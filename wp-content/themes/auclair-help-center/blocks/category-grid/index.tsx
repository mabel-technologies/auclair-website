import { registerBlockType } from '@wordpress/blocks';
import { useBlockProps, InspectorControls } from '@wordpress/block-editor';
import { PanelBody, RangeControl, ToggleControl } from '@wordpress/components';
import ServerSideRender from '@wordpress/server-side-render';
import { __ } from '@wordpress/i18n';
import metadata from './block.json';

registerBlockType( metadata.name, {
	edit: ( { attributes, setAttributes } ) => {
		const columns = attributes.columns as number;
		const showCount = attributes.showCount as boolean;
		const blockProps = useBlockProps();

		return (
			<>
				<InspectorControls>
					<PanelBody title={ __( 'Settings', 'auclair' ) }>
						<RangeControl
							label={ __( 'Columns', 'auclair' ) }
							value={ columns }
							min={ 2 }
							max={ 4 }
							onChange={ ( columns?: number ) => setAttributes( { columns: columns || 4 } ) }
						/>
						<ToggleControl
							label={ __( 'Show article count', 'auclair' ) }
							checked={ !! showCount }
							onChange={ ( showCount: boolean ) => setAttributes( { showCount } ) }
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
