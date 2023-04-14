import './styles.scss';
import html2canvas from 'html2canvas';

const apiUrl = 'https://opentdb.com/api.php?amount=10';
const triviaForm = document.getElementById('trivia-form');
const triviaContainer = document.getElementById('trivia-container');
const scoreContainer = document.getElementById('score-container');
const scoreElement = document.getElementById('score');
const newTriviaButton = document.getElementById('new-trivia');
// const shareButton = document.getElementById('share-button');

// shareButton.addEventListener('click', async () => {
//     const scoreContainer = document.getElementById('score-container');
  
//     try {
//       const canvas = await html2canvas(scoreContainer);
//       const imageData = canvas.toDataURL('image/png');
//       const text = encodeURIComponent(`¡Mira mi puntaje en esta trivia! Obtuve ${score} puntos. ¿Puedes superarme?`);
  
//       const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${imageData}`;
//       const twitterUrl = `https://twitter.com/intent/tweet?text=${text}&url=${imageData}`;
//       const linkedinUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${imageData}`;
  
//       window.open(facebookUrl, '_blank', 'width=600,height=400');
//       window.open(twitterUrl, '_blank', 'width=600,height=400');
//       window.open(linkedinUrl, '_blank', 'width=600,height=400');
//     } catch (error) {
//       console.error('Error al capturar el área del puntaje:', error);
//     }
//   });
  
async function fetchCategories() {
  const response = await fetch('https://opentdb.com/api_category.php');
  const data = await response.json();
  const categories = data.trivia_categories;
  populateCategorySelect(categories);
}

function populateCategorySelect(categories) {
  const categorySelect = document.getElementById('category');
  categories.forEach(category => {
    const option = document.createElement('option');
    option.value = category.id;
    option.textContent = category.name;
    categorySelect.appendChild(option);
  });
}

async function fetchTriviaQuestions(difficulty, type, category) {
  const response = await fetch(`${apiUrl}&difficulty=${difficulty}&type=${type}&category=${category}`);
  const data = await response.json();
  const questions = data.results;
  return questions;
}

function displayTrivia(questions) {
    triviaContainer.innerHTML = '';
    questions.forEach((question, index) => {
      const questionElement = document.createElement('div');
      questionElement.classList.add('question');
      questionElement.innerHTML = `
        <h3>${index + 1}. ${question.question}</h3>
        <ul>
          ${shuffle([...question.incorrect_answers, question.correct_answer]).map(answer => `<li class="answer" data-answer="${answer === question.correct_answer ? 'correct' : 'incorrect'}">${answer}</li>`).join('')}
        </ul>
      `;
      triviaContainer.appendChild(questionElement);
    });
  }
  

function shuffle(array) {
  let currentIndex = array.length, temporaryValue, randomIndex;

  // Mientras queden elementos para mezclar...
  while (0 !== currentIndex) {

    // Selecciona un elemento sin mezclar...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;

    // E intercambia con el elemento actual.
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }

  return array;
}

triviaForm.addEventListener('submit', async (event) => {
  event.preventDefault();
  const difficulty = document.getElementById('difficulty').value;
  const type = document.getElementById('type').value;
  const category = document.getElementById('category').value;

  const questions = await fetchTriviaQuestions(difficulty, type, category);
  displayTrivia(questions);

  scoreElement.textContent = '0';
  newTriviaButton.style.display = 'none';
});
let score = 0;

triviaContainer.addEventListener('click', (event) => {
    const answerElement = event.target.closest('.answer');
  
    if (!answerElement) {
      return;
    }
  
    const correct = answerElement.dataset.answer === 'correct';
  
    if (correct) {
      score += 100;
      scoreElement.textContent = score;
  
      // Cambiar el color del borde del contenedor de puntaje
      const scoreContainer = document.getElementById('score-container');
      if (score >= 700) {
        scoreContainer.style.borderColor = 'green';
      } else {
        scoreContainer.style.borderColor = 'red';
      }
  
      answerElement.style.backgroundColor = 'rgba(0, 200, 0, 0.5)';
    } else {
      answerElement.style.backgroundColor = 'rgba(200, 0, 0, 0.5)';
    }
  
    // Desactivar las respuestas adicionales una vez que se haya seleccionado una
    const otherAnswers = answerElement.closest('ul').querySelectorAll('.answer');
    otherAnswers.forEach((element) => {
      element.style.pointerEvents = 'none';
    });
  });
  
  
newTriviaButton.addEventListener('click', async () => {
    const difficulty = document.getElementById('difficulty').value;
    const type = document.getElementById('type').value;
    const category = document.getElementById('category').value;
  
    const questions = await fetchTriviaQuestions(difficulty, type, category);
    displayTrivia(questions);
  
    scoreElement.textContent = '0';
    newTriviaButton.style.display = 'none';
  });
  
  fetchCategories();
  