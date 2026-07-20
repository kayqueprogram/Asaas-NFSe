import { defineClientAppEnhance } from '@vuepress/client';
import SandboxTester from './components/SandboxTester.vue';
import ApiTester from './components/ApiTester.vue';

export default defineClientAppEnhance(({ app }) => {
	app.component('SandboxTester', SandboxTester);
	app.component('ApiTester', ApiTester);
});
