import { registerBlockType } from '@wordpress/blocks';
import { useBlockProps, InspectorControls } from '@wordpress/block-editor';
import { PanelBody, TextControl } from '@wordpress/components';
import ServerSideRender from '@wordpress/server-side-render';
import { __ } from '@wordpress/i18n';
import metadata from './block.json';

registerBlockType( metadata.name, {
	edit: ( { attributes, setAttributes } ) => {
		const upLabel = attributes.upLabel as string;
		const downLabel = attributes.downLabel as string;
		const thanksUp = attributes.thanksUp as string;
		const thanksDown = attributes.thanksDown as string;
		const blockProps = useBlockProps();

		return (
			<>
				<InspectorControls>
					<PanelBody title={ __( 'Settings', 'auclair' ) }>
						<TextControl
							label={ __( 'Yes label', 'auclair' ) }
							value={ upLabel }
							onChange={ ( upLabel: string ) => setAttributes( { upLabel } ) }
						/>
						<TextControl
							label={ __( 'No label', 'auclair' ) }
							value={ downLabel }
							onChange={ ( downLabel: string ) => setAttributes( { downLabel } ) }
						/>
						<TextControl
							label={ __( 'Thanks (yes)', 'auclair' ) }
							value={ thanksUp }
							onChange={ ( thanksUp: string ) => setAttributes( { thanksUp } ) }
						/>
						<TextControl
							label={ __( 'Thanks (no)', 'auclair' ) }
							value={ thanksDown }
							onChange={ ( thanksDown: string ) => setAttributes( { thanksDown } ) }
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
