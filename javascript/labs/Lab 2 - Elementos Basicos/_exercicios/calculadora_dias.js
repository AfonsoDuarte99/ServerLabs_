import {
    differenceInCalendarDays, 
    parseISO,
} from 'https://esm.run/date-fns';

window.addEventListener('load', main);

function main() {
    const btnComputeTotal = document.getElementById('computeTotal');
    btnComputeTotal.addEventListener('click', getDifferenceInDays);
}

function getDifferenceInDays() {
    const date1 = parseISO(document.getElementById('date1').value);
    const date2 = parseISO(document.getElementById('date2').value);

    const diffInDaysPanel = document.getElementById('diffInDays');
    diffInDaysPanel.innerHTML = 
        `Dias: ${Math.abs(differenceInCalendarDays(date1, date2))}`;
}

// btn.addEventListener('click', handleClick);
// btn.onclick = handleClick;