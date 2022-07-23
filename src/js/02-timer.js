import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.min.css';
import Notiflix from 'notiflix';

const outputDateEl = document.querySelector('.timer');
const buttonStartEl = document.querySelector('[data-start]');
const buttonStopEl = document.querySelector('[data-stop]');
const canvasArrayEl = document.querySelectorAll('canvas');
const audioEl = document.querySelector('.audio');

const widthField = outputDateEl.firstElementChild.offsetWidth;
const halfWidthField = Math.floor(widthField / 2);

canvasArrayEl.forEach(canvas => {
  canvas.setAttribute('width', widthField);
  canvas.setAttribute('height', widthField);
});

let selectedDate = null;
let isButtonStartActive = false;
let timer = null;
const options = {
  altFormat: 'd M Y H:i',

  position: 'auto center',
  altInput: true,
  enableTime: true,
  time_24hr: true,
  defaultDate: new Date(),
  minuteIncrement: 1,
  onClose(selectedDates, dateStr, instance) {
    selectedDate = selectedDates[0];
  },
  onChange(selectedDates) {
    const DifferenceTime = selectedDates[0].getTime() - Date.now();
    if (DifferenceTime > 0 && !isButtonStartActive) {
      isButtonStartActive = true;
      checkActivedStartButton();
    }
    if (DifferenceTime <= 0) {
      Notiflix.Notify.failure('Please choose a date in the future', {
        position: 'center-bottom',
        width: '380px',
        fontSize: '20px',
        // ...
      });
      if (isButtonStartActive) {
        isButtonStartActive = false;
        checkActivedStartButton();
      }
    }
  },
};
const fp = flatpickr('#datetime-picker', options);

buttonStartEl.addEventListener('click', onClickStartButton);
buttonStopEl.addEventListener('click', onClickRefreshButton);

function onClickStartButton() {
  fp.altInput.setAttribute('disabled', '');

  isButtonStartActive = false;
  checkActivedStartButton();
  TimerShow();
  timer = setInterval(TimerShow, 1000);
}
function checkActivedStartButton() {
  if (isButtonStartActive) {
    buttonStartEl.removeAttribute('disabled');
  } else {
    buttonStartEl.setAttribute('disabled', '');
  }
}
function onClickRefreshButton() {
  document.location.reload();
}
function TimerShow() {
  // selectedDate -= 144000; //прискорення часу

  const DifferenceTime = selectedDate - Date.now();
  if (DifferenceTime <= 0) {
    clearInterval(timer);
    Notiflix.Notify.success('Час вийшов', {
      position: 'center-center',
      fontSize: '20px',
      closeButton: true,
    });
    playSoundTimer();
    return;
  }

  outputDate(convertMs(DifferenceTime));
}
function playSoundTimer() {
  audioEl.play();
}
function outputDate(dateObj) {
  const dateArray = Object.entries(dateObj);
  dateArray.forEach(([dataSelector, value], index) => {
    outputDateEl.querySelector(`[data-${dataSelector}]`).textContent =
      addLeadingZero(value);
    if (dataSelector === 'days') {
      return;
    }
    drawCircle(index, value);
  });
}
function drawCircle(index, value) {
  const ctx = canvasArrayEl[index].getContext('2d');
  ctx.clearRect(0, 0, widthField, widthField);
  ctx.beginPath();
  ctx.strokeStyle = 'rgb(254, 61, 43)';

  ctx.lineWidth = 4;
  // ctx.lineCap = 'round';
  let path = 60 / 2;
  if (index === 1) {
    path = 24 / 2;
  }
  ctx.arc(
    halfWidthField,
    halfWidthField,
    halfWidthField - 2,
    (Math.PI / path) * (value - path / 2),
    (Math.PI / path) * (path * 2 - path / 2 - 0.01),
    true
  );
  ctx.stroke();
}
function convertMs(ms) {
  // Number of milliseconds per unit of time
  const second = 1000;
  const minute = second * 60;
  const hour = minute * 60;
  const day = hour * 24;

  // Remaining days
  const days = Math.floor(ms / day);
  // Remaining hours
  const hours = Math.floor((ms % day) / hour);
  // Remaining minutes
  const minutes = Math.floor(((ms % day) % hour) / minute);
  // Remaining seconds
  const seconds = Math.floor((((ms % day) % hour) % minute) / second);

  return { days, hours, minutes, seconds };
}
function addLeadingZero(value) {
  return value.toString().padStart(2, '0');
}
