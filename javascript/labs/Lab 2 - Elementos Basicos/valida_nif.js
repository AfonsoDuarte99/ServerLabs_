/**
 * Validador de NIFs. 
 * Exemplo de utilização:
 *
 *  $ node valida_nif.js
 *  Introduza um NIF: 215445937
 *  NIF válido
 *
 *  $ node valida_nif.js
 *  Introduza um NIF: 215445936
 *  NIF inválido
 */

const readline = require('readline');

// OU, COM NOVO SISTEMA DE MÓDULOS, 
//
//      import readline from 'readline';
//
// NESTE CASO, ESTE SCRIPT DEVE SER GUARDADO COM EXTENSÃO 'mjs'
// OU ENTÃO DEVEMOS ALTERAR PACKAGE.JSON

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

/*
    O NIF tem 9 dígitos, sendo o último o digito de controlo. Para ser 
    calculado o digito de controlo: 
    1. Multiplique o 8.o dígito por 2, o 7.o dígito por 3, o 6.o dígito 
       por 4, o 5.o dígito por 5, o 4.o dígito por 6,o 3.o dígito por 7,
       o 2.o dígito por 8, e o 1.o digito por 9
    2. Adicione os resultados
    3. Calcule o Módulo 11 do resultado, isto é, o resto da divisão do 
       número por 11. 
    4. Se o resto for 0 ou 1, o dígito de controle será 0.
    5. Se for outro algarismo x (result), o dígito de controle será o resultado 
       de 11 - x"
 */

rl.question('Introduza o NIF? ', function(numStr) {
    console.log(validaNIF1(numStr) ? "NIF válido" : "NIF inválido");
    rl.question('Pressione ENTER para continuar...', function() {rl.close();});
});

function validNIF1(strNIF) {
    let result = 0;
    for (let i = 0; i < 8; i += 1) {
        result += parseInt(strNIF[i]) * (9 - i);
    }
    result %= 11;
    const control = parseInt(strNIF[8]);
    return control === (result === 0 || result === 1 ? 0 : 11 - result);
}

function validNIF2(strNIF) {
    if (strNIF.length !== 9) {
        return false;
    }
    let result = 0;
    for (let i = 0; i < 8; i += 1) {
        const alg = parseInt(strNIF[i]);
        if (isNaN(alg)) {
            return false;
        }
        result += alg * (9 - i);
    }
    result %= 11;
    const control = parseInt(strNIF[8]);
    if (isNaN(control)) {
        return false;
    }
    return control === (result === 0 || result === 1 ? 0 : 11 - result);
}

function validNIF3(strNIF) {
    if (! /^[0-9]{9}$/.test(strNIF)) {
        return false;
    }
    let result = 0;
    for (let i = 0; i < 8; i += 1) {
        result += parseInt(strNIF[i]) * (9 - i);
    }
    result %= 11;
    const control = parseInt(strNIF[8]);
    return control === (result === 0 || result === 1 ? 0 : 11 - result);
}