export function cosineSimilarity(vecA, vecB) {
    if (!vecA || !vecB || vecA.length !== vecB.length) {
        throw new Error('Invalid vectors for cosine similarity calculation');
    }
    
    let dotProduct = 0;
    let normA = 0;
    let normB = 0;
    
    for (let i = 0; i < vecA.length; i++) {
        dotProduct += vecA[i] * vecB[i];
        normA += vecA[i] * vecA[i];
        normB += vecB[i] * vecB[i];
    }
    
    const magnitude = Math.sqrt(normA) * Math.sqrt(normB);
    
    if (magnitude === 0) {
        return 0;
    }
    
    return dotProduct / magnitude;
}

export function calculateDistance(vecA, vecB) {
    if (!vecA || !vecB || vecA.length !== vecB.length) {
        throw new Error('Invalid vectors for distance calculation');
    }
    
    let sum = 0;
    for (let i = 0; i < vecA.length; i++) {
        sum += Math.pow(vecA[i] - vecB[i], 2);
    }
    
    return Math.sqrt(sum);
}

export function normalizeVector(vector) {
    const magnitude = Math.sqrt(vector.reduce((sum, val) => sum + val * val, 0));
    
    if (magnitude === 0) {
        return new Array(vector.length).fill(0);
    }
    
    return vector.map(val => val / magnitude);
}

export function averageVectors(vectors) {
    if (!vectors || vectors.length === 0) {
        return [];
    }
    
    const length = vectors[0].length;
    const result = new Array(length).fill(0);
    
    for (const vector of vectors) {
        for (let i = 0; i < length; i++) {
            result[i] += vector[i];
        }
    }
    
    return result.map(val => val / vectors.length);
}

export function findMostSimilar(targetVector, candidateVectors) {
    let maxSimilarity = -1;
    let mostSimilarIndex = -1;
    
    for (let i = 0; i < candidateVectors.length; i++) {
        const similarity = cosineSimilarity(targetVector, candidateVectors[i]);
        if (similarity > maxSimilarity) {
            maxSimilarity = similarity;
            mostSimilarIndex = i;
        }
    }
    
    return {
        index: mostSimilarIndex,
        similarity: maxSimilarity
    };
}

/**
 * Get semantic score level based on similarity score
 * @param {number} score - Similarity score (0-1)
 * @returns {string} Score level
 */
export function getScoreLevel(score) {
    if (score >= 0.8) return 'excellent';
    if (score >= 0.6) return 'good';
    if (score >= 0.4) return 'fair';
    return 'poor';
}

/**
 * Get score color class based on level
 * @param {string} level - Score level
 * @returns {string} CSS class
 */
export function getScoreColorClass(level) {
    const colors = {
        'excellent': 'text-green-600 bg-green-100 dark:text-green-400 dark:bg-green-900',
        'good': 'text-blue-600 bg-blue-100 dark:text-blue-400 dark:bg-blue-900',
        'fair': 'text-yellow-600 bg-yellow-100 dark:text-yellow-400 dark:bg-yellow-900',
        'poor': 'text-red-600 bg-red-100 dark:text-red-400 dark:bg-red-900'
    };
    
    return colors[level] || colors.poor;
}

/**
 * Format score as percentage
 * @param {number} score - Raw score (0-1)
 * @returns {string} Formatted percentage
 */
export function formatScore(score) {
    return `${Math.round(score * 100)}%`;
}

/**
 * Calculate average score from array of scores
 * @param {number[]} scores - Array of similarity scores
 * @returns {number} Average score
 */
export function calculateAverageScore(scores) {
    if (!scores || scores.length === 0) return 0;
    return scores.reduce((sum, score) => sum + score, 0) / scores.length;
}