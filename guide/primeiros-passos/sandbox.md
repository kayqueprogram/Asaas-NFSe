# Ambiente de Sandbox (Testes)

O **Sandbox** do Asaas é um ambiente de testes completo e isolado do ambiente de Produção. Ele foi desenvolvido para que você possa homologar toda a sua integração de Notas Fiscais e cobranças sem movimentar valores reais.

---

## 1. Pontos Importantes do Sandbox

Com base nas [Dúvidas Frequentes do Sandbox do Asaas](https://docs.asaas.com/docs/duvidas-frequentes-sandbox), tenha em mente as seguintes regras de funcionamento do ambiente de homologação:

*   **Isolamento Completo:** A conta, chaves de API (`access_token`), dados de clientes e configurações criados em Sandbox **não** possuem qualquer vínculo com a Produção.
*   **Sem Notificações para Clientes:** O envio de e-mails, SMS e mensagens de voz para os clientes está desabilitado no Sandbox para evitar que contatos de teste sejam incomodados.
*   **Pagamentos Simulados:** Você não conseguirá pagar boletos ou QR Codes Pix gerados no Sandbox utilizando aplicativos bancários reais. A simulação do pagamento deve ser feita via Painel do Asaas Sandbox ou usando os endpoints de simulação da API.
*   **Webhooks Ativos:** O disparo de Webhooks para a sua aplicação funciona normalmente. É altamente recomendado testar o fluxo completo de recebimento do evento `INVOICE_SYNCHRONIZED` ou `INVOICE_ERROR` em Sandbox.
*   **Saldo Fictício:** Você pode simular saldo na sua conta de testes criando uma cobrança em nome de um cliente e confirmando o pagamento dela de forma simulada no painel.

---

## 2. Testador de API Key (Sandbox)

Utilize a caixa de ferramentas interativa abaixo para gerar amostras rápidas de código usando a sua chave de API Sandbox. Insira a sua chave para atualizar os blocos dinamicamente.

<SandboxTester />

---

## 3. Consultar Identificadores de Clientes (Sandbox)

Para realizar testes de emissão de notas ou cobranças nas outras páginas, você precisará do identificador de API do seu cliente (que inicia com `cus_`). Use a ferramenta abaixo para listar os clientes cadastrados no seu painel e copiar o ID:

<ApiTester 
  method="GET" 
  endpoint="/v3/customers?limit=5" 
  description="Listar Clientes Cadastrados" 
/>
