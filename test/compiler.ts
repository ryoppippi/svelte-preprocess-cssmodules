import { preprocess } from 'svelte/compiler';
import { cssModules } from '../src';

type Params = {
	source: string;
	cssOptions: Parameters<typeof cssModules>[0];
	preprocessOptions: Parameters<typeof preprocess>[2];
};

export async function load({
	source,
	cssOptions,
	preprocessOptions,
}: Params) {
	const { code } = await preprocess(
		source,
		[cssModules(cssOptions)],
		preprocessOptions,
	);

	return code;
};
