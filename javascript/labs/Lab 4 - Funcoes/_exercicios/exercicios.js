'use strict';

function inverte(coll) {
    return coll.reduceRight((objs, obj) => {
        objs.push(obj); 
        return objs;
    }, []);
}

function inverte(coll) {
    let objs = [];
    for (let obj of coll) {
        objs.splice(0, 0, obj);
    }
    return objs;
}

function invertePalavras(str) {
    let palavras = str.split(' ');
    return palavras.reverse().join(' ');
}

function inBetween(a, b) {
    return function(n) {
        return n >= a && n <= b;
    };
}
// OU
function inBetween(a, b) {
    return n => (n >= a && n <= b);
}

// Esta versão não serve para filter porque filter espera uma função com 
// um argumento.
function inBetween(n, a, b) {   
    return n >= a && n <= b;
}

function inCollection(...items) {
    return function(n) {
        return items.includes(n);
    }
}
// OU
function inCollection(...items) {
    return n => items.includes(n);
}

function like(pattern) {
    pattern = new RegExp(pattern);
    return function(str) {
        return pattern.test(str);
    }
}
// OU
function like(pattern) {
    pattern = new RegExp(pattern);
    return (str) => pattern.test(str);
}


// Desenvolva uma variação de slice que aceita:
// - Uma sequência de elementos que possa ser iterada por um ciclo let-of e que 
//     possua uma propriedade length e que possa ser indexada com [ ]
// - start e end com a semântica de Array.prototype.slice
// - step que indica um incremento para levar start até end; se step 
//     for positivo e start >= end , ou se step for negativo e start <= end, 
//     é devolvida uma sequência vazia; se step === 0 é devolvido undefined 
//     ou lançada uma excepção.
// A função devolve os elementos numa string, se a sequência original for uma 
// string, num array, para qualquer outro tipo de dados da sequência original. 
// Por omissão o valor de step é 1. start e end têm os valores por omissão 
// que têm em Array.prototype.slice.

/**
 * Returns a slice of seq with all elements beteween the indexes given
 * by start and end-1.
 * 
 * @param {iterable} seq An iterable sequence, suitable for for-of.
 * @param {integer} start Positive index
 * @param {integer} end Positive index
 * @param integer} step Positive or negative step.
 */
 function slice0(seq, start, end, step=1) {
    if (step === 0) {
        throw new Error('Invalid value for step (0).')
    }
    if (step < 0 && start < end || step > 0 && start > end) {
        return [];
    }
    const elems = [];
    if (step > 0) {
        for (let i = start; i < end; i += step) {
            elems.push(seq[i]);
        }
    }
    else {
        for (let i = start; i > end; i += step) {
            elems.push(seq[i]);
        }
    }
    return elems;
}

function slice(seq, start, end, step=1) {
    if (step === 0) {
        throw new Error('Invalid value for step (0).')
    }
    if (step < 0 && start < end || step > 0 && start > end) {
        return [];
    }
    const elems = [];
    const compare = step > 0 ? (x, y) => x < y : (x, y) => x > end;
    for (let i = start; compare(i, end); i += step) {
        elems.push(seq[i]);
    }
    if (typeof seq === 'string' || seq.constructor.name === 'String') {
        return elems.join('');
    }
    return elems;
}

const vals = [15, 7, 20, 14, 9, 29, 3, 4];
slice(vals, 1, 4);      // [7, 20, 14]
slice(vals, 0, 3);      // [15, 7, 20]
slice(vals, 1, 6, 2);   // [7, 14, 29]
slice(vals, 0, vals.length, 2);     // elementos posições pares
slice(vals, 1, vals.length, 2);     // elementos posições ímpares

slice(vals, 1, 6, 0);       // erro
slice(vals, 1, 6, -1);      // []
slice(vals, 1, 6, 1);       // [7, 20, 14, 9, 29]
slice(vals, 6, 1, -1);      // [29, 9, 14, 20, 7]

/**
 * Defina a função validaEndereco que verifca se um "pseudo" endereço IP passado 
 * como argumento é válido. Se for, a função devolve true, caso contrário 
 * devolve false. Um "pseudo" endereço IP possui 4 parcelas separadas por 
 * um '.' (ponto). Cada parcela deve ser um um número inteiro entre 0 e 255. 
 * Note que a função não deve aceitar zeros à esquerda na defnição de cada 
 * parcela, mas deve aceitar parcelas com um zero apenas. Também não devem 
 * ser aceites os endereços 0.0.0.0 e 255.255.255.255.
 */

 function validaEndereco(endereco) {
    const parcRE = '([0-9]|[1-9][0-9]|[1-2][0-4][0-9]|25[0-5])';
    // eslint-disable-next-line no-useless-escape
    const endRE = `^${parcRE}\.${parcRE}\.${parcRE}\.${parcRE}$`;
    if (new RegExp(endRE).test(endereco.trim())) {
        return !['255.255.255.255', '0.0.0.0'].includes(endereco);
    }
    return false;
}

/*
const soma = endereco
    .split('\.')
    .map((parc) => parseInt(parc, 10))
    .reduce((soma, parc) => soma + parc, 0)
;
if (![0, 1020].includes(soma)) {
    return true;
}
*/

// function sum(iter, key = (x) => x) {
//     let sum = 0;
//     for (let elem in iter) {
//         sum += key(elem);
//     }
//     return sum;
// }

// sum(endereco.split('\.'), (item) => parseInt(item, 10))