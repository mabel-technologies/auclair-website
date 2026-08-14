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
		<button
			type="button"
			className="auclair-search-bar__clear"
			aria-label={ __( 'Clear search', 'auclair' ) }
		>
			<svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true" focusable="false">
				<path d="M12 1.25C17.9371 1.25 22.75 6.06294 22.75 12C22.75 17.9371 17.9371 22.75 12 22.75C6.06294 22.75 1.25 17.9371 1.25 12C1.25 6.06294 6.06294 1.25 12 1.25ZM15.707 8.29297C15.3165 7.90246 14.6835 7.90247 14.293 8.29297L12 10.5859L9.70703 8.29297C9.31655 7.9027 8.68344 7.90271 8.29297 8.29297C7.90246 8.68351 7.90243 9.3175 8.29297 9.70801L10.5859 12L8.29297 14.292C7.90243 14.6825 7.90246 15.3165 8.29297 15.707C8.68344 16.0973 9.31655 16.0973 9.70703 15.707L12 13.4141L14.293 15.707C14.6835 16.0975 15.3165 16.0975 15.707 15.707C16.0975 15.3165 16.0975 14.6835 15.707 14.293L13.4141 12L15.707 9.70703C16.0975 9.31652 16.0975 8.6835 15.707 8.29297Z" fill="currentColor" />
			</svg>
		</button>
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
	save: () => null,
} );
