declare module '@wordpress/server-side-render' {
	import type { ComponentType } from 'react';

	const ServerSideRender: ComponentType< {
		block: string;
		attributes?: Record< string, unknown >;
		httpMethod?: 'GET' | 'POST';
		urlQueryArgs?: Record< string, unknown >;
	} >;

	export default ServerSideRender;
}
