declare module '@wordpress/interactivity' {
	export function store< T extends object = Record< string, any > >( // eslint-disable-line @typescript-eslint/no-explicit-any
		namespace: string,
		storePart?: Partial< T >,
		options?: { lock?: boolean | string }
	): T;

	export function getContext< T = Record< string, any > >( namespace?: string ): T; // eslint-disable-line @typescript-eslint/no-explicit-any

	export function getElement(): {
		ref: HTMLElement;
		attributes: Record< string, any >; // eslint-disable-line @typescript-eslint/no-explicit-any
	};

	export function getServerState< T = Record< string, any > >( namespace?: string ): T; // eslint-disable-line @typescript-eslint/no-explicit-any
}
