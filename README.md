# integracao-ifood-js
Integração com o ifood em javascript, utilizando como referência a api oficial.

- *Passo 1*: *Ler a API de referência* (Utilizando [Ifood Developers](https://developer.ifood.com.br/reference#autentica%C3%A7%C3%A3o2))

- *Passo 2*: *Registre-se como software house* (Ifood [Cadastro Software House](https://developer.ifood.com.br/page/cadastro-sh))

- *Passo 3*: Clonar o repositório, editar o arquivo *ifood.js* e inserir suas credenciais fornecidas pelo ifood, após o cadastro de software house.

No arquivo *ifood.js* está disponibilizado o trâmite correto para obtenção de pedidos, para importar produtos, cadastrar categorias ou até mesmo receber as avaliações, consulte a API.

## Rotina do processo
1) Gerar o bearer token a cada uma hora. (se gerar em excesso, o ifood pode bloquear suas requisições temporáriamente).
2) Buscar por novos eventos a cada 30 segundos, utilizando o bearer token.
3) Os eventos podem ser cancelamento de pedido, atualização de status ou um novo pedido, e voce precisará tratar isso no seu back-end.
4) Se o evento for de novo pedido, precisa confirmar ao ifood que recebeu e integrar o pedido.
5) Por último, fazer o tratamento no back-end.

## Está com dificuldades para realizar pedidos teste?
O ifood recomenda colocar o endereço "Bujari, 100" no bairro "BUJARI", se já fez os procedimentos porém continua não visualizando, siga os passos abaixo.

Faça uma requisição GET passando o bearer token para:

```
https://pos-api.ifood.com.br/v1.0/merchants

```

Irá retornar algo parecido com:
```
[
    {
        "id": "e4517892-ebab-40d3-b162-3qsf2-b1114a2320a6",
        "name": "Sua loja teste"
    }
]
```

Para realizar os pedidos em sua loja, basta acessar a url do ifood passando o "id" retornado na requisição anterior.
```
https://www.ifood.com.br/delivery/bujari-ac/loja-teste/e4517892-ebab-40d3-b162-3qsf2-b1114a2320a6
```

### Ficou alguma dúvida?
> Sinta-se a vontade para abrir uma issue, que tentarei esclarecer.
