
function moreThanOneWord(str) {
    return str.trim().split(/\s+/).length > 1;
}

function moreThanOneWord2(str) {
    return countWords(str) > 1;
}

function countWords(str) {
    let count = 0;
    const [INSIDE_WORD, OUTSIDE_WORD] = [10, 13];
    let state = OUTSIDE_WORD;
    // let isWhiteSpace = function(ch) { return !/\s/.test(ch);}
    let isWhiteSpace = ch => /\s/.test(ch);

    for (let ch of str) {
        if (state === OUTSIDE_WORD && !isWhiteSpace(ch)) {
            count += 1;
            state = INSIDE_WORD;
        }
        else if (state === INSIDE_WORD && isWhiteSpace(ch)) {
            state = OUTSIDE_WORD;
        }
    }
    return count;
}

function extractLetters(str) {
    return [...str].filter(function(ch) {
        return /[a-zA-Z]/.test(ch);
    });
}

function extractLetters2(str) {
    const letters = [];
    for (let ch of str) {
        if (/[a-zA-Z]/.test(ch)) {
            letters.push(ch);
        }
    }
    return letters;
}

function somePositive(nums) {
    // return undefined !== nums.find(function(num) {
    //     return nums > 0;
    // });
    return extractPositives(nums).length > 0;
}

function extractPositives(nums) {
    return nums.filter(function(num) {
        return nums > 0;
    });
}

// TPC: implementar versão que não utiliza filter e utilizar ciclos
function extractPositives2(nums) {

}

function allWords(str) {
    let words = [];
    let currWord = [];
    const [INSIDE_WORD, OUTSIDE_WORD] = [10, 13];
    let state = OUTSIDE_WORD;
    let isWhiteSpace = ch => /\s/.test(ch);

    for (let ch of str) {
        if (state === OUTSIDE_WORD && !isWhiteSpace(ch)) {
            currWord = [ch];
            state = INSIDE_WORD;
        }
        else if (state === INSIDE_WORD && !isWhiteSpace(ch)) {
            currWord.push(ch);
        }
        else if (state === INSIDE_WORD && isWhiteSpace(ch)) {
            words.push(currWord.join(''));
            currWord = [];
            state = OUTSIDE_WORD;
        }
    }
    if (currWord.length > 0) {
        words.push(currWord.join(''));
    }
    return words;
}

allWords(' abc    def   4343');

// const nums = [10, 20];
// nums = [100, 300];   // ERRO
// nums[0] = 101;       // OK

// // ------

// const NUMS = [10, 20];
// NUMS = [100, 300];      // ERRO
// NUMS[0] = [100, 300];   // ERRO  (não devemos fazer mas o JavaScript aceita)

// VARIÁVEIS DE ESTADO:
//     - CH: Caractere actual / Caractere a analisar
//     - COUNT: Contador de palavras
//     - ESTADO

// ESTADOS DO ALGORITMO (CARACTERE-A-CARACTERE)
//     - FORA_PALAVRA
//         CH = ESPAÇAMENTO      => próximo estado continua FORA_PALAVRA
//         CH = NÃO ESPAÇAMENTO  => próximo estado transita para DENTRO_PALAVRA
//                                  consequência: COUNT = COUNT + 1

//     - DENTRO_PALAVRA
//         CH = ESPAÇAMENTO      => próximo estado transita para FORA_PALAVRA
//         CH = NÃO ESPAÇAMENTO  => próximo estado continua DENTRO_PALAVRA

// "   ABC   DEF     GHI"


// TECNOLOGIAS E CONCEITOS DE BASE:
//
// 1. Web: 
//      1.1 Grid Layout
//      1.2 SPA: single-page applications
//      1.3 Algumas APIs: History, LocalStorage, Cookies, etc (nos projectos)
//
// 2. JavaScript:
//      2.1 Programação Funcional
//      2.2 POO (estilo JavaScript)
//      2.3 Programação Assíncrona (estilo JavaScript mas também abordando
//          conceitos gerais, não específicos de JavaScript)
//
// 3. Frameworks / Biblioteca
//      3.1 Node.JS (não é bem uma framework)
//      3.2 Express.js: desenvovlimento Web server-side
//      3.3 Vue.js: desenvolvimento de SPA 