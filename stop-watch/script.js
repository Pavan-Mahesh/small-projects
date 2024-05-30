const WHEEL_HEIGHT = 1.2;

const hours = document.querySelector('#hours').children;
const minutes = document.querySelector('#minutes').children;
const seconds = document.querySelector('#seconds').children;
const millis = document.querySelector('#millis').children;

const startBtn = document.querySelector('#start-btn');
const pauseBtn = document.querySelector('#pause-btn');
const resetBtn = document.querySelector('#reset-btn');
const flagBtn = document.querySelector('#flag-btn');

let millisId = null;
let lastLapMillis = 0;

startBtn.addEventListener('click', () => {
  startBtn.setAttribute('class', 'display-none');
  resetBtn.setAttribute('class', 'display-none');
  pauseBtn.removeAttribute('class');
  flagBtn.removeAttribute('class');
  millisId = setInterval(() => {
    updateMillis();
  }, 10);
});

pauseBtn.addEventListener('click', () => {
  clearInterval(millisId);
  millisId = null;
  flagBtn.setAttribute('class', 'display-none');
  pauseBtn.setAttribute('class', 'display-none');
  startBtn.removeAttribute('class');
  resetBtn.removeAttribute('class');
});

resetBtn.addEventListener('click', () => {
  const nums = document.querySelectorAll('.number');
  nums.forEach((elem, idx) => {
    elem.innerText = idx % 2;
  });
  for(let i = 0; i < 2; i++){
    millis[i].innerText = 0;
  }
  resetBtn.className = 'display-none';
  document.querySelector('.flag-container').innerHTML = '';
  lastLapMillis = 0;
});

flagBtn.addEventListener('click', () => {
  const nums = document.querySelectorAll('.number:nth-child(odd)'); // in html idx start from one
  let num = 0;
  let count = 0;
  const getTime = []
  nums.forEach(elem => {
    num = num * 10 + parseInt(elem.innerText);
    count++;
    if(count % 2 === 0) {
      getTime.push(num);
      num = 0;
    }
  });
  num = parseInt(millis[0].innerText + millis[1].innerText);
  getTime.push(num);
  let totalMillis = timeToMillis(getTime);
  if(totalMillis - lastLapMillis < 0) {
    totalMillis += 100;
    getTime[2] += 1;
  }
  const timeGap = millisToTime(totalMillis - lastLapMillis);
  lastLapMillis = totalMillis;
  
  for(let i = 0; i < 4; i++) {
    getTime[i] = (getTime[i] > 9 ? '' : '0') + getTime[i];
    timeGap[i] = (timeGap[i] > 9 ? '' : '0') + timeGap[i];
  }

  const flagContainer = document.querySelector('.flag-container');
  const flagsCount = flagContainer.childElementCount;
  const flagElem = document.createElement('div');
  flagElem.className = 'flag';
  flagElem.innerHTML = `
    <div id="sl-no">${flagsCount + 1}</div>
    <div id="gap">+ ${timeGap[0]}:${timeGap[1]}:${timeGap[2]}:${timeGap[3]}</div>
    <div id="flag">${getTime[0]}:${getTime[1]}:${getTime[2]}:${getTime[3]}</div>
  `;
  flagContainer.insertBefore(flagElem, flagContainer.firstElementChild);
});

function timeToMillis(time) {
  const totalMillis = (((time[0] * 60) + time[1]) * 60 + time[2]) * 100 + time[3];
  return totalMillis;
}

function millisToTime(totalMillis) {
  const time = [];
  time.push(Math.floor(totalMillis / (100 * 60 * 60)));
  time.push(Math.floor((totalMillis / (100 * 60)) % 60));
  time.push(Math.floor((totalMillis / 100) % 60));
  time.push(Math.floor(totalMillis % 100));
  return time;
}

function updateMillis() {
  const millisTens = parseInt(millis[0].innerText);
  const millisOnce = parseInt(millis[1].innerText);
  if(millisOnce === 9)
    millis[0].innerText = (millisTens + 1) % 10;
  millis[1].innerText = (millisOnce + 1) % 10;
  if(parseInt(millis[0].innerText + millis[1].innerText) === 84)
    rollWheel(seconds, 'seconds');
}

function rollWheel(numbers, units) {
  const tensWheel = numbers[0].firstElementChild;
  const tensNums = tensWheel.children;
  const nextTensNum = parseInt(tensNums[1].innerText);
  const oncesWheel = numbers[1].firstElementChild;
  const oncesNums = oncesWheel.children;
  const nextOncesNum = parseInt(oncesNums[1].innerText);

  if(nextTensNum === 0 && nextOncesNum === 0) {
    switch(units) {
      case 'seconds': 
        rollWheel(minutes, 'minutes');
        break;
      case 'minutes':
        rollWheel(hours, 'hours'); 
        break;
    }
  }
  
  const turns = 15;
  let count = 0;
  const intervalId = setInterval(() => {
    if(count === turns) {
      clearInterval(intervalId);
      if(nextOncesNum === 0) {
        tensNums[0].innerText = nextTensNum;
        tensWheel.removeAttribute('style');
        if(units === 'minutes' || units === 'seconds')
          tensNums[1].innerText = (nextTensNum + 1) % 6;
        else if(units === 'hours')
          tensNums[1].innerText = (nextTensNum + 1) % 10;
      }
      oncesNums[0].innerText = nextOncesNum;
      oncesWheel.removeAttribute('style');
      oncesNums[1].innerText = (nextOncesNum + 1) % 10;
      return;
    }
    count++;
    oncesWheel.style.top = (- count * (WHEEL_HEIGHT / turns)) + 'em';
    if(nextOncesNum === 0)
      tensWheel.style.top = (- count * (WHEEL_HEIGHT / turns)) + 'em';
  }, 10);
}
