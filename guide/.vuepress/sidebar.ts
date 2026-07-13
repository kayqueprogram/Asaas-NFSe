export default {
	'/': [
		{
			text: 'Home',
			children: [
				'/',
			],
		},
		{
			text: 'Primeiros Passos',
			children: [
				'/primeiros-passos/configuracoes.md',
			],
		},
		{
			text: 'Emissão de Notas',
			children: [
				'/emissao/criar-nota.md',
				'/emissao/vinculo-cobranca.md',
			],
		},
		{
			text: 'Webhooks & Eventos',
			children: [
				'/webhooks/',
			],
		},
		{
			text: 'Consulta & Cancelamento',
			children: [
				'/consulta/consultar-cancelar.md',
			],
		},
	],
};
