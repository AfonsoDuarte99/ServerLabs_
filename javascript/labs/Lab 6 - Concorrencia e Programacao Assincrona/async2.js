'use strict';

////////////////////////////////////////////////////////////////////////////////
//
//      PROGRAMAÇÃO ASSÍNCRONA COM PROMISES
//
////////////////////////////////////////////////////////////////////////////////

// DEFINIÇÃO DE PROMISSES E ESTADOS

// Como alguém dizia, "programar com callbacks é grosseiro e rude!". 
// E, de facto, é! O fluxo de execução é mais complexo e difícil de 
// analisar. Sequências de tarefas, por exemplo, têm que ser encadeadas
// umas nas outras através de callbacks que chamam callbacks, que 
// chamam callbacks, etc.. Daí a utilização de expressões como 
// "Callback Hell" ou "The Pyramid of Doom" para caracterizar 
// programação com callbacks.
//                           
//      tarefaA(function(err, resultado) {
//          if (err) {
//                // tratamento do erro e return
//          }
//          tarefaB(result, function(err, novoResultado) {
//              if (err) {
//                  // tratamento do erro e return
//              }
//              tarefaC(novoResultado, function(err, resultadoFinal) {
//                  if (err) {
//                      // tratamento do erro e return
//                  }
//                  // faz qq coisa com resultadoFinal e termina
//              });
//          });
//      });
//
// Uma PROMISE é um objecto que representa a tentativa de obter um 
// resultado a devolver no futuro (por vezes também são designadas de 
// FUTUREs). Também utilizam callbacks, mas de forma estruturada e com 
// mecanismos que permitem exprimir de forma mais clara o controlo do
// fluxo de execução.
//
// A definição de PROMISE na MDN é a seguinte:
//
// "The Promise object represents the eventual completion (or failure)
//  of an asynchronous operation, and its resulting value."
//
// PROMISEs fazem parte da especificação da biblioteca de objectos 
// do JavaScript. Criamos uma PROMISE da seguinte forma:
//
//      let promise = new Promise(function executor(resolve, reject) {
//          // executor code
//      });
//
// O EXECUTOR é uma função que é executada imediatamente e de forma 
// síncrona. Recebe duas funções, RESOLVE e REJECTED, que são definidas
// pela biblioteca de PROMISEs, e que devem ser chamadas pelo EXECUTOR
// quando a tarefa terminar com um valor - RESOLVE - ou com um erro -
// REJECT. Por norma, o papel do EXECUTOR consiste em iniciar uma 
// tarefa assíncrona que comunica os resultados, via RESOLVE ou REJECT, 
// assim que a tarefa terminar.
//
// Vamos ilustrar o funcionamento de PROMISES com um exemplo. 
// Comecemos, porém, por definir as seguintes funções auxiliares:

function log(...args) {
    let timeDiff = new Date().getTime() - now;
    let msg = `Instante: ${timeDiff.toString().padStart(4)}ms | `;
    console.log(msg, ...args);
}

function tarefaRapida_Sync(codigoTarefa) {
    log(`Tarefa ${codigoTarefa} concluída`);
}

function tarefaLenta_obtemValor_Async1(callback) {
    // Devolve um valor entre 1 e 10, demorando (pelo menos) entre
    // 100 e 1000ms a produzir esse valor.
    const value = Math.floor(Math.random()*10 + 1);
    const timeout = Math.floor(Math.random()*900 + 100);
    setTimeout(() => callback(value), timeout); 
    log(`Tarefa lenta em execução`);
}

// Ainda antes de utilizarmos uma PROMISE, vamos exemplificar o 
// funcionamento destas funções. Uma vez que a obtenção do valor é
// assíncrona, passamos uma callback que será chamada quando o valor
// estiver disponível.

now = Date.now();
tarefaRapida_Sync('A');
tarefaLenta_obtemValor_Async1((v) => log('Tarefa lenta concluída, valor', v));
tarefaRapida_Sync('B');

// "Ensanduichar" a obtenção do valor entre as tarefas síncronas A e B 
// permite confirmar que de facto a produção desse valor é feita de 
// forma assíncrona com o fluxo normal de execução do código.

// Agora vamos desenvolver uma primeira implementação do exemplo 
// anterior com uma PROMISE. Este exemplo (e o seguinte) pretendem
// ilustrar como funciona uma PROMISE, e vão parecer um pouco mais 
// complicadados do que os exemplos anteriores com callbacks.
// Os exemplos posteriores vão tornar mais claras as vantagens de 
// PROMISEs face a callbacks.
// Uma promise é criada com 'new Promise(EXECUTOR)', onde 'EXECUTOR'
// é uma função que implementa a operação assíncrona. Um EXECUTOR
// recebe duas funções - RESOLVE e REJECT - que utiliza para comunicar
// os resultados obtidos. São uma espécie de RETURNs funcionais: no 
// caso da promise terminar com sucesso, utilizamos RESOLVE para 
// indicar sucesso e "devolver" o valor produzido pela promise; se a
// promise falhar, então rejeitamos a promise com REJECT, passando aqui
// um valor que representa a situação de erro.

now = Date.now();
promise = new Promise(function(resolve, reject) {
    log("Executor")
    tarefaLenta_obtemValor_Async1(function(v) {
        log('Tarefa lenta concluída, valor', v);
        resolve(v);
    });
});
log(promise);
setTimeout(() => log(promise), 1250);

// Os logs demonstram que a PROMISE começa por estar no estado PENDING 
// e, passado algum tempo, termina no estado RESOLVED com uma indicação 
// do valor produzido por 'obtemValor_Async'.
//
// Internamente, uma PROMISE pode estar num dos seguintes estados:
//
//   PENDING ─── resolve(value) ──＞ FULFILLED ou RESOLVED
//      │
//   reject(error)
//      │
//      v
//   REJECTED
//
// Por vezes, designa-se o conjunto de estados FULFILLED+REJECTED por 
// SETTLED (ESTABELECIDA), por oposição ao estado PENDING (PENDENTE).

////////////////////////////////////////////////////////////////////////////////
//
//      ENCADEAMENTO DE PROMISES COM .THEN
//
////////////////////////////////////////////////////////////////////////////////

// Podemos registar uma função para consumir os dados "prometidos"
// através do método '.THEN'.

now = Date.now();
tarefaRapida_Sync('A');
new Promise(function(resolve, reject) {
    tarefaLenta_obtemValor_Async1(resolve);
}).then(
    (v) => log('Tarefa lenta concluída, valor', v),
    (err) => log('Ocorreu um erro', err) 
);
tarefaRapida_Sync('B');

// Mais vale redefinir 'tarefaLenta_obtemValor_Async' de modo a devolver
// uma PROMISE:

function tarefaLenta_obtemValor_Async2() {
    return new Promise(function(resolve, reject) {
        const value = Math.floor(Math.random()*10 + 1);
        const timeout = Math.floor(Math.random()*900 + 100);
        setTimeout(() => resolve(value), timeout); 
        log(`Tarefa lenta em execução`);
    });
}

now = Date.now();
tarefaRapida_Sync('A');
tarefaLenta_obtemValor_Async2().then(
    (v) => log('Tarefa lenta concluída, valor', v),
    (err) => log('Ocorreu um erro', err) 
);
tarefaRapida_Sync('B');

// O método '.THEN' permite especificar uma ou duas funções que apenas
// serão executadas após a PROMISE ter transitado para um dos estados
// FULFILLED ou REJECTED. A primeira função é invocada caso o estado
// seja FULFILLED - o que acontece quando a promise termina via função
// 'RESOLVE' -, ao passo que a segunda apenas é executada caso o estado
// seja REJECTED - ie, caso tenha terminado via a função 'REJECT'.
// O método '.THEN' devolve sempre uma nova promise: por exemplo, se o
// handler devolver um valor simples, o '.THEN' gera uma promise
// resolvida com esse valor. Voltaremos a este aspecto no resumo final
// desta secção e depois do próximo exemplo.

// Ou seja, no exemplo anterior, o argumento do parâmetro 'v' da 
// primeira callback é o valor passado por 'resolve(value)' do executor.

// Vamos agora admitir que queremos obter três valores em série, isto é,
// o segundo valor só deve ser obtido após o primeiro, e o terceiro após
// o segundo. Com callbacks, ignorando, para já, tratamento de erros, 
// seria assim:

now = Date.now();
tarefaLenta_obtemValor_Async1(function(v) {
    log('Tarefa lenta 1 concluída, valor', v);
    tarefaLenta_obtemValor_Async1(function(v) {
        log('Tarefa lenta 2 concluída, valor', v);
        tarefaLenta_obtemValor_Async1(function(v) {
            log('Tarefa lenta 3 concluída, valor', v);
        });
    });
});
log("Sequência de tarefas invocadas")

// O mesmo exemplo com PROMISEs:

now = Date.now();
tarefaLenta_obtemValor_Async2()
    .then(function(v) {
        log('Tarefa lenta 1 concluída, valor', v);
        return tarefaLenta_obtemValor_Async2();
    }).then(function(v) {
        log('Tarefa lenta 2 concluída, valor', v);
        return tarefaLenta_obtemValor_Async2();
    }).then(function(v) {
        log('Tarefa lenta 3 concluída, valor', v);
    });
log("Sequência de PROMISEs invocadas")

// O fluxo de execução é mais legível neste caso. A sequenciação é 
// explicíta. De notar que, caso o resultado do valor da função passada 
// para '.THEN' seja também uma PROMISE, o próximo '.THEN' na cadeia
// só é executado quando a esta última PROMISE estiver no estado SETTLED.

// Vamos então resumir o papel do método '.THEN', o que espera e o 
// que devolve.

// 1. O método '.THEN' permite executar duas operações assíncronas em
//    sequência, onde a segunda operação começa após a primeira ter
//    terminado, recebendo esta como argumento o valor 'resolvido' pela
//    primeira.
//
// 2. Recebe duas funções (duas callbacks) que designamos por 'handlers'
//    ("tratadores").
//    O 1o handler trata do valor "resolvido", isto é, do valor
//    produzido pela promise em caso de sucesso. Este valor é passado
//    pelo executor via função 'RESOLVE'.
//    O 2o handler trata de um eventual erro que tenha ocorrido durante
//    a execução da promise, erro que terá sido assinalado pelo executor
//    via função 'REJECT'.
//
// 3. Devolve sempre uma NOVA promise. Podemos considerar dois casos
//    principais: 
//
//    A) Se o handler terminar com um valor devolvido com a instrução
//    RETURN, o '.THEN' devolve uma promise resolvida com este valor.
//    O valor resolvido só fica disponível para '.THENs' susequentes 
//    na próxima iteração do event loop.
//
//    B) Se o handler terminar devolvendo uma promise (também com 
//    RETURN) no estado PENDING, '.THEN' devolve uma promise cuja 
//    resolução/rejeição depende da resolução/rejeição da promise 
//    devolvida pelo handler. Além disso, o valor de 'resolução' da
//    promise devolvida pelo '.THEN' é o valor de 'resolução' da
//    promise devolvida pelo handler.
//
//    Existem outros casos a considerar, mas são casos que derivam 
//    ou encaixam nos dois anteriores. Consultar: 
//    https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise/then

////////////////////////////////////////////////////////////////////////////////
//
//      TRATAMENTO DE ERROS
//
////////////////////////////////////////////////////////////////////////////////

// Vamos agora incorporar os mecanismos para assinalar e tratar 
// situações de erro. Vamos supor que a nossa tarefa para obter um 
// valor produz um "erro de tempos a tempos" (mais concretamente, 1 em
// cada 4 tentativas). 
// Começamos por modificar a tarefa lenta para obter um valor de modo 
// a que gere um erro com probabilidade de 25%. A função passa também
// a receber duas callbacks, uma que é invocada quando não há erro e
// outra para tratar do eventual erro gerado.

function tarefaLenta_obtemValor_Async1(callback, callbackErr) {
    const value = Math.floor(Math.random()*10 + 1);
    const timeout = Math.floor(Math.random()*900 + 100);
    setTimeout(function() {
        const genError = Math.random() >= 0.75;
        if (genError && !callbackErr)  {
            return;
        }
        return genError ? callbackErr(new Error("Ocorreu um erro!")) : callback(value);
    }); 
    log(`Tarefa lenta em execução`);
}


now = Date.now();
tarefaLenta_obtemValor_Async1(
    (v)   => log('Tarefa lenta concluída, valor', v),
    (err) => log("Tarefa lenta concluída com ERRO:", err)
);

// Agora a sequência de invocações:

now = Date.now();
tarefaLenta_obtemValor_Async1(
    function(v) {
        log('Tarefa lenta 1 concluída, valor', v);
        tarefaLenta_obtemValor_Async1(
            function(v) {
                log('Tarefa lenta 2 concluída, valor', v);
                tarefaLenta_obtemValor_Async1(
                    (v) => log('Tarefa lenta 3 concluída, valor', v),
                    (err) => log("Tarefa lenta 3, erro na obtenção do terceiro valor:", err)
                );
            },
            (err) => log("Tarefa lenta 2, erro na obtenção do segundo valor:", err)
        );
    },
    (err) => log("Tarefa lenta 1, erro na obtenção do primeiro valor:", err)
);
log("Sequência de tarefas invocadas")

// Vejamos agora a mesma sequência de operações com PROMISEs. Primeiro 
// redefinimos a tarefa lenta para gerar um erro com prob. de 25%:

function tarefaLenta_obtemValor_Async2() {
    return new Promise(function(resolve, reject) {
        const value = Math.floor(Math.random()*10 + 1);
        const timeout = Math.floor(Math.random()*900 + 100);
        setTimeout(function() {
            const genError = Math.random() >= 0.75;
            return genError ? reject(new Error("Ocorreu um erro!")) : resolve(value);
        }, timeout); 
        log(`Tarefa lenta em execução`);
    });
}

// E agora como invocar para obter apenas um valor:

now = Date.now();
tarefaLenta_obtemValor_Async2().then(
    (v)   => log('Tarefa lenta concluída, valor', v),
    (err) => log("Tarefa lenta concluída com ERRO:", err)
);

// A sequência de operações fica bem mais simples porque podemos
// terminar um encadeamento de 'THENs' com um '.CATCH'. Ou seja, ao
// invés de definirmos uma função para cada erro, podemos definir um
// "handler" para todos os erros, tal como faríamos com um TRY-CATCH em
// código síncrono.

now = Date.now();
tarefaLenta_obtemValor_Async2()
    .then(function(v) {
        log('Tarefa 1 lenta concluída, valor', v);
        return tarefaLenta_obtemValor_Async2();
    })
    .then(function(v) {
        log('Tarefa 2 lenta concluída, valor', v);
        return tarefaLenta_obtemValor_Async2();
    })
    .then(function(v) {
        log('Tarefa 3 lenta concluída, valor', v);
        return tarefaLenta_obtemValor_Async2();
    })
    .catch(err => log("Tarefa lenta, erro na obtenção do valor:", err));
log("Sequência de tarefas invocadas")

////////////////////////////////////////////////////////////////////////////////
//
//      OPERAÇÕES EM SÉRIE E EM PARALELO COM PROMISES
//
////////////////////////////////////////////////////////////////////////////////

// EXEMPLO: TAREFA ASSÍNCRONA LENTA DE I/O: MÚLTIPLOS ACESSOS SEQUENCIAIS 
//           C/ PROMISES

// Vamos voltar ao 2o exemplo do laboratório de programação assíncrona
// com callbacks. Porém, desta vez começamos por implementar a versão
// sequencial (ie, onde os pedidos são colocados em série).
// Para tal, começamos por definir uma função auxiliar que, dada uma
// sequência funções assíncronas (*), implementadas com promises, gera um
// encadeamento dessas funções. Este encadeamento é uma função que 
// recebe o valor para 'arrancar' a execução do encadeamento, isto é, 
// o valor que é passado para a primeira promise do encadeamento.
// A primeira promise do encadeamento é sempre uma promise resolvida
// com este valor. 'HANDLERS' é uma sequência de handlers. Como vimos,
// tipicamente, um handler devolve, ou uma nova promise, ou um valor,
// sendo que este é transformado numa promise pelo '.THEN' que processa 
// o handler.

// (*) - Cada uma das funções de HANDLERS é um handler do valor
//       resolvido pelo handler anterior. Ou seja, cada HANDLER deve
//       ser o tipo de função que passaríamos para qualquer '.THEN' 
//       individual.

function makeAsyncChain(...handlers) { 
    return x => handlers.reduce((acc, handler) => acc.then(handler), Promise.resolve(x));
}

// A função seguinte executa um encadeamento produzido pela função 
// anterior.

function runAsyncChain({startValue, handlers}) { 
    return makeAsyncChain(...handlers)(startValue);
}

// Agora precisamos de redefinir a 'tarefaLenta_IO_Async' de modo a 
// tirar partido da função anterior. Para tal, temos que converter os
// pedidos XHR em PROMISEs. Para tal, redefinimos 'makeUrlRequest' para
// devolver uma PROMISE com o pedido XHR. 'resolve' é chamado após o 
// evento 'load' ter disparado, ao passo que 'reject' é chamado com 
// o evento 'error' ou com um resultado inválido obtido com o 'load'.
// O valor "resolvido" por cada promise é o total de bytes acumulado 
// mais os bytes obtidos pelo XHR actual.

// Depois, por cada site, geramos um handler adequado para 
// 'runAsyncChain'. Cada handler recebe o valor anteriormente resolvido
// (o valor resolvido pela PROMISE devolvida por 'makeUrlRequest', 
// ou seja, a dimensão em K chars de um site) e passa este valor para
// uma nova PROMISE a resolver no futuro.

function tarefaLenta_IO_Async(codigoTarefa, sites) {
    let promise = runAsyncChain({
        startValue: 0, 
        handlers: sites.map(site => (total) => makeUrlRequest(site, total))
    });
    log(`Tarefa lenta ${codigoTarefa} em execução`);
    return promise;

    /////////////////////////////////////////////

    function makeUrlRequest(url, total = 0) {
        return new Promise(function(resolve, reject) {
            let request = new XMLHttpRequest();
            request.onload = function() {
                try {
                    resolve(total + processUrlRequest(request, url));
                }
                catch (err) {
                    reject(err);
                }
            };
            request.onerror = () => reject(new Error('Network error.'));
            request.open('GET', url, true);
            request.send(null);
        });
    }
    function processUrlRequest(request, url) {
        if (request.status !== 200) {
            throw new Error('Unable to fetch resource: ' + url);
        }
        const shortUrl = `${url.slice(0, 15)}...${url.slice(-5)}`;
        const size = request.responseText.length/1000;
        log(`${shortUrl}: ${size.toFixed(2)}K chars`);
        return size;
    }
}

// O código seguinte demonstra como executar 'tarefaLenta_IO_Async':

const sites = [
    'https://jsonplaceholder.typicode.com/posts',
    'https://jsonplaceholder.typicode.com/comments',
    'https://jsonplaceholder.typicode.com/todos',
];

now = Date.now();
tarefaLenta_IO_Async('1', sites)
    .then(total => log('Total =>', total))
    .catch(err => log('ERRO:', err))
;

// Consulte PROMISE.ALL para ver como executar um conjunto de promises
// em paralelo e aguardar pelo fim de todas elas.

// Consultar: 
// . https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Using_promises
// . https://javascript.info/promise-basics

