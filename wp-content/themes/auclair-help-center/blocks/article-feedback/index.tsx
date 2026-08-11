import { registerBlockType } from '@wordpress/blocks';
import { useBlockProps, InspectorControls, RichText } from '@wordpress/block-editor';
import { PanelBody, TextControl } from '@wordpress/components';
import { __ } from '@wordpress/i18n';
import metadata from './block.json';

const THUMB_PATHS: Record< 'up' | 'down', string > = {
	up: '<path d="M5.83317 16.6666L2.49983 16.6666C2.0396 16.6666 1.6665 16.2935 1.6665 15.8333V9.16663C1.6665 8.70639 2.0396 8.33329 2.49984 8.33329H5.83317" stroke-linecap="round"/><path d="M14.9566 16.6666H5.8335V8.33329L11.5966 2.49996L11.6558 2.55979C12.8602 3.77888 13.1984 5.62286 12.5067 7.19831L12.0083 8.33329H16.6855C17.8198 8.33329 18.6144 9.46692 18.2397 10.5505L16.5108 15.5505C16.2796 16.219 15.6563 16.6666 14.9566 16.6666Z"/>',
	down: '<path d="M5.83317 2.49992L2.49983 2.49993C2.0396 2.49993 1.6665 2.87303 1.6665 3.33327V9.99992C1.6665 10.4602 2.0396 10.8333 2.49984 10.8333H5.83317" stroke-linecap="round"/><path d="M14.9561 2.49996H5.83301V10.8333L11.5962 16.6666L11.6553 16.6068C12.8597 15.3877 13.1979 13.5437 12.5062 11.9683L12.0078 10.8333H16.685C17.8193 10.8333 18.6139 9.69967 18.2392 8.61604L16.5103 3.61604C16.2791 2.94756 15.6558 2.49996 14.9561 2.49996Z"/>',
};

const ThumbIcon = ( { direction }: { direction: 'up' | 'down' } ) => (
	<svg
		width="20"
		height="20"
		viewBox="0 0 20 20"
		fill="none"
		stroke="currentColor"
		strokeWidth={ 1.5 }
		strokeLinejoin="round"
		aria-hidden="true"
		focusable="false"
		dangerouslySetInnerHTML={ { __html: THUMB_PATHS[ direction ] } }
	/>
);

registerBlockType( metadata.name, {
	edit: ( { attributes, setAttributes } ) => {
		const question = attributes.question as string;
		const upLabel = attributes.upLabel as string;
		const downLabel = attributes.downLabel as string;
		const thanksUp = attributes.thanksUp as string;
		const thanksDown = attributes.thanksDown as string;
		const blockProps = useBlockProps();

		return (
			<>
				<InspectorControls>
					<PanelBody title={ __( 'Thank-you messages', 'auclair' ) }>
						<TextControl
							label={ __( 'Thanks (yes)', 'auclair' ) }
							help={ __( 'Shown briefly after a "yes" vote, then fades away on its own.', 'auclair' ) }
							value={ thanksUp }
							onChange={ ( thanksUp: string ) => setAttributes( { thanksUp } ) }
						/>
						<TextControl
							label={ __( 'Thanks (no)', 'auclair' ) }
							help={ __( 'Shown briefly after a "no" vote, then fades away on its own.', 'auclair' ) }
							value={ thanksDown }
							onChange={ ( thanksDown: string ) => setAttributes( { thanksDown } ) }
						/>
					</PanelBody>
				</InspectorControls>
				<div { ...blockProps }>
					<RichText
						tagName="p"
						className="auclair-article-feedback__question"
						value={ question }
						onChange={ ( question: string ) => setAttributes( { question } ) }
						allowedFormats={ [] }
					/>
					<div className="auclair-article-feedback__response">
						<div className="auclair-article-feedback__buttons">
							<div className="auclair-article-feedback__button">
								<ThumbIcon direction="up" />
								<RichText
									tagName="span"
									value={ upLabel }
									onChange={ ( upLabel: string ) => setAttributes( { upLabel } ) }
									allowedFormats={ [] }
								/>
							</div>
							<div className="auclair-article-feedback__button">
								<ThumbIcon direction="down" />
								<RichText
									tagName="span"
									value={ downLabel }
									onChange={ ( downLabel: string ) => setAttributes( { downLabel } ) }
									allowedFormats={ [] }
								/>
							</div>
						</div>
					</div>
				</div>
			</>
		);
	},
	save: () => null,
} );
