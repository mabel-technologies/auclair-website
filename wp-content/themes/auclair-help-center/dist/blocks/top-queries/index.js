import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { registerBlockType } from '@wordpress/blocks';
import { useBlockProps, InspectorControls } from '@wordpress/block-editor';
import { PanelBody, SelectControl, RangeControl } from '@wordpress/components';
import ServerSideRender from '@wordpress/server-side-render';
import { __ } from '@wordpress/i18n';
import metadata from './block.json';
const SOURCES = [
    { label: __('Sticky (is_top_query)', 'auclair'), value: 'sticky' },
    { label: __('Most viewed', 'auclair'), value: 'most-viewed' },
    { label: __('Manual', 'auclair'), value: 'manual' },
];
registerBlockType(metadata.name, {
    edit: ({ attributes, setAttributes }) => {
        const source = attributes.source;
        const limit = attributes.limit;
        const blockProps = useBlockProps();
        return (_jsxs(_Fragment, { children: [_jsx(InspectorControls, { children: _jsxs(PanelBody, { title: __('Settings', 'auclair'), children: [_jsx(SelectControl, { label: __('Source', 'auclair'), value: source, options: SOURCES, onChange: (source) => setAttributes({ source }) }), _jsx(RangeControl, { label: __('Number of items', 'auclair'), value: limit, min: 1, max: 20, onChange: (limit) => setAttributes({ limit: limit || 10 }) })] }) }), _jsx("div", { ...blockProps, children: _jsx(ServerSideRender, { block: metadata.name, attributes: attributes }) })] }));
    },
    save: () => null,
});
