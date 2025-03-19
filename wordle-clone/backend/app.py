from flask import Flask, request, jsonify
from flask_cors import CORS
import random
import json
import os
from dotenv import load_dotenv

app = Flask(__name__)
CORS(app)
load_dotenv()

# Load word list
try:
    with open('word_list.txt', 'r') as f:
        WORD_LIST = [word.strip().upper() for word in f.readlines() if len(word.strip()) == 5]
    print(f"Loaded {len(WORD_LIST)} valid 5-letter words from word_list.txt")
except Exception as e:
    print(f"Error loading word list: {e}")
    # Fallback words - all 5 letters
    WORD_LIST = ['APPLE', 'BEACH', 'CHAIR', 'DANCE', 'EAGLE', 'FLAME', 'GRAPE', 'HOUSE', 'IMAGE', 'JUICE']
    print("Using fallback word list")

@app.route('/api/word')
def get_word():
    word = random.choice(WORD_LIST)
    print(f"Selected word: {word}")
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

    if guess not in WORD_LIST:
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
    word = data.get('word')
    
    if not score or not word:
        return jsonify({'error': 'Missing score or word'}), 400
    
    # Here you would typically save the score to a database
    # For now, we'll just return success
    return jsonify({'success': True})

if __name__ == '__main__':
    app.run(debug=True, port=5001) 