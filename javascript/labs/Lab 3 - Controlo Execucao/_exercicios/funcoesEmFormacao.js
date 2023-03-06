
function moreThanOneWord(str) {
    return str.trim().split(/\s+/).length > 1;
}

function moreThanOneWord2(str) {
    return countWords(str) > 1;
}

function countWords(str) {
    const [DENTRO_PALAVRA, FORA_PALAVRA] = [0, 1];
    let estado = FORA_PALAVRA;
    let count = 0;
    let isWhiteSpace = function(ch) {
        return /\s/.test(ch);
    }
    for (let ch of str) {
        if (estado === FORA_PALAVRA && !isWhiteSpace(ch)) {
            count += 1;
            estado = DENTRO_PALAVRA;
        }
        else if (estado === DENTRO_PALAVRA && isWhiteSpace(ch)) {
            estado = FORA_PALAVRA;
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
            console.log(str, '->', moreThanOneWord2(str))
        }
        console.log("\n------\n");
    }
}

function extractLetters(str) {
    let letters = [];
    for (let ch of str) {
        if (/[A-Za-z]/.test(ch)) {
            letters.push(ch);
        }
    }
    return letters;
}

function extractLetters2(str) {
    return [...str].filter(function(ch) {
        return /[A-Za-z]/.test(ch);
    });
}

let str = "   ABC123 &%& alberto";
console.log(str, '->', extractLetters2(str));