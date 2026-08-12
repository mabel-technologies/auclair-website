import { registerBlockType } from '@wordpress/blocks';
import { useBlockProps, InspectorControls } from '@wordpress/block-editor';
import { PanelBody, TextControl } from '@wordpress/components';
import { __ } from '@wordpress/i18n';
import metadata from './block.json';

const markup = ( placeholder: string, action: string ) => (
	<div
		className="auclair-search-bar"
		data-wp-interactive="auclair"
		data-wp-context={ JSON.stringify( { action } ) }
	>
		<span className="auclair-search-bar__icon" aria-hidden="true">
			<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
				<circle cx="11" cy="11" r="7" />
				<line x1="21" y1="21" x2="16.65" y2="16.65" />
			</svg>
		</span>
		<input
			type="text"
			className="auclair-search-bar__input"
			placeholder={ placeholder }
			data-wp-bind--value="state.searchQuery"
			data-wp-on--input="actions.setSearchQuery"
			data-wp-on--keydown="actions.handleSearchKeydown"
			aria-label={ __( 'Search for help', 'auclair' ) }
		/>
	</div>
);

registerBlockType( metadata.name, {
	edit: ( { attributes, setAttributes } ) => {
		const placeholder = attributes.placeholder as string;
		const action = attributes.action as string;
		const blockProps = useBlockProps();

		return (
			<>
				<InspectorControls>
					<PanelBody title={ __( 'Settings', 'auclair' ) }>
						<TextControl
							label={ __( 'Placeholder', 'auclair' ) }
							value={ placeholder }
							onChange={ ( placeholder: string ) => setAttributes( { placeholder } ) }
						/>
						<TextControl
							label={ __( 'Search action URL', 'auclair' ) }
							help={ __( 'Use %s as the query placeholder. Navigated to as soon as the visitor starts typing.', 'auclair' ) }
							value={ action }
							onChange={ ( action: string ) => setAttributes( { action } ) }
						/>
					</PanelBody>
				</InspectorControls>
				<div { ...blockProps }>{ markup( placeholder, action ) }</div>
			</>
		);
	},
	save: ( { attributes } ) => {
		const placeholder = attributes.placeholder as string;
		const action = attributes.action as string;
		const blockProps = useBlockProps.save();

		return <div { ...blockProps }>{ markup( placeholder, action ) }</div>;
	},
} );
