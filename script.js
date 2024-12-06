// List of words for pronunciation practice
const words = [
    { word: 'thorough', audio: 'https://www.merriam-webster.com/audio/prons/en/us/mp3/t/thoroug01.mp3' },
    { word: 'squirrel', audio: 'https://www.merriam-webster.com/audio/prons/en/us/mp3/s/squirre01.mp3' },
    { word: 'anemone', audio: 'https://www.merriam-webster.com/audio/prons/en/us/mp3/a/anemone01.mp3' },
    { word: 'mischievous', audio: 'https://www.merriam-webster.com/audio/prons/en/us/mp3/m/mischie01.mp3' },
    { word: 'entrepreneur', audio: 'https://www.merriam-webster.com/audio/prons/en/us/mp3/e/entrepr01.mp3' }
];

// Select the elements from the HTML
const wordDisplay = document.getElementById('word');
const feedback = document.getElementById('feedback');
const startButton = document.getElementById('start-button');
const countdownDisplay = document.getElementById('countdown');
const scoreValue = document.getElementById('score-value');
const audioElement = document.getElementById('word-audio');

let currentScore = 0;

// Display a random word when the game loads
function getRandomWord() {
    const randomIndex = Math.floor(Math.random() * words.length);
    return words[randomIndex];
}

function displayWord() {
    const wordObject = getRandomWord();
    wordDisplay.textContent = wordObject.word;
    audioElement.src = wordObject.audio;
}

// Countdown timer before the game starts
function startCountdown() {
    let countdown = 3;
    countdownDisplay.textContent = countdown;
    const interval = setInterval(() => {
        countdown--;
        countdownDisplay.textContent = countdown;
        if (countdown <= 0) {
            clearInterval(interval);
            countdownDisplay.style.display = 'none';
            startRecognition();
        }
    }, 1000);
}

// Function to start speech recognition
function startRecognition() {
    if (!('webkitSpeechRecognition' in window)) {
        alert('Sorry, your browser does not support speech recognition.');
        return;
    }

    const recognition = new webkitSpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = 'en-US';

    recognition.start();

    recognition.onresult = (event) => {
        const spokenWord = event.results[0][0].transcript.toLowerCase();
        const correctWord = wordDisplay.textContent.toLowerCase();

        if (spokenWord === correctWord) {
            feedback.textContent = 'Correct! Great job!';
            feedback.style.color = 'green';
            currentScore++;
            scoreValue.textContent = currentScore;
            setTimeout(() => {
                displayWord();
                feedback.textContent = '';
            }, 2000);
        } else {
            feedback.textContent = `Try again! You said: "${spokenWord}".`;
            feedback.style.color = 'red';
        }
    };

    recognition.onerror = (event) => {
        console.error('Error occurred in recognition:', event.error);
        feedback.textContent = 'Error occurred. Please try again.';
        feedback.style.color = 'red';
    };
}

// Play the word audio when the game starts
function playWordAudio() {
    audioElement.play();
}

// Attach event listener to the button
startButton.addEventListener('click', () => {
    countdownDisplay.style.display = 'block';
    startButton.disabled = true;
    displayWord();
    playWordAudio();
    startCountdown();
});
