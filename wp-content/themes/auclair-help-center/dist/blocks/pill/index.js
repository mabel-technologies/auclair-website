import { jsx as _jsx } from "react/jsx-runtime";
import { registerBlockType } from '@wordpress/blocks';
import { useBlockProps, RichText } from '@wordpress/block-editor';
import metadata from './block.json';
registerBlockType(metadata.name, {
    edit: ({ attributes, setAttributes }) => {
        const label = attributes.label;
        const blockProps = useBlockProps({ className: 'auclair-pill' });
        return (_jsx(RichText, { ...blockProps, tagName: "span", value: label, onChange: (label) => setAttributes({ label }), allowedFormats: [] }));
    },
    save: ({ attributes }) => {
        const blockProps = useBlockProps.save({ className: 'auclair-pill' });
        return _jsx(RichText.Content, { ...blockProps, tagName: "span", value: attributes.label });
    },
});
