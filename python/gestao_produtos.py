"""
Programa para gestão do catalogo de produtos. Este programa permite:
    - Listar o catalogo
    - Pesquisar por alguns campos
    - Eliminar um registo do catalogo
    - Guardar o catalogo em ficheiro
"""

from decimal import Decimal as dec
import subprocess
import sys
from typing import TextIO

CSV_DEFAULT_DELIM = ','
DEFAULT_INDENTATION = 3

##########################################################################

##
##  Produtos e Catalogo
##

##########################################################################

PRODUCT_TYPES = {
    'AL': 'Alimentação',
    'DL': 'Detergente p/Loiça',
    'FRL': 'Frutas e Legumes'
}

# id    : > 0 e tem que ter cinco digitos
# nome
# tipo
# quantidade
# preco

class Produto:
    def __init__(
        self,
        id_: int,
        nome: str,
        tipo: str,
        quantidade: int,
        preco: dec,
        ):
        if id_ < 0 or len(str(id_)) !=5:
            raise InvalidProdAttribute(f'{id_=} Invalido (deve ser > 0 e ter 5 digitos)')
        #:
        if not nome:
            raise InvalidProdAttribute('Nome vazio')
        #:
        if tipo not in PRODUCT_TYPES:
            raise InvalidProdAttribute(f'Tipo de produto ({tipo}) desconhecido')
        #:
        if quantidade < 0:
            raise InvalidProdAttribute('Quantidade de ser >= 0')
        #:
        if preco < 0:
            raise InvalidProdAttribute('Preço deve ser >=0')
        #:
        

        self.id = id_
        self.nome = nome
        self.tipo = tipo
        self.quantidade = quantidade
        self.preco = preco
    #:
#:

    def __str__(self):
        cls_name = self.__class__.__name__
        return f'{cls_name}[id = {self.id} nome = "{self.nome}" "tipo = {self.tipo}"]'

class InvalidProdAttribute(ValueError):
    pass
#:


def main() -> None:
    prod1 = Produto(30987,'pão de milho','AL',2,dec('1.5'))
    #prod2 = Produto(356, 'AJAX')

    print(f"prod1 {prod1.nome}")  # console.log('prod1 ${prod1.nome}')
    #print(f"prod2 {prod2.nome}")
#:

if __name__ == 'main':
    main()
#:
