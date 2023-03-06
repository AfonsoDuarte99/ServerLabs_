// 
// import {filter} from 'lodash-es';

function moreThanOneWord(str) {
    return str.trim().split(/\s+/).length > 1;
}

function moreThanOneWord2(str) {
    return countWords(str) > 1;
}

function countWords(str) {
    const [INSIDE_WORD, OUTSIDE_WORD] = [0, 1];
    let estado = OUTSIDE_WORD;
    let count = 0;
    let isWhiteSpace = function(ch) {
        return /\s/.test(ch);
    }
    for (let ch of str) {
        if (estado === OUTSIDE_WORD && !isWhiteSpace(ch)) {
            count += 1;
            estado = INSIDE_WORD;
        }
        else if (estado === INSIDE_WORD && isWhiteSpace(ch)) {
            estado = OUTSIDE_WORD;
        }
    }
    return count;
}

function testMoreThanWord() {
    console.log("===================================\nMORE_THAN_ONE_WORD\n==================================="); 
    let strs = [
        "bom dia",
        "bom",
        "    bom   ",
        "bom dia pessoal",
        "bom\tdia\tpessoal",
        "",
    ];
    let variations = [
        moreThanOneWord,
        moreThanOneWord2,
    ];
    for (let fn of variations) {
        console.log(fn.name, ":\n");
        for (let str of strs) {
            console.log(str, '->', fn(str))
        }
        console.log("\n------\n");
    }
}

function extractLetters(str) {
    const letters = [];
    for (let ch of str) {
        if (/[a-zA-Z]/.test(ch)) {
            letters.push(ch);
        }
    }
    return letters;
}

function extractLetters2(str) {
    return [...str].filter(ch => /[a-zA-Z]/.test(ch));
}

function extractLetters3(str) {
    // browser provavelemente será return _.filter(str, ch => /[a-zA-Z]/.test(ch));
    // return filter(str, ch => /[a-zA-Z]/.test(ch));
}

function somePositive(arr) {
    for (let val of arr) {
        if (val > 0) {
            return true;
        }
    }
    return false;
}

function somePositive2(arr) {
    return arr.some(val => val > 0);
}

// Devolver todos os elementos positivos de um array => semelhante a extractLetters

function allWords(str) {
    const [INSIDE_WORD, OUTSIDE_WORD] = [0, 1];
    let state = OUTSIDE_WORD;
    let currWord = [];
    let words = [];
    let isWhiteSpace = function(ch) {
        return /\s/.test(ch);
    }
    for (let ch of str) {
        if (state === OUTSIDE_WORD && !isWhiteSpace(ch)) {
            currWord.push(ch);
            state = INSIDE_WORD;
        }
        else if (state === INSIDE_WORD && isWhiteSpace(ch)) {
            words.push(currWord.join(""));
            currWord = [];
            state = OUTSIDE_WORD;
        }
        else if (state === INSIDE_WORD && !isWhiteSpace(ch)) {
            currWord.push(ch);
        }
    }
    if (currWord.length > 0) {
        words.push(currWord.join(""));
    }
    return words;
}

function allWords2(str) {
    str = str.trim();
    if (!str) {
        return [];
    }
    return str.trim().split(/\s+/);
}

function allWords3(str) {
    return str.match(/(\S+)/g);
}

function testAllWords() {
    console.log("===================================\ALL_WORDS\n==================================="); 
    let strs = [
        "bom dia",
        "bom",
        "    bom   ",
        "bom dia pessoal",
        "bom\tdia\tpessoal",
        "",
    ];
    let variations = [
        allWords,
        allWords2,
        allWords3,
    ];
    for (let fn of variations) {
        console.log(fn.name, ":\n");
        for (let str of strs) {
            console.log(str, '->', fn(str))
        }
        console.log("\n------\n");
    }
}


function resolvente(a, b, c) {
    let valueToSqr = b**2 - 4 * a * c;
    if (valueToSqr < 0) {
        return NaN;
    }
    return [(-b + Math.sqrt(valueToSqr))/ 2 * a, (-b - Math.sqrt(valueToSqr)) / 2 * a];
}


testAllWords();