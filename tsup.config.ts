import { defineConfig } from 'tsup';
import unpluginTypia from '@ryoppippi/unplugin-typia/esbuild';

export default defineConfig({
	entry: ['src/index.ts'],
	target: 'esnext',
	format: ['esm'],
	clean: true,
	dts: true,
	treeshake: true,
	plugins: [unpluginTypia()],
});
