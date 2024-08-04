import { describe, expect, it } from 'vitest';
import { compiler } from '../compiler.ts';

const source = '<style module="scoped">.red { color: red; }</style><span class="red">Red</span>';

describe('scoped Mode', () => {
	it('generate CSS Modules from HTML attributes, Replace CSS className', async () => {
		const output = await compiler({
			source,
			preprocessOptions: {
				localIdentName: '[local]-123',
			},
		});

		expect(output).toBe('<style module="scoped">.red-123 { color: red; }</style><span class="red-123">Red</span>');
	});

	it('avoid generated class to start with a non character', async () => {
		const output = await compiler({
			source,
			preprocessOptions: {
				localIdentName: '1[local]',
			},
		});
		expect(output).toBe('<style module="scoped">._1red { color: red; }</style><span class="_1red">Red</span>');
	});

	it('avoid generated class to end with a hyphen', async () => {
		const output = await compiler({
			source,
			preprocessOptions: {
				localIdentName: '[local]-',
			},
		});
		expect(output).toBe('<style module="scoped">.red { color: red; }</style><span class="red">Red</span>');
	});

	it('generate class with path token', async () => {
		const output = await compiler({
			source,
			preprocessOptions: {
				localIdentName: '[path][name]__[local]',
			},
		});
		expect(output).toBe('<style module="scoped">.test_App__red { color: red; }</style><span class="test_App__red">Red</span>');
	});

	it('replace directive', async () => {
		const output = await compiler({
			source: '<style module="scoped">.red { color: red; }</style><span class:red={true}>Red</span>',
			preprocessOptions: {
				localIdentName: '[local]-123',
			},
		});
		expect(output).toBe('<style module="scoped">.red-123 { color: red; }</style><span class:red-123={true}>Red</span>');
	});

	it('replace short hand directive', async () => {
		const output = await compiler({
			source: '<script>const red = true;</script><style module="scoped">.red { color: red; } .blue { color: blue; }</style><span class:red class:blue={red}>Red</span>',
			preprocessOptions: {
				localIdentName: '[local]-123',
			},
		});
		expect(output).toBe('<script>const red = true;</script><style module="scoped">.red-123 { color: red; } .blue-123 { color: blue; }</style><span class:red-123={red} class:blue-123={red}>Red</span>');
	});

	it('replace multiple classnames on attribute', async () => {
		const output = await compiler({
			source: '<style module="scoped">.red { color: red; } .bold { font-weight: bold }</style><span class="red bold">Red</span>',
			preprocessOptions: {
				localIdentName: '[local]-123',
			},
		});
		expect(output).toBe('<style module="scoped">.red-123 { color: red; } .bold-123 { font-weight: bold }</style><span class="red-123 bold-123">Red</span>');
	});

	it('replace classnames on conditional expression', async () => {
		const output = await compiler({
			source: `<style module="scoped">.red { color: red; } .bold { font-weight: bold }</style><span class="red {true ? 'bold' : 'red'} bold">Red</span>`,
			preprocessOptions: {
				localIdentName: '[local]-123',
			},
		});
		expect(output).toBe(`<style module="scoped">.red-123 { color: red; } .bold-123 { font-weight: bold }</style><span class="red-123 {true ? 'bold-123' : 'red-123'} bold-123">Red</span>`);
	});

	it('replace classname on component', async () => {
		const output = await compiler({
			source: `<script>import Button from './Button.svelte';</script><style module="scoped">.red { color: red; }</style><Button class="red" />`,
			preprocessOptions: {
				localIdentName: '[local]-123',
			},
		});
		expect(output).toBe(`<script>import Button from './Button.svelte';</script><style module="scoped">.red-123 { color: red; }</style><Button class="red-123" />`);
	});

	it('replace classname listed in <style> only', async () => {
		const output = await compiler({
			source: `<style module="scoped">.red { color: red; }</style><span class="red bold">Red</span>`,
			preprocessOptions: {
				localIdentName: '[local]-123',
			},
		});
		expect(output).toBe(`<style module="scoped">.red-123 { color: red; }</style><span class="red-123 bold">Red</span>`);
	});

	it('replace class attribute only', async () => {
		const output = await compiler({
			source: `<style module="scoped">.red { color: red; }</style><span class="red" data-color="red">Red</span>`,
			preprocessOptions: {
				localIdentName: '[local]-123',
			},
		});
		expect(output).toBe(`<style module="scoped">.red-123 { color: red; }</style><span class="red-123" data-color="red">Red</span>`);
	});

	it('skip empty class attribute', async () => {
		const output = await compiler({
			source: `<style module="scoped">.red { color: red; }</style><span class="">Red</span>`,
			preprocessOptions: {
				localIdentName: '[local]-123',
			},
		});
		expect(output).toBe(`<style module="scoped">.red-123 { color: red; }</style><span class="">Red</span>`);
	});

	it('parse extra attributes as well', async () => {
		const output = await compiler({
			source: `<style module="scoped">.red { color: red; }</style><span class="red" data-color="red">Red</span>`,
			preprocessOptions: {
				localIdentName: '[local]-123',
				includeAttributes: ['data-color'],
			},
		});
		expect(output).toBe(`<style module="scoped">.red-123 { color: red; }</style><span class="red-123" data-color="red-123">Red</span>`);
	});

	it('do not replace the classname', async () => {
		const output = await compiler({
			source: `<style>.red { color: red; }</style><span class="red">Red</span>`,
			preprocessOptions: {
				localIdentName: '[local]-123',
			},
		});
		expect(output).toBe(`<style>.red { color: red; }</style><span class="red">Red</span>`);
	});

	it('do not replace the classname when `parseStyleTag` is off', async () => {
		const output = await compiler({
			source: `<style module="scoped">.red { color: red; }</style><span class="red">Red</span>`,
			preprocessOptions: {
				localIdentName: '[local]-123',
				parseStyleTag: false,
			},
		});
		expect(output).toBe(`<style module="scoped">.red { color: red; }</style><span class="red">Red</span>`);
	});
});
