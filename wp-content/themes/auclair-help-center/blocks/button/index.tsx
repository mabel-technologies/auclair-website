import { registerBlockType } from '@wordpress/blocks';
import { useBlockProps, RichText, InspectorControls, LinkControl } from '@wordpress/block-editor';
import { PanelBody, ToggleControl, SelectControl, Popover, Button as WPButton } from '@wordpress/components';
import { __ } from '@wordpress/i18n';
import { useState } from '@wordpress/element';
import metadata from './block.json';

const VARIANTS = [
	{ label: __( 'Primary', 'auclair' ), value: 'primary' },
	{ label: __( 'Secondary', 'auclair' ), value: 'secondary' },
	{ label: __( 'Ghost', 'auclair' ), value: 'ghost' },
];

registerBlockType( metadata.name, {
	edit: ( { attributes, setAttributes } ) => {
		const label = attributes.label as string;
		const href = attributes.href as string;
		const variant = attributes.variant as string;
		const fullWidthMobile = attributes.fullWidthMobile as boolean;
		const [ isEditingLink, setIsEditingLink ] = useState( false );
		const blockProps = useBlockProps( {
			className: `auclair-button is-${ variant }${ fullWidthMobile ? ' is-full-width-mobile' : '' }`,
		} );

		return (
			<>
				<InspectorControls>
					<PanelBody title={ __( 'Settings', 'auclair' ) }>
						<SelectControl
							label={ __( 'Variant', 'auclair' ) }
							value={ variant }
							options={ VARIANTS }
							onChange={ ( variant: string ) => setAttributes( { variant } ) }
						/>
						<ToggleControl
							label={ __( 'Full width on mobile', 'auclair' ) }
							checked={ !! fullWidthMobile }
							onChange={ ( fullWidthMobile: boolean ) => setAttributes( { fullWidthMobile } ) }
						/>
					</PanelBody>
				</InspectorControls>
				<div style={ { position: 'relative', display: 'inline-block' } }>
					<RichText
						{ ...blockProps }
						tagName="span"
						value={ label }
						onChange={ ( label: string ) => setAttributes( { label } ) }
						allowedFormats={ [] }
					/>
					<WPButton
						variant="tertiary"
						size="small"
						onClick={ () => setIsEditingLink( true ) }
					>
						{ href ? href : __( 'Add link', 'auclair' ) }
					</WPButton>
					{ isEditingLink && (
						<Popover onClose={ () => setIsEditingLink( false ) }>
							<LinkControl
								value={ { url: href } }
								onChange={ ( value: any ) => // eslint-disable-line @typescript-eslint/no-explicit-any
									setAttributes( { href: value?.url || '' } )
								}
							/>
						</Popover>
					) }
				</div>
			</>
		);
	},
	save: ( { attributes } ) => {
		const label = attributes.label as string;
		const href = attributes.href as string;
		const variant = attributes.variant as string;
		const fullWidthMobile = attributes.fullWidthMobile as boolean;
		const blockProps = useBlockProps.save( {
			className: `auclair-button is-${ variant }${ fullWidthMobile ? ' is-full-width-mobile' : '' }`,
		} );
		return (
			<RichText.Content
				{ ...blockProps }
				tagName="a"
				href={ href }
				value={ label }
			/>
		);
	},
} );
