const fnButtons = document.querySelector('.calculator-fnButtons');
const numButtons = document.querySelector('.calculator-numButtons');
const calcButtons = document.querySelector('.calculator-calcButtons');
const outputNum = document.querySelector('.calculator-output-num');
const outputCalc = document.querySelector('.calculator-output-calc');
const outputProcess = document.querySelector('.calculator-output-process');

const calcFn = {
  Reset: ({ num, calc, delay }) => {
    // 此函式用於點擊「Reset」鍵或「=」
    // 1. 清空 data
    // 2. 移除運算鍵的鎖定
    action = {
      currentNum: 0,
      numbers: [],
      calcAction: [],
      result: 0,
    };

    calcFn.changeOutput(num, calc, delay);
    calcButtons.classList.remove('disable');
  },
  Del: ({ num, calc, delay }) => {
    if(num) {
      const str = num.toString();

      if(str.length > 1) {
        action.currentNum =  Number(str.slice(0, str.length - 1));
      } else {
        action.currentNum = 0;
      }
      

      calcFn.changeOutput(action.currentNum, calc, delay);
    }
  },
  "+": (num1, num2) => num1 + num2,
  "-": (num1, num2) => num1 - num2,
  "*": (num1, num2) => num1 * num2,
  "/": (num1, num2) => num1 / num2,
  "=": (ary) => {
    const { calcAction } = action;
    let total = ary[0];

    for(let i = 0; i < calcAction.length; i += 1) {
      total = calcFn[calcAction[i]](total, ary[i + 1]);
    }

    if(`${total}`.includes('.')) {
      const fixNum = 10 - `${total}`.split('.')[0].length - 1;
      total = total.toFixed(fixNum);
    }

    return total;
  },
  changeOutput(num, calc, delay) {
    const { numbers, calcAction } = action;

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

let action = {
  currentNum: 0,
  numbers: [],
  calcAction: [],
  disableFn: false,
  result: 0,
};

fnButtons.addEventListener('click', (event) =>  {
  if(event.target.nodeName === 'BUTTON') {
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
        num: action.currentNum,
        calc: clickAction,
        delay: true
      };
    }

    calcFn[clickAction](param);
  }
})

numButtons.addEventListener('click', (event) =>  {
  if(event.target.nodeName === 'BUTTON') {
    const clickNum = Number(event.target.textContent);
    let current = action.currentNum;
    outputNum.classList.remove("smaller");

    if(current === 0 && clickNum === 0) {
      current = 0;
    } else if(current === 0) {
      current = '';
      current += clickNum;
    } else if(current.toString().length < 10) {
      current = current.toString() + clickNum;
    }

    if(current.toString().length >= 10) {
      document.querySelector('.alert-text').classList.add("show");

      setTimeout(() => {
        document.querySelector('.alert-text').classList.remove("show");
      }, 2000);
    }
    
    action.currentNum = Number(current);
    outputNum.textContent = current;
    calcButtons.classList.remove('disable');
  }
})

calcButtons.addEventListener('click', (event) =>  {
  if(event.target.nodeName === 'BUTTON') {
    let clickCalc = event.target.textContent;
    const { currentNum } = action;
    outputNum.classList.remove("smaller");

    if(clickCalc === '=') {
      action.numbers.push(currentNum);
      const total = calcFn["="](action.numbers);

      if(`${total}`.length >= 12) {
        outputNum.classList.add("smaller");
      }

      calcFn.Reset({
        num: total,
        calc: clickCalc,
        delay: false
      });
    } 
    
    if(clickCalc !== '=') {
      action.numbers.push(currentNum);
      action.calcAction.push(clickCalc);
      calcButtons.classList.add('disable');
      
      calcFn.changeOutput(0, clickCalc, false);
    }

    action.currentNum = 0;
  }
})

function init() {
  calcFn.changeOutput(0, '', false);
}

init();