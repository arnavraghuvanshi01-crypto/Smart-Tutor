// DOM Elements
const textInput = document.getElementById('text-input');
const charCounter = document.getElementById('char-counter');
const summarizeBtn = document.getElementById('summarize-btn');
const copyBtn = document.getElementById('copy-btn');
const loadingSpinner = document.getElementById('loading-spinner');
const errorMessage = document.getElementById('error-message');
const summaryResult = document.getElementById('summary-result');
const summaryContent = document.getElementById('summary-content');

// Character counter
textInput.addEventListener('input', () => {
    const charCount = textInput.value.length;
    charCounter.textContent = `${charCount}/10000 characters`;
    summarizeBtn.disabled = charCount < 20 || charCount > 10000;
});

// Show/hide loading state
const showLoading = () => {
    loadingSpinner.classList.remove('hidden');
    summarizeBtn.disabled = true;
    errorMessage.classList.add('hidden');
    summaryResult.classList.add('hidden');
};

const hideLoading = () => {
    loadingSpinner.classList.add('hidden');
    summarizeBtn.disabled = false;
};

// Show error message
const showError = (message) => {
    errorMessage.textContent = message;
    errorMessage.classList.remove('hidden');
    summaryResult.classList.add('hidden');
};

// Improved text summarization with better sentence selection
const summarizeText = () => {
    const text = textInput.value.trim();
    
    if (text.length < 20) {
        showError('Please enter at least 20 characters of text.');
        return;
    }
    
    if (text.length > 10000) {
        showError('Text exceeds maximum length of 10,000 characters.');
        return;
    }
    
    showLoading();
    
    try {
        // Split text into sentences and clean them
        const sentences = text.split(/(?<=[.!?])\s+/)
            .map(s => s.trim())
            .filter(s => s.length > 0)
            .filter(sentence => !sentence.match(/^(what|who|where|when|why|how|is|are|do|does|did|can|could|would|should|will|shall|may|might|must)\s/i));
        
        // Calculate word frequencies (ignoring common words)
        const commonWords = new Set(['the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by', 'is', 'are', 'was', 'were', 'be', 'been', 'being', 'have', 'has', 'had', 'do', 'does', 'did', 'will', 'would', 'shall', 'should', 'may', 'might', 'must', 'can', 'could']);
        
        const words = text.toLowerCase().match(/\b\w+\b/g) || [];
        const wordFrequencies = {};
        words.forEach(word => {
            if (word.length > 3 && !commonWords.has(word)) {
                wordFrequencies[word] = (wordFrequencies[word] || 0) + 1;
            }
        });
        
        // Score sentences based on multiple factors
        const scoredSentences = sentences.map(sentence => {
            let score = 0;
            const sentenceWords = sentence.toLowerCase().match(/\b\w+\b/g) || [];
            const sentenceLength = sentenceWords.length;
            
            // Skip very short or very long sentences
            if (sentenceLength < 5 || sentenceLength > 40) {
                return { sentence, score: 0 };
            }
            
            // Score based on word frequencies (higher weight for important words)
            let importantWordCount = 0;
            sentenceWords.forEach(word => {
                if (wordFrequencies[word]) {
                    score += wordFrequencies[word] * 3; // Triple weight for important words
                    importantWordCount++;
                }
            });
            
            // Bonus for having multiple important words
            if (importantWordCount > 2) {
                score *= 1.5;
            }
            
            // Key phrases that indicate important information
            const keyPhrases = [
                // Importance indicators
                'important', 'key', 'main', 'primary', 'essential', 'crucial', 'critical', 'vital',
                // Definition indicators
                'definition', 'means', 'defined as', 'refers to', 'is called', 'known as', 'term',
                // Conclusion indicators
                'conclusion', 'summary', 'therefore', 'thus', 'hence', 'consequently', 'as a result',
                // List indicators
                'first', 'second', 'third', 'finally', 'lastly', 'additionally', 'furthermore',
                // Example indicators
                'example', 'for instance', 'specifically', 'such as', 'including',
                // Contrast indicators
                'however', 'although', 'despite', 'but', 'nevertheless', 'on the other hand',
                // Cause-effect indicators
                'because', 'since', 'due to', 'as a result', 'leads to', 'results in'
            ];
            
            // Check for key phrases
            keyPhrases.forEach(phrase => {
                if (sentence.toLowerCase().includes(phrase)) {
                    score += 10; // High bonus for key phrases
                }
            });
            
            // Special bonus for definition sentences
            if (sentence.match(/\b(means|defined as|refers to|is called|known as)\b/i)) {
                score += 15; // Very high bonus for definitions
            }
            
            // Bonus for sentences with numbers or lists
            if (sentence.match(/\d+\.|\d+\)|first|second|third|finally/i)) {
                score += 8; // High bonus for lists
            }
            
            // Penalty for questions
            if (sentence.match(/\?$/) || sentence.match(/^(what|who|where|when|why|how|is|are|do|does|did|can|could|would|should|will|shall|may|might|must)\s/i)) {
                score *= 0.1; // Strong penalty for questions
            }
            
            // Position-based scoring
            const sentenceIndex = sentences.indexOf(sentence);
            const middleIndex = Math.floor(sentences.length / 2);
            const distanceFromMiddle = Math.abs(sentenceIndex - middleIndex);
            
            // Bonus for sentences near the middle (often contain main points)
            if (distanceFromMiddle < sentences.length / 4) {
                score *= 1.5;
            }
            
            // Bonus for the first sentence (often contains introduction)
            if (sentenceIndex === 0) {
                score *= 1.3;
            }
            
            // Bonus for the last sentence (often contains conclusion)
            if (sentenceIndex === sentences.length - 1) {
                score *= 1.3;
            }
            
            return { sentence, score, length: sentence.length };
        });
        
        // Sort sentences by score in descending order
        scoredSentences.sort((a, b) => b.score - a.score);
        
        // Calculate target length (40% of original text)
        const targetLength = Math.floor(text.length * 0.4);
        let currentLength = 0;
        const selectedSentences = [];
        
        // Select sentences until we reach 40% of the original length
        for (const item of scoredSentences) {
            if (item.score > 0 && currentLength + item.length <= targetLength) {
                selectedSentences.push(item.sentence);
                currentLength += item.length;
            }
        }
        
        // If we haven't reached the target length, add more sentences
        if (currentLength < targetLength * 0.8) { // If we're below 80% of target
            const remainingSentences = scoredSentences
                .filter(item => !selectedSentences.includes(item.sentence) && item.score > 0)
                .sort((a, b) => a.length - b.length); // Prefer shorter sentences to fine-tune length
            
            for (const item of remainingSentences) {
                if (currentLength + item.length <= targetLength) {
                    selectedSentences.push(item.sentence);
                    currentLength += item.length;
                }
            }
        }
        
        // Format the summary
        const summary = selectedSentences
            .map(sentence => {
                const cleanSentence = sentence.trim().replace(/\s+/g, ' ');
                if (!/[.!?]$/.test(cleanSentence)) {
                    return cleanSentence + '.';
                }
                return cleanSentence;
            })
            .join(' ');

        // Display the summary
        summaryContent.textContent = summary;
        summaryResult.classList.remove('hidden');
        hideLoading();
        
        // Format as a single paragraph
        const formattedSummary = `<p>${summary}</p>`;
        
        summaryContent.innerHTML = formattedSummary;
        summaryResult.classList.remove('hidden');
        errorMessage.classList.add('hidden');
    } catch (error) {
        console.error('Error:', error);
        showError('An error occurred while generating the summary.');
    } finally {
        hideLoading();
    }
};

// Copy summary to clipboard
const copySummary = () => {
    const text = summaryContent.textContent;
    navigator.clipboard.writeText(text)
        .then(() => {
            const originalText = copyBtn.innerHTML;
            copyBtn.innerHTML = '<i class="fas fa-check"></i> Copied!';
            setTimeout(() => {
                copyBtn.innerHTML = originalText;
            }, 2000);
        })
        .catch(err => {
            console.error('Failed to copy text: ', err);
            showError('Failed to copy summary to clipboard.');
        });
};

// Event listeners
summarizeBtn.addEventListener('click', summarizeText);
copyBtn.addEventListener('click', copySummary);
  