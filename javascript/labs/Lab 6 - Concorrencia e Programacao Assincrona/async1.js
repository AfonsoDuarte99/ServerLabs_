'use strict';

////////////////////////////////////////////////////////////////////////////////
//
//      TEORIA: CONCORRÊNCIA
//
////////////////////////////////////////////////////////////////////////////////

// Suporte para programação assíncrona é o tópico a abordar neste
// ficheiro de código. Este modelo de programação é especialmente
// vocacionado para sistemas que necessitam de dar resposta a várias
// solicitações ao mesmo tempo. Antes de abordarmos quais os mecanismos
// de JavaScript para programar de acordo com este modelo, necessitamos
// primeiro de estabelecer algumas noções prévias e perceber porque é
// que este modelo de programação se tornou tão relevante nos últimos
// anos.
//
// Em qualquer sistema computacional existem múltiplas actividades a
// decorrer em qualquer instante. Essas actividades podem estar
// relacionadas entre si ou não. Por exemplo, enquanto lemos este
// documento o sistema operativo pode ter necessidade de processar
// pacotes de dados que chegam pela interface de rede, ao mesmo tempo
// que a aplicação de arquivamento pode estar "entretida" a produzir um
// ZIP, enquanto que programa de trading recebe uma notificação de que
// as acções da Apple subiram acima dos $200.
//
// Define-se CONCORRÊNCIA como sendo a composição de múltiplas 
// actividades ou processos, independentes entre si, e que podem 
// concorrer pelos mesmos recursos (*) ao mesmo tempo. A noção de
// concorrência está relacionada com a estrutura dada a esses processos
// de modo a que possam partilhar os recursos do sistema.
//
// (*) - No mínimo concorrem pela utilização do CPU.
//
// Uma outra noção relacionada, PARALELISMO, tem que ver com exectuar 
// múltiplas actividades independentes, relacionadas entre si ou não, 
// em simultâneo. Paralelismo só é possível com múltiplos CPUs ou 
// cores.
//
// Citando Rob Pike, um dos criadores da linguagem Go:
//
// "Concurrency is about dealing with lots of things at once.
//  Parallelism is about doing lots of things at once."
//
// São noções relacionadas mas também diferentes. Paralelismo 
// pressupôe concorrência, mas podemos ter concorrência sem parelismo.
//
// Exemplo de Concorrência: sistema operativo. Os drivers do rato, do 
// teclado, da placa gráfica, etc, necessitam do CPU e de outros 
// recursos ao mesmo tempo; o kernel regula o acesso a estes recursos e 
// evita que estas actividades se "atropelem" umas às outras (eg, dando 
// espaços de memória diferentes a cada actividade, garantido que em 
// cada instante apenas uma utiliza os recursos de cada core, etc.). 
// Se só houver um CPU single-core, então não há parelismo. Mas o 
// kernel dá a a ilusão que estas actividades são executadas em 
// simultâneo.
// 
// Exemplo de Paralelismo: multiplicação de vectores ou de matrizes. 
// Esta actividade pode ser dividida em sub-actividades independentes
// que podem ser executadas em simultâneo quando atribuidas a vários 
// cores. Enquanto que um core processa uma parte de um vector, outro
// core processa a outra parte.
//
// O foco deste documento é CONCORRÊNCIA: estabelecer uma estrutura, um 
// modelo, para lidar com múltiplas solicitações ao mesmo tempo. 
// Existem vários modelos/abordagens para obter concorrência. Alguns 
// deles permitem também lidar com paralelismo. Os mais populares são:
//
//      1. Processos do SO/Multiprocessamento (**)
//      2. Threads/fios de execução (*)
//      3. Programação assíncrona com laço de eventos (event loop)
//
// Estas abordagens não são mutuamente exclusivas, porém cada uma tenta
// endereçar os problemas demonstrados pelas outras duas. O foco deste 
// documento é o modelo 3, que é o modelo seguido pela maioria dos 
// ambientes de execução da linguagem JavaScript. Veremos que existem 
// várias implementações possíveis para o modelo 3. Também aqui vamos
// considerar três formas de programação assíncrona: utilização de 
// CALLBACKS, programação com PROMISES e utilização da notação 
// ASYNC/AWAIT (que também assenta em promises).
//
// (*) Uma thread é uma função que pode ser executada em simultâneo com
// outras funções e que pode ser preemptivamente interrompida em 
// qualquer instante para dar lugar a outra thread. Por norma, quem 
// decide que uma thread deve dar lugar a outra é um processo do SO 
// designado de scheduler ("calendarizador"). Uma thread não sabe 
// quando é que vai perder acesso ao CPU. Quando comparadas com o event
// loop, a grande vantagem de threads é que podem tirar partido de 
// múltiplos cores. Ou seja, permitem concorrência com paralelismo.
// Threads tornam mais fácil, rápido e *perigoso* partilhar informação
// entre si, isto quando comparadas com processos. Como todas as threads 
// de um mesmo processo partilham o mesmo espaço de memória, todas elas
// podem aceder directamente às estruturas de dados globais de um 
// programa. Para evitar problemas, esse acesso tem que ser regulado
// (sincronizado), o que torna este modelo de concorrência muito
// difícil de programar.
// Uma análise mais aprofundada de threads sai fora do âmbito deste 
// documento. Mas, dada a importância do tópico, sugere-se a consulta
// de informação sobre este assunto.
//
// (**) Concorrência com processos do SO, abordagem também designada de
// multiprocessamento, passa por lançar um processo por cada actividade
// independente. Um processo é como que um programa autónomo, com o seu 
// espaço de endereçamento e estruturas de dados próprias ao nível do 
// SO. Também permitem concorrência com paralelismo, mas o custo é 
// maior do que com threads uma vez que um novo processo necessita de
// muito mais infraestrutura do que uma thread. Porém, processos estão 
// isolados uns dos outros. É mais difícil partilhar dados entre 
// processos, mas também é mais difícil ter os problemas de 
// sincronização que habitualmente ocorrem com threads.

////////////////////////////////////////////////////////////////////////////////
//
//      UM POUCO MAIS DE TEORIA: AMBIENTE DE EXECUÇÃO DE JAVASCRIPT
//
////////////////////////////////////////////////////////////////////////////////

// Conceptualmente, o ambiente de execução do JavaScript abrange três
// zonas de memória com propósitos distintos:
//
//  1. Stack/Pilha: memória que suporta a invocação de funções. É aqui 
//     que são guardados os endereços de retorno das funções bem como 
//     os valores de variáveis locais. Por valores, entenda-se valores
//     primitivos e referências para objectos (uma referência é um 
//     endereço de memória, ie, um inteiro positivo). Designa-se por 
//     frame toda a memória necessária para suportar a invocação de uma
//     função.
//     A título de exemplo, considere o seguinte script:
//
//            function funA() {
//                funB();
//                funD();
//            }
//            function funB() {
//                funC();
//            }
//            function funC() { }
//            function funD() { 
//                funE();
//            }
//            function funE() { }
//
//            console.log(funA());
//            funE();
//
//     De forma simplificada, o stack evolui assim: 
//
//       0. main()            (*)
//       1. main() => funA()  (**)
//       2. main() => funA() => funB()
//       3. main() => funA() => funB() => funC()
//       4. main() => funA() => funB()
//       5. main() => funA()
//       6. main() => funA() => funD()
//       8. main() => funA() => funD() => funE()
//       9. main() => funA() => funD()
//      10. main() => funA()
//      11. main() => console.log()
//      12. main()
//      13. main() => funE()
//      14. main()
//      15. stack vazio: fim da iteração do event loop, está na altura
//          de consultar a fila de macrotarefas e executar a primeira
//          tarefa, caso exista, ou aguardar que uma tarefa seja 
//          adicionada a esta fila (ver em baixo secção sobre EVENT
//          LOOP) 
//
//     O ciclo actual do event loop corresponde à execução de todas 
//     as funções cujos stack frames preenchem o stack.
//      
//      (*) main representa o código executável do script, definido no
//      "top-level", isto é, o código no nível de indentação mais à
//      esquerda e que, como tal, não está dentro de nenhuma função.
//      Podemos olhar para este main como sendo a primeira tarefa a
//      processar pelo event-loop.
//
//      (**) De notar que as funções main, console.log ou funA/.../D
//      não estão verdadeiramente no stack; o que está no stack são
//      as frames que resultam da invocação destas funções, contendo
//      cada frame as variáveis locais das funções e o endereço de
//      retorno para a função invocadora
//
//  2. Heap/Amontoado: Esta é uma zona de memória não-estruturada, onde
//     são criados os objectos, isto é, todos os não-primitivos da
//     linguagem. Em linguagems como Java, C++ ou C#, é nesta zona de 
//     memória que são criados objectos com a palavra-reservada "new". 
//     Em JavaScript, objectos são criados com "new" mas também de 
//     outras formas (objectos literais, Object.create(), etc.).
//
//  3. Macrotask Queue/Fila de Macrotarefas: na prática, é uma zona
//     de memória onde são colocadas operações a desempenhar após a
//     o actual ciclo do event loop. Cada tarefa tem uma função
//     associada. Todas as funções invocadas com 'setTimeout' ou
//     'setInterval' vêm aqui parar. Além disso, no browser todos os
//     eventos ('click', 'keypress', etc.) com event listener associado
//     também dão origem a uma tarefa que é colocada aqui. Por cada
//     ciclo do event loop, é removida e excutada uma tarefa da fila
//     de macrotarefas.
//
// Podemos considerar uma outra fila de tarefas, a Microtasks Queue,
// utilizada pelo mecanismos de PROMISEs. Esta fila está presente nas 
// implementações de JS dos browsers e em Node.js. O browser possui
// ainda outra fila, a Animation Queue, utilizada pelo mecanismo de 
// rendering e à qual podemos aceder através 'requestAnimationFrame'. 
// Vamos, para já, ignorar estas filas.

////////////////////////////////////////////////////////////////////////
//
//      UM POUCO MAIS DE TEORIA: EVENT LOOP/LAÇO DE EVENTOS
//
////////////////////////////////////////////////////////////////////////

// O modelo de concorrência da maioria das implementações de JavaScript
// assenta num "event loop". O ciclo seguinte ilustra, de forma 
// simplificada, o funcionamento de um event loop:
//
//      while (fila.aguardaTarefa()) {
//          fila.processaTarefa();
//      }
//
// fila.aguardaTarefa() espera sincronamente por uma tarefa na fila de 
// macrotarefas. Assim que existir uma tarefa (ocorreu um evento com 
// event listener ou está na altura de executar uma função via 
// setTimeout ou setInterval), ela é removida da fila, colocada no 
// stack (dando origem a uma frame) e executada. Por seu turno, todas 
// as funções invocadas pela tarefa vão popular o stack com as suas 
// frames. Só quando o stack esvaziar é que o ciclo termina, e o 
// event loop volta a aguardar pela próxima tarefa na fila. De notar
// que o mecanismo que aguarda por nova tarefa pode ser notificado 
// de que não vão ser adicionadas novas tarefas porque, basicamente,
// não há mais nada a fazer no script. Neste caso, a espera por nova
// tarefa termina, devolvendo "nada" o que faz com que o event loop
// encerre a sua execução => o script termina.
// 
// Este modelo é bastante diferente da abordagem seguida em linguagens 
// como C, C++ ou Java, linguagens onde tipicamente se recorre a threads 
// ou processos do SO para gerir múltiplas actividades. 
//
// Uma característica muito importante do event loop: ele é "single 
// threaded", ou seja, em cada instante existe apenas uma thread a 
// correr. Quer isto dizer que cada tarefa é completamente executada
// antes que a próxima tarefa seja processada. Ou seja, ao contrário
// do que sucede com threads, aqui uma função nunca é preemptivamente
// interrompida. Isto evita todos os problemas de sincronização 
// habitualmente associados a threads. No entanto, se uma tarefa 
// demora demasiado, todo o sistema fica "pendurado" à espera que 
// termine. No browser, isto significa que acções do utilizador ficam 
// por responder. Para evitar isto, todas as funções devem cooperar 
// entre si, dando a vez sempre que aguardam por uma operação morosa.
// 
// Devido a ser "single-threaded", o event loop promove um modelo de 
// concorrência "cooperativo". Uma consequência disto é que as funções 
// e métodos do ambiente de execução e da maioria das bibliotecas de
// JavaScript são assíncronos, isto é, nunca penduram o utilizador
// (ver funções síncronas e assíncronas em baixo). Se uma função 
// necessita de executar uma operação demorada, ela passa a vez a uma 
// outra função qualquer (que será seleccionada pelo event loop). Mas,
// antes disto, a função original regista uma outra função para 
// processar os resultados da operação demorada logo que esta termine.
// A operação demorada é executada assíncronamente e, assim que terminar 
// e tiver resultados para partilhar, chama a tal função que processa
// estes resultados. A execução assíncrona da operação demorada leva a
// que uma ou mais tarefas sejam colocadas na fila de macrotarefas. 
// Podemos olhar para cada uma destas tarefas como sendo um "bocadinho"
// da operação demorada. A última tarefa é responsável por chamar a 
// função que processa os resultados.

////////////////////////////////////////////////////////////////////////////////
//
//      FUNÇÕES SÍNCRONAS E ASSÍNCRONAS
//
////////////////////////////////////////////////////////////////////////////////

// Devido à necessidade de suportar programação assíncrona, as funções 
// podem então ser divididas em dois tipos quanto ao modelo de execução:
//
//  - SÍNCRONAS: Funções que retornam apenas quando o trabalho tiver
//    terminado ou falhado. Neste modelo, quando a função A invoca a 
//    função B, apenas retoma a execução depois de B ter terminado.
//    Enquanto B não terminar, a função A fica suspensa.
//
//  - ASSÍNCRONAS: Funções que não aguardam pela conclusão do trabalho
//    e retornam imediatamente. O trabalho a desempenhar será concluído
//    mais à frente no tempo, altura em que os resultados serão 
//    comunicados de volta.
// 
// Funções síncronas são muito úteis porque o seu fluxo de execução é 
// fácil de entender. No entanto, tornam-se problemáticas quando demoram
// muito tempo a concluir, e bloqueiam a acção da função invocadora e 
// de outras que se seguem. Funções síncronas demoradas são também 
// designadas de BLOQUEANTES (BLOCKING) porque bloqueiam a acção das 
// funções invocadoras por muito tempo. Num sistema com muita carga, 
// ie, onde é necessário despachar muitas actividades em simultâneo, 
// uma função bloqueante pode atrasar todo o sistema.
// Mesmo em sistemas de baixa carga, uma função bloqueante pode ser 
// problemática se, enquanto executa uma operação morosoa, for 
// necessário dar atenção imediata a uma outra ocorrência no sistema.
// Este é o caso dos sistemas c/ GUI. Se uma função bloquear o sistema,
// deixa de ser possível dar resposta imediata a acções do utilizador.
// O utilizador vai notar que o sistema não reage ou demora a reagir
// quando carrega num botão, tenta arrastar um objecto no ecrã, clica
// num botão, etc...
//
// Nas secções que seguem vamos introduzir programação assíncrona por
// meio de três exemplos que correspondem a três tarefas típicas que 
// não devem bloquear o código que depende do resultado destas tarefas:
//
//  1. Tarefa lenta para obtenção de um valor. Chamadas ao sistema, 
//     consultas a BD ou ao sistema de ficheiros, invocação de certas 
//     operações de I/O para obtenção de um valor, utilização de 
//     algoritmos mais demorados (eg, algoritmos criptográficos), etc.,
//     entram nesta categoria de tarefas.
//  2. Tarefa lenta de I/O lenta que consiste em várias operações de I/O 
//     executadas em paralelo ou em série.
//  3. Tarefa lenta computacional, como, por exemplo, um algoritmo 
//     de ordenação ou de pesquisa.
//
// Para efeitos de comparação, vamos primeiro implementar as versões 
// síncronas destes exemplos.

////////////////////////////////////////////////////////////////////////
//
//      MODELO "HABITUAL": PROGRAMAÇÃO SÍNCRONA
//
////////////////////////////////////////////////////////////////////////

// 1o EXEMPLO: TAREFA SÍNCRONA LENTA DE I/O: OBTER UM VALOR

// A função 'tarefaRapida_Sync' simula, como o nome indica, uma tarefa
// síncrona rápida. Por "rápida", entenda-se "instantânea". Tarefas 
// síncronas rápidas não são problemáticas. Uma tarefa síncrona lenta, 
// simulada por uma das 'tarefaSync_Lentas' em baixo, essa sim pode 
// causar problemas. 

function log(...args) {
    let timeDiff = Date.now() - now;
    let msg = `Instante: ${timeDiff.toString().padStart(4)}ms | `;
    console.log(msg, ...args);
}

function tarefaRapida_Sync(codigoTarefa) {
    log(`Tarefa ${codigoTarefa} concluída`);
}

function tarefaLenta_obtemValor_Sync(codigoTarefa) {
    // Devolve um valor entre 1 e 10, demorando (pelo menos) entre
    // 100 e 1000ms a produzir esse valor.
    const value = Math.floor(Math.random()*10 + 1);
    const timeout = Math.floor(Math.random()*900 + 100);
    sleep(timeout);
    log(`Tarefa lenta ${codigoTarefa} finalmente concluída: valor ${value}`);

    //////////////////////////////////////////////////////

    function sleep(delay) {
        const start = Date.now();
        const end = start + delay;
        for (let time = start; time < end; time = Date.now());
    }
}

now = Date.now();
tarefaRapida_Sync('A');
tarefaLenta_obtemValor_Sync('1');
tarefaRapida_Sync('B'); 

// 2o EXEMPLO: TAREFA SÍNCRONA LENTA DE I/O: MÚLTIPLOS ACESSOS

// A 'tarefaLenta_IO_Sync' representa uma tarefa de I/O que vai à rede
// buscar alguma informação. Neste caso concreto, a função descarrega
// um conjunto de páginas em série, obtém o número de caracteres de 
// cada página que soma a um total que é devolvido no final.
// Os URLs são descarregados por ordem. Uma função síncrona não 
// consegue explorar o facto dos pedidos serem independentes e
// poderem ser colocados em simultâneo.
//
// Para já ignoramos situações de erro, nomeadamente se os URLs são
// válidos, se é possível obter ligação, etc. De notar que se ocorrer
// um erro com URL específico, a função segue para o seguinte.

// Em Node.js:
// const XMLHttpRequest = require('xmlhttprequest').XMLHttpRequest;

function tarefaLenta_IO_Sync(codigoTarefa, sites) {
    // Obtém dados a partir dos seguintes URLs e indica a sua
    // dimensão. 
    // Inspirado em:
    // https://pybay.com/site_media/slides/raymond2017-keynote/simple_examples.html
    let totalSizeKChars = 0;
    for (let url of sites) {
        // Utilizamos XMLHttpRequest e não fetch porque este último é
        // sempre assíncrono (devolve uma Promise) e aqui queremos 
        // explorar uma tarefa síncrona demorada em JS. XMLHttpRequest 
        // permite um modo síncrono, modo esse que é desaconselhado em 
        // código real, mas que aqui é útil para efeitos de demonstração.
        let request = new XMLHttpRequest();
        request.open('GET', url, false);  // `false` makes the request synchronous
        request.send(null);
        totalSizeKChars += processUrlRequest(request, url);
    }

    log(`Tarefa lenta ${codigoTarefa} finalmente concluída`);
    return totalSizeKChars;

    ////////////////////////////////////////////////////

    function processUrlRequest(request, url) {
        if (request.status === 200) {            
            const shortUrl = `${url.slice(0, 15)}...${url.slice(-5)}`;
            const size = request.responseText.length/1000;
            log(`${shortUrl}: ${size.toFixed(2)}K chars`);
            return size;            
        }
        return 0;
    }
}

const sites = [
    'https://jsonplaceholder.typicode.com/posts', 
    'https://jsonplaceholder.typicode.com/comments',
    'https://jsonplaceholder.typicode.com/todos',
    // 'https://jsonplaceholder.typicode.com/albums',
    // 'https://jsonplaceholder.typicode.com/photos',
    // 'https://jsonplaceholder.typicode.com/users',
    // 'https://www.json-generator.com/api/json/get/bVWsbKODsi?indent=2',
    // 'https://www.json-generator.com/api/json/get/caTHrxUsAy?indent=2',
    // 'https://www.json-generator.com/api/json/get/coORLaelnS?indent=2',
];
now = Date.now();
tarefaRapida_Sync('A');
tarefaLenta_IO_Sync('1', sites);
tarefaRapida_Sync('B'); 

// 3o EXEMPLO: TAREFA SÍNCRONA LENTA COMPUTACIONAL

// tarefaLenta_Comp_Sync é um ciclo com milhões de iterações. Vamos
// imaginar que é um algoritmo que processa milhões de registos em
// memória.

function tarefaLenta_Comp_Sync(codigoTarefa) {
    for (let i = 0;  i < 2000000000; i += 1) {
        // faz qq coisa com i
    }
    log(`Tarefa lenta ${codigoTarefa} finalmente concluída`);
}

now = Date.now();
tarefaRapida_Sync('A');
tarefaLenta_Comp_Sync('1');
tarefaRapida_Sync('B'); 

////////////////////////////////////////////////////////////////////////////////
//
//      TIRAR PARTIDO DO EVENT LOOP: PROGRAMAÇÃO ASSÍNCRONA C/ CALLBACKS
//
////////////////////////////////////////////////////////////////////////////////

//
// SETTIMEOUT

// Assumindo que as tarefas são independentes entre si, a tarefa lenta
// vai bloquear a execução da tarefa B (e das seguintes). A tarefa 
// lenta pode ceder prioridade, passando a ser escalonada para correr 
// na próxima iteração do laço de eventos. 
// A função 'setTimeout(fun, t)', aguarda pelo menos "t" milisegundos 
// antes de executar a função de 0 argumentos "fun". "fun" será sempre 
// executada após a iteração actual do event loop e é sempre colocada 
// no final da fila de macrotarefas. Se "t" for 0, "fun" é colocada na 
// fila de macrotarefas para ser executada na próxima iteração do event 
// loop.

now = Date.now();
tarefaRapida_Sync('A');
// executa na próxima iteração do event loop
setTimeout(() => tarefaLenta_IO_Sync('1', sites), 0);  
// setTimeout(tarefaLenta_IO_Sync, 0);
tarefaRapida_Sync('B'); 

now = Date.now();
tarefaRapida_Sync('A');
setTimeout(() => tarefaLenta_Comp_Sync('1'), 0);
tarefaRapida_Sync('B'); 

// É claro que isto não resolve o problema das tarefas lentas 
// bloquearem o sistema. O que conseguimos foi adiar o problema para a 
// próxima iteração do event loop.

now = Date.now();
tarefaRapida_Sync('A');
setTimeout(() => tarefaLenta_IO_Sync('1', sites), 0);
setTimeout(() => tarefaRapida_Sync('C', 0)); 
tarefaRapida_Sync('B'); 

// A tarefa 'C' é bloqueada pela tarefa lenta na próxima iteração do 
// event loop.

//
// FUNÇÕES ASSÍNCRONAS C/ CALLBACKS

// Vamos agora definir versões assíncronas das nossas tarefas lentas.
// Estas versões recebem uma função que será chamada quando a tarefa
// tiver terminado e que tem como argumento(s) o(s) dado(s) obtidos
// pela tarefa assíncrona.

// 1o EXEMPLO: TAREFA ASSÍNCRONA LENTA DE I/O: OBTER UM VALOR

function tarefaLenta_obtemValor_Async(codigoTarefa, callback) {
    const value = Math.floor(Math.random()*10 + 1);
    const timeout = Math.floor(Math.random()*900 + 100);
    setTimeout(() => callback(value), timeout); 
    log(`Tarefa lenta ${codigoTarefa} em execução`);
}

now = Date.now();
tarefaRapida_Sync('A');
tarefaLenta_obtemValor_Async('1', (v) => log('Tarefa lenta 1 concluída, valor', v));
setTimeout(() => tarefaRapida_Sync('C'), 0); 
tarefaRapida_Sync('B'); 

// 2o EXEMPLO: TAREFA ASSÍNCRONA LENTA DE I/O: MÚLTIPLOS ACESSOS

// No caso da tarefa de I/O, utilizamos XMLHttpRequest em modo
// assíncrono. Neste modo o objecto assinala a recepção de uma
// resposta com o evento 'load'. Podemos registar uma função para 
// "apanhar" esse evento e processar os dados da página obtida através
// do URL passado para 'XMLHttpRequest.open'. A tarefa passa a receber
// uma callback que é chamada quando todos os URLs tiverem sido 
// processados. Essa callback recebe o total de bytes. Como é que 
// sabemos que todos os URLs foram processados e que é altura de 
// invocar a callback final? Através de um contador que é actualizado
// pela callback individual para cada URL (ie, a que é chamada quando 
// ocorre o evento 'load' do objecto XMLHttpRequest). Este contador
// é monitorizado por uma função que é periodicamente invocada via
// 'setTimeout'.
// Esta versão explora o facto dos pedidos serem independentes e
// poderem ser lançados em simultâneo, explorando assim o parelismo
// existente ao nível do kernel do SO, que é a entidade que 
// efectivamente trata das comunicações por HTTP.
// Também aqui ignoramos situações de erro.

function tarefaLenta_IO_Async(codigoTarefa, sites, callback) {
    let totalSizeKChars = 0;
    let finished = 0;
    for (let url of sites) {
        // Utilizamos XMLHttpRequest no seu modo normal, isto é, em 
        // modo assíncrono
        let request = new XMLHttpRequest();
        request.onload = function() {
            totalSizeKChars += processUrlRequest(request, url)
            finished += 1;
        };
        request.open('GET', url, true);  // `true` makes the request asynchronous
        request.send(null);
    }
    setTimeout(function testIfAllDone() {
        if (finished < sites.length) {
            setTimeout(testIfAllDone, 0);
            return;
        }
        log(`Tarefa lenta ${codigoTarefa} finalmente concluída`);
        callback(totalSizeKChars);
    }, 0);
    log(`Tarefa lenta ${codigoTarefa} em execução`);

    ///////////////////////////////////////////////////////////////////////////

    function processUrlRequest(request, url) {
        if (request.status === 200) {
            const shortUrl = `${url.slice(0, 15)}...${url.slice(-5)}`;
            const size = request.responseText.length/1000;
            log(`${shortUrl}: ${size.toFixed(2)}K chars`);
            return size;
        }
        return 0;
    }
}

now = Date.now();
tarefaRapida_Sync('A');
tarefaLenta_IO_Async(
    '1', 
    sites,
    (totalSizeKChars) => console.log(`Total chars: ${totalSizeKChars.toFixed(2)}K chars`)
);
setTimeout(() => tarefaRapida_Sync('C', 0)); 
tarefaRapida_Sync('B'); 

//
// FUNÇÕES ASSÍNCRONAS C/ CALLBACKS
// 3o EXEMPLO (a): TAREFA ASSÍNCRONA LENTA COMPUTACIONAL

function tarefaLenta_Comp_Async(codigoTarefa, callback) {
    function compute(start, end) {
        for (let i = start; i < end; i += 1)  {
            // faz qq coisa com i
        }
    }
    function asyncComputation(start = 0) {
        if (start >= 2000000000) {
            log(`Tarefa lenta ${codigoTarefa} finalmente concluída`);
            callback(start);
            return;
        }
        const end = start + 2000000;
        compute(start, end);
        setTimeout(() => asyncComputation(end), 0);
    }
    asyncComputation();
    log(`Tarefa lenta ${codigoTarefa} em execução`);
}

now = Date.now();
tarefaRapida_Sync('A');
tarefaLenta_Comp_Async('1', (i) => console.log(`Last i: ${i}`));
setTimeout(() => tarefaRapida_Sync('C', 0)); 
tarefaRapida_Sync('B'); 

//
// FUNÇÕES ASSÍNCRONAS C/ CALLBACKS
// 3o EXEMPLO (b): TAREFA ASSÍNCRONA LENTA COMPUTACIONAL c/ WORKERs

// No exemplo anterior, alterámos a implementação do algoritmo de modo
// a que este liberte o CPU de "tempos a tempos". Vamos supor que não
// temos acesso ao código fonte do algoritmo. Como torná-lo assíncrono?
// Uma solução passa por criar um fluxo de execução para correr a
// versão síncrona do algoritmo em paralelo com a execução do script
// principal. Hoje em dia, tal é possível porque os browsers (e o Node)
// já suportam uma forma mais fiável de threads: os WORKERs.
// Um WORKER é uma thread que corre no seu 'runtime' de JavaScript e
// num contexto diferente da thread principal. A thread principal e o
// Worker comunicam por troca de mensagens. Isto evita a maioria dos
// problemas associados a threads, nomeadamente a utilização de variáveis
// globais para para partilhar informação.
// 
// Consultar: https://developer.mozilla.org/en-US/docs/Web/API/Web_Workers_API/Using_web_workers

function tarefaLenta_Comp_Async2(codigoTarefa, callback) {
    const worker = new Worker('async1_worker.js');
    worker.postMessage([codigoTarefa, now]);
    worker.onmessage = (event) => callback(event.data);
}

now = Date.now();
tarefaRapida_Sync('A');
tarefaLenta_Comp_Async2('1', (i) => console.log(`Last i: ${i}`));
setTimeout(() => tarefaRapida_Sync('C', 0)); 
tarefaRapida_Sync('B'); 

////////////////////////////////////////////////////////////////////////////////
//
//      OPERAÇÕES SEQUENCIAIS E ERROS C/ CALLBACKS
//
////////////////////////////////////////////////////////////////////////////////

// A função 'tarefaLenta_IO_Async' lança todos os pedidos em simultâneo
// e, como tal, processa cada URL em paralelo. Suponhamos agora que
// os URLs devem ser processados sequencialmente. Isto é, vamos imaginar
// que só é possível obter uma página após ter sido obtida a anterior.
// Além do mais, se ocorrer um erro na obtenção de uma página, seja
// ela qual for, todo o processo deve terminar com erro. Dada a sua
// natureza síncrona, 'tarefaLenta_IO_Sync' já é naturalmente
// sequencial: cada novo pedido de página está bloqueado à espera que o
// anterior termine. Apenas precisamos de adicionar o tratamento de
// erros, que neste caso consiste em lançar uma excepção quando o
// pedido HTTP não é bem sucedido.

sites = [
    'https://jsonplaceholder.typicode.com/posts',
    'https://jsonplaceholder.typicode.com/commentsssss',
    'https://jsonplaceholder.typicode.com/todos',
    
];

function tarefaLenta_IO_Sync(codigoTarefa, sites) {
    let totalSizeKChars = 0;
    for (let url of sites) {
        let request = new XMLHttpRequest();
        request.open('GET', url, false);
        request.send(null);
        totalSizeKChars += processUrlRequest(request, url);
    }

    log(`Tarefa lenta ${codigoTarefa} finalmente concluída`);
    return totalSizeKChars;

    ////////////////////////////////////////////////////
    
    function processUrlRequest(request, url) {
        if (request.status !== 200) {
            throw new Error("Unable to fetch resource: " + url);
        }
        const shortUrl = `${url.slice(0, 15)}...${url.slice(-5)}`;
        const size = request.responseText.length/1000;        
        log(`${shortUrl}: ${size.toFixed(2)}K chars`);
        return size;
    }
}

// No caso de 'tarefaLenta_IO_Async' vamos ter que encadear os pedidos:
// apenas quando um pedido for colocado e os resultados devolvidos é
// que podemos passar para o seguinte. Ou seja, em termos do objecto
// XMLHttpRequest, isto signfica, que o evento 'load' vai ter uma
// callback que cria o XMLHttpRequest para o pedido seguinte e que
// depois chama a callback seguinte, etc., até chegarmos à última
// callback que, na verdade, é uma função passada por quem chama
// 'tarefaLenta_IO_Async'. Ou seja, tal como na versão anterior,
// também aqui 'tarefaLenta_IO_Async' recebe uma callback.
// Todavia, agora esta callback deve ser uma função com dois
// parâmetros, 'err' e 'totalChars'. Vejamos como chamar:
//  
//      tarefaLenta_IO_Async(
//          'tarefa1', 
//          [url1, ..., urlN],
//          function(err, totalChars) {
//              if (err) {
//                  // aqui tratamos de um eventual erro
//              }
//              else {
//                  // processa 'totalChars'
//              }
//          } 
//      );
//   
// O tratamento de erros segue um dos padrões habituais para tratamento
// de erros com callbacks (mas não com PROMISEs, conforme veremos):
// como não é possível comunicar o erro lançando uma excepção, este é
// passado como primeiro argumento da callback, sendo que os restantes
// argumentos representam os valores produzidos após a normal execução
// da tarefa. Caso não ocorra um erro, a tarefa passa 'undefined' ou
// 'null' como argumento deste primeiro parâmetro da callback, caso
// contrário a callback recebe um objecto 'Error' com informação sobre
// o sucedido. A callback deve começar por verificar se ocorreu um 
// erro, antes de verificar os restantes parâmetros.

function tarefaLenta_IO_Async(codigoTarefa, sites, callback) {
    let totalSizeKChars = 0;

    makeUrlRequest(sites[0], () => 
        makeUrlRequest(sites[1], () =>
            makeUrlRequest(sites[2], () => {
                log(`Tarefa lenta ${codigoTarefa} finalmente concluída`);
                callback(undefined, totalSizeKChars);
            }
    )));   
    log(`Tarefa lenta ${codigoTarefa} em execução`);

    /////////////////////////////////////////////////////////

    function makeUrlRequest(url, next) {
        let request = new XMLHttpRequest();
        request.onload = function() {
            try {
                totalSizeKChars += processUrlRequest(request, url);
                next();
            }
            catch (err) {
                callback(err);
            }
        };
        request.onerror = () => callback(new Error('Unexpected Error!'));
        request.open('GET', url, true);
        request.send(null);
    }
    function processUrlRequest(request, url) {
        if (request.status !== 200) {
            throw new Error("Unable to fetch resource: " + url);
        }
        const shortUrl = `${url.slice(0, 15)}...${url.slice(-5)}`;
        const size = request.responseText.length/1000;        
        log(`${shortUrl}: ${size.toFixed(2)}K chars`);
        return size;
    }
}

// A função anterior funciona apenas para 3 URLs. E se este número não
// for um fixo? Neste caso, podemos construir recursivamente uma cadeia
// de pedidos XMLHttpRequest. Cada chamada recursiva processa o URL na
// posição 'i' do array 'sites' e regista uma callback para o evento
// 'load'. Esta callback é que faz a chamada recursiva à própria função
// que processou o URL 'i', só que agora para processar o URL 'i+1'.
// Depois de processarmos o último URL, situação que só sucede se não
// tiver ocorrido nenhum erro até então, é chamada a callback passada
// como parâmetro para 'tarefaLenta_IO_Async'. O primeiro argumento
// desta callback (para o parâmetro 'err') é o valor 'undefined', uma
// vez que não ocorreu qualquer erro.

function tarefaLenta_IO_Async(codigoTarefa, sites, callback) {
    let totalSizeKChars = 0;    
    makeUrlRequest(0);
    log(`Tarefa lenta ${codigoTarefa} em execução`);

    /////////////////////////////////////////////////////////

    function makeUrlRequest(urlIndex) {
        if (urlIndex === sites.length) {
            log(`Tarefa lenta ${codigoTarefa} finalmente concluída`);
            callback(undefined, totalSizeKChars);
            return; 
        }
        let request = new XMLHttpRequest();
        request.onload = function() {
            try {
                totalSizeKChars += processUrlRequest(request, sites[urlIndex]);
                makeUrlRequest(urlIndex + 1);
            }
            catch (err) {
                callback(err);
            }
        };
        request.onerror = () => callback(new Error('Unexpected Error!'));
        request.open('GET', sites[urlIndex], true);
        request.send(null);
    }
    function processUrlRequest(request, url) {
        if (request.status !== 200) {
            throw new Error("Unable to fetch resource: " + url);
        }
        const shortUrl = `${url.slice(0, 15)}...${url.slice(-5)}`;
        const size = request.responseText.length/1000;        
        log(`${shortUrl}: ${size.toFixed(2)}K chars`);
        return size;
    }
}

now = Date.now();
tarefaRapida_Sync('A');
tarefaLenta_IO_Async(
    '1', 
    sites,
    function(err, totalSizeKChars) {
        if (err) {
            console.log(`Erro`, err);
            return;
        }
        console.log(`Total chars: ${totalSizeKChars.toFixed(2)}K chars`);
    }
);
setTimeout(() => tarefaRapida_Sync('C', 0)); 
tarefaRapida_Sync('B'); 


// Outro padrão habitualmente seguido para tratamento de erros consiste
// em passar duas callbacks, uma para o fluxo "normal" de execução, sem
// erros, e outra para quando a tarefa termina com um erro. 
//
//      tarefaLenta_IO_Async(
//          'tarefa1', 
//          [url1, ..., urlN],
//          function(totalChars) {
//              // processa 'totalChars'
//          },
//          function(err) {
//              // aqui tratamos de um eventual erro
//          }
//      );
//
// Fica como exercício implementar uma versão de 'tarefaLenta_IO_Async', 
// baseada na anterior, mas que suporte o tratamento de erros numa
// callback separada.

////////////////////////////////////////////////////////////////////////////
//
//      VER INFORMAÇÃO E EXEMPLOS EM "THE MODERN JAVASCRIPT TUTORIAL"
//      https://javascript.info/callbacks
//
////////////////////////////////////////////////////////////////////////////

// FIM 
