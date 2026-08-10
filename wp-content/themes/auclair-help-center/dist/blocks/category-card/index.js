import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { registerBlockType } from '@wordpress/blocks';
import { useBlockProps, InspectorControls } from '@wordpress/block-editor';
import { PanelBody, TextControl, ToggleControl } from '@wordpress/components';
import ServerSideRender from '@wordpress/server-side-render';
import { __ } from '@wordpress/i18n';
import metadata from './block.json';
registerBlockType(metadata.name, {
    edit: ({ attributes, setAttributes }) => {
        const termId = attributes.termId;
        const animate = attributes.animate;
        const blockProps = useBlockProps();
        return (_jsxs(_Fragment, { children: [_jsx(InspectorControls, { children: _jsxs(PanelBody, { title: __('Settings', 'auclair'), children: [_jsx(TextControl, { label: __('Term ID', 'auclair'), type: "number", value: termId ? String(termId) : '', onChange: (value) => setAttributes({ termId: Number(value) || 0 }) }), _jsx(ToggleControl, { label: __('Ring animation on hover', 'auclair'), checked: !!animate, onChange: (animate) => setAttributes({ animate }) })] }) }), _jsx("div", { ...blockProps, children: termId ? (_jsx(ServerSideRender, { block: metadata.name, attributes: attributes })) : (_jsx("p", { children: __('Choose a help_category term ID in the sidebar.', 'auclair') })) })] }));
    },
    save: () => null,
});
