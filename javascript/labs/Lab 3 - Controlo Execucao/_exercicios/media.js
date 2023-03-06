window.addEventListener('load', function() {
    const goBtn = document.getElementById('go');
    goBtn.addEventListener('click', showAverage);
});

function showAverage() {
    const numbersString = document.getElementById('numbers').value.trim();
    const values = numbersString.split(/\s+/);

    // COMPLETAR A PARTIR DAQUI
    
    let soma = 0;
    for (let value of values) {
        soma += parseFloat(value);
    }

    // for (let i = 0; i < values.length; i += 1) {
    //     soma += parseFloat(values[i]);
    // }
    alert(`
        Soma  : ${soma}
        Média : ${(soma/values.length).toFixed(2)}`
    );
}