import { registerBlockType } from '@wordpress/blocks';
import { useBlockProps, RichText, InspectorControls, AlignmentControl, BlockControls } from '@wordpress/block-editor';
import { PanelBody } from '@wordpress/components';
import { __ } from '@wordpress/i18n';
import metadata from './block.json';

registerBlockType( metadata.name, {
	edit: ( { attributes, setAttributes } ) => {
		const title = attributes.title as string;
		const subtitle = attributes.subtitle as string;
		const align = attributes.align as string;
		const blockProps = useBlockProps( {
			className: `auclair-section-heading has-text-align-${ align }`,
		} );

		return (
			<>
				<BlockControls>
					<AlignmentControl
						value={ align as any } // eslint-disable-line @typescript-eslint/no-explicit-any
						onChange={ ( align?: string ) => setAttributes( { align: align || 'left' } ) }
					/>
				</BlockControls>
				<InspectorControls>
					<PanelBody title={ __( 'Settings', 'auclair' ) } />
				</InspectorControls>
				<div { ...blockProps }>
					<RichText
						tagName="h2"
						className="auclair-section-heading__title"
						value={ title }
						onChange={ ( title: string ) => setAttributes( { title } ) }
						allowedFormats={ [] }
					/>
					<RichText
						tagName="p"
						className="auclair-section-heading__subtitle"
						value={ subtitle }
						placeholder={ __( 'Optional subtitle…', 'auclair' ) }
						onChange={ ( subtitle: string ) => setAttributes( { subtitle } ) }
						allowedFormats={ [] }
					/>
				</div>
			</>
		);
	},
	save: ( { attributes } ) => {
		const title = attributes.title as string;
		const subtitle = attributes.subtitle as string;
		const align = attributes.align as string;
		const blockProps = useBlockProps.save( {
			className: `auclair-section-heading has-text-align-${ align }`,
		} );

		return (
			<div { ...blockProps }>
				<RichText.Content tagName="h2" className="auclair-section-heading__title" value={ title } />
				{ subtitle && (
					<RichText.Content tagName="p" className="auclair-section-heading__subtitle" value={ subtitle } />
				) }
			</div>
		);
	},
} );
