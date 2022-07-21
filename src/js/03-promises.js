import Notiflix from 'notiflix';

const formEl = document.querySelector('.form');
formEl.addEventListener('submit', onClickSubmit);

function onClickSubmit(event) {
  event.preventDefault();
  const elements = event.currentTarget.elements;
  const stepNumber = Number(elements.step.value);
  const delayNumber = Number(elements.delay.value);
  const amountNumber = Number(elements.amount.value);
  for (let i = 1; i <= amountNumber; i += 1) {
    createPromise(i, stepNumber * (i - 1) + delayNumber)
      .then(({ position, delay }) => {
        Notiflix.Notify.success(`Fulfilled promise ${position} in ${delay}ms`);
      })
      .catch(({ position, delay }) => {
        Notiflix.Notify.failure(`Rejected promise ${position} in ${delay}ms`);
      });
  }
}

function createPromise(position, delay) {
  const promise = new Promise((resolve, reject) => {
    setTimeout(() => {
      const shouldResolve = Math.random() > 0.3;
      if (shouldResolve) {
        resolve({ position, delay });
      } else {
        reject({ position, delay });
      }
    }, delay);
  });
  // console.log('pos=', position, ' delay=', delay);
  return promise;
}
