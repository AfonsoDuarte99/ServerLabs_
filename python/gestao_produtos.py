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
##      Produtos e Catalogo
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

    @classmethod
    def from_csv(cls, linha: str, delim = CSV_DEFAULT_DELIM) -> 'Produto':
        attrs = linha.split(delim)
        return Produto(
            id_ = int(attrs[0]),
            nome = (attrs[1]),
            tipo = (attrs[2]),
            quantidade = int(attrs[3]),
            preco = dec(attrs[4]),
            )
    #:

    @property
    def desc_tipo(self) -> str:
        return PRODUCT_TYPES[self.tipo]
    #:

    def __str__(self):
        cls_name = self.__class__.__name__
        return f'{cls_name}[id = {self.id} nome = "{self.nome}" "tipo = {self.tipo}"]'
    #:

    def __repr__(self):
        cls_name = self.__class__.__name__
        return f'{cls_name}(id = {self.id}, nome = {self.nome}, tipo = {self.tipo},'\
            f'quantidade = {self.quantidade}, preco = {repr(self.preco)})'
    #:

    def com_iva(self,taxa_iva:dec) -> dec:
        return self.preco * (1 + taxa_iva/100)
    #:
#:

class ProdutoEspecial(Produto):
    def valor_stock(self) -> dec:
        return self.quantidade * self.preco
    #:
#:

class InvalidProdAttribute(ValueError):
    pass
#:

class CatalogoProdutos:
    def __init__(self):
        self.prods = {}
    #:

    def append(self,prod:Produto):
        if prod.id in self._prods:
            raise DuplicateValue(f'Já existe produto com id {prod.id} no catálogo')
        self._prods[prod.id] = prod
    #:

    def _dump(self):
        for prod in self._prods:
            print(prod)
        #:
    #:

    def obtem_por_id(self, id:int) -> Produto | None:
        return self._prods.get(id)
    #:

    def pesquisa(self,criterio) -> 'CatalogoProdutos':
        encontrados = CatalogoProdutos()
        for prod in self._prods.values():
            if criterio(prod):
                encontrados.append(prod)
        return encontrados
    #:

    def __str__(self):
        class_name = self.__class__.__name__
        return f'{class_name}[#produtos = {len(self._prods)}]'
    #:

    def __iter__(self):
        for prod in self._prods.values():
            yield prod
        #:
    #:

    def __len__(self):
        return len(self._prods)
    #:
#:

class DuplicateValue(Exception):
    pass
#:

###########################################################################

##
##      Leitura dos Ficheiros
##

##########################################################################

def le_produtos(caminho_fich: str, delim = CSV_DEFAULT_DELIM) -> CatalogoProdutos:
    prods = CatalogoProdutos()
    #ler ficheiro e popular cartalogo com cada um dos produtos
    #uma linha do ficheiro corresponde a um produto
    with open(caminho_fich, 'rt') as fich:
        for linha in linhas_relevantes(fich):
            prods.append(Produto.from_csv(linha, delim))
    return prods
#:

def linhas_relevantes(fich: TextIO):
    for linha in fich:
            linha = linha.strip()
            if len(linha) == 0 or linha[0] == '#':
                continue
            yield linha
#:

def main() -> None:
    #produtos = CatalogoProdutos()
    #produtos.append(Produto(30987, 'pão de milho', 'AL',2,dec('1')))
    #produtos.append(Produto(30098, 'leite mimosa', 'AL',10,dec('2')))
    #produtos.append(Produto(21109, 'fairy', 'DL',20,dec('3'))) 
    #produtos.append(Produto(21109, 'fairy', 'DL',20,dec('3'))) 

    produtos = le_produtos('produtos.csv')
    produtos._dump()

    print('------')

    produto = ProdutoEspecial.from_csv('21112,sonasol,DL,25,2.5')
    print(type(produto))
#: 

if __name__ == 'main':
    main()
#:
