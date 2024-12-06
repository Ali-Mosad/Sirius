// List of words and sounds to practice
const words = [
    { word: 'through', audio: 'audio/through.mp3' },
    { word: 'though', audio: 'audio/though.mp3' },
    { word: 'thought', audio: 'audio/thought.mp3' },
    { word: 'knight', audio: 'audio/knight.mp3' },
    { word: 'recipe', audio: 'audio/recipe.mp3' }
];

let currentWordIndex = 0;

// DOM Elements
const wordElement = document.getElementById('word');
const startBtn = document.getElementById('startBtn');
const playWordBtn = document.getElementById('playWordBtn');
const recordBtn = document.getElementById('recordBtn');
const feedbackElement = document.getElementById('result');

// Initialize game
function startGame() {
    currentWordIndex = 0;
    feedbackElement.innerText = "Your pronunciation: ";
    updateWordDisplay();
    playWordBtn.disabled = false;
    recordBtn.disabled = false;
}

// Update the word on the screen
function updateWordDisplay() {
    wordElement.innerText = words[currentWordIndex].word;
}

// Play the word audio
function playWordAudio() {
    const audio = new Audio(words[currentWordIndex].audio);
    audio.play();
}

// Record pronunciation (using Web Speech API)
async function recordPronunciation() {
    const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
    recognition.lang = 'en-US';
    recognition.start();

    recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript.toLowerCase();
        const correctWord = words[currentWordIndex].word.toLowerCase();

        if (transcript === correctWord) {
            feedbackElement.innerText = "Your pronunciation is correct! 🎉";
        } else {
            feedbackElement.innerText = "Try again! 😬";
        }
    };

    recognition.onerror = () => {
        feedbackElement.innerText = "Sorry, I didn't catch that. Please try again.";
    };
}

// Event Listeners
startBtn.addEventListener('click', startGame);
playWordBtn.addEventListener('click', playWordAudio);
recordBtn.addEventListener('click', recordPronunciation);

startBtn.disabled = false;
playWordBtn.disabled = true;
recordBtn.disabled = true;
