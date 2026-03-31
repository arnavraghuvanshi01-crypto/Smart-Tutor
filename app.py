from flask import Flask, request, jsonify
from flask_cors import CORS
import re

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

# Test endpoint
@app.route('/api/test', methods=['GET'])
def test():
    return jsonify({'status': 'Server is running!'}), 200

def simple_summarize(text):
    # Split text into sentences
    sentences = re.split(r'(?<=[.!?])\s+', text)
    
    # If text is too short, return as is
    if len(sentences) <= 2:
        return text
    
    # Take first 3 sentences as summary
    summary = ' '.join(sentences[:3])
    return summary

@app.route('/api/summarize', methods=['POST'])
def summarize():
    try:
        # Get text from request
        data = request.get_json()
        if not data or 'text' not in data:
            return jsonify({'error': 'No text provided'}), 400

        text = data['text']
        
        # Validate text length
        if len(text.strip()) < 20:
            return jsonify({'error': 'Text is too short. Please provide at least 20 characters.'}), 400

        # Generate summary
        summary = simple_summarize(text)
        
        if summary and len(summary.strip()) > 0:
            return jsonify({'summary': summary}), 200
        else:
            return jsonify({'error': 'Failed to generate summary'}), 500

    except Exception as e:
        print(f"Error in summarization: {str(e)}")
        return jsonify({'error': 'Internal server error'}), 500

if __name__ == '__main__':
    print("Starting server...")
    print("Server will be available at http://127.0.0.1:5000")
    app.run(host='127.0.0.1', port=5000, debug=True) 