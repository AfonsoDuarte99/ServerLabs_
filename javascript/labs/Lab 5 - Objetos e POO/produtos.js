'use strict';

function isDigit(str) {
    return /^[0-9]+$/.test(str);
}

////////////////////////////////////////////////////////////////////////
//
//      DESCRIÇÃO DO PROBLEMA
//
////////////////////////////////////////////////////////////////////////

// Considere uma loja para venda online de produtos. Um Produto possui
// um identificador alfa-numérico, preço e taxa de IVA, valores que
// deverão ser passados ao construtor. Devem ser aceites os tipos de
// dados string e decimal para parâmetros que representem montantes
// ou taxas. Deve ser  possível obter o montante de IVA e o preço
// final, sendo que este resulta  de acrescentar o montante de IVA ao
// preço. A representação externa legível toString deve exibir o tipo
// de produto, o identificador e o preço. Para  qualquer produto deve
// ser possível obter uma lista mutável com todos os  atributos
// exportáveis em formato String. Deve também existir um método  toCSV
// ("to comma separated values") que "exporta" um produto para uma
// string com os valores dos atributos delimitados por';'. Deve ser
// possível construir um produto a partir desta representação externa
// através do construtor fromCSV. Os elementos devem ser exportados
// pela ordem pela qual são passados para o construtor.
//
// Existem dois tipos de produtos: livro e jogo de computador. 
// Para cada Livro são guardados título, código isbn e lista de autores. 
// À excepção  de traços ('-'), um isbn deve possuir 10 ou 13 dígitos. 
// Não necessita de considerar outras validações. Cada JogoComputador, 
// além dos atributos gerais que todos os produtos  têm, possui título, 
// número de série e género. O número de série é um  inteiro com pelo 
// menos 7 dígitos. Também pode ser uma string com  dígitos e traços. 
// O delimitador para a representação CSV de um JogoComputador é o
// caractere ':'.  A representação externa dos livros e dos jogos
// deve ser idêntica à dos produtos gerais. Esta deve gerar uma linha
// de texto na qual os atributos aparecem pela ordem pela qual devem
// ser passados para o construtor. Todos os produtos devem poder ser
// inseridos em estruturas de dados como Maps ou Sets. Dois produtos
// com o mesmo id devem ser considerados iguais. Também deve ser
// possível representar uma Encomenda. Esta consiste de um
// identificador alfa-numérico, uma associação entre Produtos e
// quantidades, e uma data-hora de criação. Deve ser possível calcular
// o preço final de uma encomenda assim como o montante de iva da
// encomenda.
//
// Resumindo:
// Produto        ☞ id: string, preco: string ou decimal, 
//                  taxaIVA: string ou decimal
// Livro          ☞ Produto com titulo: string, isbn: string, 
//                  autores: string delimitada ou array de nomes
// JogoComputador ☞ Produto com titulo: string, numSerie: string, 
//                  genero: string
// Encomenda      ☞ id: string, prods: associação Produto → quantidade, 
//                  data/hora 

////////////////////////////////////////////////////////////////////////
//
//      SOLUÇÃO COM CLASSES ES6
//      (MODELO PSEUDOCLÁSSICO MAIS PRÓXIMO DE JAVA, C#)
//
////////////////////////////////////////////////////////////////////////

//
// PRODUTO

class Produto {        
    constructor(id, preco, taxaIVA) {        
        this.id = id;
        preco = parseFloat(preco);
        taxaIVA = parseFloat(taxaIVA);
        if (!preco || preco < 0) {
            throw new Error("Preço inválido: " + this.preco);
        }
        if (!taxaIVA || taxaIVA < 0) {
            throw new Error("Taxa de IVA inválida: " + this.taxaIVA);
        }
        this.id = id;
        this.preco = preco;
        this.taxaIVA = taxaIVA;
        this.iva = preco * (taxaIVA / 100);
        this.precoFinal = preco + this.iva; 
        this.csvDelim = Produto.DEFAULT_CSV_DELIM;
    }

    equals(obj) {
        if (this === obj) {
            return true;
        }
        if (!obj || !(obj instanceof Produto)) {
            return false;
        }
        return this.id === obj.id;
    }

    exportAttrs() {
        return [this.id, this.preco, this.taxaIVA]
    }

    toString() {
        const className = this.constructor.name;
        const preco = this.preco.toFixed(2);
        const taxaIVA = this.taxaIVA.toFixed(2);
        return `${className} id: '${this.id}' preco: ${preco} iva: ${taxaIVA}%`;
    }

    toCSV(csvDelim) {
        csvDelim = csvDelim || this.csvDelim;
        return this.exportAttrs().join(this.csvDelim)
    }
}

Produto.DEFAULT_CSV_DELIM = ";";

Produto.fromCSV = function(csvStr) {
    // NOTA: this é suposto ser uma "classe", ie, um objecto função
    // utilizado como construtor
    const csvDelim = this.DEFAULT_CSV_DELIM;
    const attrs = csvStr.split(csvDelim);
    return new this(...attrs);
}

// Não é suposto criarmos produtos com o construtor Produto, mas ficam
// alguns exemplos para testes:
// let prod1 = new Produto('LL12', 20, 13);
// let prod2 = new Produto('LL12', 20, 13);

// console.log(prod1.toString())
// console.log(prod2.toCSV())
// console.log(prod1 === prod2);
// console.log(prod1.equals(prod2));

//
// LIVRO

class Livro extends Produto {
    constructor(
            id, 
            preco, 
            taxaIVA,
            titulo, 
            isbn, 
            autores
    ) {
        super(id, preco, taxaIVA);
        const isbnSemTracos = isbn.replace(/-/g, "");
        if (!isDigit(isbnSemTracos) || 
            ![10, 13].includes(isbnSemTracos.length)) {
            throw new Error("ISBN inválido: " + isbn);
        }
        this.titulo = titulo;
        this.isbn = isbn;
        this.autores = autores instanceof Array ? autores : autores.split('//');
    }

    exportAttrs() {
        return super.exportAttrs().concat([
            this.titulo,
            this.isbn,
            this.autores.join('//')
        ]);
    }
}

//
// JOGO COMPUTADOR

class JogoComputador extends Produto {

    constructor(
            id, 
            preco, 
            taxaIVA,
            titulo, 
            numSerie, 
            genero
    ) {
        super(id, preco, taxaIVA);
        const numSerieSemTracos = numSerie.replace(/-/g, "");
        if (!isDigit(numSerieSemTracos) || numSerieSemTracos.length < 7)  {
            throw Error("Número de série inválido: " + numSerie);
        }
        this.titulo = titulo;
        this.numSerie = numSerie;
        this.genero = genero;
        this.csvDelim = JogoComputador.DEFAULT_CSV_DELIM;
    }

    exportAttrs() {
        return super.exportAttrs().concat([
            this.titulo,
            this.numSerie,
            this.genero
        ]);
    }
}

JogoComputador.DEFAULT_CSV_DELIM = ":";

//
// ENCOMENDA

class DuplicateError extends Error {}

class Encomenda {
    constructor(id, ...prods) {
        this.id = id;
        this.dataHora = new Date();
        this.prods = new Map();
        for (const [produto, quantidade] of prods) {
            this.adicionaProduto(produto, quantidade);
        }
    }

    adicionaProduto(produto, quantidade) {
        if (this.prods.has(produto.id)) {
            throw new DuplicateError(`Produto com id ${produto.id} repetido.`);
        }
        this.prods.set(produto.id, {produto, quantidade});
    }

    get total() {
        let sum = 0;
        for (const {produto, quantidade} of this.prods.values()) {
            sum += (produto.precoFinal * quantidade);
        }
        return sum;
    }

    get iva() {
        let sum = 0;
        for (const {produto, quantidade} of this.prods.values()) {
            sum += (produto.iva * quantidade);
        }
        return sum;
    }

    toString() {
        return `Encomenda: ${this.id} ${this.dataHora} ${this.prods}`;
    }
}

////////////////////////////////////////////////////////////////////////
//
//      TESTES
//
////////////////////////////////////////////////////////////////////////

function test() {
    let liv1 = new Livro(
        "LL12", 
        "20", 
        "13",
        "Automate the Boring Stuff with Python",
        "978-1593275990",
        ["Al Sweigart"]
    );
    let liv2 = Livro.fromCSV(
        "LL98;30;13;Python Cookbook;978-1-449-34037-7;David Beazley//Brian K. Jones"
    );
    let liv3 = Livro.fromCSV(liv2.toCSV());
    let liv4 = new Livro(
        "JV11",
        "10",
        "13",
        "Effective Java: 3rd Edition",
        "978-0134685991",
        ["Joshua Block"]
    );

    let jog1 = new JogoComputador(
        "JC11", 
        "100", 
        "13",
        "Assassins Creed IV",
        "8561245220",
        "FPS"
    );
    let jog2 = JogoComputador.fromCSV(
        "JC20:98:13:Counter-Strike:8111135910:FPS"
    );

    let jog3 = new JogoComputador(
        "JC12",
        "49.99",
        "23",
        "Pro Evolution Soccer 2019",
        "8074314874",
        "Soccer"
    );

    let prods = [liv1, liv2, liv4, jog1, jog2, jog3];

    console.log("\n**********\n");
    console.log("Eis os objectos:");
    for (let p of prods) {
        console.log(p.toString());
    }
    console.log("\nAgora em CSV  :");
    for (let p of prods) {
        console.log(p.toCSV());
    }

    let enc1 = new Encomenda("12PQ78", 
        [liv1, 2],
        [liv2, 1],
        [jog1, 1],
        [jog2, 4]
    );
    return enc1;
}