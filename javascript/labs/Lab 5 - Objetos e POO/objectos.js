'use strict';

////////////////////////////////////////////////////////////////////////
//
//      SUMÁRIO EXECUTIVO:
//
////////////////////////////////////////////////////////////////////////

// Neste laboratório vamos estudar Programação Orientada por Objectos 
// (POO) em JavaScript. Vamos ver que modelos de POO JavaScript suporta
// e, para cada um destes modelos, quais os mecanismos da linguagem mais
// apropriados para programar de acordo com o que cada um desses modelos
// prescreve. 
//
// Os modelos e mecanismos que aqui vamos estudar são os seguintes
//
//      1. Pseudoclássico: Protótipos e Herança Prototipal
//      2. Clássico: Classes ES6
//      3. Sem Classes: Fábricas de Objectos c/ "Herança" Funcional
//
// Seguem-se as conclusões e recomendações do laboratório, dirigidas 
// especiamente para aos "apressados" que não pretendem seguir o 
// laboratório todo até ao fim, e que apenas querem saber qual é a 
// receita que devem utilizar:
// 
// 1. Sempre que possível devemos utilizar o modelo 3, uma vez que os 
//    os outros dois apresentam sérios problemas em termos da 
//    organização muito rígida que impõem ao código, o que dificulta
//    a sua manutenção e extensibilidade, além de que não oferecem
//    privacidade (à data de hoje).
//
// 2. Sempre que não for possível ou viável utilizar o modelo 3,
//    recomenda-se então a utilização do modelo 2, tirando partido das
//    novas classes ES6. Os dois modelos "clássicos" são muito 
//    populares, mas, com a chegada do ES6 em 2015, muitas bibliotecas e
//    frameworks passaram a definir APIs assentes em classes ES6. Como 
//    veremos, o modelo 2 também utiliza protótipos e herança prototipal. 
//    As classes como que escondem este pormenor. Tendo nós consciência
//    disto, então mais vale tirar partido da conveniência sintática
//    oferecida pelas classes, o que leva a código mais expressivo, 
//    legível e fácil de alterar.

////////////////////////////////////////////////////////////////////////
//
//      OBJECTOS LITERAIS
//
////////////////////////////////////////////////////////////////////////

// Programação Orientada por Objectos (POO) consiste numa metodologia
// de programação que utiliza objectos - uma agregação de atributos e
// operações numa só unidade - para representar informação concreta
// sobre os conceitos que o software pretende representar. Esses
// conceitos (eg, cliente, produto, encomenda, livro, ficheiro,
// ligação, device driver, local, utilizador, etc.) são definidos
// através de um qualquer mecanismo da linguagem, tipicamente, através
// de classes, um mecanismo muito popular em linguagens com suporte
// nativo para POO. Uma classe (ou mecanismo equivalente) define como
// é que os objectos são criados, que informação "carregam" consigo e
// que operações suportam. Cada objecto representa uma "criação" da
// classe, ie, uma instância da classe. Uma classe, não só actua como
// que uma especificação dos objectos dessa classe, como também,
// funciona como um modelo (ie, um "template") através do qual criamos
// os objectos. Na maioria das linguagens que suportam classes, uma
// classe é também um tipo de dados.

// Objecto: uma agregação de propriedades com uma notação literal

let ponto1 = {x: 10, y: -20};   // ao longo dos exemplos vamos reassociar
let ponto2 = {x: -1, y: 40};    //   estas vars; por isso 'let' e não 'const'

console.log("ponto: %o", ponto1);
console.log("ponto: %o", ponto2);
console.log("(X, Y) -> (%d, %d)", ponto1.x, ponto1.y);

// NOTA: consultar as opções de console.log em 
//      https://console.spec.whatwg.org/#logger

function distancia(p1, p2) {
    const pow = Math.pow;
    const xDistSq = pow(p1.x - p2.x, 2);
    const yDistSq = pow(p1.y - p2.y, 2);       
    return Math.sqrt(xDistSq + yDistSq);
}

function toString(ponto) {
    return `<${ponto.x}, ${ponto.y}>`;
}

// Outros objectos: uma cor e um ponto com cor

let cor1 = {r: 221, g: 101, b: 23};

let ponto3 = {
    x: 20, 
    y: 15, 
    cor: {r: 221, g: 101, b: 23}
};

console.log(toString(ponto3), ponto3.cor);

// Hmmm... como definir um toString para aceitar pontos e cores?
// Como verificar se o objecto em questão é um ponto ou uma cor?
// Pelo tipo? Não, porque o tipo é Object:

console.log(typeof ponto1, typeof ponto2, typeof ponto3, typeof cor1);

// Podemos usar ponto instanceof "construtor ou tipo" ? Não, porque:
// 1. Não existe construtor; objectos literais são do "tipo" Object
// 2. instanceof não funciona bem em JavaScript conforme veremos

console.log(ponto1 instanceof Object, ponto1.constructor.name);

// Solução: múltiplas implementações com nomes diferentes. Sim, não é
// uma solução agradável, mas JavaScript não suporta sobrecarga de 
// funções (overloading)

function toStringCor(cor) {
    return `r: ${cor.r} g: ${cor.g} b: ${cor.b}`;
}

function toStringPonto(ponto) {
    let pontoStr = `<${ponto.x}, ${ponto.y}>`;
    if (ponto.hasOwnProperty('cor')) {
        pontoStr +=  ` (${toStringCor(ponto.cor)})`;
    }
    return pontoStr;
}

ponto3.cor = {r: 200, g: 100, b: 189};
console.log(ponto3)

////////////////////////////////////////////////////////////////////////
//
//      PROPRIEDADE THIS E OPERADOR NEW
//
////////////////////////////////////////////////////////////////////////


let pessoa = {
    nome: "alberto",
    apelido: "alves",
    nomeCompleto() {
        return `${this.nome} ${this.apelido}`
    }
}

////////////////////////////////////////////////////////////////////////
//
//      POO COM PROTÓTIPOS
//      (MODELO PSEUDOCLÁSSICO)
//
////////////////////////////////////////////////////////////////////////

// 1a VERSÃO: CONSTRUTOR COM PROPRIEDADES DE DADOS E COM MÉTODOS
//
// Em JavaScript, funções são objectos e, tal como outros objectos, possuem
// propriedades. Uma dessas propriedades é o protótipo, um objecto que 
// será a base para criar outros objectos. 
//
// Primeiro definimos uma função construtora que, por convenção, tem o 
// o nome dos objectos que queremos criar, em que a primeira letra é 
// uma maíscula. Esta função construtora é o mais parecido que existe 
// em JavaScript com aquilo que se designa por "classe" noutras 
// linguagens, como Java ou C#.

function Ponto2D(x, y) {
    this.x = x;
    this.y = y;
    this.toString = function() {
        return `<${this.x}, ${this.y}>`;
    }
    this.distancia = function(p2) {
        const pow = Math.pow;
        const xDistSq = pow(this.x - p2.x, 2);
        const yDistSq = pow(this.y - p2.y, 2);       
        return Math.sqrt(xDistSq + yDistSq);
    }        
}

ponto1 = new Ponto2D(10, -20);
ponto2 = new Ponto2D(-1, 40);

console.log(ponto1, ponto2);
console.log(ponto1.toString(), ponto2.toString());
console.log(typeof ponto1, ponto1.constructor.name, ponto1 instanceof Ponto2D);

// Cada objecto tem o seu x, y e .... toString
console.log(ponto1.toString === ponto2.toString)

// 2a VERSÃO: UTILIZAÇÃO DO PROTÓTIPO
//
// Todos os objectos nascem com uma ligação a um objecto designado de 
// protótipo (*). Sempre que tentamos aceder a uma propriedade de um 
// objecto, o JavaScript procura-a primeiro no próprio objecto. Se não
// existir, a propriedade é então procurada no protótipo. Caso não 
// exista, é procurada no protótipo do protótipo, e assim sucessivamente 
// até chegarmos a Object. Só se não existir em Object, após ter
// percorrido toda a cadeia de protótipos, é que o JavaScript declara 
// que a propriedade não existe, devolvendo undefined.
// 
// Objectos criados com o mesmo construtor partilham o mesmo protótipo.
// Deste modo, "tudo" o que adicionarmos ao protótipo fica acessível
// a todos os objectos. Então, se associarmos métodos ao protótipo, 
// atendendo à forma como as propriedades são procuradas ao longo da 
// cadeia de protótipos, então estes ficam disponíveis para todos os 
// objectos.
//
// (*): Dado um objecto qualquer, o seu protótipo está associado a uma
// propriedade interna designada de [[Prototype]]. Se necessitarmos de
// aceder ao protótipo, ao invés de aceder directamente a esta 
// propriedade (o que não é possível), utilizamos o método 
// Object.getPrototypeOf(objecto). Conforme veremos, o objecto que se
// obtém através de getPrototypeOf também pode ser obtido através da 
// propriedade prototype da função construtora que construiu o objecto
// em questão. Por exemplo, dado o array arr1, então verifica-se o 
// seguinte: 
//        Object.getPrototypeOf(arr1) === Array.prototype

function Ponto2D(x, y) {
    this.x = x;
    this.y = y;
}

// Em vez de cada objecto carregar consigo os métodos, vamos
// associá-los ao protótipo:

Ponto2D.prototype.toString = function() {
    return `<${this.x}, ${this.y}>`;
};

Ponto2D.prototype.distancia = function(p2) {
    const pow = Math.pow;
    const xDistSq = pow(this.x - p2.x, 2);
    const yDistSq = pow(this.y - p2.y, 2);
    return Math.sqrt(xDistSq + yDistSq);
};

let ponto1 = new Ponto2D(10, -20);
let ponto2 = new Ponto2D(-1, 40);

// Cada objecto tem o seu x, y mas todos partilham toString
console.log(ponto1, ponto2);
console.log(ponto1.toString(), ponto2.toString());
console.log(ponto1.toString === ponto2.toString)

// Ponto2D, ponto1 e ponto2 têm uma referência para um mesmo objecto,
// o protótipo dos objectos criados com Ponto2D

console.log(Ponto2D.prototype === Object.getPrototypeOf(ponto1));
console.log(Ponto2D.prototype === Object.getPrototypeOf(ponto2));

// Vamos acrescentar propriedades a ponto1 apenas
ponto1.cor = {r: 21, g: 19, b: 78};
console.log(ponto1);
console.log(ponto2);

// Vamos acrescentar propriedades a todos os pontos:
Ponto2D.prototype.visivel = true;
console.log(ponto1, ponto1.visivel);
console.log(ponto2, ponto2.visivel);

// Todos os pontos começam com esta propriedade no protótipo e com o
// mesmo valor. Porém, alterações à propriedade são "locais" a cada 
// objecto. Ou seja, quando se altera o valor dessa propriedade para
// um objecto, altera-se apenas para esse objecto.
ponto1.visivel = false;
console.log(ponto1.visivel, ponto2.visivel);

// PROPRIEDADES READ-ONLY E SETTERS (E GETTERS)
// Pontos devem ser imutáveis. Não devemos poder mudar as coordenadas
// 'x' e 'y'. Podemos utilizar 'defineProperty' para obter esse efeito
// de duas maneiras. A primeira torna as propriedades 'x' e 'y' 
// imutáveis em modo strict (e apenas neste modo).

function Ponto2D(x, y) {
    let propertyDefinitions =  {
        writable: false,
        configurable: true,
        enumerable: true
    };
    Object.defineProperty(this, 'x', {value: x, ...propertyDefinitions});
    Object.defineProperty(this, 'y', {value: y, ...propertyDefinitions});
}

const ponto7 = new Ponto2D(5, -4);
console.log(ponto7.x, ponto7.y);
(function() {
    'use strict';
    ponto7.x = 40;
})();

// Uma outra solução passa por definir um setter para lançar um 
// erro quando a propriedade é chamada. Isto obriga-nos a definir
/// um getter para aceder aos valores de 'x' e 'y'

function Ponto2D(x, y) {
    let propertyDefinitions =  {
        set() {
            throw new Error('Imutable property!')
        },
        configurable: true,
        enumerable: true,
    };
    Object.defineProperty(this, 'x', {get()  {return x;},  ...propertyDefinitions});
    Object.defineProperty(this, 'y', {get() {return y;}, ...propertyDefinitions});
}

const ponto77 = new Ponto2D(5, -4);
ponto77.x = 40;   // erro, mesmo em non-strict mode

// De notar que, com o ES6, podemos definir getters e setters em 
// objectos literais. Aqui vai um exemplo

let aluno = {
    nome: 'alberto antunes',
    get apelido() {
        return this.nome.slice(this.nome.lastIndexOf(' ') + 1);
    },
    get dataNascimento() {
        return new Date('1997-10-10');
    },
    set dataNascimento(val) {
        throw new Error('As pessoas não mudam de data de nascimento!')
    }
};

// Consultar:
// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/defineProperty
// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/set

// VARIÁVEIS E MÉTODOS ESTÁTICOS
//
// Como é que temos variáveis/métodos "de classe", ie, estáticos? 
// Podemos guardar no construtor. Essas proprieades são localizadas
// mais facilmente, e fica explícito que não dependem de um objecto
// mas sim do próprio construtor.

Ponto2D.versao = "1.0";
console.log(Ponto2D.versao);
console.log(ponto1.versao);     // errado

Ponto2D.fromString = function(pontoStr) {
    if (!/^<[\-+]?\d+(\.\d+)?,\s*[\-+]?\d+(\.\d+)?>$/.test(pontoStr)) {
        throw new Error(`Invalid string value for point ${pontoStr}`);
    }
    let [xStr, yStr] = pontoStr.split(',');
    xStr = xStr.trim().slice(1);
    yStr = yStr.trim().slice(0, -1);
    return new Ponto2D(parseFloat(xStr), parseFloat(yStr));
}

let ponto3 = Ponto2D.fromString("<5.7, 23>");
console.log(ponto3);
let ponto4 = new Ponto2D(5.7, 23);
// comparação seguinte é falsa porque são objectos diferentes 
// apesar de terem o mesmo conteúdo
console.log(ponto3 === ponto4);  

// mas as seguintes já dão true
console.log(ponto3.toString() === ponto4.toString());
console.log(JSON.stringify(ponto3) === JSON.stringify(ponto4));

// Uma outra definição para Ponto2D.fromString. Quais as vantagens
// desta definição?
Ponto2D.fromString = (function() {
    const pontoStrRegex = /^<[\-+]?\d+(\.\d+)?,\s*[\-+]?\d+(\.\d+)?>$/;
    return function(pontoStr) {
        if (!pontoStrRegex.test(pontoStr)) {
            throw new Error(`Invalid string value for point ${pontoStr}`);
        }
        let [xStr, yStr] = pontoStr.split(',');
        xStr = xStr.trim().slice(1);
        yStr = yStr.trim().slice(0, -1);
        return new Ponto2D(parseFloat(xStr), parseFloat(yStr));
    }
}());

////////////////////////////////////////////////////////////////////////
//
//      HERANÇA COM CLASSES ES6 E PROTÓTIPOS
//      (MODELO PSEUDOCLÁSSICO)
//
////////////////////////////////////////////////////////////////////////

// Depois de passar por esta secção, ler: 
// https://javascript.info/prototype-inheritance
// https://medium.com/@cscalfani/goodbye-object-oriented-programming-a59cda4c0e53
// https://ericleads.wordpress.com/2013/02/11/fluent-javascript-three-different-kinds-of-prototypal-oo/

// Vamos criar um Ponto2DColorido com as seguintes características:
// 1. É também um Ponto2D, logo vai herdar as propriedades de Ponto2D
// 2. Redefine o método .toString(), estendendo-o para indicar a cor
// 3. Tem duas novas propriedades
//      3.1 cor: que é um objecto literal com r, g e b
//      3.2 brilha: método para modificar o brilho do ponto em 
//          percentagem do valor actual da cor
//
// Como satisfazer requisito 1? Noutras linguagens utilizamos herança.
// Existe herança neste modelo pseudoclássico? Sim: se substituirmos 
// o protótipo original de um construtor por outro objecto, então 
// podemos herdar as propriedades desse objecto. Neste caso concreto, se
// definirmos

function Ponto2DColorido(x, y, cor) {
    Ponto2D.call(this, x, y);     // chama Ponto2D, sem operador new, e com 
    this.cor = cor;               // this associado ao objecto criado com
}                                 // new Ponto2DColorido

// Object.create permite criar um objecto e especificar qual o protótipo
// desse mesmo objecto. Queremos um novo protótipo para Ponto2DColorido
// mas com todos os métodos de Ponto2D.prototype

Ponto2DColorido.prototype = Object.create(Ponto2D.prototype);
Ponto2DColorido.prototype.constructor = Ponto2DColorido;

// Também era possível substituir a chamada a Object.create por
//
//      Ponto2DColorido.prototype = new Ponto2D();
//
// Só que isto faria com que o construtor Ponto2 fosse executado
// e as propriedades x e y passariam para o protótipo.

// Vamos redefinir o método .toString. Note-se que queremos aproveitar
// o método existente na "superclasse" Ponto2D. Para invocarmos o 
// "supermétodo" não podemos fazer this.toString() porque isso faria
// com que o método Ponto2DColorido.prototype.toString fosse 
// recursivamente chamado. Para invocarmos o "super" método, e assim 
// reutilizarmos o seu código, temos que chamar aceder ao método 
// herdado através de Ponto2D. 

Ponto2DColorido.prototype.toString = function() {
    // const txt = this.toString();  // erro: entra em "loop" recursivo
    const txt = Ponto2D.prototype.toString.call(this);
    const cor = this.cor;
    return txt + ` (r: ${cor.r} g: ${cor.g} b: ${cor.b})`;
}

Ponto2DColorido.prototype.brilha = function(perc) {
    const [min, max, round] = [Math.min, Math.max, Math.round];
    const cor = this.cor;
    const factor = (1 + perc / 100);
    cor.r = max(0, min(255, round(cor.r * factor)));
    cor.g = max(0, min(255, round(cor.g * factor)));
    cor.b = max(0, min(255, round(cor.b * factor)));
    return cor;
}

ponto3 = new Ponto2DColorido(40, -35, {r: 11, g: 201, b: 156});
ponto4 = new Ponto2DColorido(12, 19, {r: 110, g: 101, b: 39});
console.log(ponto3);
console.log(ponto4);
console.log("ponto1 instanceof Ponto2D? ", ponto1 instanceof Ponto2D);
console.log("ponto3 instanceof Ponto2D? ", ponto3 instanceof Ponto2D);
console.log("ponto1 instanceof Ponto2DColorido? ", ponto1 instanceof Ponto2DColorido);
console.log("ponto3 instanceof Ponto2DColorido? ", ponto3 instanceof Ponto2DColorido);
console.log(ponto3.toString());
console.log(ponto4.toString());
console.log(ponto3.distancia(ponto1));
console.log(Object.getPrototypeOf(ponto3) === Ponto2DColorido.prototype);
console.log(Object.getPrototypeOf(Object.getPrototypeOf(ponto3)) === Ponto2D.prototype);

// Continuamos a não poder capturar uma referência para um método e 
// usá-la sem passar igualmente o objecto de onde foi extraída, porque 
// os métodos dependem de this e, como sabemos, o valor desta 
// propriedade é dinâmico e depende do contexto de execução:

let distancia = ponto2.distancia;
console.log(distancia(ponto2));     // erro
let brilha = ponto3.brilha;
console.log(brilha());              // erro

////////////////////////////////////////////////////////////////////////
//
//      POO COM CLASSES ES6
//      (MODELO PSEUDOCLÁSSICO MAIS PRÓXIMO DE JAVA, C#)
//
////////////////////////////////////////////////////////////////////////

// A solução anterior para POO não é propriamente agradável
// de escrever. Ainda que forneça encapsulamento, no sentido em que 
// atributos e métodos ficam "contidos" num mesmo objecto, o código 
// fica disperso pelo ficheiro, e não está contido dentro de uma unidade 
// lógica (de um espaço de nomes).
// Além de que temos que actualizar as referências para os protótipos 
// manualmente, o que torna o código verboso, pouco abstracto, mais
// difícil de escrever, e tudo isto aumenta a probabilidade de nos 
// enganarmos.
// Finalmente, não existe qualquer mecanismo para limitar o acesso a
// propriedades, ou seja, não existe acesso privado como noutras 
// linguagens com classes.
//
// Com o ES6, veio a palavra-reservada "class" e com ela um suporte 
// sintático para trabalhar com classes neste modelo prototipal.
// Trata-se meramente de "açúcar sintático", já que, na verdade, 
// JavaScript continua a ser uma linguagem sem classes. Por um lado, se 
// pretendemos programar neste modelo pseudoclássico, o "açúcar
// sintático" é bem vindo já que torna o código mais claro. Por outro 
// lado, ao recorrer a uma sintaxe inspirada na linguagem Java, pode 
// dar a ideia errada de JavaScript tem classes, quando não tem.

class Ponto2D {
    visivel = true;
    static versao = "2.0";
    static _pontoStrRegex = /^<[\-+]?\d+(\.\d+)?,\s*[\-+]?\d+(\.\d+)?>$/;

    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
    static fromString(pontoStr) {
        if (!Ponto2D._pontoStrRegex.test(pontoStr)) {
            throw new Error(`Invalid string value for point ${pontoStr}`);
        }
        let [xStr, yStr] = pontoStr.split(',');
        xStr = xStr.trim().slice(1);
        yStr = yStr.trim().slice(0, -1);
        return new Ponto2D(parseFloat(xStr), parseFloat(yStr));
    }
    toString() {
        return `<${this.x}, ${this.y}>`;
    }
    distancia(p2) {
        const pow = Math.pow;
        const xDistSq = pow(this.x - p2.x, 2);
        const yDistSq = pow(this.y - p2.y, 2);       
        return Math.sqrt(xDistSq + yDistSq);
    }
}

let ponto1 = new Ponto2D(10, -20);
let ponto2 = new Ponto2D(-1, 40);

// Cada objecto tem o seu x, y mas todos partilham toString
console.log(ponto1.toString === ponto2.toString)
console.log(ponto1, ponto2);
console.log(ponto1.toString(), ponto2.toString());
console.log(ponto1.constructor.name);
console.log(Object.getPrototypeOf(ponto1) === Ponto2D.prototype);

class Ponto2DColorido extends Ponto2D {
    constructor(x, y, cor) {
        super(x, y);
        this.cor = cor;
    }
    toString() {
        const txt = super.toString();
        const cor = this.cor;
        return txt + ` (r: ${cor.r} g: ${cor.g} b: ${cor.b})`;
    }
    brilha(perc) {
        const [min, max, round] = [Math.min, Math.max, Math.round];
        const cor = this.cor;
        const factor = (1 + perc / 100);
        cor.r = max(0, min(255, round(cor.r * factor)));
        cor.g = max(0, min(255, round(cor.g * factor)));
        cor.b = max(0, min(255, round(cor.b * factor)));
        return cor;
    }
}

ponto3 = new Ponto2DColorido(40, -35, {r: 11, g: 201, b: 156});
ponto4 = new Ponto2DColorido(12, 19, {r: 110, g: 101, b: 39});
console.log(ponto3);
console.log(ponto4);
console.log("ponto1 instanceof Ponto2D? ", ponto1 instanceof Ponto2D);
console.log("ponto3 instanceof Ponto2D? ", ponto3 instanceof Ponto2D);
console.log("ponto1 instanceof Ponto2DColorido? ", ponto1 instanceof Ponto2DColorido);
console.log("ponto3 instanceof Ponto2DColorido? ", ponto3 instanceof Ponto2DColorido);
console.log(ponto3.toString());
console.log(ponto4.toString());
console.log(ponto3.distancia(ponto4));
console.log(Object.getPrototypeOf(ponto3) === Ponto2DColorido.prototype);
console.log(Object.getPrototypeOf(Object.getPrototypeOf(ponto3)) === Ponto2D.prototype);

// Também aqui, uma referência para um método não traz consigo o objecto
// a partir do qual a referência foi retirada. 

let toStr = ponto3.toString;
console.log(toStr());          // erro

////////////////////////////////////////////////////////////////////////
//
//      POO COM FÁBRICAS DE OBJECTOS E SEM CLASSES
//      (CONSTRUTORES FUNCIONAIS / FACTORY FUNCTIONS / POWER CONSTRUCTORS)
//
////////////////////////////////////////////////////////////////////////

// As soluções anteriores sofrem de alguns problemas:
// 1. São complicadas, sendo necessário escrever muito código de 
//    infraestrutura (com protótipos), ou com muita sintaxe (class).
// 2. Não oferecem privacidade. À data de julho de 2020, existem 
//    propostas para adicionar propriedades privadas JavaScript.
// 3. Estimulam a utilização do modelo clássico para POO, modelo que 
//    tem sido alvo de muitas críticas em tempos recentes, 
//    especialmente o mecanismo de herança. Muita vezes, este modelo 
//    leva à criação hieraquias de objectos muito rígidas, difíceis de 
//    compreender, alterar e manter.
// 4. Dependem da utilização de "this", e a utilização desta propriedade
//    é confusa.
// 5. Dependem da utilização de "new", e este operador (não só aqui, 
//    mas em todas linguagens onde existe) levanta alguns problemas
//    em termos de manutenção do código, nomeadamente, no facto de 
//    não podermos tratar um construtor como sendo apenas mais uma 
//    função. Além disso, no modelo pseudoclássico, se nos esquecermos
//    de invocar o construtor sem new, o JavaScript não alerta para 
//    o erro.
// 6. Estimulam a utilização de objectos com muito estado (ie, variáveis)
//    partilhado entre os diversos métodos. Corremos o risco de enfrentar
//    os mesmos problemas que encontramos quando programamos com muitas 
//    variáveis globais.
//
// Vamos ver uma solução mais simples, baseada em closures e objectos
// literais, que consegue obter a maioria dos benefícios da POO.
// Trata-se, na verdade, de um padrão de software muito utilizado 
// em JavaScript, ainda que possam existir outros muito parecidos.
// De facto, existem várias "receitas" para chegar a uma solução 
// similar a esta. Aqui está (*):
//  
//    function constructor(spec) {
//        let {member} = spec;
//        let {other} = otherConstructor(spec);  // inheritance call
//        return {
//            method1: function(...) {
//                // tem acesso a member, other, spec
//            },
//            // ...
//            methodN: function(...) {
//                // tem acesso a member, other, spec
//            }
//        };
//    }
// 
// "spec" representa um objecto de especificação. Aconselha-se a
// utilização de um destes objectos para transportar os argumentos de
// construtores, dado que, estes tendem a ter muitos parâmetros.
// Se quisermos devolver um objecto imutável, ou seja, um objeto 
// incorruptível e seguro, então podemos envolver o objecto devolvido
// em Object.freeze.
//
// Esta "receita" suporta muitas variações. Uma outra possível tira 
// partido do "spread operator" para passar as propriedades do objecto 
// base para o objecto que herda.
//
//    function constructor(spec) {
//        let {member} = spec;
//        let base = otherConstructor(spec);  // inheritance call
//        return {
//            ...base,
//            method1: function(...) {
//                // tem acesso a member, other, spec
//            },
//            // ...
//            methodN: function(...) {
//                // tem acesso a member, other, spec
//            }
//        };
//    }
//
// Uma outra possível, que, num cenário de herança, reaproveita o 
// objecto criado pelo "super" construtor (desde que este não tenha 
// sido congelado) é a seguinte:
//
//    function constructor(spec) {
//        let {member} = spec;
//        let base = otherConstructor(spec);  // inheritance call
//        base.method1 = function(...) {
//            ...
//        };
//        // ...
//        base.method1 = function(...) {
//            ...
//        };
//        return base;
//    }
//
// Para manter a "compatibilidade" com os exemplos anteriores
// desenvolvidos de acordo com o modelo pseudoclássico, aqui não 
// utilizamos um objecto de especificação nos nossos construtores.
//
// (*) Baseado no modelo recomendado por Douglas Crockford

function ponto2D(x, y) {
    return {
        x,
        y,
        visivel: true,
        toString: function() {
            return `<${x}, ${y}>`;
        },
        distancia: function(p2) {
            const pow = Math.pow;
            const xDistSq = pow(x - p2.x, 2);
            const yDistSq = pow(y - p2.y, 2);       
            return Math.sqrt(xDistSq + yDistSq);
        },
        [Symbol.toStringTag]: 'ponto2D'
    };
}

ponto2D.versao = "3.0";

ponto2D.fromString = (function() {
    const pontoStrRegex = /^<[\-+]?\d+(\.\d+)?,\s*[\-+]?\d+(\.\d+)?>$/;
    return function(pontoStr) {
        if (!pontoStrRegex.test(pontoStr)) {
            throw new Error(`Invalid string value for point ${pontoStr}`);
        }
        let [xStr, yStr] = pontoStr.split(',');
        xStr = xStr.trim().slice(1);
        yStr = yStr.trim().slice(0, -1);
        return ponto2D(parseFloat(xStr), parseFloat(yStr));
    }
}());

// NOTA: Estamos a dar acesso directo aos atributos. Isto pode parecer
// uma violação do princípio de encapsulamento/ocultação de
// informação. Porém, em JavaScript existem getters (o equivalente a 
// a properties em Python ou C#) que são métodos que são invocados 
// quando se acede a um atributo de dados. Como a sintaxe para aceder
// ao valor de uma propriedade é igual à sintaxe para invocar um 
// getter, em qualquer altura podemos substituir o acesso directo por
// um getter que intercepta esse acesso directo:
//
// function ponto2D(x, y) {
//     let coords = Float64Array.of(x, y);
//     return {
//         get x() {   
//             return coords[0];  // ou outra qq forma de obter x
//         },
//         get y() {
//             return coords[1];
//         },
//         toString: function() {
//             return `<${coords[0]}, ${coords[1]}>`;
//         },
//         distancia: function(p2) {
//             const pow = Math.pow;
//             const xDistSq = pow(coords[0] - p2.x, 2);
//             const yDistSq = pow(coords[1] - p2.y, 2);       
//             return Math.sqrt(xDistSq + yDistSq);
//         }        
//     };
// }

let ponto1 = ponto2D(10, -20);
let ponto2 = ponto2D(-1, 40);

console.log(ponto1.toString === ponto2.toString)
console.log(ponto1, ponto2);
console.log(ponto1.toString(), ponto2.toString());

function ponto2DColorido(x, y, cor) {
    let base = ponto2D(x, y);
    let baseToString = base.toString;

    base.toString = function() {
        const txt = baseToString();
        return txt + ` (r: ${cor.r} g: ${cor.g} b: ${cor.b})`;        
    };

    base.brilha = function() {
        const [min, max, round] = [Math.min, Math.max, Math.round];
        const factor = (1 + perc / 100);
        cor.r = max(0, min(255, round(cor.r * factor)));
        cor.g = max(0, min(255, round(cor.g * factor)));
        cor.b = max(0, min(255, round(cor.b * factor)));
        return cor;
    };

    base[Symbol.toStringTag] = 'ponto2DColorido';

    return base;
}

ponto3 = ponto2DColorido(40, -35, {r: 11, g: 201, b: 156});
ponto4 = ponto2DColorido(12, 19, {r: 110, g: 101, b: 39});
console.log(ponto3.toString());
console.log(ponto4.toString());
console.log(ponto3.distancia(ponto4));

// Graças a [Symbol.toStringTag] podemos ter uma verificação de tipos:
// Consultar: https://javascript.info/instanceof
console.log({}.toString.call(ponto1));     // [object ponto2D]
console.log({}.toString.call(ponto4));     // [object ponto2DColorido]

let distancia = ponto3.distancia;
console.log(distancia(ponto2));

// Vantagens deste modelo:
//
// 1. Closure garante privacidade
// 2. Mais simples pq não exige sintaxe acrescida nem manipulação de
//    manual de protótipos.
// 3. Não usa "new" nem "this", o que em JavaScript é um bónus:
//    não há o risco de acidentalmente alterar o objecto global, não
//    é preciso fazer "rebinding" de "this", etc.
// 4. Não utiliza herança nem leva a hierarquias de objectos muito
//    profundas e rígidas, à semelhança do que acontece em Java, C++
//    e C#. Nestas linguagens, e em JavaScript, quando utilizamos os
//    outros modelos, em particular o modelo clássico, utiliza-se
//    herança para partilha de código (ie, de comportamento). Ora,
//    a herança de classes, apesar de ser um mecanismo interessante
//    para reutilização de código, tende a aumentar a dependência entre
//    classes. A um ponto que, a dada altura, torna-se muito difícil
//    alterar uma classe de base sem quebrar a compatibilidade com as
//    classes derivadas.
// 5. Em qualquer instante podemos alterar a composição dos objectos
//    sem que isso implique aterações no código cliente, tal como  
//    quando se utiliza "new" (quando fazemos "new Xpto(...)" os 
//    objectos serão sempre do tipo "Xpto", mesmo que, em dada 
//    ocasião, precisemos de devolver um objecto do tipo "Ypto").
// 6. Mais rápido localizar um método numa "hierarquia" de objectos.
//    Os métodos estão logo "ali", no objecto, e não é necessário 
//    percorrer uma cadeia de protótipos para lá chegar.
//
// Desvantagens deste modelo:
//
// 1. Necessita de mais memória por cada instância porque cada ponto2D 
//    tem o seu .toString, o seu .distancia, o seu .brilha, etc. Apesar
//    do código de cada um desses métodos ser partilhado, é necessário
//    um objecto função por método e por objecto ponto2D. Ao passo que,
//    com protótipos/classes, todos os Ponto2D partilham os mesmos 
//    objectos função. No entanto, a memória extra consumida por cada
//    objecto ponto2D, comparativamente com essas soluções, é reduzida, 
//    e isto só tem impacto quando lidamos com muitos milhões de  
//    objectos. Neste caso, se calhar é melhor utilizar outra linguagem
//    de programação.
// 2. Não tipificado: "instanceof" não funciona. Porém não é difícil 
//    acrescentar suporte adhoc para tipos, além de que "instanceof" 
//    e "typeof" respondem à pergunta "quem és tu?" quando, se calhar,
//    apenas precisamos de perguntar "o que é que tu consegues fazer?".
// 3. Não é permitido enriquecer um protótipo com métodos e, com isso, 
//    "injectar" nova funcionalidade em todos os objectos que herdam
//    desse protótipo (herança retroactiva). É, no entanto, possível
//    alterar ou estender dinâmicamente os super-construtores através 
//    de um decorador.