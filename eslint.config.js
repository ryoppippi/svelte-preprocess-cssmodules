import { ryoppippi } from '@ryoppippi/eslint-config';

export default ryoppippi({
	tailwind: false,
	svelte: true,
	ignores: ['test/**', 'example/**'],
	typescript: {
		tsconfigPath: './tsconfig.json',
	},
});
