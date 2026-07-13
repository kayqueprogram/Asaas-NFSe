# Criar Nota Fiscal Avulsa

A emissão de nota fiscal avulsa (ou sob demanda) ocorre de forma independente de uma cobrança no Asaas. É útil quando você realiza vendas por outros meios de pagamento e deseja centralizar a emissão fiscal no Asaas.

## Endpoint
`POST /v3/invoices`

## Cabeçalhos Necessários
- `access_token`: Sua chave de API privada do Asaas.
- `Content-Type`: `application/json`

## Parâmetros do Payload

| Campo | Tipo | Obrigatório | Descrição |
| :--- | :--- | :--- | :--- |
| `customer` | String | Sim | ID do cliente cadastrado no Asaas. |
| `serviceDescription` | String | Sim | Descrição do serviço que constará na nota. |
| `value` | Decimal | Sim | Valor total dos serviços prestados. |
| `deductions` | Decimal | Não | Deduções permitidas por lei municipal. |
| `effectiveDate` | String | Sim | Data de competência da nota (AAAA-MM-DD). |
| `municipalServiceCode`| String | Não | Código do serviço municipal (sobrescreve o padrão). |

### Exemplo de Requisição (cURL)

```bash
curl --request POST \
  --url https://api.asaas.com/v3/invoices \
  --header 'Content-Type: application/json' \
  --header 'access_token: $API_KEY' \
  --data '{
    "customer": "cus_123456789",
    "serviceDescription": "Desenvolvimento de software sob medida para plataforma web.",
    "value": 1500.00,
    "effectiveDate": "2026-07-13",
    "municipalServiceCode": "1.05"
  }'
```

### Exemplo de Resposta

```json
{
  "object": "invoice",
  "id": "inv_987654321",
  "status": "PENDING",
  "customer": "cus_123456789",
  "value": 1500.00,
  "serviceDescription": "Desenvolvimento de software sob medida para plataforma web.",
  "effectiveDate": "2026-07-13",
  "xmlUrl": null,
  "pdfUrl": null
}
```

::: tip STATUS INICIAL
Toda nota fiscal avulsa recém-criada assume o status `PENDING` (ou `DRAFT` se configurada para rascunho), significando que ela entrou na fila de processamento assíncrono para comunicação com a prefeitura.
:::
