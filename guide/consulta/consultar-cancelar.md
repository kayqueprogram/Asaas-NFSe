# Consulta e Cancelamento

Após a emissão da nota fiscal de serviço, você pode realizar consultas para obter metadados, links de download, ou solicitar o cancelamento da nota caso o serviço tenha sido desfeito ou faturado incorretamente.

## 1. Consultar Nota Fiscal de Serviço

Você pode buscar os detalhes de uma nota fiscal pelo ID retornado na criação.

### Endpoint
`GET /v3/invoices/{id}`

**Exemplo de resposta (Nota Emitida):**
```json
{
  "object": "invoice",
  "id": "inv_987654321",
  "status": "SYNCHRONIZED",
  "customer": "cus_123456789",
  "value": 1500.00,
  "invoiceNumber": "2026071300054",
  "pdfUrl": "https://api.asaas.com/v3/invoices/inv_987654321/pdf",
  "xmlUrl": "https://api.asaas.com/v3/invoices/inv_987654321/xml"
}
```

---

## 2. Cancelar Nota Fiscal

O cancelamento de uma nota fiscal depende das regras fiscais e prazos estabelecidos pela prefeitura do seu município. Se permitido, você pode disparar a solicitação diretamente pela API.

### Endpoint
`POST /v3/invoices/{id}/cancel`

### Exemplo de Requisição (cURL)

```bash
curl --request POST \
  --url https://api.asaas.com/v3/invoices/inv_987654321/cancel \
  --header 'access_token: $API_KEY'
```

### Exemplo de Resposta (Status: `CANCELED`)

```json
{
  "object": "invoice",
  "id": "inv_987654321",
  "status": "CANCELED",
  "value": 1500.00,
  "observations": "Solicitação de cancelamento enviada e homologada pela prefeitura."
}
```

::: warning REJEIÇÃO DE CANCELAMENTO
Se o prazo legal do seu município tiver expirado, a API do Asaas retornará um código `400 Bad Request` com o erro e justificativa retornados pela prefeitura.
:::
