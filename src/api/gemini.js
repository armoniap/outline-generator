const GEMINI_API_BASE = 'https://generativelanguage.googleapis.com/v1beta';
const EMBEDDING_MODEL = 'embedding-001';
const MAX_RETRIES = 3;
const INITIAL_RETRY_DELAY = 1000;

export async function generateEmbeddings(apiKey, texts, taskType = 'SEMANTIC_SIMILARITY') {
    if (!apiKey || !texts || !Array.isArray(texts) || texts.length === 0) {
        throw new Error('API key and non-empty texts array are required');
    }

    const url = `${GEMINI_API_BASE}/models/${EMBEDDING_MODEL}:embedContent?key=${apiKey}`;
    const embeddings = [];

    for (const text of texts) {
        if (!text || typeof text !== 'string' || text.trim().length === 0) {
            throw new Error('All texts must be non-empty strings');
        }

        const requestBody = {
            model: `models/${EMBEDDING_MODEL}`,
            content: {
                parts: [{ text: text.trim() }]
            },
            taskType
        };

        try {
            const response = await makeRequestWithRetry(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(requestBody)
            });

            if (response.embedding && response.embedding.values) {
                embeddings.push(response.embedding.values);
            } else {
                throw new Error('Invalid response format from Gemini API');
            }
        } catch (error) {
            console.error(`Error generating embedding for text: "${text.substring(0, 50)}..."`, error);
            throw error;
        }

        // Add small delay between requests to avoid rate limiting
        await sleep(100);
    }

    return embeddings;
}

async function makeRequestWithRetry(url, options, retryCount = 0) {
    try {
        const response = await fetch(url, options);
        
        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            
            if (response.status === 429 && retryCount < MAX_RETRIES) {
                const delay = INITIAL_RETRY_DELAY * Math.pow(2, retryCount);
                console.warn(`Rate limited. Retrying in ${delay}ms...`);
                await sleep(delay);
                return makeRequestWithRetry(url, options, retryCount + 1);
            }
            
            if (response.status >= 500 && retryCount < MAX_RETRIES) {
                const delay = INITIAL_RETRY_DELAY * Math.pow(2, retryCount);
                console.warn(`Server error ${response.status}. Retrying in ${delay}ms...`);
                await sleep(delay);
                return makeRequestWithRetry(url, options, retryCount + 1);
            }
            
            const errorMessage = errorData.error?.message || errorData.message || 'Unknown error';
            const errorDetails = response.status === 400 ? 
                `Bad Request - Check API key and request format. ${errorMessage}` :
                response.status === 403 ?
                `Forbidden - Check API key permissions. ${errorMessage}` :
                `HTTP ${response.status} - ${errorMessage}`;
            throw new Error(`Gemini API Error ${response.status}: ${errorDetails}`);
        }
        
        const data = await response.json();
        return data;
        
    } catch (error) {
        if (error.name === 'TypeError' && error.message.includes('fetch')) {
            throw new Error('Errore di connessione. Verifica la tua connessione internet.');
        }
        
        if (retryCount < MAX_RETRIES && (
            error.message.includes('network') || 
            error.message.includes('timeout') ||
            error.message.includes('fetch')
        )) {
            const delay = INITIAL_RETRY_DELAY * Math.pow(2, retryCount);
            console.warn(`Network error. Retrying in ${delay}ms...`);
            await sleep(delay);
            return makeRequestWithRetry(url, options, retryCount + 1);
        }
        
        throw error;
    }
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

export async function testGeminiApiKey(apiKey) {
    try {
        const testText = 'test';
        const embeddings = await generateEmbeddings(apiKey, [testText]);
        return embeddings && embeddings.length > 0 && Array.isArray(embeddings[0]);
    } catch (error) {
        console.error('Gemini API key test failed:', error.message);
        return false;
    }
}