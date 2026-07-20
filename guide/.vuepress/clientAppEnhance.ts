import { defineClientAppEnhance } from '@vuepress/client';
import SandboxTester from './components/SandboxTester.vue';

export default defineClientAppEnhance(({ app }) => {
	app.component('SandboxTester', SandboxTester);
});
