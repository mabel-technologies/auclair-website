import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { registerBlockType } from '@wordpress/blocks';
import { useBlockProps, RichText, InnerBlocks } from '@wordpress/block-editor';
import metadata from './block.json';
const TEMPLATE = [
    ['auclair/search-bar'],
    ['auclair/quick-help-chips'],
];
registerBlockType(metadata.name, {
    edit: ({ attributes, setAttributes }) => {
        const eyebrow = attributes.eyebrow;
        const heading = attributes.heading;
        const subheading = attributes.subheading;
        const blockProps = useBlockProps({ className: 'auclair-help-hero' });
        return (_jsxs("div", { ...blockProps, children: [_jsx("div", { className: "auclair-help-hero__glow" }), _jsxs("div", { className: "auclair-help-hero__content", children: [_jsx(RichText, { tagName: "span", className: "auclair-help-hero__eyebrow", value: eyebrow, onChange: (eyebrow) => setAttributes({ eyebrow }), allowedFormats: [] }), _jsx(RichText, { tagName: "h1", className: "auclair-help-hero__heading", value: heading, onChange: (heading) => setAttributes({ heading }), allowedFormats: [] }), _jsx(RichText, { tagName: "p", className: "auclair-help-hero__subheading", value: subheading, placeholder: "Optional subheading\u2026", onChange: (subheading) => setAttributes({ subheading }), allowedFormats: [] }), _jsx(InnerBlocks, { template: TEMPLATE, templateLock: false, allowedBlocks: ['auclair/search-bar', 'auclair/quick-help-chips'] })] })] }));
    },
    save: ({ attributes }) => {
        const eyebrow = attributes.eyebrow;
        const heading = attributes.heading;
        const subheading = attributes.subheading;
        const blockProps = useBlockProps.save({ className: 'auclair-help-hero' });
        return (_jsxs("div", { ...blockProps, children: [_jsx("div", { className: "auclair-help-hero__glow" }), _jsxs("div", { className: "auclair-help-hero__content", children: [_jsx(RichText.Content, { tagName: "span", className: "auclair-help-hero__eyebrow", value: eyebrow }), _jsx(RichText.Content, { tagName: "h1", className: "auclair-help-hero__heading", value: heading }), subheading && (_jsx(RichText.Content, { tagName: "p", className: "auclair-help-hero__subheading", value: subheading })), _jsx(InnerBlocks.Content, {})] })] }));
    },
});
