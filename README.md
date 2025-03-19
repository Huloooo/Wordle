# Wordle Clone

A modern implementation of the popular word game Wordle, built with React and Flask.

## Features

- Classic Wordle gameplay
- Hardcore mode with stricter rules
- Modern, responsive UI
- Keyboard support
- Color-coded feedback
- Score tracking

## Tech Stack

- Frontend: React with TypeScript
- Backend: Flask (Python)
- Styling: Material-UI
- State Management: React Hooks

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- Python 3.8 or higher
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone git@github.com:Huloooo/Wordle.git
cd Wordle
```

2. Set up the backend:
```bash
cd wordle-clone/backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
python app.py
```

3. Set up the frontend:
```bash
cd wordle-clone/frontend
npm install
npm start
```

The game will be available at:
- Frontend: http://localhost:3000
- Backend: http://localhost:5001

## Game Rules

1. You have 6 attempts to guess the 5-letter word
2. After each guess, you get color-coded feedback:
   - Green: Correct letter in correct position
   - Yellow: Correct letter in wrong position
   - Gray: Letter not in the word

### Hardcore Mode

In hardcore mode, you must:
- Use correct letters in their correct positions
- Use all revealed letters in subsequent guesses

## Contributing

Feel free to submit issues and enhancement requests! 