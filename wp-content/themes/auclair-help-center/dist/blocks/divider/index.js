import { jsx as _jsx, Fragment as _Fragment, jsxs as _jsxs } from "react/jsx-runtime";
import { registerBlockType } from '@wordpress/blocks';
import { useBlockProps, InspectorControls } from '@wordpress/block-editor';
import { PanelBody, ToggleControl } from '@wordpress/components';
import { __ } from '@wordpress/i18n';
import metadata from './block.json';
registerBlockType(metadata.name, {
    edit: ({ attributes, setAttributes }) => {
        const inset = attributes.inset;
        const blockProps = useBlockProps({
            className: `auclair-divider${inset ? ' is-inset' : ''}`,
        });
        return (_jsxs(_Fragment, { children: [_jsx(InspectorControls, { children: _jsx(PanelBody, { title: __('Settings', 'auclair'), children: _jsx(ToggleControl, { label: __('Inset', 'auclair'), checked: !!inset, onChange: (inset) => setAttributes({ inset }) }) }) }), _jsx("hr", { ...blockProps })] }));
    },
    save: ({ attributes }) => {
        const blockProps = useBlockProps.save({
            className: `auclair-divider${attributes.inset ? ' is-inset' : ''}`,
        });
        return _jsx("hr", { ...blockProps });
    },
});
