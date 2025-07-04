import { generateEmbeddings } from '../api/gemini.js';
import { makeOpenRouterRequest, MODELS } from '../api/openrouter.js';
import { cosineSimilarity, getScoreLevel, calculateAverageScore } from '../utils/math.js';

export class SemanticAnalyzer {
    constructor() {
        this.geminiApiKey = null;
        this.openrouterApiKey = null;
        this.currentTopic = null;
        this.topicEmbedding = null;
        this.headings = [];
        this.semanticTerms = [];
    }

    setApiKeys(geminiApiKey, openrouterApiKey) {
        this.geminiApiKey = geminiApiKey;
        this.openrouterApiKey = openrouterApiKey;
    }

    setSemanticTerms(semanticData) {
        this.semanticTerms = this.extractSemanticTermsFromData(semanticData);
    }

    extractSemanticTermsFromData(semanticData) {
        const terms = [];
        
        if (semanticData.salientEntities) {
            terms.push(...semanticData.salientEntities);
        }
        
        if (semanticData.synonyms) {
            terms.push(...semanticData.synonyms);
        }
        
        if (semanticData.categories) {
            Object.values(semanticData.categories).forEach(category => {
                if (category.entities) terms.push(...category.entities);
                if (category.examples) terms.push(...category.examples);
                if (category.attributes) terms.push(...category.attributes);
            });
        }
        
        ['partWholeRelationships', 'commonCollocations', 'relatedStatements', 
         'relatedQuestions', 'commonErrors', 'currentDebates'].forEach(key => {
            if (semanticData[key]) {
                terms.push(...semanticData[key]);
            }
        });
        
        // Remove duplicates and clean terms
        return [...new Set(terms)]
            .filter(term => term && typeof term === 'string' && term.trim().length > 0)
            .map(term => term.trim());
    }

    parseOutline(outlineText) {
        const lines = outlineText.split('\n').filter(line => line.trim());
        const headings = [];
        
        lines.forEach((line, index) => {
            const trimmed = line.trim();
            let level = null;
            let text = '';
            
            // Parse markdown format
            if (trimmed.startsWith('### ')) {
                level = 'H3';
                text = trimmed.substring(4).trim();
            } else if (trimmed.startsWith('## ')) {
                level = 'H2';
                text = trimmed.substring(3).trim();
            } else if (trimmed.startsWith('# ')) {
                level = 'H1';
                text = trimmed.substring(2).trim();
            }
            // Parse H1:, H2:, H3: format
            else if (trimmed.startsWith('H1:')) {
                level = 'H1';
                text = trimmed.substring(3).trim();
            } else if (trimmed.startsWith('H2:')) {
                level = 'H2';
                text = trimmed.substring(3).trim();
            } else if (trimmed.startsWith('H3:')) {
                level = 'H3';
                text = trimmed.substring(3).trim();
            }
            
            if (level && text) {
                headings.push({
                    id: `heading_${index}`,
                    level,
                    text,
                    original: line,
                    score: null,
                    scoreLevel: null,
                    embedding: null
                });
            }
        });
        
        return headings;
    }

    async analyzeOutlineSemanticCoherence(topic, outlineText) {
        if (!this.geminiApiKey) {
            throw new Error('Gemini API key is required for semantic analysis');
        }

        this.currentTopic = topic;
        this.headings = this.parseOutline(outlineText);
        
        if (this.headings.length === 0) {
            throw new Error('No valid headings found in outline');
        }

        // Prepare texts for embedding generation
        const texts = [topic, ...this.headings.map(h => h.text)];
        
        try {
            // Generate embeddings for topic and all headings
            const embeddings = await generateEmbeddings(this.geminiApiKey, texts);
            
            // Store topic embedding
            this.topicEmbedding = embeddings[0];
            
            // Calculate scores for each heading
            const headingEmbeddings = embeddings.slice(1);
            
            this.headings.forEach((heading, index) => {
                heading.embedding = headingEmbeddings[index];
                heading.score = cosineSimilarity(this.topicEmbedding, heading.embedding);
                heading.scoreLevel = getScoreLevel(heading.score);
            });

            // Calculate overall statistics
            const scores = this.headings.map(h => h.score);
            const overallScore = calculateAverageScore(scores);
            const overallLevel = getScoreLevel(overallScore);
            
            const statistics = {
                totalHeadings: this.headings.length,
                overallScore: overallScore,
                overallLevel: overallLevel,
                scoreDistribution: this.calculateScoreDistribution()
            };

            return {
                headings: this.headings,
                statistics: statistics,
                topic: topic
            };

        } catch (error) {
            console.error('Error in semantic analysis:', error);
            throw error;
        }
    }

    calculateScoreDistribution() {
        const distribution = {
            excellent: 0,
            good: 0,
            fair: 0,
            poor: 0
        };

        this.headings.forEach(heading => {
            distribution[heading.scoreLevel]++;
        });

        return distribution;
    }

    async recalculateHeadingScore(headingId, newText) {
        if (!this.topicEmbedding || !this.geminiApiKey) {
            throw new Error('Topic embedding not available. Run full analysis first.');
        }

        try {
            const embeddings = await generateEmbeddings(this.geminiApiKey, [newText]);
            const newEmbedding = embeddings[0];
            const newScore = cosineSimilarity(this.topicEmbedding, newEmbedding);
            const newScoreLevel = getScoreLevel(newScore);

            // Update heading in array
            const headingIndex = this.headings.findIndex(h => h.id === headingId);
            if (headingIndex >= 0) {
                const oldScore = this.headings[headingIndex].score;
                this.headings[headingIndex].text = newText;
                this.headings[headingIndex].score = newScore;
                this.headings[headingIndex].scoreLevel = newScoreLevel;
                this.headings[headingIndex].embedding = newEmbedding;

                return {
                    score: newScore,
                    scoreLevel: newScoreLevel,
                    oldScore: oldScore,
                    improvement: newScore - oldScore
                };
            }

            return {
                score: newScore,
                scoreLevel: newScoreLevel,
                oldScore: null,
                improvement: null
            };

        } catch (error) {
            console.error('Error recalculating heading score:', error);
            throw error;
        }
    }

    async generateAISuggestion(headingId) {
        if (!this.openrouterApiKey || !this.currentTopic) {
            throw new Error('OpenRouter API key and topic are required for AI suggestions');
        }

        const heading = this.headings.find(h => h.id === headingId);
        if (!heading) {
            throw new Error('Heading not found');
        }

        const currentOutline = this.getCurrentOutlineText();
        
        const messages = [
            {
                role: 'system',
                content: `Sei un esperto SEO e content strategist specializzato nella creazione di titoli semanticamente ottimizzati. Il tuo compito è migliorare la coerenza semantica dei subheading rispetto all'argomento principale.`
            },
            {
                role: 'user',
                content: `Migliora questo subheading per massimizzare la coerenza semantica con l'argomento principale "${this.currentTopic}":

SUBHEADING DA MIGLIORARE:
Livello: ${heading.level}
Titolo attuale: "${heading.text}"
Punteggio attuale: ${Math.round(heading.score * 100)}%

CONTESTO OUTLINE COMPLETA:
${currentOutline}

TERMINI SEMANTICI DISPONIBILI:
${this.semanticTerms.slice(0, 20).join(', ')}

REQUISITI:
1. Mantieni il significato originale del subheading
2. Integra termini semanticamente rilevanti quando possibile
3. Usa linguaggio naturale e coinvolgente
4. Assicurati che il nuovo titolo sia più coerente con "${this.currentTopic}"
5. Mantieni il livello di profondità appropriato (${heading.level})

Rispondi SOLO con il nuovo subheading migliorato, senza spiegazioni aggiuntive.`
            }
        ];

        try {
            const response = await makeOpenRouterRequest(
                this.openrouterApiKey, 
                MODELS.SEMANTIC_ANALYSIS, 
                messages, 
                100
            );
            
            return response.choices[0].message.content.trim();
        } catch (error) {
            console.error('Error generating AI suggestion:', error);
            throw error;
        }
    }

    getCurrentOutlineText() {
        return this.headings.map(heading => {
            const prefix = heading.level === 'H1' ? '# ' : 
                          heading.level === 'H2' ? '## ' : '### ';
            return prefix + heading.text;
        }).join('\n');
    }

    getUpdatedStatistics() {
        const scores = this.headings.map(h => h.score).filter(s => s !== null);
        const overallScore = calculateAverageScore(scores);
        const overallLevel = getScoreLevel(overallScore);
        
        return {
            totalHeadings: this.headings.length,
            overallScore: overallScore,
            overallLevel: overallLevel,
            scoreDistribution: this.calculateScoreDistribution()
        };
    }
}

// Singleton instance
export const semanticAnalyzer = new SemanticAnalyzer();