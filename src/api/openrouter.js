const OPENROUTER_API_BASE = 'https://openrouter.ai/api/v1';
const MAX_RETRIES = 3;
const INITIAL_RETRY_DELAY = 1000;

// Available models for different tasks
export const MODELS = {
    SERP_SEARCH: 'perplexity/sonar', // Perplexity Sonar for SERP search
    OUTLINE_EXTRACTION: 'openai/gpt-4o-mini', // GPT-4o Mini for outline extraction
    SEMANTIC_ANALYSIS: 'anthropic/claude-3-5-sonnet-20241022', // Claude Sonnet 3.5 for semantic analysis
    ASPECT_GENERATION: 'anthropic/claude-3-5-sonnet-20241022', // Claude Sonnet 3.5 for aspect generation
    OUTLINE_GENERATION: 'anthropic/claude-3-5-sonnet-20241022', // Claude Sonnet 3.5 for final outline
    FALLBACK_MODEL: 'openai/gpt-3.5-turbo' // Fallback model for when others fail
};

// List of non-coherent subheadings to filter out
const FILTERED_SUBHEADINGS = [
    'conclusione', 'conclusioni', 'chi siamo', 'chiama ora', 'contattaci', 'contatti',
    'richiedi preventivo', 'preventivo', 'offerta', 'promozione', 'sconto',
    'privacy policy', 'termini di servizio', 'cookie policy', 'disclaimer',
    'footer', 'sidebar', 'menu', 'navigazione', 'breadcrumb',
    'condividi', 'social', 'newsletter', 'iscriviti', 'seguici',
    'testimonial', 'recensioni cliente', 'clienti', 'portfolio',
    'servizi correlati', 'prodotti correlati', 'articoli correlati',
    'biografia autore', 'autore', 'about us', 'team', 'staff',
    'faq generiche', 'domande frequenti generiche', 'help', 'supporto',
    'login', 'registrati', 'account', 'profilo utente'
];

export async function makeOpenRouterRequest(apiKey, model, messages, maxTokens = 1000) {
    if (!apiKey || !model || !messages) {
        throw new Error('API key, model, and messages are required');
    }

    const url = `${OPENROUTER_API_BASE}/chat/completions`;
    
    const requestBody = {
        model,
        messages,
        max_tokens: maxTokens,
        temperature: 0.7,
        top_p: 1.0,
        frequency_penalty: 0.0,
        presence_penalty: 0.0
    };

    return await makeRequestWithRetry(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${apiKey}`,
            'HTTP-Referer': window.location.origin,
            'X-Title': 'AI Outline Generator'
        },
        body: JSON.stringify(requestBody)
    });
}

export async function searchCompetitorUrls(apiKey, topic) {
    // First try with Perplexity/Sonar - search on Google.it for Italian results
    const messages = [
        {
            role: 'user',
            content: `Cerca su Google.it i primi 10 risultati per l'argomento "${topic}". 
            
            IMPORTANTE: Cerca specificamente su Google Italia (google.it) per ottenere risultati in lingua italiana.
            
            Concentrati su:
            - Articoli di blog italiani
            - Guide complete in italiano
            - Pagine informative italiane
            - Risorse educative italiane
            - Siti web .it quando possibile
            
            Evita:
            - Pagine puramente commerciali/vendita
            - Post social media
            - Notizie brevi
            - Pagine senza contenuto sostanziale
            - Risultati in inglese se esistono alternative italiane
            
            Per ogni risultato fornisci:
            - URL del sito italiano
            - Titolo in italiano
            - Breve descrizione del contenuto
            
            Rispondi in formato JSON:
            {
                "results": [
                    {
                        "url": "https://example.it",
                        "title": "Titolo della pagina italiana",
                        "description": "Breve descrizione in italiano"
                    }
                ]
            }`
        }
    ];

    try {
        const response = await makeOpenRouterRequest(apiKey, MODELS.SERP_SEARCH, messages, 2000);
        const content = response.choices[0].message.content;
        
        // Parse JSON response
        const jsonMatch = content.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
            const parsed = JSON.parse(jsonMatch[0]);
            return parsed.results || [];
        }
        
        throw new Error('Invalid response format from Perplexity');
    } catch (error) {
        console.warn('Perplexity search failed, using fallback with GPT-4o-mini:', error.message);
        
        // Fallback to GPT-4o-mini with simulated search
        return await searchCompetitorUrlsFallback(apiKey, topic);
    }
}

async function searchCompetitorUrlsFallback(apiKey, topic) {
    const messages = [
        {
            role: 'system',
            content: 'Sei un assistente che genera URL e contenuti realistici per analisi competitor di siti web italiani.'
        },
        {
            role: 'user',
            content: `Genera 10 URL realistici di competitor italiani e descrizioni dei contenuti per l'argomento "${topic}". Questi dovrebbero essere tipici siti che si posizionerebbero bene su Google.it per questo topic.
            
            Crea realistici:
            - Nomi di dominio italiani (come esempio1.it, blog.esempio2.com, marketing.example.it, etc.)
            - Titoli delle pagine in italiano
            - Brevi descrizioni di cosa conterrebbe ogni pagina
            
            Concentrati su tipi di contenuto educativi e informativi tipici del web italiano.
            
            Rispondi in formato JSON:
            {
                "results": [
                    {
                        "url": "https://esempio.it/pagina",
                        "title": "Titolo realistico della pagina",
                        "description": "Cosa conterrebbe questa pagina"
                    }
                ]
            }`
        }
    ];

    try {
        const response = await makeOpenRouterRequest(apiKey, MODELS.FALLBACK_MODEL, messages, 1500);
        const content = response.choices[0].message.content;
        
        // Parse JSON response
        const jsonMatch = content.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
            const parsed = JSON.parse(jsonMatch[0]);
            return parsed.results || [];
        }
        
        throw new Error('Invalid response format');
    } catch (error) {
        console.error('Error in fallback competitor search:', error);
        // Return some default results as last resort
        return generateDefaultCompetitorResults(topic);
    }
}

function generateDefaultCompetitorResults(topic) {
    return [
        {
            url: "https://marketing.esempio1.it/guida",
            title: `Guida Completa al ${topic}`,
            description: `Guida completa che copre tutti gli aspetti del ${topic}`
        },
        {
            url: "https://blog.digitalitalia.com/articolo",
            title: `${topic}: Tutto quello che devi sapere`,
            description: `Articolo dettagliato che spiega i fondamenti del ${topic}`
        },
        {
            url: "https://webmarketing.it/tutorial",
            title: `Come Padroneggiare il ${topic}`,
            description: `Tutorial passo-passo per il ${topic}`
        },
        {
            url: "https://consulenza.esempio4.it/consigli",
            title: `I 10 Migliori Consigli per il ${topic}`,
            description: `Consigli esperti e best practice per il ${topic}`
        },
        {
            url: "https://strategiadigitale.com/avanzate",
            title: `Strategie Avanzate di ${topic}`,
            description: `Tecniche e strategie avanzate per il ${topic}`
        },
        {
            url: "https://formazione.online.it/corso",
            title: `Corso Professionale di ${topic}`,
            description: `Corso completo per professionisti del ${topic}`
        },
        {
            url: "https://business.italia.net/case-study",
            title: `Case Study di Successo nel ${topic}`,
            description: `Esempi reali di successo nel ${topic}`
        }
    ];
}

export async function extractOutlineFromContent(apiKey, url, title, description) {
    const messages = [
        {
            role: 'system',
            content: `Sei un esperto nell'estrazione di outline da contenuti web. Il tuo compito è identificare la struttura gerarchica dei contenuti (H1, H2, H3) da una pagina web.`
        },
        {
            role: 'user',
            content: `Estrai l'outline strutturale dalla seguente pagina web:

URL: ${url}
Titolo: ${title}
Descrizione: ${description}

Identifica e restituisci:
1. Il titolo principale (H1)
2. I sottotitoli principali (H2)
3. I sotto-sottotitoli (H3)

Filtra ed escludi:
- Sezioni commerciali (contatti, preventivi, etc.)
- Elementi di navigazione
- Footer e sidebar
- Sezioni autore/biografia
- Call-to-action commerciali

Rispondi in formato:
H1: Titolo principale
H2: Primo sottotitolo
H3: Primo sotto-sottotitolo
H3: Secondo sotto-sottotitolo
H2: Secondo sottotitolo
H3: Terzo sotto-sottotitolo
... e così via

Se non riesci ad accedere al contenuto, prova a immaginare una struttura logica basata su titolo e descrizione.`
        }
    ];

    try {
        const response = await makeOpenRouterRequest(apiKey, MODELS.OUTLINE_EXTRACTION, messages, 1500);
        const content = response.choices[0].message.content.trim();
        
        // Filter out non-coherent subheadings
        const filteredContent = filterIncoherentSubheadings(content);
        
        return {
            url,
            title,
            outline: filteredContent
        };
    } catch (error) {
        console.error('Error extracting outline:', error);
        throw error;
    }
}

export function filterIncoherentSubheadings(outlineText) {
    const lines = outlineText.split('\n');
    const filteredLines = lines.filter(line => {
        const lowerLine = line.toLowerCase();
        return !FILTERED_SUBHEADINGS.some(filter => 
            lowerLine.includes(filter.toLowerCase())
        );
    });
    return filteredLines.join('\n');
}

export async function generateSemanticAnalysis(apiKey, topic) {
    const messages = [
        {
            role: 'system',
            content: `Sei un esperto linguista e semantologo. Il tuo compito è creare un'analisi semantica completa e dettagliata di un argomento specifico.`
        },
        {
            role: 'user',
            content: `Think this step by step.
Topic=${topic}
Write in italian a semantic lexicon:
1. Identify 5 salient entities (nouns) to the topic.
2. Identify 5 synonyms.
3. Create 5 categories to organize these entities. Name 5 significant entities within each category.
4. Offer 5 specific named examples for each of these entities.
5. Identify 5 attributes of each of these entities.
6. Apply semantic concepts to the topic and write down 5 salient entities for each semantic concept related to the topic.
7. Delve into 5 related linguistic categories and write down 5 related entities related to the topic for each category.
8. List 5 Part-Whole Relationships.
9. List 5 Common Collocations.
10. List 5 Related Statements.
11. List 5 Related Questions.
12. List 5 Common Errors/Misconceptions.
13. Detail 5 Current Debates.

Rispondi in formato JSON strutturato per facilitare l'elaborazione:
{
    "salientEntities": ["entità1", "entità2", "entità3", "entità4", "entità5"],
    "synonyms": ["sinonimo1", "sinonimo2", "sinonimo3", "sinonimo4", "sinonimo5"],
    "categories": {
        "categoria1": {
            "entities": ["entità1", "entità2", "entità3", "entità4", "entità5"],
            "examples": ["esempio1", "esempio2", "esempio3", "esempio4", "esempio5"],
            "attributes": ["attributo1", "attributo2", "attributo3", "attributo4", "attributo5"]
        },
        "categoria2": {
            "entities": ["entità1", "entità2", "entità3", "entità4", "entità5"],
            "examples": ["esempio1", "esempio2", "esempio3", "esempio4", "esempio5"],
            "attributes": ["attributo1", "attributo2", "attributo3", "attributo4", "attributo5"]
        },
        "categoria3": {
            "entities": ["entità1", "entità2", "entità3", "entità4", "entità5"],
            "examples": ["esempio1", "esempio2", "esempio3", "esempio4", "esempio5"],
            "attributes": ["attributo1", "attributo2", "attributo3", "attributo4", "attributo5"]
        },
        "categoria4": {
            "entities": ["entità1", "entità2", "entità3", "entità4", "entità5"],
            "examples": ["esempio1", "esempio2", "esempio3", "esempio4", "esempio5"],
            "attributes": ["attributo1", "attributo2", "attributo3", "attributo4", "attributo5"]
        },
        "categoria5": {
            "entities": ["entità1", "entità2", "entità3", "entità4", "entità5"],
            "examples": ["esempio1", "esempio2", "esempio3", "esempio4", "esempio5"],
            "attributes": ["attributo1", "attributo2", "attributo3", "attributo4", "attributo5"]
        }
    },
    "semanticConcepts": {
        "concetto1": ["entità1", "entità2", "entità3", "entità4", "entità5"],
        "concetto2": ["entità1", "entità2", "entità3", "entità4", "entità5"],
        "concetto3": ["entità1", "entità2", "entità3", "entità4", "entità5"],
        "concetto4": ["entità1", "entità2", "entità3", "entità4", "entità5"],
        "concetto5": ["entità1", "entità2", "entità3", "entità4", "entità5"]
    },
    "linguisticCategories": {
        "categoria1": ["entità1", "entità2", "entità3", "entità4", "entità5"],
        "categoria2": ["entità1", "entità2", "entità3", "entità4", "entità5"],
        "categoria3": ["entità1", "entità2", "entità3", "entità4", "entità5"],
        "categoria4": ["entità1", "entità2", "entità3", "entità4", "entità5"],
        "categoria5": ["entità1", "entità2", "entità3", "entità4", "entità5"]
    },
    "partWholeRelationships": ["relazione1", "relazione2", "relazione3", "relazione4", "relazione5"],
    "commonCollocations": ["collocazione1", "collocazione2", "collocazione3", "collocazione4", "collocazione5"],
    "relatedStatements": ["affermazione1", "affermazione2", "affermazione3", "affermazione4", "affermazione5"],
    "relatedQuestions": ["domanda1", "domanda2", "domanda3", "domanda4", "domanda5"],
    "commonErrors": ["errore1", "errore2", "errore3", "errore4", "errore5"],
    "currentDebates": ["dibattito1", "dibattito2", "dibattito3", "dibattito4", "dibattito5"]
}`
        }
    ];

    try {
        const response = await makeOpenRouterRequest(apiKey, MODELS.SEMANTIC_ANALYSIS, messages, 4000);
        const content = response.choices[0].message.content;
        
        // Parse JSON response
        const jsonMatch = content.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
            return JSON.parse(jsonMatch[0]);
        }
        
        throw new Error('Invalid response format');
    } catch (error) {
        console.error('Error generating semantic analysis:', error);
        throw error;
    }
}

export async function generateAspectsToTreat(apiKey, topic, competitorOutlines) {
    const messages = [
        {
            role: 'system',
            content: `Sei un esperto content strategist. Il tuo compito è analizzare le outline dei competitor e identificare tutti gli aspetti che dovrebbero essere trattati per creare un contenuto completo e competitivo su un argomento.`
        },
        {
            role: 'user',
            content: `Analizza queste outline dei competitor per l'argomento "${topic}" e identifica tutti gli aspetti che dovrebbero essere trattati:

OUTLINE COMPETITOR:
${competitorOutlines.map((comp, index) => `
COMPETITOR ${index + 1} (${comp.title}):
${comp.outline}
`).join('\n')}

Identifica:
1. Aspetti comuni trattati da più competitor
2. Aspetti unici trovati in singoli competitor
3. Aspetti mancanti che potrebbero essere importanti
4. Sotto-aspetti specifici per ogni area tematica
5. Aspetti avanzati per utenti esperti
6. Aspetti base per principianti

Organizza tutto in categorie logiche e fornisci una lista completa di tutti gli aspetti da considerare per creare un contenuto esaustivo.

Rispondi in formato JSON:
{
    "aspectsByCategory": {
        "categoria1": [
            {
                "aspect": "Nome aspetto",
                "description": "Descrizione dettagliata",
                "priority": "high|medium|low",
                "foundInCompetitors": ["competitor1", "competitor2"],
                "isUnique": false,
                "isMissing": false
            }
        ]
    },
    "summary": {
        "totalAspects": 0,
        "highPriorityAspects": 0,
        "missingAspects": 0,
        "uniqueAspects": 0
    }
}`
        }
    ];

    try {
        const response = await makeOpenRouterRequest(apiKey, MODELS.ASPECT_GENERATION, messages, 3000);
        const content = response.choices[0].message.content;
        
        // Parse JSON response
        const jsonMatch = content.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
            return JSON.parse(jsonMatch[0]);
        }
        
        throw new Error('Invalid response format');
    } catch (error) {
        console.error('Error generating aspects to treat:', error);
        throw error;
    }
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
                `Bad Request - Check API key and model availability. ${errorMessage}` :
                `HTTP ${response.status} - ${errorMessage}`;
            throw new Error(`OpenRouter API Error ${response.status}: ${errorDetails}`);
        }
        
        const data = await response.json();
        
        if (!data.choices || !data.choices[0] || !data.choices[0].message) {
            throw new Error('Invalid response format from OpenRouter API');
        }
        
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

export async function generateFinalOutline(apiKey, topic, selectedData, includeH3 = true) {
    const messages = [
        {
            role: 'system',
            content: `Sei un esperto content strategist e SEO specialist. Il tuo compito è creare un'outline completa e semanticamente ottimizzata per un contenuto che deve coprire al 100% tutti gli aspetti di un argomento.`
        },
        {
            role: 'user',
            content: `Crea un'outline completa per l'argomento "${topic}" utilizzando i seguenti dati:

OUTLINE COMPETITOR ANALIZZATE:
${selectedData.competitors.map((comp, index) => `
${comp.title}:
${comp.outline}
`).join('\n')}

ASPETTI DA TRATTARE SELEZIONATI:
${Object.entries(selectedData.aspects || {}).map(([category, aspects]) => `
${category}:
${aspects.map(aspect => `- ${aspect.aspect}: ${aspect.description}`).join('\n')}
`).join('\n')}

ELEMENTI SEMANTICI SELEZIONATI:
${JSON.stringify(selectedData.semanticAnalysis, null, 2)}

REQUISITI DELL'OUTLINE:
1. ${includeH3 ? 'Usa struttura H1, H2, H3 per massima profondità' : 'Usa solo H1 e H2 per struttura più semplice'}
2. Subheading in italiano perfetto, interessanti e coinvolgenti
3. Ogni subheading deve avere un argomento UNICO senza ripetizioni
4. Incorpora entità semantiche rilevanti nei titoli quando possibile
5. Usa domande come subheading quando è naturale e coinvolgente
6. Copri TUTTI gli aspetti importanti dell'argomento
7. Struttura logica e progressiva
8. Subheading che esprimono chiaramente cosa sarà trattato

FORMATO RICHIESTO:
H1: Titolo Principale
H2: Primo Argomento Principale
${includeH3 ? 'H3: Primo Sottoargomento\nH3: Secondo Sottoargomento' : ''}
H2: Secondo Argomento Principale
${includeH3 ? 'H3: Primo Sottoargomento\nH3: Secondo Sottoargomento' : ''}

Crea un'outline esaustiva che non lasci nessun aspetto importante non trattato.`
        }
    ];

    try {
        const response = await makeOpenRouterRequest(apiKey, MODELS.SEMANTIC_ANALYSIS, messages, 3000);
        const content = response.choices[0].message.content.trim();
        return content;
    } catch (error) {
        console.error('Error generating final outline:', error);
        throw error;
    }
}

export async function testOpenRouterApiKey(apiKey) {
    try {
        const testMessages = [
            {
                role: 'user',
                content: 'Reply with "OK" if you receive this message.'
            }
        ];
        
        // Use the most reliable model for testing
        const response = await makeOpenRouterRequest(apiKey, MODELS.FALLBACK_MODEL, testMessages, 10);
        return response.choices && response.choices[0] && response.choices[0].message;
    } catch (error) {
        console.error('OpenRouter API key test failed:', error.message);
        return false;
    }
}