from flask import Flask, request, jsonify
from flask_cors import CORS
import nltk
from nltk.tokenize import sent_tokenize
from nltk.corpus import stopwords
from nltk.tokenize import word_tokenize
from string import punctuation
from heapq import nlargest
import logging

# Configure logging
logging.basicConfig(level=logging.DEBUG)
logger = logging.getLogger(__name__)

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "*"}})  # Enable CORS for all routes

# Download required NLTK data
try:
    nltk.download('punkt')
    nltk.download('stopwords')
    logger.info("NLTK data downloaded successfully")
except Exception as e:
    logger.error(f"Error downloading NLTK data: {str(e)}")

@app.route('/test', methods=['GET'])
def test_connection():
    logger.info("Test endpoint called")
    return jsonify({'status': 'ok'}), 200

def summarize(text, per=0.3):
    try:
        # Tokenize the text into sentences
        sentences = sent_tokenize(text)
        logger.debug(f"Number of sentences: {len(sentences)}")
        
        # Tokenize words, remove stopwords and punctuation
        stop_words = set(stopwords.words('english') + list(punctuation))
        word_tokens = word_tokenize(text.lower())
        word_freq = {}
        
        for word in word_tokens:
            if word not in stop_words and len(word) > 1:
                if word not in word_freq:
                    word_freq[word] = 1
                else:
                    word_freq[word] += 1
        
        # Calculate sentence scores
        sent_scores = {}
        for sentence in sentences:
            for word in word_tokenize(sentence.lower()):
                if word in word_freq:
                    if sentence not in sent_scores:
                        sent_scores[sentence] = word_freq[word]
                    else:
                        sent_scores[sentence] += word_freq[word]
        
        # Get summary sentences
        select_length = max(1, int(len(sentences) * per))
        summary = nlargest(select_length, sent_scores, key=sent_scores.get)
        
        # Join sentences and ensure minimum length
        summary_text = ' '.join(summary)
        if len(summary_text.split()) < 20:
            # If summary is too short, include more sentences
            select_length = min(len(sentences), max(3, int(len(sentences) * 0.5)))
            summary = nlargest(select_length, sent_scores, key=sent_scores.get)
            summary_text = ' '.join(summary)
        
        logger.debug(f"Generated summary length: {len(summary_text.split())} words")
        return summary_text
    except Exception as e:
        logger.error(f"Error in summarize function: {str(e)}")
        raise

@app.route('/summarize', methods=['POST'])
def summarize_text():
    try:
        logger.info("Summarize endpoint called")
        data = request.get_json()
        if not data:
            logger.error("No data provided in request")
            return jsonify({'success': False, 'message': 'No data provided'}), 400
            
        text = data.get('text')
        if not text:
            logger.error("No text provided in request")
            return jsonify({'success': False, 'message': 'No text provided'}), 400
        
        if len(text.split()) < 20:
            logger.error("Text too short")
            return jsonify({'success': False, 'message': 'Text is too short. Please provide at least 20 words.'}), 400
        
        # Generate summary
        summary = summarize(text)
        
        if not summary or len(summary.strip()) == 0:
            logger.error("Empty summary generated")
            return jsonify({'success': False, 'message': 'Failed to generate summary'}), 500
            
        logger.info("Summary generated successfully")
        return jsonify({
            'success': True,
            'summary': summary
        }), 200
    
    except Exception as e:
        logger.error(f"Error in summarize_text endpoint: {str(e)}")
        return jsonify({
            'success': False,
            'message': str(e)
        }), 500

if __name__ == '__main__':
    print("Starting server...")
    print("Server will be available at http://127.0.0.1:5001")
    app.run(host='0.0.0.0', port=5001, debug=True)