import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { registerBlockType } from '@wordpress/blocks';
import { useBlockProps, InspectorControls } from '@wordpress/block-editor';
import { PanelBody, TextControl, SelectControl, RangeControl } from '@wordpress/components';
import ServerSideRender from '@wordpress/server-side-render';
import { __ } from '@wordpress/i18n';
import metadata from './block.json';
const SOURCES = [
    { label: __('Most viewed', 'auclair'), value: 'popular' },
    { label: __('Help tags', 'auclair'), value: 'term' },
    { label: __('Manual', 'auclair'), value: 'manual' },
];
registerBlockType(metadata.name, {
    edit: ({ attributes, setAttributes }) => {
        const label = attributes.label;
        const source = attributes.source;
        const limit = attributes.limit;
        const blockProps = useBlockProps();
        return (_jsxs(_Fragment, { children: [_jsx(InspectorControls, { children: _jsxs(PanelBody, { title: __('Settings', 'auclair'), children: [_jsx(TextControl, { label: __('Label', 'auclair'), value: label, onChange: (label) => setAttributes({ label }) }), _jsx(SelectControl, { label: __('Source', 'auclair'), value: source, options: SOURCES, onChange: (source) => setAttributes({ source }) }), _jsx(RangeControl, { label: __('Number of chips', 'auclair'), value: limit, min: 1, max: 8, onChange: (limit) => setAttributes({ limit: limit || 4 }) }), 'manual' === source && (_jsx("p", { children: __('Manual items are edited via the Code Editor block attributes for now.', 'auclair') }))] }) }), _jsx("div", { ...blockProps, children: _jsx(ServerSideRender, { block: metadata.name, attributes: attributes }) })] }));
    },
    save: () => null,
});
