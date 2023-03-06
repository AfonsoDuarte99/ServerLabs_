function Cliente(nif, nome, emailAddr) {
    this.nif = nif;
    this.nome = nome;
    this.emailAddr = emailAddr;
    this.inbox = [];
}

Cliente.validaNif = function(numStr) {
    if (numStr.length !== 9 || !(/^[0-9]+$/.test(numStr))) {
        return false;
    }
    let result = 0;
    for (let i of _.range(8)) {
        result += parseInt(numStr[i], 10) * (9 - i);
    }
    result %= 11;
    const controlDigit = parseInt(numStr[8], 10);
    return result == 0 || result == 1 
         ? controlDigit == 0 
         : controlDigit == 11 - result;
}

Cliente.prototype.toString = function() {
    return `${this.nif}/${this.nome}/${this.emailAddr}`;
};

Cliente.prototype.enviaMsg = function(msg) {
    this.inbox.push({dataHora: new Date(), mensagem: msg});
};

Cliente.prototype.activo = true;

let cli1 = new Cliente('215698525', 'Alberto', 'alb@mail.com');
let cli2 = new Cliente('253595894', 'Armando', 'arm@mail.com');

cli1.activo = false;

function ClienteEspecial(dataAniversario, ...args) {
    Cliente.call(this, ...args);    
    this.dataAniversario = dataAniversario;               
}


ClienteEspecial.prototype = Object.create(Cliente.prototype);
ClienteEspecial.prototype.constructor = ClienteEspecial;

ClienteEspecial.prototype.toString = function() {
    // data de aniversario devem aparecer em primeiro lugar
    // atributos devem ser separados ; e cada string terminada com |
    let baseToStr = Cliente.prototype.toString.call(this);
    let dt = this.dataAniversario;
    let dataAnivStr = `${dt.getFullYear()}/${dt.getMonth() + 1}/${dt.getDate()}`;
    return `${baseToStr.replace(/\//g, ';')};${dataAnivStr}|`;
}

let cli3 = new ClienteEspecial(new Date(1991, 1, 1), '289252059', 'Arnaldo', 'arn@mail.com');
let cli4 = new ClienteEspecial(new Date(1992, 1, 1), '257590897', 'Augusto', 'aug@mail.com');

let clientes  = [cli1, cli2, cli3, cli4];

for (let cli of clientes) {
    console.log(cli.toString());
}