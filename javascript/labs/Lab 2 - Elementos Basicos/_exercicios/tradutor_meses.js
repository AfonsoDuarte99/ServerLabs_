'use strict';

window.addEventListener('load', function() {
    const monthNameBtn = document.getElementById('monthNameBtn');
    monthNameBtn.addEventListener('click', showMonthName);
});

function showMonthName() {
    const monthNum = parseInt(document.getElementById('monthNum').value);
    const language = document.getElementById('language').value;
    window.monthNamePanel.innerHTML = `${getMonthName(monthNum, language)}`;
    return false;
}






























let getMonthName;
{
    let months = new Map([
        [
            'en',
            [
                'January',
                'February',
                'March',
                'April',
                'May',
                'June',
                'July',
                'August',
                'September',
                'October',
                'November',
                'December',
            ]
        ],
        [
            'pt',
            [
                'Janeiro',
                'Fevereiro',
                'Março',
                'Abril',
                'Março',
                'Junho',
                'Julho',
                'Agosto',
                'Setembro',
                'Outubro',
                'Novembro',
                'Dezembro',
            ]
        ],
        [
            'es',
            [
                'Enero',
                'Febrero',
                'Marzo',
                'Abril',
                'Mayo',
                'Junio',
                'Julio',
                'Agosto',
                'Septiembre',
                'Octubure',
                'Noviembre',
                'Diciembre',
            ]
        ],
    ]);

    getMonthName = function(numericMonth, lang) {
        return months.get(lang)[numericMonth-1];
    }
}

/*
for (let i = 0; i <= 100; i += 2) {
    if (i % 21 !== 0) {
        console.log(i);
    }
}

for (let i of _.range(0, 100, 2)) {
    if (i % 21 !== 0) {
        console.log(i);
    }
}*/