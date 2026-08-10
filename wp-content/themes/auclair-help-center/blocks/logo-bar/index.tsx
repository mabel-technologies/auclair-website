import { registerBlockType } from '@wordpress/blocks';
import { useBlockProps, InspectorControls } from '@wordpress/block-editor';
import { PanelBody, TextControl } from '@wordpress/components';
import ServerSideRender from '@wordpress/server-side-render';
import { __ } from '@wordpress/i18n';
import metadata from './block.json';

registerBlockType( metadata.name, {
	edit: ( { attributes, setAttributes } ) => {
		const homeUrl = attributes.homeUrl as string;
		const blockProps = useBlockProps();

		return (
			<>
				<InspectorControls>
					<PanelBody title={ __( 'Settings', 'auclair' ) }>
						<TextControl
							label={ __( 'Home URL', 'auclair' ) }
							value={ homeUrl }
							onChange={ ( homeUrl: string ) => setAttributes( { homeUrl } ) }
						/>
					</PanelBody>
				</InspectorControls>
				<div { ...blockProps }>
					<ServerSideRender block={ metadata.name } attributes={ attributes } />
				</div>
			</>
		);
	},
	save: () => null,
} );
