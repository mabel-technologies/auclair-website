import { registerBlockType } from '@wordpress/blocks';
import { useBlockProps, InspectorControls } from '@wordpress/block-editor';
import { PanelBody, TextControl, ToggleControl } from '@wordpress/components';
import { __ } from '@wordpress/i18n';
import metadata from './block.json';

const markup = ( placeholder: string, action: string, liveSuggest: boolean ) => (
	<div
		className="auclair-search-bar"
		data-wp-interactive="auclair"
		data-wp-context={ JSON.stringify( { action, liveSuggest } ) }
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
		<ul className="auclair-search-bar__suggestions" hidden data-wp-bind--hidden="!state.hasSuggestions">
			<template data-wp-each--item="state.suggestions">
				<li>
					<a data-wp-bind--href="context.item.url" data-wp-text="context.item.title"></a>
				</li>
			</template>
		</ul>
	</div>
);

registerBlockType( metadata.name, {
	edit: ( { attributes, setAttributes } ) => {
		const placeholder = attributes.placeholder as string;
		const action = attributes.action as string;
		const liveSuggest = attributes.liveSuggest as boolean;
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
							help={ __( 'Use %s as the query placeholder.', 'auclair' ) }
							value={ action }
							onChange={ ( action: string ) => setAttributes( { action } ) }
						/>
						<ToggleControl
							label={ __( 'Live suggestions', 'auclair' ) }
							checked={ !! liveSuggest }
							onChange={ ( liveSuggest: boolean ) => setAttributes( { liveSuggest } ) }
						/>
					</PanelBody>
				</InspectorControls>
				<div { ...blockProps }>{ markup( placeholder, action, liveSuggest ) }</div>
			</>
		);
	},
	save: ( { attributes } ) => {
		const placeholder = attributes.placeholder as string;
		const action = attributes.action as string;
		const liveSuggest = attributes.liveSuggest as boolean;
		const blockProps = useBlockProps.save();

		return <div { ...blockProps }>{ markup( placeholder, action, liveSuggest ) }</div>;
	},
} );
