
// <script src="lodash.js"></script>
// document.head.innerHTML += 'lodash.js';
// npm install -g lodash  OU npm install --save loadash

// ARRAYS
let nomes = ['Alberto', 'Armando', 'Arnaldo'];
for (let nome of nomes) {
    console.log(nome);
}

for (let nome of nomes.slice().reverse()) {
    console.log(nome);
}

for (let [i, nome] of nomes.entries()) {
    console.log(`${i} => ${nome}`)
}

let pontos3D = [
    {x: 20, y: 10, z: 30},
    {x: -1, y: 5.2, z: 10},
    {x: -1.7, y: -2, z: -3},
];
for (let {x, y, z} of pontos3D) {
    console.log(`X: ${x}   Y: ${y}   Z: ${z} `)
}

// STRINGS
let txt = 'Alberto';
for (let ch of txt) {
    console.log(ch);
}

for (let [i, ch] of [...txt].entries()) {
    console.log(`${i} => ${ch}`);
}

for (let ch of [...txt].reverse().join('')) {
    console.log(ch);
} 

// OBJECTOS
let pessoa = {nome: 'Alberto', apelido: 'Antunes', idade: 27};
for (let [key, value] of Object.entries(pessoa)) {
    console.log(`${key} => ${value}`)
}

for (let key of Object.keys(pessoa)) {
    console.log(`${key} => ${pessoa[key]}`)
}

for (let value of Object.values(pessoa)) {
    console.log(`valor de propriedade => ${value}`)
}

// MAPAS
let pessoas = new Map([
    [112301, {nome: 'Alberto', apelido: 'Antunes', idade: 27}],
    [892714, {nome: 'Armando', apelido: 'Almeida', idade: 41}],
    [473331, {nome: 'António', apelido: 'Aveleda', idade: 22}],
]);

for (let [id, pessoa] of pessoas) {
    console.log(`${id} => ${pessoa.nome}`)
}

for (let id of pessoas.keys()) {
    console.log(`ID: ${id}`);
}

for (let pessoa of pessoas.values()) {
    console.log(`${pessoa.apelido}, ${pessoa.nome}`);
}

// GAMAS DE VALORES
for (let i of [...Array(5).keys()]) {
    console.log(i);
}

for (let i of _.range(5)) {     // utiliza função da biblioteca lodash
    console.log(i);
}

for (let i of _.range(5, 11)) {     
    console.log(i);
}

for (let i of _.range(5, 11, 2)) {     
    console.log(i);
}

for (let i of _.range(10, 4, -1)) {     
    console.log(i);
}

const letras = String.fromCharCode(..._.range('a'.charCodeAt(), 'z'.charCodeAt() + 1))
console.log(letras);

// GAMAS DE VALORES + ESTRUTURAS DE DADOS
let codigo = 'A8B2C0';
for (let i of _.range(0, codigo.length, 2)) {     
    console.log(codigo[i]);
}

let mensagem = "emrahc met tpircsavaj";
for (let i of _.range(mensagem.length - 1, -1, -1)) {
    console.log('.'.repeat(i), mensagem[i]);
} 

// CONTAGENS
let frutas = ['abacate', 'nêspera', 'marmelo', 'diospiro', 
              'marmelo', 'diospiro', 'abacate', 'diospiro'] ;
let contadores = new Map();
for (let fruta of frutas) {
    let n = contadores.get(fruta) || 0;
    contadores.set(fruta, n + 1);
}
console.log(contadores);

// AGRUPAR
let frutas = ['abacate', 'nêspera', 'marmelo', 'diospiro', 'pera'];
let grupos = new Map();
for (let fruta of frutas) {
    let grupo = grupos.get(fruta.length) || [];
    grupo.push(fruta);
    grupos.set(fruta.length, grupo);
}

let nomes = ['Alberto', 'Armando', 'Arnaldo'];
let idades = [19, 12, 30, 24];

for (let [nome, idade] of _.zip(nomes, idades)) {
    console.log(`${nome} -> ${idade}`);
} 

/////////////////////////////////////////////////////

// é um número primo?
function isPrime(num) {    
    if (!Number.isInteger(num) || num < 2) {
        return false;
    }
    for (let x of _.range(2, num)) {
        if (num % x === 0) {
           return false;
        }
    }
    return true;
}

// é uma password válida? isto é, tem pelo menos 6 caractares, uma min., 
// uma maiú., um dígito e um símbolo?
function isValidPassword(pwd) {
    const letras = String.fromCharCode(..._.range('a'.charCodeAt(), 
                                                  'z'.charCodeAt() + 1));
    const LETRAS = letras.toUpperCase();
    return pwd.length >= 6 
        && _.intersection([...pwd], [...letras]).length !== 0
        && _.intersection([...pwd], [...LETRAS]).length !== 0
        && _.intersection([...pwd], [...'0123456789']).length !== 0
        && _.intersection([...pwd], [...'#$!%']).length !== 0;
}
