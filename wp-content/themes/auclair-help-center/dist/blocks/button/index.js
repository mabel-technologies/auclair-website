import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { registerBlockType } from '@wordpress/blocks';
import { useBlockProps, RichText, InspectorControls, LinkControl } from '@wordpress/block-editor';
import { PanelBody, ToggleControl, SelectControl, Popover, Button as WPButton } from '@wordpress/components';
import { __ } from '@wordpress/i18n';
import { useState } from '@wordpress/element';
import metadata from './block.json';
const VARIANTS = [
    { label: __('Primary', 'auclair'), value: 'primary' },
    { label: __('Secondary', 'auclair'), value: 'secondary' },
    { label: __('Ghost', 'auclair'), value: 'ghost' },
];
registerBlockType(metadata.name, {
    edit: ({ attributes, setAttributes }) => {
        const label = attributes.label;
        const href = attributes.href;
        const variant = attributes.variant;
        const fullWidthMobile = attributes.fullWidthMobile;
        const [isEditingLink, setIsEditingLink] = useState(false);
        const blockProps = useBlockProps({
            className: `auclair-button is-${variant}${fullWidthMobile ? ' is-full-width-mobile' : ''}`,
        });
        return (_jsxs(_Fragment, { children: [_jsx(InspectorControls, { children: _jsxs(PanelBody, { title: __('Settings', 'auclair'), children: [_jsx(SelectControl, { label: __('Variant', 'auclair'), value: variant, options: VARIANTS, onChange: (variant) => setAttributes({ variant }) }), _jsx(ToggleControl, { label: __('Full width on mobile', 'auclair'), checked: !!fullWidthMobile, onChange: (fullWidthMobile) => setAttributes({ fullWidthMobile }) })] }) }), _jsxs("div", { style: { position: 'relative', display: 'inline-block' }, children: [_jsx(RichText, { ...blockProps, tagName: "span", value: label, onChange: (label) => setAttributes({ label }), allowedFormats: [] }), _jsx(WPButton, { variant: "tertiary", size: "small", onClick: () => setIsEditingLink(true), children: href ? href : __('Add link', 'auclair') }), isEditingLink && (_jsx(Popover, { onClose: () => setIsEditingLink(false), children: _jsx(LinkControl, { value: { url: href }, onChange: (value) => // eslint-disable-line @typescript-eslint/no-explicit-any
                                 setAttributes({ href: value?.url || '' }) }) }))] })] }));
    },
    save: ({ attributes }) => {
        const label = attributes.label;
        const href = attributes.href;
        const variant = attributes.variant;
        const fullWidthMobile = attributes.fullWidthMobile;
        const blockProps = useBlockProps.save({
            className: `auclair-button is-${variant}${fullWidthMobile ? ' is-full-width-mobile' : ''}`,
        });
        return (_jsx(RichText.Content, { ...blockProps, tagName: "a", href: href, value: label }));
    },
});
