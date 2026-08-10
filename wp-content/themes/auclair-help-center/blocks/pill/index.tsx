import { registerBlockType } from '@wordpress/blocks';
import { useBlockProps, RichText } from '@wordpress/block-editor';
import metadata from './block.json';

registerBlockType( metadata.name, {
	edit: ( { attributes, setAttributes } ) => {
		const label = attributes.label as string;
		const blockProps = useBlockProps( { className: 'auclair-pill' } );

		return (
			<RichText
				{ ...blockProps }
				tagName="span"
				value={ label }
				onChange={ ( label: string ) => setAttributes( { label } ) }
				allowedFormats={ [] }
			/>
		);
	},
	save: ( { attributes } ) => {
		const blockProps = useBlockProps.save( { className: 'auclair-pill' } );
		return <RichText.Content { ...blockProps } tagName="span" value={ attributes.label as string } />;
	},
} );
