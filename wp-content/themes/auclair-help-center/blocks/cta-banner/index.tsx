import { registerBlockType } from '@wordpress/blocks';
import { useBlockProps, RichText, InspectorControls, LinkControl } from '@wordpress/block-editor';
import { PanelBody, ColorPicker, Popover, Button as WPButton } from '@wordpress/components';
import { __ } from '@wordpress/i18n';
import { useState } from '@wordpress/element';
import metadata from './block.json';
import { iconSvg } from '../icon-tile/icons';

const noop = () => undefined;

type PanelProps = {
	heading: string;
	body: string;
	buttonLabel: string;
	buttonUrl: string;
	accent: string;
	editable: boolean;
	onChangeHeading?: ( v: string ) => void;
	onChangeBody?: ( v: string ) => void;
	onChangeButtonLabel?: ( v: string ) => void;
};

const Panel = ( {
	heading,
	body,
	buttonLabel,
	buttonUrl,
	accent,
	editable,
	onChangeHeading = noop,
	onChangeBody = noop,
	onChangeButtonLabel = noop,
}: PanelProps ) => (
	<div
		className="auclair-cta-banner auclair-ring-hover"
		style={ { '--auclair-ring-accent': accent } as React.CSSProperties }
	>
		<span className="auclair-icon-tile is-large" style={ { '--auclair-icon-accent': accent } as React.CSSProperties }>
			<span className="auclair-icon-tile__glow" />
			<span
				className="auclair-icon-tile__icon"
				dangerouslySetInnerHTML={ { __html: iconSvg( 'question-circle', 28 ) } }
			/>
		</span>
		<div className="auclair-cta-banner__body">
			{ editable ? (
				<>
					<RichText tagName="h2" className="auclair-cta-banner__heading" value={ heading } onChange={ onChangeHeading } allowedFormats={ [] } />
					<RichText tagName="p" className="auclair-cta-banner__text" value={ body } onChange={ onChangeBody } allowedFormats={ [] } />
				</>
			) : (
				<>
					<RichText.Content tagName="h2" className="auclair-cta-banner__heading" value={ heading } />
					<RichText.Content tagName="p" className="auclair-cta-banner__text" value={ body } />
				</>
			) }
		</div>
		{ editable ? (
			<RichText
				tagName="span"
				className="auclair-button is-primary auclair-cta-banner__button"
				value={ buttonLabel }
				onChange={ onChangeButtonLabel }
				allowedFormats={ [] }
			/>
		) : (
			<RichText.Content
				tagName="a"
				className="auclair-button is-primary auclair-cta-banner__button"
				value={ buttonLabel }
				// @ts-ignore -- href is a valid prop on the rendered anchor tag.
				href={ buttonUrl }
			/>
		) }
	</div>
);

registerBlockType( metadata.name, {
	edit: ( { attributes, setAttributes } ) => {
		const heading = attributes.heading as string;
		const body = attributes.body as string;
		const buttonLabel = attributes.buttonLabel as string;
		const buttonUrl = attributes.buttonUrl as string;
		const accent = attributes.accent as string;
		const [ isEditingLink, setIsEditingLink ] = useState( false );
		const blockProps = useBlockProps();

		return (
			<>
				<InspectorControls>
					<PanelBody title={ __( 'Settings', 'auclair' ) }>
						<p>{ __( 'Button URL', 'auclair' ) }</p>
						<WPButton variant="secondary" onClick={ () => setIsEditingLink( true ) }>
							{ buttonUrl || __( 'Add link', 'auclair' ) }
						</WPButton>
						{ isEditingLink && (
							<Popover onClose={ () => setIsEditingLink( false ) }>
								<LinkControl
									value={ { url: buttonUrl } }
									onChange={ ( value: any ) => setAttributes( { buttonUrl: value?.url || '' } ) } // eslint-disable-line @typescript-eslint/no-explicit-any
								/>
							</Popover>
						) }
						<p>{ __( 'Accent colour', 'auclair' ) }</p>
						<ColorPicker color={ accent } onChange={ ( accent: string ) => setAttributes( { accent } ) } enableAlpha={ false } />
					</PanelBody>
				</InspectorControls>
				<div { ...blockProps }>
					<Panel
						heading={ heading }
						body={ body }
						buttonLabel={ buttonLabel }
						buttonUrl={ buttonUrl }
						accent={ accent }
						editable
						onChangeHeading={ ( heading: string ) => setAttributes( { heading } ) }
						onChangeBody={ ( body: string ) => setAttributes( { body } ) }
						onChangeButtonLabel={ ( buttonLabel: string ) => setAttributes( { buttonLabel } ) }
					/>
				</div>
			</>
		);
	},
	save: ( { attributes } ) => {
		const heading = attributes.heading as string;
		const body = attributes.body as string;
		const buttonLabel = attributes.buttonLabel as string;
		const buttonUrl = attributes.buttonUrl as string;
		const accent = attributes.accent as string;
		const blockProps = useBlockProps.save();

		return (
			<div { ...blockProps }>
				<Panel heading={ heading } body={ body } buttonLabel={ buttonLabel } buttonUrl={ buttonUrl } accent={ accent } editable={ false } />
			</div>
		);
	},
} );
