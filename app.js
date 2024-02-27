let data = {
  currentNum: 0,
  numbers: [],
  calcAction: [],
  disableFn: false
};

let result = 0;

const calcFn = {
  Reset: ({ num, calc, delay }) => {
    const calcButtons = document.querySelector('.calculator-calcButtons');

    data = {
      currentNum: 0,
      numbers: [],
      calcAction: [],
    };

    calcFn.changeOutput(num, calc, delay);

    if(typeof num === 'string') {
      calcButtons.classList.add('disable');
      calcButtons.classList.add('disableResult');
      result = 0;
    } else {
      calcButtons.classList.remove('disable');
      calcButtons.classList.remove('disableResult');
    }
  },
  Del: ({ num, calc, delay }) => {
    if(num) {
      const str = num.toString();

      if(str.length > 1) {
        data.currentNum =  Number(str.slice(0, str.length - 1));
      } else {
        data.currentNum = 0;
      }
      

      calcFn.changeOutput(data.currentNum, calc, delay);
    }
  },
  "+": (num1, num2) => num1 + num2,
  "-": (num1, num2) => num1 - num2,
  "*": (num1, num2) => num1 * num2,
  "/": (num1, num2) => num1 / num2,
  "=": (numbers, calcAction) => {
    let total = numbers[0];

    for(let i = 0; i < calcAction.length; i += 1) {
      total = calcFn[calcAction[i]](total, numbers[i + 1]);
    }

    if(`${total}`.includes('.') && `${total}`.split('.')[1].length > 10) {
      total = Number(total.toFixed(10));
    }

    return total;
  },
  changeOutput(num, calc, delay) {
    const outputNum = document.querySelector('.calculator-output-num');
    const outputCalc = document.querySelector('.calculator-output-calc');
    const outputProcess = document.querySelector('.calculator-output-process');
    const { numbers, calcAction } = data;

    if(calc && calc !== '=') {
      let str = '';

      for(let i = 0; i < calcAction.length; i += 1) {
        str += numbers[i];
        str += calcAction[i];
      }

      outputProcess.textContent = str;
    } else {
      outputProcess.textContent = '';
    }

    outputNum.textContent = num;
    outputCalc.textContent = calc;

    if(delay) {
      setTimeout(() => {
        outputCalc.textContent = '';
      }, 1000)
    }
  },
};

function listenFnButtons() {
  const fnButtons = document.querySelector('.calculator-fnButtons');
  const outputNum = document.querySelector('.calculator-output-num');

  fnButtons.addEventListener('click', (event) => {
    if(event.target.nodeName !== 'BUTTON') {
      return;
    }

    const clickAction = event.target.textContent;
    let param = '';

    if(clickAction === 'Reset') {
      outputNum.classList.remove("smaller");
      param = {
        num: 0,
        calc: clickAction,
        delay: true
      };
    }

    if(clickAction === 'Del') {
      param = {
        num: data.currentNum,
        calc: clickAction,
        delay: true
      };
    }

    calcFn[clickAction](param);
  });
};

function listenNumButtons () {
  const numButtons = document.querySelector('.calculator-numButtons');
  const calcButtons = document.querySelector('.calculator-calcButtons');
  const outputNum = document.querySelector('.calculator-output-num');

  numButtons.addEventListener('click', (event) => {
    if(event.target.nodeName !== 'BUTTON') {
      return;
    }

    const clickNum = Number(event.target.textContent);
    let current = data.currentNum;
    result = 0;
    
    outputNum.classList.remove("smaller");

    if(current === 0 && clickNum === 0) {
      current = 0;
    } else if(current === 0) {
      current = '';
      current += clickNum;
    } else if(current.toString().length < 10) {
      current = current.toString() + clickNum;
    } else {
      const alertText = document.querySelector('.alert-text');
      alertText.classList.add("show");

      setTimeout(() => {
        alertText.classList.remove("show");
      }, 2000);
    }
    
    data.currentNum = Number(current);
    outputNum.textContent = current;
    calcButtons.classList.remove('disable');
  });
}

function listenCalcButtons () {
  const calcButtons = document.querySelector('.calculator-calcButtons');
  const outputNum = document.querySelector('.calculator-output-num');

  calcButtons.addEventListener('click', (event) => {
    if(event.target.nodeName !== 'BUTTON') {
      return;
    }
  
    let clickCalc = event.target.textContent;
    const { currentNum } = data;
    outputNum.classList.remove("smaller");

    if(clickCalc === '=') {
      data.numbers.push(currentNum);
      let total = calcFn["="](data.numbers, data.calcAction);

      if(`${total}`.length >= 12) {
        outputNum.classList.add("smaller");
      }

      result = total;

      if(!isFinite(total) && !isNaN(total)) {
        total = '無法除以零';
      } else if (isNaN(total)) {
        total = '無法計算';
      }

      calcFn.Reset({
        num: total,
        calc: clickCalc,
        delay: false
      });
      return;
    }
    
    if(result) {
      data.numbers.push(result);
      result = 0;
    } else {
      data.numbers.push(currentNum);
    }

    data.calcAction.push(clickCalc);
    calcButtons.classList.add('disable');
    
    calcFn.changeOutput(0, clickCalc, false);
    data.currentNum = 0;
  });
}

function init() {
  calcFn.changeOutput(0, '', false);

  listenFnButtons();
  listenNumButtons();
  listenCalcButtons();
};

init();