const CLIENTE_ID = "gamadelivery";
const CLIENTE_SECRET = "5SXa4QzL";
const GRANT_TYPE = "password";
const USERNAME = "POS-328207455";
const PASSWORD = "POS-328207455";

let setSubmit = () => {
    var data = new FormData();
    data.append("client_id", CLIENTE_ID);
    data.append("client_secret", CLIENTE_SECRET);
    data.append("grant_type", GRANT_TYPE);
    data.append("username", USERNAME);
    data.append("password", PASSWORD);

    var xhr = new XMLHttpRequest();
    xhr.withCredentials = true;

    xhr.addEventListener("readystatechange", function () {
        if (this.readyState === 4) {
            console.log(this.responseText);
        }
    });

    xhr.open("POST", "https://pos-api.ifood.com.br/oauth/token");
    xhr.send(data);
};


///
///
///
setSubmit();

// let integracaoIfood = (username, password, merchantId, callback, failback) => {
//     let token = localStorage.getItem('token_ifood');
//     if (token) {
//         token = JSON.parse(token);
//         const dataAtual = new Date();
//         const expira = new Date(token.expira);

//         if (dataAtual.getTime() < expira.getTime()) {
//             if (typeof callback === 'function') {
//                 if (token.token) {
//                     callback(token.token, merchantId);
//                 }
//             }
//             return;
//         }
//     }
//     setSubmit({
//         dados: {
//             client_id: 'gamadelivery',
//             client_secret: '5SXa4QzL',
//             grant_type: 'password',
//             username: username,
//             password: password,
//         },
//         loading: () => { },
//     }, 'https://pos-api.ifood.com.br/oauth/token', (r, xhr) => {
//         var data = new Date();
//         data.setHours(data.getHours() + 1);
//         let token = {
//             token: xhr.responseJSON.access_token,
//             expira: data
//         };
//         localStorage.setItem('token_ifood', JSON.stringify(token));
//         if (typeof callback === 'function') {
//             if (token.token) {
//                 callback(token.token, merchantId);
//                 return;
//             }
//             setRetorno('Integração com ifood realizada com sucesso.', 'success');
//         }
//     }, (r, xhr) => {
//         if (typeof failback === 'function') {
//             failback();
//             return;
//         }
//         setRetorno('II-1: Não foi possível autenticar com o ifood, verifique suas credenciais.', 'danger');
//     });
// };
// /**
//  * 
//  * Estágio 4
//  * Comunicar ifood do recebimento dos eventos
//  * 
//  */
// let comunicarIfood = (token, pedido) => {
//     if (!pedido || !token) {
//         setRetorno('CI-1: Não foi possível gerar o pedido.', 'danger');
//         return;
//     }
//     setSubmit({
//         dados: JSON.stringify([{
//             id: pedido.id
//         }]),
//         headers: {
//             "Authorization": "bearer " + token,
//             "Content-Type": "application/json",
//             "Cache-Control": "no-cache",
//         },
//         loading: () => { },
//     }, 'https://pos-api.ifood.com.br/v1.0/events/acknowledgment', (r, xhr) => { }, (r, xhr) => {
//         setRetorno('CI-2: Não foi possível comunicar ao ifood do recebimento dos pedidos.', 'danger');
//     });
// }
// /**
//  * 
//  * Estágio 3
//  * Gerar pedido
//  * 
//  */
// let gerarPedido = (token, pedido) => {
//     if (!pedido || !token) {
//         setRetorno('GP-1: Não foi possível gerar o pedido.', 'danger');
//         return;
//     }
//     let confirmarPedido = () => {
//         setSubmit({
//             dados: {},
//             headers: {
//                 "Authorization": "bearer " + token,
//                 "Content-Type": "application/json",
//                 "Cache-Control": "no-cache",
//             },
//             loading: () => { },
//         }, 'https://pos-api.ifood.com.br/v1.0/orders/' + pedido.correlationId + '/statuses/confirmation', (r, xhr) => comunicarIfood(token, pedido), (r, xhr) => {
//             setRetorno('GP-2: Não foi possível confirmar o pedido com o ifood.', 'danger');
//         });
//     }
//     /**
//      * 
//      */
//     let integrarPedido = () => {
//         setSubmit({
//             dados: {},
//             headers: {
//                 "Authorization": "bearer " + token,
//                 "Content-Type": "application/json",
//                 "Cache-Control": "no-cache",
//             },
//             loading: () => { },
//         }, 'https://pos-api.ifood.com.br/v1.0/orders/' + pedido.correlationId + '/statuses/integration', (r, xhr) => confirmarPedido(), (r, xhr) => {
//             setRetorno('IP-1: Não foi possível integrar o pedido do ifood.', 'danger');
//         });
//     }
//     /**
//      * 
//      */
//     let salvarPedido = pedidoRecebido => {
//         let request = 'inicio/finalizar/';
//         let informacoes = {
//             ifood: pedidoRecebido.reference,
//             status: '',
//             usuario: {},
//             produtos: [],
//             valores: {
//                 produtos: 0,
//                 entrega: 0,
//                 total: 0,
//                 desconto: 0,
//             },
//         };
//         switch (pedido.code) {
//             case 'PLACED':
//                 integrarPedido();
//                 return;
//                 break;
//             case 'CONFIRMED':
//                 informacoes.integrar = true;
//                 request = 'inicio/finalizar/';
//                 break;
//             case 'CANCELLED':
//                 request = 'adm/pedidos/cancelamento/';
//                 break;
//             case 'READY_TO_DELIVER':
//                 informacoes.status = 'Pronto para retirada';
//                 request = 'adm/pedidos/alterarstatusifood/';
//                 break;
//             case 'DISPATCHED':
//                 informacoes.status = 'Saiu para entrega';
//                 request = 'adm/pedidos/alterarstatusifood/';
//                 break;
//             case 'CONCLUDED':
//             case 'DELIVERED':
//                 informacoes.status = 'Entregue';
//                 request = 'adm/pedidos/alterarstatusifood/';
//                 break;
//             case 'INTEGRATED':
//             default:
//                 comunicarIfood(token, pedido);
//                 return;
//                 break;
//         }
//         informacoes.usuario = {
//             id: 3,
//             nome: pedidoRecebido.customer.name,
//             email: 'ifood@gamasistemas.com.br',
//             tel: pedidoRecebido.customer.phone,
//             cpf: pedidoRecebido.customer.taxPayerIdentificationNumber,
//             bairro: pedidoRecebido.deliveryAddress.neighborhood,
//             end: pedidoRecebido.deliveryAddress.streetName,
//             nm: pedidoRecebido.deliveryAddress.streetNumber + "--" + (pedidoRecebido.deliveryAddress.complement ? pedidoRecebido.deliveryAddress.complement : ''),
//             cep: pedidoRecebido.deliveryAddress.postalCode,
//             totalPedidos: pedidoRecebido.customer.ordersCountOnRestaurant
//         };
//         /**
//          * 
//          */
//         pedidoRecebido.items.map(item => {
//             /**
//              * adicionais
//              */
//             let adicionais = [];
//             if (item.subItems && item.subItems.length > 0) {
//                 item.subItems.map(adicional => {
//                     adicionais.push('- ' + (adicional.quantity > 1 ? adicional.quantity + ' x ' : '') + adicional.name + ' ' + (adicional.totalPrice > 0 ? '+' + getMoney(adicional.totalPrice) : '') + '\n');
//                 });
//             }
//             /**
//              * produto
//              */
//             informacoes.produtos.push({
//                 id: item.externalCode,
//                 produto: item.quantity + " x " + item.name + "\n" + adicionais.join('') + (item.observations ? 'Observações: ' + item.observations + '\n' : ''),
//                 preco: getMoney(item.totalPrice),
//                 adicionais: adicionais
//             });
//         });
//         /**
//          * 
//          */
//         informacoes.valores.produtos = pedidoRecebido.subTotal;
//         informacoes.valores.entrega = pedidoRecebido.deliveryFee;
//         informacoes.valores.total = pedidoRecebido.totalPrice;
//         pedidoRecebido.payments.map(pagamento => {
//             if (pagamento.code !== 'DESC') {
//                 if (pagamento.prepaid) {
//                     informacoes.pagamento = 'ifood online';
//                 } else {
//                     informacoes.pagamento = pagamento.name;
//                     informacoes.troco = (pagamento.changeFor ? pagamento.changeFor : 0);
//                 }
//             }
//             // switch (pagamento.code) {
//             //   case 'VOUCHER':
//             //   case 'IFOOD_OUTROS':
//             //   case 'IFOOD_ONLINE':
//             //     informacoes.pagamento = 'ifood online';
//             //     break;
//             //   case 'DIN':
//             //   case 'GER_CT':
//             //   default:
//             //     informacoes.pagamento = 'Dinheiro';
//             //     informacoes.troco = pagamento.changeFor;
//             //     break;
//             //   case 'CHE':
//             //     informacoes.pagamento = 'Cheque';
//             //     break;
//             //   case 'DNREST':
//             //   case 'RAM':
//             //   case 'VSREST':
//             //   case 'RDREST':
//             //   case 'RHIP':
//             //   case 'REC':
//             //   case 'BANRC':
//             //   case 'GOODC':
//             //   case 'VERDEC':
//             //   case 'CRE':
//             //   case 'GER_CC':
//             //   case 'NUGO':
//             //   case 'QRC':
//             //     informacoes.pagamento = 'Cartão de Crédito';
//             //     break;
//             //   case 'MEREST':
//             //   case 'VIREST':
//             //   case 'RED':
//             //   case 'BANRD':
//             //   case 'GER_DC':
//             //     informacoes.pagamento = 'Cartão de Débito';
//             //     break;
//             //   case 'VA_OFF':
//             //     informacoes.pagamento = 'Voucher Alimentação';
//             //     break;
//             //   case 'VISAVR':
//             //   case 'NUTCRD':
//             //   case 'BENVVR':
//             //   case 'RSELE':
//             //   case 'VVREST':
//             //   case 'VR_SMA':
//             //   case 'GRNCAR':
//             //   case 'RSODEX':
//             //   case 'VALECA':
//             //   case 'TVER':
//             //   case 'CPRCAR':
//             //   case 'GRNCPL':
//             //     informacoes.pagamento = 'Voucher Refeição';
//             //     break;
//             //   case 'TRE':
//             //     informacoes.pagamento = 'Voucher Restaurante';
//             //     break;
//             //   case 'DES':
//             //     break;
//             // }
//         });
//         /**
//          *
//          */
//         setSubmit({
//             dados: informacoes,
//             loading: () => { },
//         }, RAIZ + request, (r, xhr) => {
//             comunicarIfood(token, pedido);
//         }, (r, xhr) => {
//             if (r) {
//                 setRetorno('SP-1: Não foi possível salvar o pedido do ifood.<br /><b>' + r + '</b>', 'danger');
//             }
//         });
//     }
//     /**
//      * 
//      */
//     let getPedido = () => {
//         setSubmit({
//             dados: {},
//             requisicao: 'GET',
//             headers: {
//                 "Authorization": "bearer " + token,
//                 "Content-Type": "application/json",
//                 "Cache-Control": "no-cache",
//             },
//             loading: () => { },
//         }, 'https://pos-api.ifood.com.br/v1.0/orders/' + pedido.correlationId, (r, xhr) => {
//             let pedidoRecebido = xhr.responseJSON;
//             salvarPedido(xhr.responseJSON);
//         }, (r, xhr) => {
//             setRetorno('GPD-1: Não foi possível receber as informações do pedido.', 'danger');
//         });
//     }
//     /**
//      * 
//      */
//     getPedido();
// }
// /**
//  * 
//  * Estágio 2
//  * Buscar eventos
//  * 
//  */
// let ifoodGetPedidos = () => integracaoIfood('<?= $cfg_i['ifood_usuario']; ?>', '<?= $cfg_i['ifood_senha']; ?>', '<?= $cfg_i['ifood_merchantId']; ?>', token => {
//     if (!token) {
//         setRetorno('IGP-1: Não foi possível gerar o pedido.', 'danger');
//         return;
//     }
//     setSubmit({
//         dados: {},
//         requisicao: "GET",
//         headers: {
//             "Authorization": "bearer " + token,
//             "Content-Type": "application/json",
//             "Cache-Control": "no-cache",
//         },
//         loading: () => { },
//     }, 'https://pos-api.ifood.com.br/v3.0/events:polling', (r, xhr) => {
//         let pedidos = xhr.responseJSON;
//         if (pedidos.length > 0) {
//             /**
//              * 
//              */
//             let tempDatas = [];
//             let tempPedidos = {};
//             pedidos.map(pedido => {
//                 let data = new Date(pedido.createdAt);
//                 tempDatas.push(data.getTime());
//                 tempPedidos[data.getTime()] = pedido;
//             });
//             /**
//              * 
//              */
//             tempDatas.sort((a, b) => {
//                 return a - b;
//             });
//             /**
//              * 
//              */
//             tempDatas.map(data => {
//                 gerarPedido(token, tempPedidos[data]);
//             });
//         }
//     }, (r, xhr) => { });
// });
// /**
//  *
//  */
// notificacoes();
// setInterval(notificacoes, 60000);
// if (ENTREGAS && IFOOD) {
//     ifoodGetPedidos();
//     setInterval(ifoodGetPedidos, 30000);
// }