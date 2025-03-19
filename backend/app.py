from flask import Flask, request, jsonify
from flask_cors import CORS
import firebase_admin
from firebase_admin import credentials, firestore
import os
from dotenv import load_dotenv
import random

# Load environment variables
load_dotenv()

# Initialize Flask app
app = Flask(__name__)
CORS(app)

# Initialize Firebase
cred = credentials.Certificate(os.getenv('FIREBASE_CREDENTIALS_PATH'))
firebase_admin.initialize_app(cred)
db = firestore.client()

# Word list (we'll expand this later)
WORDS = ['APPLE', 'BEACH', 'CHAIR', 'DANCE', 'EAGLE']

# Emoji word mappings
EMOJI_WORDS = {
    'APPLE': '🍎',
    'BEACH': '🏖️',
    'CHAIR': '🪑',
    'DANCE': '💃',
    'EAGLE': '🦅',
}

@app.route('/api/word', methods=['GET'])
def get_word():
    """Get a random word for the game"""
    emoji_mode = request.args.get('emoji_mode', 'false').lower() == 'true'
    word = random.choice(WORDS)
    
    if emoji_mode:
        return jsonify({
            'word': word,
            'emoji': EMOJI_WORDS.get(word, '❓')
        })
    return jsonify({'word': word})

@app.route('/api/check', methods=['POST'])
def check_word():
    """Check if the submitted word is valid and return feedback"""
    data = request.get_json()
    guess = data.get('guess', '').upper()
    target = data.get('target', '').upper()
    hardcore_mode = data.get('hardcore_mode', False)
    
    if not guess or not target:
        return jsonify({'error': 'Missing guess or target word'}), 400
    
    if len(guess) != 5:
        return jsonify({'error': 'Word must be 5 letters'}), 400
    
    if guess not in WORDS:
        return jsonify({'error': 'Not in word list'}), 400
    
    # Hardcore mode validation
    if hardcore_mode and len(data.get('previous_guesses', [])) > 0:
        previous_guesses = data.get('previous_guesses', [])
        previous_feedback = data.get('previous_feedback', [])
        
        # Check if all revealed letters are used
        revealed_letters = set()
        for i, feedback in enumerate(previous_feedback):
            for j, status in enumerate(feedback):
                if status in ['correct', 'present']:
                    revealed_letters.add(previous_guesses[i][j])
        
        for letter in revealed_letters:
            if letter not in guess:
                return jsonify({'error': 'Must use all revealed letters in hardcore mode'}), 400
    
    # Calculate feedback
    feedback = []
    for i in range(5):
        if guess[i] == target[i]:
            feedback.append('correct')
        elif guess[i] in target:
            feedback.append('present')
        else:
            feedback.append('absent')
    
    return jsonify({
        'feedback': feedback,
        'is_correct': guess == target
    })

@app.route('/api/hint', methods=['POST'])
def get_hint():
    """Generate an AI-powered hint based on previous guesses"""
    data = request.get_json()
    current_guess = data.get('currentGuess', '')
    previous_guesses = data.get('previousGuesses', [])
    feedback = data.get('feedback', [])
    
    if not previous_guesses:
        return jsonify({'hint': 'Try using common letters like E, A, R, I, O, T, N, S, L, C'})
    
    # Analyze previous guesses and feedback
    correct_letters = set()
    present_letters = set()
    absent_letters = set()
    
    for i, guess in enumerate(previous_guesses):
        for j, status in enumerate(feedback[i]):
            if status == 'correct':
                correct_letters.add(guess[j])
            elif status == 'present':
                present_letters.add(guess[j])
            else:
                absent_letters.add(guess[j])
    
    # Generate hint based on analysis
    if correct_letters:
        return jsonify({
            'hint': f'You have found the letters: {", ".join(correct_letters)}. Try to use them in the correct positions.'
        })
    elif present_letters:
        return jsonify({
            'hint': f'The word contains these letters: {", ".join(present_letters)}. Try them in different positions.'
        })
    else:
        return jsonify({
            'hint': 'Try using different letters. The word might contain common consonants like R, S, T, L, N.'
        })

@app.route('/api/save-score', methods=['POST'])
def save_score():
    """Save the game score to Firestore"""
    data = request.get_json()
    try:
        db.collection('scores').add({
            'player': data.get('player', 'anonymous'),
            'score': data.get('score', 0),
            'word': data.get('word', ''),
            'timestamp': firestore.SERVER_TIMESTAMP
        })
        return jsonify({'message': 'Score saved successfully'})
    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True, port=5000) 