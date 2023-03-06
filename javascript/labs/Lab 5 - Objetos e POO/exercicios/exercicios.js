class Pessoa {
    constructor(nome) {
        this.nome = nome        
    }
    apresenteSe() {
        return "Eu sou o/a " + this.obtemTitulo() + " " + this.nome + ".";
    }
    obtemTitulo() {
        return "";
    }
}
class PessoaFormal extends Pessoa {
    constructor(nome, titulo) {
        // - 1 - 
        super(nome)
        this.titulo = titulo;
    }
    apresenteSe() {
        return super.apresenteSe() + ". Ao seu dispor.";
    }
    // - 2 -
    obtemTitulo() {
        return this.titulo;
    }
}
function teste() {
    let p = new Pessoa("Alberto");
    console.log(p.apresenteSe());

    p = new PessoaFormal("Armando", "Doutor");
    console.log(p.apresenteSe());
}

/////////////////////////////////////////////////////

class Colaborador {
    constructor(salBase) {
        this.salBase = salBase;
    }
    vencimento() {
        return this.salBase + this.obtemBonus();
    }
    obtemBonus() {
        return 50;
    }
}
class ColaboradorSenior extends Colaborador {
    // constructor(salBase) {
    //     super(salBase);
    // }
    obtemBonus() {
        return super.obtemBonus() + 200;
        // return 200;
    }
}
function teste1() {
    let c = new Colaborador(1000);
    console.log(c.vencimento());
            
    c = new ColaboradorSenior(1000);
    console.log(c.vencimento());
}