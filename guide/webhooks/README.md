# Webhooks e Atualizações de Status

A comunicação com as prefeituras para emissão de notas é assíncrona. O tempo de resposta municipal pode variar de alguns segundos a horas. Por isso, a melhor maneira de monitorar o status de suas notas fiscais de serviço é configurando um **Webhook** para receber notificações em tempo real.

## Eventos de Notas Fiscais

No webhook do Asaas, você deve escutar os seguintes eventos chave para notas fiscais de serviço:

| Evento | Descrição |
| :--- | :--- |
| `INVOICE_CREATED` | A nota fiscal foi gerada e agendada na fila do Asaas. |
| `INVOICE_UPDATED` | Houve alguma alteração nos dados do rascunho da nota. |
| `INVOICE_SYNCHRONIZED` | **Sucesso.** A prefeitura autorizou e emitiu a nota. O XML e PDF já estão disponíveis. |
| `INVOICE_ERROR` | **Erro.** Houve rejeição da prefeitura ou erro cadastral. O erro descritivo é enviado. |
| `INVOICE_CANCELED` | A nota fiscal foi devidamente cancelada. |

---

### Exemplo de Payload Recebido (Evento: `INVOICE_SYNCHRONIZED`)

Quando a prefeitura autoriza a emissão da sua nota fiscal, seu endpoint de webhook receberá um POST com o seguinte formato:

```json
{
  "event": "INVOICE_SYNCHRONIZED",
  "invoice": {
    "id": "inv_987654321",
    "status": "SYNCHRONIZED",
    "value": 1500.00,
    "pdfUrl": "https://api.asaas.com/v3/invoices/inv_987654321/pdf",
    "xmlUrl": "https://api.asaas.com/v3/invoices/inv_987654321/xml",
    "invoiceNumber": "2026071300054",
    "validationCode": "A7B8C9D0"
  }
}
```

::: tip TRATAMENTO DE ERROS
Ao receber o evento `INVOICE_ERROR`, verifique o campo `"observations"` ou `"errors"` do payload para ler a mensagem descritiva fornecida pela prefeitura (ex: "Alíquota do ISS informada incorretamente para o município").
:::
