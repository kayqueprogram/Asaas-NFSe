# Emissão Vinculada a Cobranças

O Asaas permite agendar a emissão automática de notas fiscais atreladas a cobranças (boletos, Pix ou cartão de crédito). Dessa forma, a nota fiscal é gerada e enviada ao cliente sem intervenção manual.

## Configuração do Vínculo

Para emitir notas vinculadas, você deve passar o parâmetro `invoice` dentro do payload de criação da cobrança (`POST /v3/payments`).

### Regras de Agendamento (`updatePaymentInvoiceConfig`)

Você pode escolher quando a nota fiscal de serviço será gerada com base no campo `updatePaymentInvoiceConfig` ou definindo a regra de envio:

- `ON_PAYMENT`: A nota será gerada no momento em que a cobrança for paga.
- `ON_DUE_DATE`: A nota será gerada na data de vencimento da cobrança.
- `BEFORE_DUE_DATE`: A nota será gerada X dias antes do vencimento.

---

### Exemplo de Requisição (Criar Cobrança com Agendamento de Nota)

```bash
curl --request POST \
  --url https://api.asaas.com/v3/payments \
  --header 'Content-Type: application/json' \
  --header 'access_token: $API_KEY' \
  --data '{
    "customer": "cus_123456789",
    "billingType": "PIX",
    "value": 350.00,
    "dueDate": "2026-07-20",
    "description": "Mensalidade do serviço de infraestrutura",
    "invoice": {
      "municipalServiceCode": "1.05",
      "updatePaymentInvoiceConfig": "ON_PAYMENT"
    }
  }'
```

Ao efetuar o pagamento da cobrança PIX criada acima, o Asaas criará e enviará automaticamente a nota de serviço para a prefeitura no mesmo instante.
