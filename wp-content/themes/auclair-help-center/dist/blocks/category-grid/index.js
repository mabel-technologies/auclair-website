import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { registerBlockType } from '@wordpress/blocks';
import { useBlockProps, InspectorControls } from '@wordpress/block-editor';
import { PanelBody, RangeControl, ToggleControl } from '@wordpress/components';
import ServerSideRender from '@wordpress/server-side-render';
import { __ } from '@wordpress/i18n';
import metadata from './block.json';
registerBlockType(metadata.name, {
    edit: ({ attributes, setAttributes }) => {
        const columns = attributes.columns;
        const showCount = attributes.showCount;
        const blockProps = useBlockProps();
        return (_jsxs(_Fragment, { children: [_jsx(InspectorControls, { children: _jsxs(PanelBody, { title: __('Settings', 'auclair'), children: [_jsx(RangeControl, { label: __('Columns', 'auclair'), value: columns, min: 2, max: 4, onChange: (columns) => setAttributes({ columns: columns || 4 }) }), _jsx(ToggleControl, { label: __('Show article count', 'auclair'), checked: !!showCount, onChange: (showCount) => setAttributes({ showCount }) })] }) }), _jsx("div", { ...blockProps, children: _jsx(ServerSideRender, { block: metadata.name, attributes: attributes }) })] }));
    },
    save: () => null,
});
