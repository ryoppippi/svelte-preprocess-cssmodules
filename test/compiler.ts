import path from 'node:path';
import { preprocess } from 'svelte/compiler';
import { cssModules } from '../src';

type Params = {
	source: string;
	cssPreprocessorOptions: Parameters<typeof cssModules>[0];
	preprocessOptions: Parameters<typeof preprocess>[2];
};

export async function compiler({
	source,
	cssPreprocessorOptions,
	preprocessOptions,
}: Params) {
	const { code } = await preprocess(
		source,
		[cssModules(cssPreprocessorOptions)],
		{
			...preprocessOptions,
			filename: path.resolve(__dirname, './test/App.svelte'),
		},
	);

	return code;
};
