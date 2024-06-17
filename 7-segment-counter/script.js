const dontShow = {
  "a": [1, 4],
  "b": [5, 6],
  "c": [2],
  "d": [1, 4, 7],
  "e": [1, 3, 4, 5, 7, 9],
  "f": [1, 2, 3, 7],
  "g": [0, 1, 7]
}

let num = 0;
document.getElementById('push-button')
  .addEventListener('click', () => {
    num = (num + 1) % 10;
    displayNum(num);
  });

function displayNum(num) {
  const ids = getIDs(num);
  let hold = 0;
  for(let i of ['a', 'b', 'c', 'd', 'e', 'f', 'g']) {
    const elem = document.querySelector(`#${i} .move-piece`);
    if(i === ids[hold]) {
      hold++;
      if(elem.getAttribute('data-at-center') === 'true')
        continue;
      elem.setAttribute('data-at-center', 'true');
      switch(i) {
        case 'a':
          elem.classList.remove('center-to-top');
          elem.classList.add('top-to-center');
          break;
        case 'b':
        case 'c':
          elem.classList.remove('center-to-right');
          elem.classList.add('right-to-center');
          break;
        case 'd':
        case 'g':
          elem.classList.remove('center-to-bottom');
          elem.classList.add('bottom-to-center');
          break;
        case 'e':
        case 'f':
          elem.classList.remove('center-to-left');
          elem.classList.add('left-to-center');
      }
    } else {
      if(elem.getAttribute('data-at-center') === 'false')
        continue;
      elem.setAttribute('data-at-center', 'false');
      switch(i) {
        case 'a':
          elem.classList.remove('top-to-center');
          elem.classList.add('center-to-top');
          break;
        case 'b':
        case 'c':
          elem.classList.remove('right-to-center');
          elem.classList.add('center-to-right');
          break;
        case 'd':
        case 'g':
          elem.classList.remove('bottom-to-center');
          elem.classList.add('center-to-bottom');
          break;
        case 'e':
        case 'f':
          elem.classList.remove('left-to-center');
          elem.classList.add('center-to-left');
      }
    }
  }
}

function getIDs(num) {
  const show = [];
  for([key, value] of Object.entries(dontShow)) {
    let flag = true;
    for(let i = 0; i < value.length; i++)
      if(value[i] === num)
        flag = false;
    if(flag)
      show.push(key);
  }
  return show;
}