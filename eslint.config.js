import { ryoppippi } from '@ryoppippi/eslint-config';

export default ryoppippi({
	tailwind: false,
	svelte: true,
	ignores: ['example/**'],
	typescript: {
		tsconfigPath: './tsconfig.json',
	},
});
