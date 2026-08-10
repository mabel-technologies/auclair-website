import { jsx as _jsx, Fragment as _Fragment, jsxs as _jsxs } from "react/jsx-runtime";
import { registerBlockType } from '@wordpress/blocks';
import { useBlockProps, InspectorControls } from '@wordpress/block-editor';
import { PanelBody, TextControl } from '@wordpress/components';
import ServerSideRender from '@wordpress/server-side-render';
import { __ } from '@wordpress/i18n';
import metadata from './block.json';
registerBlockType(metadata.name, {
    edit: ({ attributes, setAttributes }) => {
        const homeUrl = attributes.homeUrl;
        const blockProps = useBlockProps();
        return (_jsxs(_Fragment, { children: [_jsx(InspectorControls, { children: _jsx(PanelBody, { title: __('Settings', 'auclair'), children: _jsx(TextControl, { label: __('Home URL', 'auclair'), value: homeUrl, onChange: (homeUrl) => setAttributes({ homeUrl }) }) }) }), _jsx("div", { ...blockProps, children: _jsx(ServerSideRender, { block: metadata.name, attributes: attributes }) })] }));
    },
    save: () => null,
});
