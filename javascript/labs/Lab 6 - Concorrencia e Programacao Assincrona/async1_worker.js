
let now;

function log(...args) {
    let timeDiff = Date.now() - now;
    let msg = `Instante: ${timeDiff.toString().padStart(4)}ms | `;
    console.log(msg, ...args);
}

globalThis.onmessage = function tarefaLenta_Comp_Sync_(event) {
    const [codigoTarefa, startTime] = event.data;
    now = startTime;
    log(`Tarefa lenta ${codigoTarefa} em execução`);
    let i;
    for (i = 0;  i < 2000000000; i += 1) {
        // faz qq coisa com i
    }
    postMessage(i);
    log(`Tarefa lenta ${codigoTarefa} finalmente concluída`);
};