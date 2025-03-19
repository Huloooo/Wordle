# Wordle Clone

A feature-rich Wordle clone built with React and Flask, featuring additional game modes and modern UI elements.

## Features

- Classic Wordle gameplay
- Emoji-Only Wordle mode
- Hardcore Mode
- Haptic & Sound Effects
- Themed Puzzles
- AI-powered Hints
- Dynamic Themes (including retro pixel art)
- Animated Letter Tiles
- Gradient Backgrounds
- Voice Input Support

## Prerequisites

- Python 3.8+
- Node.js 14+
- npm or yarn
- Firebase account and credentials

## Setup

### Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Create and activate a virtual environment:
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

4. Create a `.env` file in the backend directory with your Firebase credentials:
   ```
   FIREBASE_CREDENTIALS_PATH=path/to/your/firebase-credentials.json
   FLASK_ENV=development
   FLASK_APP=app.py
   ```

5. Start the Flask server:
   ```bash
   python app.py
   ```

### Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm start
   ```

## Usage

1. Open your browser and navigate to `http://localhost:3000`
2. Start playing Wordle!
3. Use the keyboard to input letters
4. Press Enter to submit your guess
5. Use Backspace to delete letters

## Additional Features

### Emoji-Only Mode
- Toggle emoji-only mode in the settings
- Words are replaced with emoji combinations
- Perfect for visual learners

### Hardcore Mode
- Must use revealed letters in subsequent guesses
- More challenging gameplay
- Toggle in settings

### Voice Input
- Click the microphone icon to enable voice input
- Speak your guess instead of typing
- Works with most modern browsers

### AI Hints
- Get up to 3 hints per word
- AI analyzes your previous guesses
- Provides strategic suggestions

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details. 