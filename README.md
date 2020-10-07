# integracao-ifood-js
Integração com o ifood em javascript, utilizando como referência a api oficial.

*Passo 1*
- *Ler a API de referência* (Utilizando [Ifood Developers](https://developer.ifood.com.br/reference#autentica%C3%A7%C3%A3o2))

*Passo 2*
- *Registre-se como software house* (Ifood [Cadastro Software House](https://developer.ifood.com.br/page/cadastro-sh))

*Passo 3*
- Clonar o repositório e realizar os testes com suas credenciais.

No arquivo *ifood.js* está disponibilizado o trâmite correto para obtenção de pedidos, para importar produtos, cadastrar categorias ou até mesmo receber as avaliações, consulte a API.

### Está com dificuldades para realizar pedidos teste?

Faça uma requisição GET passando o bearer token para:
``

https://pos-api.ifood.com.br/v1.0/merchants

``