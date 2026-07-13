# Integração de NFSe com a API do Asaas

Bem-vindo ao guia de integração para emissão de **Notas Fiscais de Serviço Eletrônicas (NFSe)** através da API do Asaas.

Esta documentação tem como objetivo orientar desenvolvedores na parametrização do ambiente, na emissão manual de notas, no vínculo de emissão automática com cobranças, no recebimento de atualizações por Webhooks e no cancelamento de notas.

## O que é a emissão de nota de serviço no Asaas?

O Asaas possibilita que você automatize toda a emissão de notas fiscais de serviço decorrentes das cobranças geradas na plataforma ou faça emissões de forma avulsa. A comunicação com a prefeitura do município da sua conta é feita de forma assíncrona e transparente por meio das nossas integrações.

## Fluxo Geral de Emissão

```
[Sua Aplicação]
      │
      ▼ (Cria Nota ou Cobrança com Nota)
 [API Asaas]
      │
      ▼ (Processa e Envia à Prefeitura)
 [Prefeitura]
      │
      ├─► [Status: SYNCHRONIZED]  ──► (Gera Webhook) ──► [Sua Aplicação]
      └─► [Status: ERROR]         ──► (Gera Webhook) ──► [Sua Aplicação]
```

## Navegação Rápida

*   **[Configurações Iniciais](/primeiros-passos/configuracoes.md)**: Como ativar o serviço e configurar os dados municipais.
*   **[Criar Notas Fiscais](/emissao/criar-nota.md)**: Requisição detalhada para gerar uma nota fiscal de serviço avulsa.
*   **[Vincular a Cobranças](/emissao/vinculo-cobranca.md)**: Como agendar emissões automáticas atreladas a pagamentos.
*   **[Webhooks & Eventos](/webhooks/)**: Tratar retornos assíncronos da prefeitura.
*   **[Consultar e Cancelar](/consulta/consultar-cancelar.md)**: Obter arquivos XML/PDF ou solicitar cancelamento de notas fiscais.
