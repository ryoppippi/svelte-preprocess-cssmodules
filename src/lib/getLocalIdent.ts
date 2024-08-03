type Context = {
	context: string;
	resourcePath: string;
};

type LocalIdentName = {
	template: string;
	interpolatedName: string;
};

type Options = {
	markup: string;
	style: string;
};

export type GetLocalIdent = {
	(context: Context, localIdentName: LocalIdentName, localName: string, options: Options): string;
};

export const getLocalIdent: GetLocalIdent = (_context, localIdentName) =>
	localIdentName.interpolatedName;
