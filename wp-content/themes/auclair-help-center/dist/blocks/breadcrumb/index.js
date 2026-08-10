import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { registerBlockType } from '@wordpress/blocks';
import { useBlockProps, InspectorControls } from '@wordpress/block-editor';
import { PanelBody, ToggleControl, TextControl } from '@wordpress/components';
import ServerSideRender from '@wordpress/server-side-render';
import { __ } from '@wordpress/i18n';
import metadata from './block.json';
registerBlockType(metadata.name, {
    edit: ({ attributes, setAttributes }) => {
        const showBack = attributes.showBack;
        const overrideLabel = attributes.overrideLabel;
        const overrideUrl = attributes.overrideUrl;
        const blockProps = useBlockProps();
        return (_jsxs(_Fragment, { children: [_jsx(InspectorControls, { children: _jsxs(PanelBody, { title: __('Settings', 'auclair'), children: [_jsx(ToggleControl, { label: __('Show back chevron', 'auclair'), checked: !!showBack, onChange: (showBack) => setAttributes({ showBack }) }), _jsx(TextControl, { label: __('Override last crumb label', 'auclair'), help: __('Leave empty to derive from the current page.', 'auclair'), value: overrideLabel, onChange: (overrideLabel) => setAttributes({ overrideLabel }) }), _jsx(TextControl, { label: __('Override last crumb URL', 'auclair'), value: overrideUrl, onChange: (overrideUrl) => setAttributes({ overrideUrl }) })] }) }), _jsx("div", { ...blockProps, children: _jsx(ServerSideRender, { block: metadata.name, attributes: attributes }) })] }));
    },
    save: () => null,
});
