# Configurações Iniciais

Antes de iniciar a emissão de notas fiscais de serviço (NFSe) via API, é necessário habilitar o serviço em sua conta Asaas e configurar as regras tributárias do seu município.

## 1. Ativação do Serviço

A ativação inicial do módulo de Notas Fiscais deve ser realizada diretamente pelo Painel do Asaas:

1. Acesse **Configurações da Conta** > **Notas Fiscais**.
2. Siga o passo a passo para envio da documentação de credenciamento municipal e certificado digital (se exigido por sua prefeitura).
3. Aguarde a homologação da conta pelo time do Asaas.

## 2. Ambientes da API

O Asaas disponibiliza dois ambientes para desenvolvimento e homologação de integrações. Cada ambiente possui suas próprias credenciais (`access_token`):

*   **Sandbox (Homologação / Testes)**:
    *   URL Base: `https://sandbox.asaas.com/api`
    *   *Nota: Ideal para testar o fluxo de criação de notas sem gerar efeitos fiscais reais.*
*   **Produção**:
    *   URL Base: `https://api.asaas.com`
    *   *Nota: Todas as operações realizadas aqui geram emissões de valor legal perante as prefeituras.*

---

## 3. Configurações Municipais via API

As configurações de alíquotas de impostos, códigos de serviço municipais e federais (LC 116) podem ser visualizadas ou editadas via API.

O Asaas permite a emissão de duas maneiras:
1.  **Emissão via Prefeitura (Fluxo Padrão):** Realizada diretamente através do webservice homologado do seu município.
2.  **Emissão via Portal Nacional:** Obrigatória para alguns perfis de empresas (MEI e outros enquadramentos específicos).

### Ativação do Portal Nacional
Caso sua empresa precise emitir notas pelo Portal Nacional, habilite a flag correspondente nas configurações fiscais do Asaas:
*   No menu **Notas Fiscais > Configurações** no Painel, vá à aba **Informações Fiscais** e selecione "Sim" em **"Emito NFS-e pelo Portal Nacional"**.
*   *Nota:* Ao alterar o portal emissor para o Portal Nacional, a listagem automática de serviços municipais via API pode ficar indisponível. Desse modo, o código do serviço deve ser informado manualmente através do parâmetro `municipalServiceCode` ao agendar uma nota.

### Endpoint de Configuração Fiscal
`GET /v3/invoiceSettings`

Esta chamada retorna as configurações fiscais configuradas para a sua conta corporativa.

Para maiores detalhes e informações de listagem de municípios suportados, consulte a referência oficial em [Listar Configurações Municipais no Asaas](https://docs.asaas.com/reference/listar-configuracoes-municipais).

**Exemplo de resposta:**
```json
{
  "object": "invoiceSettings",
  "enabled": true,
  "deductApp": true,
  "municipalServiceCode": "1.05",
  "municipalServiceName": "Licenciamento ou cessão de direito de uso de programas de computação",
  "tax": 3.00,
  "issIncludedInValue": true,
  "cnae": "6202-3/00"
}
```

::: warning ATENÇÃO
Os campos `municipalServiceCode` e `cnae` devem estar exatamente de acordo com o cadastro da sua empresa na prefeitura ou no Portal Nacional para evitar rejeições na emissão.
:::

---

## 4. Status das Notas Fiscais

Durante o fluxo assíncrono de comunicação com a prefeitura, a Nota Fiscal assume diferentes status na API do Asaas:

| Status | Descrição |
| :--- | :--- |
| `DRAFT` | Nota salva em modo rascunho (não enviada para a prefeitura). |
| `PENDING` | Nota em fila de espera para envio à prefeitura. |
| `SENDING` | Nota em processo de transmissão de dados com o município. |
| `SENT` | XML da nota fiscal enviado com sucesso à prefeitura. |
| `SYNCHRONIZED` | **Emissão Concluída.** Nota fiscal autorizada, PDF e XML disponíveis para consulta. |
| `ERROR` | **Erro de Emissão.** Rejeitada pela prefeitura (detalhes no campo `observations`). |
| `CANCELED` | Nota fiscal cancelada com sucesso na prefeitura. |
| `CANCELLATION_PENDING` | Solicitação de cancelamento em processamento. |
| `CANCELLATION_ERROR` | Falha ao tentar cancelar a nota fiscal na prefeitura. |

