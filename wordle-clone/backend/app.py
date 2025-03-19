from flask import Flask, request, jsonify
from flask_cors import CORS
import random
import json
import os
from dotenv import load_dotenv
import logging

app = Flask(__name__)
CORS(app)
load_dotenv()

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# List of complex 5-letter words for hardcore mode
HARDCORE_WORDS = [
    'ABYSS', 'CYNIC', 'EPOCH', 'FJORD', 'GLEAN',  # Deep, profound
    'HAUTE', 'IDYLL', 'JOUST', 'KNAVE', 'LYMPH',  # High fashion
    'MYRRH', 'NYMPH', 'OZONE', 'PHYLA', 'QUARK',  # Mythological being
    'RHYME', 'SYNOD', 'THYME', 'USURP', 'VYING',  # Subatomic particle
    'WIGHT', 'XENON', 'YACHT', 'ZESTY'  # Luxury boat
]

# Load word list
with open('word_list.txt', 'r') as f:
    words = [word.strip().upper() for word in f.readlines()]
    words = [word for word in words if len(word) == 5]
    logger.info(f"Loaded {len(words)} valid 5-letter words from word_list.txt")

@app.route('/api/word', methods=['GET'])
def get_word():
    hardcore_mode = request.args.get('hardcore', 'false').lower() == 'true'
    
    if hardcore_mode:
        # Filter hardcore words to only include those in the valid word list
        valid_hardcore_words = [word for word in HARDCORE_WORDS if word in words]
        if not valid_hardcore_words:
            # Fallback to regular words if no valid hardcore words
            word = random.choice(words)
            logger.info(f"No valid hardcore words found, using regular word: {word}")
        else:
            word = random.choice(valid_hardcore_words)
            logger.info(f"Selected hardcore word: {word}")
    else:
        word = random.choice(words)
        logger.info(f"Selected word: {word}")
    
    return jsonify({'word': word})

@app.route('/api/check', methods=['POST'])
def check_word():
    data = request.get_json()
    print(f"Received check request with data: {data}")  # Debug log
    
    guess = data.get('guess', '').upper()
    target = data.get('target', '')
    hardcore_mode = data.get('hardcore_mode', False)
    previous_guesses = data.get('previous_guesses', [])
    previous_feedback = data.get('previous_feedback', [])

    if not guess or not target:
        print(f"Missing data - guess: {guess}, target: {target}")  # Debug log
        return jsonify({'error': 'Missing guess or target word'}), 400

    if len(guess) != 5:
        return jsonify({'error': 'Guess must be 5 characters long'}), 400

    if not guess.isalpha():
        return jsonify({'error': 'Guess must contain only letters'}), 400

    if guess not in words:
        print(f"Invalid word: {guess}")  # Debug log
        return jsonify({'error': 'Not in word list'}), 400

    # Check hardcore mode rules
    if hardcore_mode and previous_guesses:
        print(f"Checking hardcore mode rules for guess: {guess}")
        for prev_guess, prev_feedback in zip(previous_guesses, previous_feedback):
            print(f"Previous guess: {prev_guess}, feedback: {prev_feedback}")
            for i, (letter, feedback) in enumerate(zip(prev_guess, prev_feedback)):
                if feedback == 'correct' and guess[i] != letter:
                    print(f"Hardcore mode error: Must use correct letter '{letter}' in position {i}")
                    return jsonify({'error': 'Must use correct letters in correct positions'}), 400
                if feedback == 'present' and letter not in guess:
                    print(f"Hardcore mode error: Must use revealed letter '{letter}'")
                    return jsonify({'error': 'Must use all revealed letters'}), 400

    # Generate feedback
    feedback = ['absent'] * 5
    target_letters = list(target)
    
    # First pass: mark correct letters
    for i in range(5):
        if guess[i] == target_letters[i]:
            feedback[i] = 'correct'
            target_letters[i] = None
    
    # Second pass: mark present letters
    for i in range(5):
        if feedback[i] != 'correct':
            for j in range(5):
                if target_letters[j] == guess[i]:
                    feedback[i] = 'present'
                    target_letters[j] = None
                    break

    is_correct = guess == target
    print(f"Feedback for guess '{guess}': {feedback}, is_correct: {is_correct}, hardcore_mode: {hardcore_mode}")
    return jsonify({
        'feedback': feedback,
        'is_correct': is_correct
    })

@app.route('/api/save-score', methods=['POST'])
def save_score():
    data = request.get_json()
    score = data.get('score')
    hardcore_mode = data.get('hardcore_mode', False)
    
    if score is None:
        return jsonify({'error': 'Missing score'}), 400
    
    # Here you would typically save the score to a database
    # For now, we'll just return success
    logger.info(f"Saved score: {score} (hardcore mode: {hardcore_mode})")
    return jsonify({'success': True})

if __name__ == '__main__':
    app.run(debug=True, port=5001) 