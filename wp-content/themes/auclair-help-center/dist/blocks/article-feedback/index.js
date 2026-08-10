import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { registerBlockType } from '@wordpress/blocks';
import { useBlockProps, InspectorControls } from '@wordpress/block-editor';
import { PanelBody, TextControl } from '@wordpress/components';
import ServerSideRender from '@wordpress/server-side-render';
import { __ } from '@wordpress/i18n';
import metadata from './block.json';
registerBlockType(metadata.name, {
    edit: ({ attributes, setAttributes }) => {
        const upLabel = attributes.upLabel;
        const downLabel = attributes.downLabel;
        const thanksUp = attributes.thanksUp;
        const thanksDown = attributes.thanksDown;
        const blockProps = useBlockProps();
        return (_jsxs(_Fragment, { children: [_jsx(InspectorControls, { children: _jsxs(PanelBody, { title: __('Settings', 'auclair'), children: [_jsx(TextControl, { label: __('Yes label', 'auclair'), value: upLabel, onChange: (upLabel) => setAttributes({ upLabel }) }), _jsx(TextControl, { label: __('No label', 'auclair'), value: downLabel, onChange: (downLabel) => setAttributes({ downLabel }) }), _jsx(TextControl, { label: __('Thanks (yes)', 'auclair'), value: thanksUp, onChange: (thanksUp) => setAttributes({ thanksUp }) }), _jsx(TextControl, { label: __('Thanks (no)', 'auclair'), value: thanksDown, onChange: (thanksDown) => setAttributes({ thanksDown }) })] }) }), _jsx("div", { ...blockProps, children: _jsx(ServerSideRender, { block: metadata.name, attributes: attributes }) })] }));
    },
    save: () => null,
});
