/**
 * 
 * 
 * Integração com ifood em javascript
 * Copyright (c) 2020 Danilo Machado
 * xxdannilinxx@gmail.com
 * 
 * 
 * 
 */
const CLIENTE_ID = "xxx";
const CLIENTE_SECRET = "xxx";
const GRANT_TYPE = "password";
const USERNAME = "xxx";
const PASSWORD = "xxx";
const MERCHAN_ID = "xxx";
/**
 * 
 * função personalizada jquery para realizar as requisições
 * 
 */
let setSubmit = (dados, caminho, successback, failback) => {
    $.ajax({
        async: true,
        type: (dados.requisicao ? dados.requisicao : 'POST'),
        timeout: 30000,
        url: caminho,
        headers: (dados.headers ? dados.headers : this.headers),
        data: (dados.dados ? dados.dados : dados),
        complete: xhr => {
            if (xhr.status >= 200 && xhr.status <= 202) {
                successback(xhr.responseText, xhr);
            } else {
                failback(xhr.responseText, xhr);
                console.error(xhr);
            }
        },
        dataType: 'json'
    });
};
/**
 * 
 * Passo 4
 * Comunicar ifood do recebimento dos eventos, para não recebê-los novamente e gerar duplicidade.
 * 
 */
let comunicarIfood = (token, pedido) => {
    if (!pedido || !token) {
        console.error('CI-1: Não foi possível gerar o pedido.');
        return;
    }
    setSubmit({
        dados: JSON.stringify([{
            id: pedido.id
        }]),
        headers: {
            "Authorization": "bearer " + token,
            "Content-Type": "application/json",
            "Cache-Control": "no-cache",
        },

    }, 'https://pos-api.ifood.com.br/v1.0/events/acknowledgment', (r, xhr) => {
        console.log('Comunicação efetuada com sucesso.');
    }, (r, xhr) => {
        console.error('CI-2: Não foi possível comunicar ao ifood do recebimento dos pedidos.');
    });
}
/**
 * 
 * Passo 3
 * Busca informações do pedido no ifood e gera o pedido no seu back-end.
 * 
 */
let gerarPedido = (token, pedido) => {
    if (!pedido || !token) {
        console.error('GP-1: Não foi possível gerar o pedido.');
        return;
    }
    /**
     * Passo 3-4
     * confirma ao ifood que recebeu o pedido.
     * 
     */
    let confirmarPedido = () => {
        setSubmit({
            dados: {},
            headers: {
                "Authorization": "bearer " + token,
                "Content-Type": "application/json",
                "Cache-Control": "no-cache",
            },

        }, 'https://pos-api.ifood.com.br/v1.0/orders/' + pedido.correlationId + '/statuses/confirmation', (r, xhr) => comunicarIfood(token, pedido), (r, xhr) => {
            console.error('GP-2: Não foi possível confirmar o pedido com o ifood.');
        });
    }
    /**
     * 
     * Passo 3-3
     * confirma ao ifood que integrou o pedido. (essencial)
     * 
     */
    let integrarPedido = () => {
        setSubmit({
            dados: {},
            headers: {
                "Authorization": "bearer " + token,
                "Content-Type": "application/json",
                "Cache-Control": "no-cache",
            },

        }, 'https://pos-api.ifood.com.br/v1.0/orders/' + pedido.correlationId + '/statuses/integration', (r, xhr) => confirmarPedido(), (r, xhr) => {
            console.error('IP-1: Não foi possível integrar o pedido do ifood.');
        });
    }
    /**
     * 
     * Passo 3-2
     * 
     */
    let salvarPedido = pedidoRecebido => {
        switch (pedido.code) {
            case 'CONFIRMED':
                //Confirmado
                break;
            case 'CANCELLED':
                //Cancelado
                break;
            case 'READY_TO_DELIVER':
                //Pronto para retirada
                break;
            case 'DISPATCHED':
                //Saiu para entrega
                break;
            case 'CONCLUDED':
            case 'DELIVERED':
                // Entregue
                break;
            case 'PLACED':
                integrarPedido();
                return;
            case 'INTEGRATED':
            default:
                comunicarIfood(token, pedido);
                return;
        }
        /**
         * 
         * Passo 3-5 (último)
         * salva o pedido no seu back-end.
         * 
         */
        setSubmit({
            dados: pedidoRecebido,
        }, 'http://localhost/seu_arquivo.php', (r, xhr) => {
            comunicarIfood(token, pedido);
            console.log('Pedido salvo com sucesso.');
        }, (r, xhr) => {
            if (r) {
                console.error('SP-1: Não foi possível salvar o pedido do ifood.<br /><b>' + r + '</b>');
            }
        });
    }
    /**
     * 
     * Passo 3-1
     * busca informações do pedido, antes de salvar no back-end.
     * 
     */
    let getPedido = () => {
        setSubmit({
            dados: {},
            requisicao: 'GET',
            headers: {
                "Authorization": "bearer " + token,
                "Content-Type": "application/json",
                "Cache-Control": "no-cache",
            },

        }, 'https://pos-api.ifood.com.br/v1.0/orders/' + pedido.correlationId, (r, xhr) => {
            salvarPedido(xhr.responseJSON);
        }, (r, xhr) => {
            console.error('GPD-1: Não foi possível receber as informações do pedido.');
        });
    }
    getPedido();
}
/**
 * 
 * Passo 2
 * Buscar eventos (polling) no ifood recursivamente e temporáriamente. (novos pedidos/atualizações/cancelamentos) 
 * 
 */
let ifoodGetPedidos = () => ifood(token => {
    if (!token) {
        console.error('IGP-1: Não foi possível gerar o pedido.');
        return;
    }
    setSubmit({
        dados: {},
        requisicao: "GET",
        headers: {
            "Authorization": "bearer " + token,
            "Content-Type": "application/json",
            "Cache-Control": "no-cache",
        },

    }, 'https://pos-api.ifood.com.br/v3.0/events:polling', (r, xhr) => {
        let pedidos = xhr.responseJSON;
        if (pedidos.length > 0) {
            /**
             * 
             */
            let tempDatas = [];
            let tempPedidos = {};
            pedidos.map(pedido => {
                let data = new Date(pedido.createdAt);
                tempDatas.push(data.getTime());
                tempPedidos[data.getTime()] = pedido;
            });
            /**
             * 
             */
            tempDatas.sort((a, b) => {
                return a - b;
            });
            /**
             * 
             */
            tempDatas.map(data => {
                gerarPedido(token, tempPedidos[data]);
            });
        }
    }, (r, xhr) => {
        console.log('Polling efetuado com sucesso em ' + new DateTime());
    });
}, (r) => {
    console.error('IGP-2: Não foi possível gerar o pedido.');
    return;
});
/**
 * 
 * Passo 1
 * função para gerar o token direto do ifood, o token é valido por 60 minutos, sendo assim, salvamos o token no storage
 * e quando estiver prestes a expirar, geramos um novo.
 * Atenção, se tentar gerar um token a cada requisição, o ifood pode bloquear suas requisições temporáriamente.
 * 
 */
let ifood = (callback, failback) => {
    let token = localStorage.getItem('token_ifood');
    if (token) {
        token = JSON.parse(token);
        let dataAtual = new Date();
        let expira = new Date(token.expira);
        if (dataAtual.getTime() < expira.getTime()) {
            if (typeof callback === 'function') {
                if (token.token) {
                    callback(token.token);
                }
            }
            return;
        }
    }
    setSubmit({
        dados: {
            client_id: CLIENTE_ID,
            client_secret: CLIENTE_SECRET,
            grant_type: GRANT_TYPE,
            username: USERNAME,
            password: PASSWORD,
        },
    }, 'https://pos-api.ifood.com.br/oauth/token', (r, xhr) => {
        var data = new Date();
        data.setHours(data.getHours() + 1);
        let token = {
            token: xhr.responseJSON.access_token,
            expira: data
        };
        localStorage.setItem('token_ifood', JSON.stringify(token));
        if (typeof callback === 'function') {
            if (token.token) {
                callback(token.token);
                return;
            }
            console.log('Integração com ifood realizada com sucesso.');
        }
    }, (r, xhr) => {
        if (typeof failback === 'function') {
            failback();
            return;
        }
        console.error('IFOOD-1: Não foi possível autenticar com o ifood, verifique suas credenciais.');
    });
};
/**
 *
 * Início
 * o ifood recomenda realizar os pollings (buscar eventos) a cada 30s, toda vez que efetuar a busca ao mesmo tempo irá notificar ao ifood
 * que a loja e está aberta.
 * 
 */
ifoodGetPedidos();
setInterval(ifoodGetPedidos, 30000);