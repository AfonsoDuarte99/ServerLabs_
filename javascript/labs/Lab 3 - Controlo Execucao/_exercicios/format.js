import {chunk} from 'lodash-es';
import wordwrap from 'wordwrapjs/index.mjs';

// console.log(_);
// let chunk = _.chunk;

function formatLeft(str, n) {
    return leftFormattedLines(str, n).join('\n');
}

function leftFormattedLines(str, n) {
    const words = str.trim().split(/\s+/);
    for (let i = 0; i < words.length; i += 1) {
        if (words[i].length > n) {
            const subWords = chunk([...words[i]], n).map(arr => arr.join(""));
            words.splice(i, 1, ...subWords);
        }
    }
    const lines = [];
    let currLine = [words.shift()];
    let lineWidth = currLine[0].length;
    for (let word of words) {
        if (lineWidth + 1 + word.length <= n) {
            // Stay in the same line
            currLine.push(word);
            lineWidth += 1 + word.length;  // note the '+=' 
        }
        else {
            // New line
            lines.push(currLine.join(" "));
            currLine = [word];
            lineWidth = word.length;       // note the '=' 
        }
    }
    if (lineWidth > 0) {
        lines.push(currLine.join(" "));
    }
    return lines;
}

console.log("====================================================");
console.log("COM ALGORITMO CASEIRO");
console.log("====================================================");

let str = "abcd def ghi jkl mnopq rs xyz";
console.log("Texto é:", str);
console.log("Linhas :\n->", leftFormattedLines(str, 8));  // ['abcd def', 'ghi jkl', 'mnopq rs', 'xyz']
console.log("Texto formatado :\n->", formatLeft(str, 8));

console.log("------------");

str = `10/10/10:
Fui ao mercado comprar peixe para o jantar.
Encontrei o Alberto e o Armando. Convidei-os para
jantar. Conversámos sobre o António, que eles
encontraram no casamento do Arnaldo.`
console.log("Texto é:", str);
console.log("Linhas\n->", leftFormattedLines(str, 20));
console.log("Texto formatado\n", formatLeft(str, 20));

console.log("====================================================");
console.log("COM WORDWRAPJS");
console.log("====================================================");
console.log("Texto formatado\n", wordwrap.wrap(str, {width: 20}));