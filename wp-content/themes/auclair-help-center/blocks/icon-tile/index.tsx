import { registerBlockType } from '@wordpress/blocks';
import { useBlockProps, InspectorControls } from '@wordpress/block-editor';
import { PanelBody, SelectControl, ColorPicker } from '@wordpress/components';
import { __ } from '@wordpress/i18n';
import metadata from './block.json';
import { ICON_OPTIONS, iconSvg } from './icons';

registerBlockType( metadata.name, {
	edit: ( { attributes, setAttributes } ) => {
		const icon = attributes.icon as string;
		const accent = attributes.accent as string;
		const size = attributes.size as string;
		const blockProps = useBlockProps( {
			className: `auclair-icon-tile is-${ size }`,
			style: { '--auclair-icon-accent': accent } as React.CSSProperties,
		} );

		return (
			<>
				<InspectorControls>
					<PanelBody title={ __( 'Settings', 'auclair' ) }>
						<SelectControl
							label={ __( 'Icon', 'auclair' ) }
							value={ icon }
							options={ ICON_OPTIONS }
							onChange={ ( icon: string ) => setAttributes( { icon } ) }
						/>
						<SelectControl
							label={ __( 'Size', 'auclair' ) }
							value={ size as any } // eslint-disable-line @typescript-eslint/no-explicit-any
							options={ [
								{ label: __( 'Default', 'auclair' ), value: 'default' },
								{ label: __( 'Large', 'auclair' ), value: 'large' },
							] }
							onChange={ ( size: string ) => setAttributes( { size } ) }
						/>
						<p>{ __( 'Accent colour', 'auclair' ) }</p>
						<ColorPicker
							color={ accent }
							onChange={ ( accent: string ) => setAttributes( { accent } ) }
							enableAlpha={ false }
						/>
					</PanelBody>
				</InspectorControls>
				<span { ...blockProps }>
					<span className="auclair-icon-tile__glow" />
					<span
						className="auclair-icon-tile__icon"
						dangerouslySetInnerHTML={ {
							__html: iconSvg( icon, size === 'large' ? 32 : 24 ),
						} }
					/>
				</span>
			</>
		);
	},
	save: ( { attributes } ) => {
		const icon = attributes.icon as string;
		const accent = attributes.accent as string;
		const size = attributes.size as string;
		const blockProps = useBlockProps.save( {
			className: `auclair-icon-tile is-${ size }`,
			style: { '--auclair-icon-accent': accent } as React.CSSProperties,
		} );

		return (
			<span { ...blockProps }>
				<span className="auclair-icon-tile__glow" />
				<span
					className="auclair-icon-tile__icon"
					dangerouslySetInnerHTML={ {
						__html: iconSvg( icon, size === 'large' ? 32 : 24 ),
					} }
				/>
			</span>
		);
	},
} );
