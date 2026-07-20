<template>
  <div class="sandbox-tester-card">
    <div class="tester-header">
      <div class="header-icon">⚙️</div>
      <div class="header-title">
        <h3>Testador de Integração Sandbox</h3>
        <p>Gere códigos ou faça um teste de requisição real da sua chave API</p>
      </div>
    </div>

    <div class="input-group">
      <label for="apiKey">Sua API Key de Sandbox:</label>
      <div class="input-wrapper">
        <input 
          :type="showKey ? 'text' : 'password'" 
          id="apiKey" 
          v-model="apiKey" 
          placeholder="Insira sua chave (ex: $aesaas...)"
          class="tester-input"
        />
        <button @click="showKey = !showKey" class="toggle-btn" type="button">
          {{ showKey ? 'Ocultar' : 'Mostrar' }}
        </button>
      </div>
      <small class="help-text">
        As chaves de Sandbox geralmente iniciam com <code>$aesaas</code>.
      </small>
    </div>

    <div class="action-buttons">
      <button 
        @click="runTestRequest" 
        :disabled="loading || !apiKey" 
        class="test-request-btn"
      >
        <span v-if="loading">Enviando Requisição...</span>
        <span v-else>🚀 Testar Requisição Real</span>
      </button>
    </div>

    <!-- Request Status and Response Display -->
    <div v-if="testResult" class="test-result-section">
      <div :class="['status-badge', testResult.success ? 'success' : 'error']">
        Status: {{ testResult.status }} {{ testResult.success ? '(Sucesso)' : '(Erro)' }}
      </div>
      <div class="response-title">Resposta da API (GET /v3/invoiceSettings):</div>
      <div class="code-container response-code">
        <pre><code>{{ testResult.response }}</code></pre>
      </div>
    </div>

    <div class="tabs">
      <button 
        v-for="tab in tabs" 
        :key="tab.id" 
        @click="activeTab = tab.id"
        :class="['tab-btn', { active: activeTab === tab.id }]"
      >
        {{ tab.label }}
      </button>
    </div>

    <div class="code-container">
      <pre><code>{{ generatedCode }}</code></pre>
      <button @click="copyCode" class="copy-btn">
        {{ copied ? 'Copiado!' : 'Copiar Código' }}
      </button>
    </div>

    <div class="security-warning">
      <strong>⚠️ Nota de Segurança:</strong> Para possibilitar testes diretamente do seu navegador nesta documentação, a requisição passa por um Proxy CORS seguro e temporário. <strong>Nunca insira sua chave de Produção aqui!</strong> Use apenas chaves de Sandbox.
    </div>
  </div>
</template>

<script>
export default {
  name: 'SandboxTester',
  data() {
    return {
      apiKey: '',
      showKey: false,
      activeTab: 'curl',
      copied: false,
      loading: false,
      testResult: null,
      tabs: [
        { id: 'curl', label: 'cURL' },
        { id: 'js', label: 'JavaScript (Node)' },
        { id: 'python', label: 'Python' }
      ]
    };
  },
  computed: {
    displayKey() {
      return this.apiKey.trim() || 'SUA_API_KEY_AQUI';
    },
    generatedCode() {
      if (this.activeTab === 'curl') {
        return `curl --request GET \\
  --url https://sandbox.asaas.com/api/v3/invoiceSettings \\
  --header 'accept: application/json' \\
  --header 'access_token: ${this.displayKey}'`;
      }
      if (this.activeTab === 'js') {
        return `const fetch = require('node-fetch');

const options = {
  method: 'GET',
  headers: {
    accept: 'application/json',
    access_token: '${this.displayKey}'
  }
};

fetch('https://sandbox.asaas.com/api/v3/invoiceSettings', options)
  .then(response => response.json())
  .then(data => console.log(data))
  .catch(err => console.error(err));`;
      }
      if (this.activeTab === 'python') {
        return `import requests

url = "https://sandbox.asaas.com/api/v3/invoiceSettings"

headers = {
    "accept": "application/json",
    "access_token": "${this.displayKey}"
}

response = requests.get(url, headers=headers)
print(response.json())`;
      }
      return '';
    }
  },
  methods: {
    async copyCode() {
      try {
        await navigator.clipboard.writeText(this.generatedCode);
        this.copied = true;
        setTimeout(() => {
          this.copied = false;
        }, 2000);
      } catch (err) {
        console.error('Falha ao copiar código: ', err);
      }
    },
    async runTestRequest() {
      if (!this.apiKey) return;
      this.loading = true;
      this.testResult = null;

      // Utilizando proxy CORS gratuito e estável
      const targetUrl = 'https://sandbox.asaas.com/api/v3/invoiceSettings';
      const proxyUrl = `https://corsproxy.io/?${encodeURIComponent(targetUrl)}`;

      try {
        const response = await fetch(proxyUrl, {
          method: 'GET',
          headers: {
            'accept': 'application/json',
            'access_token': this.apiKey.trim()
          }
        });

        const status = response.status;
        const data = await response.json().catch(() => null);

        this.testResult = {
          success: response.ok,
          status: status,
          response: data ? JSON.stringify(data, null, 2) : 'Sem corpo de resposta'
        };
      } catch (err) {
        this.testResult = {
          success: false,
          status: 'Erro de Conexão',
          response: JSON.stringify({ error: err.message, detail: 'Falha ao se comunicar com a API do Asaas através do proxy CORS.' }, null, 2)
        };
      } finally {
        this.loading = false;
      }
    }
  }
};
</script>

<style scoped>
.sandbox-tester-card {
  background-color: var(--c-bg-light, #1e1e24);
  border: 1px solid var(--c-border, #2f2f37);
  border-radius: 8px;
  padding: 1.5rem;
  margin: 1.5rem 0;
  color: var(--c-text, #e2e2e9);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.tester-header {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.header-icon {
  font-size: 2rem;
}

.header-title h3 {
  margin: 0;
  color: var(--c-text-accent, #5865f2);
  font-size: 1.25rem;
}

.header-title p {
  margin: 0.25rem 0 0 0;
  font-size: 0.85rem;
  opacity: 0.8;
}

.input-group {
  margin-bottom: 1.2rem;
}

.input-group label {
  display: block;
  font-weight: 600;
  font-size: 0.9rem;
  margin-bottom: 0.5rem;
}

.input-wrapper {
  display: flex;
  gap: 0.5rem;
}

.tester-input {
  flex-grow: 1;
  background-color: var(--c-bg, #0f0f11);
  border: 1px solid var(--c-border, #2f2f37);
  border-radius: 4px;
  color: #fff;
  padding: 0.6rem 0.8rem;
  font-size: 0.9rem;
  outline: none;
  font-family: monospace;
}

.tester-input:focus {
  border-color: var(--c-brand, #5865f2);
}

.toggle-btn {
  background-color: #3b4252;
  border: none;
  border-radius: 4px;
  color: #fff;
  padding: 0 1rem;
  font-size: 0.85rem;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.2s;
}

.toggle-btn:hover {
  background-color: #434c5e;
}

.help-text {
  display: block;
  margin-top: 0.4rem;
  font-size: 0.75rem;
  opacity: 0.7;
}

.action-buttons {
  margin-bottom: 1.5rem;
}

.test-request-btn {
  background-color: var(--c-brand, #0038e5);
  border: none;
  border-radius: 4px;
  color: #fff;
  padding: 0.7rem 1.5rem;
  font-size: 0.9rem;
  font-weight: 600;
  cursor: pointer;
  transition: opacity 0.2s;
  width: 100%;
}

.test-request-btn:hover:not(:disabled) {
  opacity: 0.9;
}

.test-request-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.test-result-section {
  margin-bottom: 1.5rem;
  border: 1px solid var(--c-border, #2f2f37);
  border-radius: 6px;
  padding: 1rem;
  background-color: var(--c-bg, #0f0f11);
}

.status-badge {
  display: inline-block;
  padding: 0.25rem 0.6rem;
  border-radius: 4px;
  font-size: 0.8rem;
  font-weight: 700;
  margin-bottom: 0.75rem;
}

.status-badge.success {
  background-color: rgba(16, 185, 129, 0.2);
  color: #10b981;
  border: 1px solid rgba(16, 185, 129, 0.3);
}

.status-badge.error {
  background-color: rgba(239, 68, 68, 0.2);
  color: #ef4444;
  border: 1px solid rgba(239, 68, 68, 0.3);
}

.response-title {
  font-size: 0.8rem;
  font-weight: 600;
  margin-bottom: 0.4rem;
  opacity: 0.9;
}

.response-code {
  background-color: #141416 !important;
}

.tabs {
  display: flex;
  gap: 0.5rem;
  border-bottom: 1px solid var(--c-border, #2f2f37);
  margin-bottom: 1rem;
}

.tab-btn {
  background: none;
  border: none;
  color: var(--c-text, #e2e2e9);
  padding: 0.5rem 1rem;
  font-size: 0.85rem;
  font-weight: 600;
  cursor: pointer;
  opacity: 0.7;
  border-bottom: 2px solid transparent;
  transition: all 0.2s;
}

.tab-btn.active {
  opacity: 1;
  color: var(--c-brand, #0038e5);
  border-bottom-color: var(--c-brand, #0038e5);
}

.code-container {
  position: relative;
  background-color: var(--c-bg, #0f0f11);
  border-radius: 6px;
  padding: 1rem;
  margin-bottom: 1rem;
}

.code-container pre {
  margin: 0;
  overflow-x: auto;
  font-family: Consolas, Monaco, monospace;
  font-size: 0.85rem;
  color: #f3f4f6;
  white-space: pre-wrap;
}

.copy-btn {
  position: absolute;
  top: 0.5rem;
  right: 0.5rem;
  background-color: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.15);
  border-radius: 4px;
  color: #fff;
  padding: 0.3rem 0.6rem;
  font-size: 0.75rem;
  cursor: pointer;
  transition: background-color 0.2s;
}

.copy-btn:hover {
  background-color: rgba(255, 255, 255, 0.2);
}

.security-warning {
  background-color: rgba(245, 158, 11, 0.1);
  border: 1px solid rgba(245, 158, 11, 0.25);
  border-radius: 6px;
  padding: 0.8rem;
  font-size: 0.8rem;
  color: #fbbf24;
  line-height: 1.4;
}
</style>
