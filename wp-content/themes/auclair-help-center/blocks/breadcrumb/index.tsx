import { registerBlockType } from '@wordpress/blocks';
import { useBlockProps, InspectorControls } from '@wordpress/block-editor';
import { PanelBody, ToggleControl, TextControl } from '@wordpress/components';
import ServerSideRender from '@wordpress/server-side-render';
import { __ } from '@wordpress/i18n';
import metadata from './block.json';

registerBlockType( metadata.name, {
	edit: ( { attributes, setAttributes } ) => {
		const showBack = attributes.showBack as boolean;
		const overrideLabel = attributes.overrideLabel as string;
		const overrideUrl = attributes.overrideUrl as string;
		const blockProps = useBlockProps();

		return (
			<>
				<InspectorControls>
					<PanelBody title={ __( 'Settings', 'auclair' ) }>
						<ToggleControl
							label={ __( 'Show back chevron', 'auclair' ) }
							checked={ !! showBack }
							onChange={ ( showBack: boolean ) => setAttributes( { showBack } ) }
						/>
						<TextControl
							label={ __( 'Override last crumb label', 'auclair' ) }
							help={ __( 'Leave empty to derive from the current page.', 'auclair' ) }
							value={ overrideLabel }
							onChange={ ( overrideLabel: string ) => setAttributes( { overrideLabel } ) }
						/>
						<TextControl
							label={ __( 'Override last crumb URL', 'auclair' ) }
							value={ overrideUrl }
							onChange={ ( overrideUrl: string ) => setAttributes( { overrideUrl } ) }
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
