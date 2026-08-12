import { registerBlockType } from '@wordpress/blocks';
import { useBlockProps, RichText, InnerBlocks } from '@wordpress/block-editor';
import metadata from './block.json';

const TEMPLATE: Array< [ string, Record< string, unknown >? ] > = [
	[ 'auclair/search-bar' ],
	[ 'auclair/quick-help-chips' ],
];

registerBlockType( metadata.name, {
	edit: ( { attributes, setAttributes } ) => {
		const eyebrow = attributes.eyebrow as string;
		const heading = attributes.heading as string;
		const subheading = attributes.subheading as string;
		const blockProps = useBlockProps( { className: 'auclair-help-hero' } );

		return (
			<div { ...blockProps }>
				<div className="auclair-help-hero__glow" />
					<div className="auclair-help-hero__rings" aria-hidden="true">
						<span className="auclair-help-hero__ring auclair-help-hero__ring--1" />
						<span className="auclair-help-hero__ring auclair-help-hero__ring--2" />
						<span className="auclair-help-hero__ring auclair-help-hero__ring--3" />
					</div>
				<div className="auclair-help-hero__content">
					<RichText
						tagName="span"
						className="auclair-help-hero__eyebrow"
						value={ eyebrow }
						onChange={ ( eyebrow: string ) => setAttributes( { eyebrow } ) }
						allowedFormats={ [] }
					/>
					<RichText
						tagName="h1"
						className="auclair-help-hero__heading"
						value={ heading }
						onChange={ ( heading: string ) => setAttributes( { heading } ) }
						allowedFormats={ [] }
					/>
					<RichText
						tagName="p"
						className="auclair-help-hero__subheading"
						value={ subheading }
						placeholder="Optional subheading…"
						onChange={ ( subheading: string ) => setAttributes( { subheading } ) }
						allowedFormats={ [] }
					/>
					<InnerBlocks
						template={ TEMPLATE }
						templateLock={ false }
						allowedBlocks={ [ 'auclair/search-bar', 'auclair/quick-help-chips' ] }
					/>
				</div>
			</div>
		);
	},
	save: ( { attributes } ) => {
		const eyebrow = attributes.eyebrow as string;
		const heading = attributes.heading as string;
		const subheading = attributes.subheading as string;
		const blockProps = useBlockProps.save( { className: 'auclair-help-hero' } );

		return (
			<div { ...blockProps }>
				<div className="auclair-help-hero__glow" />
					<div className="auclair-help-hero__rings" aria-hidden="true">
						<span className="auclair-help-hero__ring auclair-help-hero__ring--1" />
						<span className="auclair-help-hero__ring auclair-help-hero__ring--2" />
						<span className="auclair-help-hero__ring auclair-help-hero__ring--3" />
					</div>
				<div className="auclair-help-hero__content">
					<RichText.Content tagName="span" className="auclair-help-hero__eyebrow" value={ eyebrow } />
					<RichText.Content tagName="h1" className="auclair-help-hero__heading" value={ heading } />
					{ subheading && (
						<RichText.Content tagName="p" className="auclair-help-hero__subheading" value={ subheading } />
					) }
					<InnerBlocks.Content />
				</div>
			</div>
		);
	},
} );
