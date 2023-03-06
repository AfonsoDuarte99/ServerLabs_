'use strict';

/*
6.1  Indicar se uma string possui mais do que uma palavra.
*/

function hasWords(str) {
    return words(str).length > 1;
}

/*
6.2  Devolver todas as letras de uma string
*/

function extractLetters(str) {
    const letters = [];
    for (let ch of str) {
        if ((ch >= 'a' && ch <= 'z') || (ch >= 'A' && ch <= 'Z')) {
            letters.push(ch);
        }
    }
    return letters;
}

/*
 6.3  Indicar se um array possui pelo menos um elemento positivo.
 */

function hasPositive(arr) {
    for (let obj of arr) {
        let isNumber =  typeof obj === 'number'
                     || (typeof obj === 'object' && obj.constructor.name === 'Number');
        if (isNumber && obj > 0) {
            return true;
        }
    }
    return false;
}

/*
 6.5  Devolver todas as palavras de uma string. Por palavra entenda-se todas as 
 sequências de caracteres consecutivos que não são caracteres de espaçamento.
 */

function words(str) {
    const result = str.trim().split(/\s+/);
    if (result.length === 1 && !result[0]) {
        return [];
    }
    return result;
}

let strs = [
    "",
    "      ",
    "abc",
    "  abc  ",
    "abc def 4343  %&$",
];

for (let str of strs) {
    let words_ = words(str);
    console.log(`"${str}" ==> ${words_.length === 0 ? "[]" : words_}`);
}


// ----------------------------------------



// function ePalindromo(txt, apenasAlfaNum = false, ignoraCap = false) {

//     txt = ignoraCap && txt.toLowerCase() || txt;
//     return ePal(apenasAlfaNum ? filtraAlfaNum(txt) : txt);

//     function filtraAlfaNum(txt) {
//         return Array.from(txt).filter((car) => /^[0-9a-zA-Z]$/.test(car));
//     }

//     function ePal(seqCars) {
//         if (seqCars.length <= 1) {
//             return true;
//         }
//         return seqCars[0] === seqCars[seqCars.length - 1] && ePal(seqCars.slice(1, -1));
//     }
// }

// ePal("ABCBA") -> "A" === "D" && true <=> true
// ePal("BCB")   -> "B" === "B" && true <=> true
// ePal("C")     -> true (pq. "C".length <= 1)

// slice("BCB"(1, -1)) -> "C"
// N! = N x (N-1)!
// N! = N x (N - 1) x (N -2) x   1

// function factorial(n) {
//     if (n === 1 || n === 0) {
//         return 1;
//     }
//     return n * factorial(n-1);
// }

// factorial(4) -> 4 * 6 = 24               [factorial(3)]
// factorial(3) -> 3 * 2 = 6                [factorial(2)]
// factorial(2) -> 2 * 1 = 2                [factorial(1)]
// factorial(1) -> 1