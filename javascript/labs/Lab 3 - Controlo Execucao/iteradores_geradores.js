
// CONSULTAR: 
// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Iterators_and_Generators
// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Iteration_protocols#The_iterator_protocol

// VERSÃO TRADICIONAL: 
// Construímos um array de objectos com todos os objectos filtrados.
// Se passarmos um iterável com 10_000_000 de objectos e se 
// forem filtrados metade, então necessitamos de memória para 
// 15_000_000 de objectos.

function filtra(itens, criterio) {
    let seleccionados = [];
    for (let item of itens) {
        if (criterio(item)) {
            seleccionados.push(item);
        }
    }
    return seleccionados;
}

// No sentido de reduzir as necessidades de memória, e mesmo assim 
// poder encadear várias operações como filtra, ou seja, operações que
// podem produzir resultados temporários com mihões de objectos a 
// linguagem JavaScript apresenta a sua versão do pattern Iterator (ver
// "Design Patterns" do GoF). O conceito central aqui é o conceito de
// ITERADOR, um objecto a partir do qual acedemos ao próximo elemento
// elemento de uma coleção de elementos.
// 
// NOÇÕES:
//
// ITERÁVEL: Objecto que se pode iterar através do ciclo 'for-of' ou 
//           através do método 'iterador.next()'. 
//           Formalmente, um objecto iterável é um objecto que
//           implementa o PROTOCOLO DE ITERABILIDADE. Este protocolo
//           estabelece uma interface a partir da qual se extrai um 
//           iterador a partir do iterável. Ou seja, um iterável é 
//           um objecto do qual tiramos um iterador.
//           O protocolo de iterabilidade especifica que um iterável
//           deve implementar o método 'iteravel.[Symbol.iterator]()',
//           sendo que este método responsável por devolver o iterador.
//
// ITERADOR: Na prática é um objecto que possibilita obter o próximo
//           valor de um iterável.
//           Formalmente, um iterador é um objecto que implementa o 
//           PROTOCOLO DE ITERAÇÃO. Este protocolo especifica uma 
//           interface com o método 'iterador.next()', método utilizado 
//           para obter o próximo valor de um iterável. O método 
//           'iterador.next()' devolve o seguinte objecto:
//           '{value: VALOR, done: true/false}'
//           Quando o iterador chegar ao fim do iterável, se o iterável
//           for finito, então  devolve 
//           '{value: ULTIMO_VALOR: done: true}'.
//           Um iterador pode ser um iterável também.
//
// GERADOR:  Uma função que pode ser parada e retomada. Um gerador é 
//           um iterador e um iterável. A função para através da 
//           instrução YIELD, e é retomado com o método 
//           'gerador.next()'. É possível devolver um valor com YIELD
//           e este valor é automaticamente encapsulado num objecto 
//           '{value: VALOR_DO_YIELD, done: false}'. Quando um 
//           gerador termina, se terminar, automaticamente é devolvido
//           o objecto: 
//           '{value: undefined ou valor devolvido com RETURN, done:true}'
//           Ou seja, um gerador pode ser utilizado implementar um 
//           iterador.
//
// Consultar: https://javascript.info/generators

// ITERADOR: VERSÃO C/ GERADOR
// Um gerador é uma função que pode suspender a sua execução e devolver
// controlo à função invocadora. A execução é suspensa com a instrução
// YIELD, que, além de suspender o gerador, permite também que este 
// devolva um valor para a função invocadora antes de suspender a 
// execução. A função invocadora pode depois retomar a execução do 
// gerador em qualquer altura. A execução é retomada com o método 
// 'gerador.next()' no exacto ponto onde o gerador suspendeu a 
// execução. 
// Assim que item a filtrar é encontrado a função pausa a sua execução
// com 'yield' e devolve o item. A execução pode ser retomada com 
// 'gerador.next()'.
// Um gerador tem que ser definido com a palavra-reservada FUNCTION*.

function* filtra(itens, criterio) {
    for (let item of itens) {
        if (criterio(item)) {
            yield item;
        }
    }
}

let nums = [100, -2, -1, 59, 44, 46, 77, -50, -4, 4, 20, -3, 150];
//...
pares = filtra(nums, (num) => num % 2 == 0);
//...
positivos = filtra(pares, (num) => num > 0);
//...
seleccionados = filtra(positivos, (num) => num >= 0 && num <= 50);


// VERSÃO COM OBJECTO ITERADOR (QUE É TAMBÉM ITERÁVEL)
function filtra(itens, criterio) {
    let it = itens[Symbol.iterator]();
    return {
        // next() {...},  equivalente a next: function() {...},
        next() {
            for (let item = it.next(); !item.done; item = it.next()) {
                if (criterio(item.value)) {
                    return item;
                }
            }
            return {value: null, done: true};
        },
        [Symbol.iterator]() {
            return this;
        }
    }
}
