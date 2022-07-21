const bodyEl = document.body;
const buttonStartEl = document.querySelector('[data-start]');
const buttonStopEl = document.querySelector('[data-stop]');
let idTimer = null;
buttonStopEl.setAttribute('disabled', '');

buttonStartEl.addEventListener('click', onClickStart);
buttonStopEl.addEventListener('click', onClickStop);

function onClickStart() {
  changeBackgroundColor();
  idTimer = setInterval(changeBackgroundColor, 1000);
  toggleAttrDisabledOnButtons();
}
function onClickStop() {
  clearInterval(idTimer);
  toggleAttrDisabledOnButtons();
}

function changeBackgroundColor() {
  bodyEl.style.backgroundColor = getRandomHexColor();
}
function getRandomHexColor() {
  return `#${Math.floor(Math.random() * 16777215)
    .toString(16)
    .padStart(6, 0)}`;
}
// функція добавляє на одну кнопку disabled,а з іншої знімає
function toggleAttrDisabledOnButtons() {
  if (buttonStartEl.hasAttribute('disabled')) {
    buttonStartEl.removeAttribute('disabled');
    buttonStopEl.setAttribute('disabled', '');
    return;
  }
  buttonStartEl.setAttribute('disabled', '');
  buttonStopEl.removeAttribute('disabled');
}
