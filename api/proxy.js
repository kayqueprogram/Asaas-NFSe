export default async function handler(req, res) {
  // Configurações de CORS para responder requisições de desenvolvimento se necessário
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, access_token'
  );

  // Responder requisições OPTIONS do preflight de CORS
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  const { endpoint } = req.query;
  if (!endpoint) {
    res.status(400).json({ error: 'Parâmetro endpoint não informado' });
    return;
  }

  // Monta a URL final apontando para o Sandbox do Asaas
  const targetUrl = `https://api-sandbox.asaas.com${endpoint}`;

  try {
    const headers = {
      'accept': 'application/json',
      'access_token': req.headers.access_token || ''
    };

    if (req.headers['content-type']) {
      headers['Content-Type'] = req.headers['content-type'];
    }

    const fetchOptions = {
      method: req.method,
      headers
    };

    // Repassar o body se for POST ou PUT
    if (req.method === 'POST' || req.method === 'PUT') {
      fetchOptions.body = JSON.stringify(req.body);
    }

    const response = await fetch(targetUrl, fetchOptions);
    const status = response.status;
    const data = await response.json().catch(() => null);

    res.status(status).json(data);
  } catch (error) {
    res.status(500).json({ error: error.message, detail: 'Erro interno no Proxy Vercel' });
  }
}
