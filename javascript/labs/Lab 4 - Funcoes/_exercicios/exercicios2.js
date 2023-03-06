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