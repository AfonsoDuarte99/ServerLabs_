import lodash from './lodash.min.js';

window.addEventListener('load', function() {
    const sumBtn = document.getElementById('sumBtn');
    sumBtn.addEventListener('click', function() {
        const num1 = parseInt(document.getElementById('num1').value, 10);
        const num2 = parseInt(document.getElementById('num2').value, 10);
        const resultPanel = document.getElementById('resultPanel');
        
        resultPanel.innerHTML = `Soma: ${sumRange(num1, num2 + 1)}`;
    });
});

function sumRange(a, b) {
    let sum = 0;
    for (let i of lodash.range(a, b)) {
        sum += i;
    }
    return sum;
}

// window.lodash = lodash;