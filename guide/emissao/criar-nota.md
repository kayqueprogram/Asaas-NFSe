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
| `useTaxSystemReformNT007`| Boolean | Não | Habilita antecipadamente a reforma de PIS/COFINS (NT-007). |
| `taxes` | Object | Não | Parâmetros de tributos e retenções fiscais da NFS-e. |

### Configuração de Impostos e Retenções (`taxes`)

O objeto `taxes` permite configurar detalhadamente os tributos aplicados e retidos na nota fiscal:

*   `iss` (Decimal): Percentual da alíquota do ISS.
*   `retainIss` (Boolean): Define se o ISS será retido na fonte.
*   `cofins` (Decimal): Percentual da alíquota de COFINS.
*   `pis` (Decimal): Percentual da alíquota de PIS.
*   `csll` (Decimal): Percentual da alíquota de CSLL.
*   `inss` (Decimal): Percentual da alíquota de INSS.
*   `ir` (Decimal): Percentual da alíquota de IR.

#### Regras de Retenção de PIS/COFINS (NT-007)
A partir do enquadramento da **Nota Técnica NT-007** (obrigatória a partir de 30/06/2026 para empresas do **Regime Normal**), novos campos tornaram-se obrigatórios ao emitir notas via Portal Nacional. Você deve preenchê-los dentro do objeto `taxes`:

*   `pisCofinsRetentionType` (String): Código da retenção de PIS/COFINS.
*   `pisCofinsTaxStatus` (String): Código da situação tributária.

---

### Exemplo de Requisição com Impostos (cURL)

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
    "municipalServiceCode": "1.05",
    "useTaxSystemReformNT007": true,
    "taxes": {
      "iss": 2.00,
      "retainIss": false,
      "pis": 0.65,
      "cofins": 3.00,
      "pisCofinsRetentionType": "1",
      "pisCofinsTaxStatus": "01"
    }
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
  "taxes": {
    "iss": 2.00,
    "retainIss": false,
    "pis": 0.65,
    "cofins": 3.00,
    "pisCofinsRetentionType": "1",
    "pisCofinsTaxStatus": "01"
  },
  "xmlUrl": null,
  "pdfUrl": null
}
```

---

## 3. Testar Emissão de Nota Fiscal Avulsa (Sandbox)

Utilize o testador interativo abaixo para enviar uma chamada real de criação de nota fiscal para o ambiente de testes do Asaas. Você pode alterar as informações do JSON abaixo (certifique-se de usar um ID de cliente válido criado no seu ambiente de Sandbox).

<ApiTester 
  method="POST" 
  endpoint="/v3/invoices" 
  description="Criar Nota Fiscal Avulsa" 
  :defaultPayload="{
    'customer': 'cus_123456789',
    'serviceDescription': 'Desenvolvimento de software sob medida para plataforma web.',
    'value': 150.00,
    'effectiveDate': '2026-07-20',
    'municipalServiceCode': '1.05'
  }" 
/>

::: tip STATUS INICIAL
Toda nota fiscal avulsa recém-criada assume o status `PENDING` (ou `DRAFT` se configurada para rascunho), significando que ela entrou na fila de processamento assíncrono para comunicação com a prefeitura.
:::
