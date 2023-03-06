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

// stdin  : STanDard INput
// stdout : STanDard OUTput

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

// const numStr = rl.question('Introduza um número inteiro? ');

rl.question('Introduza um número inteiro? ', function(numStr) {
    const num = parseInt(numStr);
    console.log(`O dobro do número é: ${2*num}`);

    rl.question('Pressione ENTER para continuar...', function() {rl.close();});
});