import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { registerBlockType } from '@wordpress/blocks';
import { useBlockProps, RichText, InspectorControls, AlignmentControl, BlockControls } from '@wordpress/block-editor';
import { PanelBody } from '@wordpress/components';
import { __ } from '@wordpress/i18n';
import metadata from './block.json';
registerBlockType(metadata.name, {
    edit: ({ attributes, setAttributes }) => {
        const title = attributes.title;
        const subtitle = attributes.subtitle;
        const align = attributes.align;
        const blockProps = useBlockProps({
            className: `auclair-section-heading has-text-align-${align}`,
        });
        return (_jsxs(_Fragment, { children: [_jsx(BlockControls, { children: _jsx(AlignmentControl, { value: align, onChange: (align) => setAttributes({ align: align || 'left' }) }) }), _jsx(InspectorControls, { children: _jsx(PanelBody, { title: __('Settings', 'auclair') }) }), _jsxs("div", { ...blockProps, children: [_jsx(RichText, { tagName: "h2", className: "auclair-section-heading__title", value: title, onChange: (title) => setAttributes({ title }), allowedFormats: [] }), _jsx(RichText, { tagName: "p", className: "auclair-section-heading__subtitle", value: subtitle, placeholder: __('Optional subtitle…', 'auclair'), onChange: (subtitle) => setAttributes({ subtitle }), allowedFormats: [] })] })] }));
    },
    save: ({ attributes }) => {
        const title = attributes.title;
        const subtitle = attributes.subtitle;
        const align = attributes.align;
        const blockProps = useBlockProps.save({
            className: `auclair-section-heading has-text-align-${align}`,
        });
        return (_jsxs("div", { ...blockProps, children: [_jsx(RichText.Content, { tagName: "h2", className: "auclair-section-heading__title", value: title }), subtitle && (_jsx(RichText.Content, { tagName: "p", className: "auclair-section-heading__subtitle", value: subtitle }))] }));
    },
});
