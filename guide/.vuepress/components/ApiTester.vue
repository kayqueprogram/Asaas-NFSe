<template>
  <div class="api-tester-card">
    <div class="tester-header">
      <div class="method-badge" :class="method.toLowerCase()">{{ method }}</div>
      <div class="header-title">
        <h4>{{ description || 'Testador de Endpoint' }}</h4>
        <code>{{ endpoint }}</code>
      </div>
    </div>

    <!-- API Key Input (Shared via localStorage) -->
    <div class="input-group">
      <label for="apiKey">Sua API Key de Sandbox:</label>
      <div class="input-wrapper">
        <input 
          :type="showKey ? 'text' : 'password'" 
          v-model="apiKey" 
          placeholder="Insira sua chave (ex: $aesaas...)"
          class="tester-input"
          @input="saveApiKey"
        />
        <button @click="showKey = !showKey" class="toggle-btn" type="button">
          {{ showKey ? 'Ocultar' : 'Mostrar' }}
        </button>
      </div>
    </div>

    <!-- Request Body Input (For POST/PUT methods) -->
    <div v-if="method.toUpperCase() === 'POST' || method.toUpperCase() === 'PUT'" class="input-group">
      <label for="payload">Corpo da Requisição (JSON):</label>
      <textarea 
        v-model="payloadString" 
        rows="8" 
        class="tester-textarea"
        placeholder="{ ... }"
      ></textarea>
    </div>

    <div class="action-buttons">
      <button 
        @click="runRequest" 
        :disabled="loading || !apiKey" 
        class="test-request-btn"
      >
        <span v-if="loading">Enviando Requisição...</span>
        <span v-else>🚀 Enviar Requisição de Teste</span>
      </button>
    </div>

    <!-- Response Display -->
    <div v-if="testResult" class="test-result-section">
      <div :class="['status-badge', testResult.success ? 'success' : 'error']">
        Status: {{ testResult.status }} {{ testResult.success ? '(Sucesso)' : '(Erro)' }}
      </div>
      <div class="response-title">Resposta do Servidor Asaas:</div>
      <div class="code-container response-code">
        <pre><code>{{ testResult.response }}</code></pre>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ApiTester',
  props: {
    method: {
      type: String,
      default: 'GET'
    },
    endpoint: {
      type: String,
      required: true
    },
    defaultPayload: {
      type: [Object, String],
      default: () => ({})
    },
    description: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      apiKey: '',
      showKey: false,
      payloadString: '',
      loading: false,
      testResult: null
    };
  },
  mounted() {
    // Carregar chave salva no localStorage
    this.apiKey = localStorage.getItem('asaas_sandbox_api_key') || '';
    
    // Iniciar payload padrão
    if (typeof this.defaultPayload === 'object') {
      this.payloadString = JSON.stringify(this.defaultPayload, null, 2);
    } else {
      this.payloadString = this.defaultPayload;
    }

    // Escutar eventos de atualização de chave de outras instâncias na página
    window.addEventListener('storage', this.handleStorageChange);
  },
  beforeUnmount() {
    window.removeEventListener('storage', this.handleStorageChange);
  },
  methods: {
    saveApiKey() {
      localStorage.setItem('asaas_sandbox_api_key', this.apiKey);
    },
    handleStorageChange(event) {
      if (event.key === 'asaas_sandbox_api_key') {
        this.apiKey = event.newValue || '';
      }
    },
    async runRequest() {
      if (!this.apiKey) return;
      this.loading = true;
      this.testResult = null;

      // Base URL de Sandbox do Asaas
      const targetUrl = `https://api-sandbox.asaas.com${this.endpoint}`;
      const proxyUrl = `https://corsproxy.io/?${encodeURIComponent(targetUrl)}`;

      const options = {
        method: this.method.toUpperCase(),
        headers: {
          'accept': 'application/json',
          'access_token': this.apiKey.trim()
        }
      };

      // Incluir body se for POST/PUT
      if (options.method === 'POST' || options.method === 'PUT') {
        options.headers['Content-Type'] = 'application/json';
        try {
          // Validar se o JSON é válido antes de enviar
          const parsed = JSON.parse(this.payloadString);
          options.body = JSON.stringify(parsed);
        } catch (e) {
          this.testResult = {
            success: false,
            status: 'Erro no JSON',
            response: JSON.stringify({ error: 'O corpo da requisição não contém um JSON válido.' }, null, 2)
          };
          this.loading = false;
          return;
        }
      }

      try {
        const response = await fetch(proxyUrl, options);
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
.api-tester-card {
  background-color: var(--c-bg-light, #1e1e24);
  border: 1px solid var(--c-border, #2f2f37);
  border-radius: 8px;
  padding: 1.25rem;
  margin: 1.5rem 0;
  color: var(--c-text, #e2e2e9);
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.12);
}

.tester-header {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 1.25rem;
}

.method-badge {
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  font-size: 0.75rem;
  font-weight: 800;
  color: #fff;
  text-transform: uppercase;
}

.method-badge.get {
  background-color: #10b981;
}

.method-badge.post {
  background-color: #3b82f6;
}

.method-badge.put {
  background-color: #f59e0b;
}

.method-badge.delete {
  background-color: #ef4444;
}

.header-title h4 {
  margin: 0;
  font-size: 1.05rem;
}

.header-title code {
  font-size: 0.8rem;
  opacity: 0.85;
}

.input-group {
  margin-bottom: 1rem;
}

.input-group label {
  display: block;
  font-weight: 600;
  font-size: 0.85rem;
  margin-bottom: 0.35rem;
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
  padding: 0.5rem 0.7rem;
  font-size: 0.85rem;
  outline: none;
  font-family: monospace;
}

.tester-input:focus {
  border-color: var(--c-brand, #0038e5);
}

.tester-textarea {
  width: 100%;
  box-sizing: border-box;
  background-color: var(--c-bg, #0f0f11);
  border: 1px solid var(--c-border, #2f2f37);
  border-radius: 4px;
  color: #a7adba;
  padding: 0.6rem;
  font-size: 0.85rem;
  font-family: Consolas, Monaco, monospace;
  outline: none;
  resize: vertical;
}

.tester-textarea:focus {
  border-color: var(--c-brand, #0038e5);
}

.toggle-btn {
  background-color: #3b4252;
  border: none;
  border-radius: 4px;
  color: #fff;
  padding: 0 0.75rem;
  font-size: 0.8rem;
  font-weight: 600;
  cursor: pointer;
}

.toggle-btn:hover {
  background-color: #434c5e;
}

.test-request-btn {
  background-color: var(--c-brand, #0038e5);
  border: none;
  border-radius: 4px;
  color: #fff;
  padding: 0.6rem 1.25rem;
  font-size: 0.85rem;
  font-weight: 600;
  cursor: pointer;
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
  margin-top: 1.25rem;
  border: 1px solid var(--c-border, #2f2f37);
  border-radius: 6px;
  padding: 0.85rem;
  background-color: var(--c-bg, #0f0f11);
}

.status-badge {
  display: inline-block;
  padding: 0.2rem 0.5rem;
  border-radius: 4px;
  font-size: 0.75rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
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
  font-size: 0.75rem;
  font-weight: 600;
  margin-bottom: 0.25rem;
  opacity: 0.9;
}

.code-container {
  background-color: #141416 !important;
  border-radius: 4px;
  padding: 0.75rem;
  overflow-x: auto;
}

.code-container pre {
  margin: 0;
  font-family: Consolas, Monaco, monospace;
  font-size: 0.8rem;
  color: #f3f4f6;
  white-space: pre-wrap;
}
</style>
