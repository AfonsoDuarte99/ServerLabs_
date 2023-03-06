/* // @ts-check */

'use strict';

////////////////////////////////////////////////////////////////////////////////
//
//      PROGRAMAÇÃO ASSÍNCRONA COM ASYNC/AWAIT
//
////////////////////////////////////////////////////////////////////////////////

// "ASYNC" e "AWAIT" são um acrescento sintático adicionado pelo ES2017
// para facilitar a utilização de promises.

// A palavra-chave ASYNC garante que uma função devolve sempre uma
// PROMISE. Se a função devolver um valor "simples", o JavaScript
// integra esse valor numa PROMISE resolvida. O operador AWAIT, que
// apenas pode ser utilizado numa função definida com ASYNC, aguarda
// que uma promise (que é o operando de AWAIT) esteja num dos
// estados SETTLED (FULFILLED ou REJECTED), antes de retomar a execução 
// da função. A execução desta função ASYNC é retomada após a expressão
// AWAIT, caso a PROMISE termine no estado FULFILLED, ou no primeiro 
// CATCH que envolva a expressão (caso um tenha sido definido), se a
// PROMISE terminar no estado REJECTED.

// Por outras palavras, uma função definida com ASYNC é uma função que
// "opera" assincronamente através do event loop, utilizando uma PROMISE
// implícita para devolver os resultados. A sintaxe e a estrutura do
// código, no entanto, aproximam-se mais de código síncrono do que de
// código que manipula explicitamente PROMISEs.

// Consulte os exemplos em: https://javascript.info/async-await.

let now = Date.now();

function log(...args) {
    let timeDiff = Date.now() - now;
    let msg = `Instante: ${timeDiff.toString().padStart(4)}ms | `;
    console.log(msg, ...args);
}

function obtemValor() {
    return new Promise(function(resolve, reject) {
        const value = Math.floor(Math.random()*10 + 1);
        const timeout = Math.floor(Math.random()*900 + 100);
        setTimeout(function() {
            const genError = Math.random() >= 0.90;   // prob erro -> 10%
            return genError ? reject(new Error("Ocorreu um erro!")) : resolve(value);
        }, timeout); 
    });
}

// A função seguinte soma três valores aleatórios de forma assíncrona.
// O resultado da soma é devolvido numa PROMISE. A obtenção dos valores 
// pode levar a uma situação de erro. 

function somaAleatoriaAssincrona() {
    let soma = 0;
    return obtemValor()
        .then(function(val) {
            log("1o valor", val);
            soma += val;
            return obtemValor();
        })
        .then(function(val) {
            log("2o valor", val);
            soma += val;
            return obtemValor();
        })
        .then(function(val) {
            log("3o valor", val);
            soma += val;
            return soma;
        })
        .catch(err => console.log("ERRO", err));
}

// E segue-se o código para testar:

now = Date.now()
somaAleatoriaAssincrona().then(soma => console.log('SOMA:', soma));

// O código é certamente mais legível do que código equivalente 
// implementado com callbacks. Porém, a versão com ASYNC/AWAIT é 
// bem mais legível:

async function somaAleatoriaAssincrona() {
    try {
        let soma = 0;
        let val = await obtemValor();
        log("1o valor", val);
        soma += val;
        
        val = await obtemValor();
        log("2o valor", val);
        soma += val

        val = await obtemValor();
        log("3o valor", val);
        soma += val

        return soma;
    }
    catch (err) {
        console.log("ERRO", err);
    }
}

// Uma vez que uma fumção ASYNC devolve uma PROMISE com o resultado, 
// o código para testar é igual ao anterior:

now = Date.now()
somaAleatoriaAssincrona().then(soma => console.log('SOMA:', soma));

// Não podemos utilizar AWAITs em código "top level" (código "chegado"
// à esquerda, fora de qualquer função ou classe). Mas podemos utilizar
// uma IIFE assíncrona para executar código "awaitable":

(async function() {
    now = Date.now();
    log('SOMA:', await somaAleatoriaAssincrona());
})();

// Sem os LOGs a função ASYNC fica ainda mais simples (ao passo que a 
// versão com PROMISEs fica praticamente na mesma).

async function somaAleatoriaAssincrona() {
    try {
        let soma = 0;
        soma = await obtemValor();
        soma += await obtemValor();
        soma += await obtemValor();
        return soma;
    }
    catch (err) {
        console.log("ERRO", err);
    }
}

////////////////////////////////////////////////////////////////////////////////
//
//      OPERAÇÕES DE I/O EM SÉRIE E EM PARALELO COM ASYNC/AWAIT
//
////////////////////////////////////////////////////////////////////////////////

// EXEMPLO 1: DESCARREGAR TRÊS SITES EM SEQUÊNCIA

// Vamos voltar à questão de obter o tamanho em bytes de um conjunto de
// sites. Mas agora, vamos utilizar a função FETCH (e a restante FETCH
// API), que veio substituir o XHR. O FETCH é uma função assíncrona que
// devolve uma PROMISE com o resultado de um pedido HTTP.

// Primeiro, vamos abordar como utilizar o FETCH para descarregar
// três sites apenas e em sequência. Vamos desenvolver duas versões,
// uma com manipulação explícita de PROMISEs, e outra com ASYNC/AWAIT.

// Propositadamente, para não "obscurecer" os mecanimos que queremos
// aqui explorar, não utilizamos ciclos nem funções como map ou reduce
// para simplificar o código. Ou seja, as versões dos próximos exemplos
// vão possuir muito código repetitivo. O exemplo final trata do
// problema mais geral de executar N operações de I/O em série ou em
// paralelo.

// Vamos então à primeira versão, que utiliza FETCH e PROMISEs.

function checkSitesSizesSequential() {
    let total = 0;

    return fetch('https://jsonplaceholder.typicode.com/posts')
        .then(response => processFetchResponse(response))
        .then(function(size) { 
            total += size;
            return fetch('https://jsonplaceholder.typicode.com/comments');
        })
        .then(response => processFetchResponse(response))
        .then(function(size) {
            total += size;
            return fetch('https://jsonplaceholder.typicode.com/todos');
        })
        .then(response => processFetchResponse(response))
        .then(size => total += size)
        .catch(err => log('ERROR:', err))
    ;

    ///////////////////////////////

    function processFetchResponse(response) {
        if (response.status !== 200) {
            throw new Error('Unable to fetch resource: ' + url);
        }
        const url = response.url;
        return response.text()
            .then(function(text) {
                const size = text.length/1000;
                log(`${url}: ${size.toFixed(2)}K chars`);
                return size;
            })
        ;
    }
}

// E agora testamos com:

now = Date.now();
checkSitesSizesSequential().then(total => log(`TOTAL: ${total.toFixed(2)}K chars`))

// Vamos à versão com ASYNC/AWAIT:

async function checkSitesSizesSequential() {
    try {
        let total = 0;

        let response = await fetch('https://jsonplaceholder.typicode.com/posts');
        let size = await processFetchResponse(response);
        total += size;

        response = await fetch('https://jsonplaceholder.typicode.com/comments');
        size = await processFetchResponse(response);
        total += size;

        response = await fetch('https://jsonplaceholder.typicode.com/todos');
        size = await processFetchResponse(response);
        return total += size;
    } 
    catch(err) {
        log('ERROR:', err);
    }

    ///////////////////////////////

    async function processFetchResponse(response) {
        if (response.status !== 200) {
            throw new Error('Unable to fetch resource: ' + url);
        }
        const url = response.url;
        const text = await response.text();
        const size = text.length/1000;
        log(`${url}: ${size.toFixed(2)}K chars`);
        return size;
    }
}

// NOTA: Não era necessário tornar processFetchResponse numa função 
// ASYNC. A versão anterior continua a poder ser utilizada com AWAIT.

// Para testar esta versão, ou utilizamos o mesmo código que utilizámos
// em cima para testar a versão anterior, ou definimos uma IIFE
// assíncrona:

(async function() {
    now = Date.now();
    const total = await checkSitesSizesSequential();
    log(`TOTAL: ${total.toFixed(2)}K chars`);
})();

// EXEMPLO 2: DESCARREGAR TRÊS SITES EM PARALELO

// Arrancamos, mais uma vez, com o exemplo com manipulação directa de
// PROMISEs, sem ASYNC/AWAIT. Vamos utilizar PROMISE.ALL para executar
// três FETCHs concorrentes e aguaradar pelo fim de todos eles.

function checkSitesSizesParallel() {
    let total = 0;
    let requests = [
        fetch('https://jsonplaceholder.typicode.com/posts')
            .then(response => processFetchResponse(response)),
        fetch('https://jsonplaceholder.typicode.com/comments')
            .then(response => processFetchResponse(response)),
        fetch('https://jsonplaceholder.typicode.com/todos')
            .then(response => processFetchResponse(response)),
    ];

    return Promise.all(requests)
        .then(sizes => sizes[0] + sizes[1] + sizes[2])
        .catch(err => log('ERROR:', err))
    ;

    ///////////////////////////////

    function processFetchResponse(response) {
        if (response.status !== 200) {
            throw new Error('Unable to fetch resource: ' + url);
        }
        const url = response.url;
        return response.text()
            .then(function(text) {
                const size = text.length/1000;
                log(`${url}: ${size.toFixed(2)}K chars`);
                return size;
            })
        ;
    }
}

now = Date.now();
checkSitesSizesParallel().then(total => log(`TOTAL: ${total.toFixed(2)}K chars`))

// Vamos agora à versão com ASYNC/AWAIT. Para já, o único mecanismo que
// temos à disposição para executar funções ASYNC em paralelo continua
// a ser PROMISE.ALL. A vantagem é que podemos aguardar pelos resultados
// PROMISE.ALL com AWAIT.

async function checkSitesSizesParallel() {
    try {
        let requests = [
            fetchAndProcess('https://jsonplaceholder.typicode.com/posts'),
            fetchAndProcess('https://jsonplaceholder.typicode.com/comments'),
            fetchAndProcess('https://jsonplaceholder.typicode.com/todos'),
        ];

        const sizes = await Promise.all(requests);
        return sizes[0] + sizes[1] + sizes[2];
    }
    catch (err) {
        log('ERROR:', err);
    }

    ///////////////////////////////

    async function fetchAndProcess(url) {
        const response = await fetch(url);
        return await processFetchResponse(response);
    }

    async function processFetchResponse(response) {
        if (response.status !== 200) {
            throw new Error('Unable to fetch resource: ' + url);
        }
        const url = response.url;
        const text = await response.text();
        const size = text.length/1000;
        log(`${url}: ${size.toFixed(2)}K chars`);
        return size;
    }
}

// Vamos testar:

(async function() {
    now = Date.now();
    const total = await checkSitesSizesParallel();
    log(`TOTAL: ${total.toFixed(2)}K chars`);
})();

// EXEMPLO 3: DESCARREGAR N SITES EM SEQUÊNCIA

// Este exemplo é semelhante a um anteriormente definido quando falámos
// de PROMISEs. Para facilitar esta tarefa, vamos, novamente, recorrer
// à função runAsyncChain.

function makeAsyncChain(...handlers) { 
    return x => handlers.reduce((acc, handler) => acc.then(handler), Promise.resolve(x));
}

function runAsyncChain({startValue, handlers}) { 
    return makeAsyncChain(...handlers)(startValue);
}

// O nosso array de sites, com mais um site para tornar o processo 
// mais interessante:

const sites = [
    'https://jsonplaceholder.typicode.com/posts',
    'https://jsonplaceholder.typicode.com/comments',
    'https://jsonplaceholder.typicode.com/todos',
    'https://jsonplaceholder.typicode.com/albums',
];

// E agora é uma questão de criarmos os handlers do encadeamento de
// .THENs que é gerado por runAsyncChain.

function checkSitesSizesSequential(sites) {
    let total = 0;

    let result = runAsyncChain({
        startValue: 0,
        handlers: sites.map(site => function(size) {
            total += size;
            return fetch(site).then(response => processFetchResponse(response));
        }),
    });
    return result.then(lastSize => total += lastSize );

    ///////////////////////////////

    function processFetchResponse(response) {
        if (response.status !== 200) {
            throw new Error('Unable to fetch resource: ' + url);
        }
        const url = response.url;
        return response.text()
            .then(function(text) {
                const size = text.length/1000;
                log(`${url}: ${size.toFixed(2)}K chars`);
                return size;
            })
        ;
    }
}

now = Date.now();
checkSitesSizesSequential(sites).then(total => log(`TOTAL: ${total.toFixed(2)}K chars`))

// E agora a vesão com ASYNC/AWAIT. Aqui as coisas simplificam-se porque
// podemos utilizar mecanismos estruturados de programação síncrona 
// para controlo da execução, nomeadamente, ciclos.

async function checkSitesSizesSequential(sites) {
    try {
        let total = 0;

        for (const site of sites) {
            const response = await fetch(site);
            const size = await processFetchResponse(response);
            total += size;
        }
        return total;
    } 
    catch(err) {
        log('ERROR:', err);
    }

    ///////////////////////////////

    async function processFetchResponse(response) {
        if (response.status !== 200) {
            throw new Error('Unable to fetch resource: ' + url);
        }
        const url = response.url;
        const text = await response.text();
        const size = text.length/1000;
        log(`${url}: ${size.toFixed(2)}K chars`);
        return size;
    }
}

(async function() {
    now = Date.now();
    const total = await checkSitesSizesSequential(sites);
    log(`TOTAL: ${total.toFixed(2)}K chars`);
})();

// EXEMPLO 4: DESCARREGAR N SITES EM PARALELO

// Começemos pela versão com PROMISEs. Não precisamos de construir um
// encadeamento de promises. Basta mapear o array de N sites em N
// promises que devolvem o tamanho do site. Depois, PROMISE.ALL 
// lança cada uma das PROMISEs do array requests, o que tem como 
// resultado um array de tamanhos.

function checkSitesSizesParallel(sites) {
    let total = 0;
    let requests = sites.map(site => 
        fetch(site).then(response => processFetchResponse(response))
    );
    return Promise.all(requests)
        .then(sizes => sizes.reduce((acc, size) => acc + size, 0))
        .catch(err => log('ERROR:', err))
    ;

    ///////////////////////////////

    function processFetchResponse(response) {
        if (response.status !== 200) {
            throw new Error('Unable to fetch resource: ' + url);
        }
        const url = response.url;
        return response.text()
            .then(function(text) {
                const size = text.length/1000;
                log(`${url}: ${size.toFixed(2)}K chars`);
                return size;
            })
        ;
    }
}

now = Date.now();
checkSitesSizesParallel(sites).then(total => log(`TOTAL: ${total.toFixed(2)}K chars`))

// E agora a versão ASYNC/AWAIT. Não é assim tão diferente porque também
// aqui temos que utilizar PROMISE.ALL. 

async function checkSitesSizesParallel(sites) {
    try {
        let requests = sites.map(site => fetchAndProcess(site));
        const sizes = await Promise.all(requests);
        return sizes.reduce((acc, val) => acc + val, 0);
    }
    catch (err) {
        log('ERROR:', err);
    }

    ///////////////////////////////

    async function fetchAndProcess(url) {
        const response = await fetch(url);
        return await processFetchResponse(response);
    }

    async function processFetchResponse(response) {
        if (response.status !== 200) {
            throw new Error('Unable to fetch resource: ' + url);
        }
        const url = response.url;
        const text = await response.text();
        const size = text.length/1000;
        log(`${url}: ${size.toFixed(2)}K chars`);
        return size;
    }
}

(async function() {
    now = Date.now();
    const total = await checkSitesSizesParallel(sites);
    log(`TOTAL: ${total.toFixed(2)}K chars`);
})();


// Consultar: 
// . https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/async_function
// . https://javascript.info/async-await



// EXERCÍCIO: Quando é que exibido "Após WAIT": antes ou depois das 
// mensagens "passaram x segs"?

function wait(segs) {
    return new Promise(function (resolve, reject) {
        setTimeout(() => resolve(segs), segs * 1000);
    });
}

wait(4)
.then(segs => {console.log(`passaram ${segs}s`); return wait(2);})
.then(segs => {console.log(`passaram ${segs}s`); return wait(3);})
.then(segs => console.log(`passaram ${segs}s`));
console.log('Após WAIT');

(async function() {
    let segs = await wait(4);
    console.log(`passaram ${segs}s`);
    segs = await wait(2);
    console.log(`passaram ${segs}s`);
    segs = await wait(3);
    console.log(`passaram ${segs}s`);
})();
console.log('Após WAIT')