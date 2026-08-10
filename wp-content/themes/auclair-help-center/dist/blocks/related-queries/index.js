import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { registerBlockType } from '@wordpress/blocks';
import { useBlockProps, InspectorControls } from '@wordpress/block-editor';
import { PanelBody, SelectControl, RangeControl, TextControl } from '@wordpress/components';
import ServerSideRender from '@wordpress/server-side-render';
import { __ } from '@wordpress/i18n';
import metadata from './block.json';
const SOURCES = [
    { label: __('Same category (falls back from related field)', 'auclair'), value: 'same-category' },
    { label: __('Manual', 'auclair'), value: 'manual' },
];
registerBlockType(metadata.name, {
    edit: ({ attributes, setAttributes }) => {
        const heading = attributes.heading;
        const source = attributes.source;
        const limit = attributes.limit;
        const blockProps = useBlockProps();
        return (_jsxs(_Fragment, { children: [_jsx(InspectorControls, { children: _jsxs(PanelBody, { title: __('Settings', 'auclair'), children: [_jsx(TextControl, { label: __('Heading', 'auclair'), value: heading, onChange: (heading) => setAttributes({ heading }) }), _jsx(SelectControl, { label: __('Source', 'auclair'), value: source, options: SOURCES, onChange: (source) => setAttributes({ source }) }), _jsx(RangeControl, { label: __('Number of items', 'auclair'), value: limit, min: 1, max: 8, onChange: (limit) => setAttributes({ limit: limit || 4 }) })] }) }), _jsx("div", { ...blockProps, children: _jsx(ServerSideRender, { block: metadata.name, attributes: attributes }) })] }));
    },
    save: () => null,
});
