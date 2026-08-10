import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { registerBlockType } from '@wordpress/blocks';
import { useBlockProps, InspectorControls } from '@wordpress/block-editor';
import { PanelBody, SelectControl, ColorPicker } from '@wordpress/components';
import { __ } from '@wordpress/i18n';
import metadata from './block.json';
import { ICON_OPTIONS, iconSvg } from './icons';
registerBlockType(metadata.name, {
    edit: ({ attributes, setAttributes }) => {
        const icon = attributes.icon;
        const accent = attributes.accent;
        const size = attributes.size;
        const blockProps = useBlockProps({
            className: `auclair-icon-tile is-${size}`,
            style: { '--auclair-icon-accent': accent },
        });
        return (_jsxs(_Fragment, { children: [_jsx(InspectorControls, { children: _jsxs(PanelBody, { title: __('Settings', 'auclair'), children: [_jsx(SelectControl, { label: __('Icon', 'auclair'), value: icon, options: ICON_OPTIONS, onChange: (icon) => setAttributes({ icon }) }), _jsx(SelectControl, { label: __('Size', 'auclair'), value: size, options: [
                                    { label: __('Default', 'auclair'), value: 'default' },
                                    { label: __('Large', 'auclair'), value: 'large' },
                                ], onChange: (size) => setAttributes({ size }) }), _jsx("p", { children: __('Accent colour', 'auclair') }), _jsx(ColorPicker, { color: accent, onChange: (accent) => setAttributes({ accent }), enableAlpha: false })] }) }), _jsxs("span", { ...blockProps, children: [_jsx("span", { className: "auclair-icon-tile__glow" }), _jsx("span", { className: "auclair-icon-tile__icon", dangerouslySetInnerHTML: {
                                __html: iconSvg(icon, size === 'large' ? 32 : 24),
                            } })] })] }));
    },
    save: ({ attributes }) => {
        const icon = attributes.icon;
        const accent = attributes.accent;
        const size = attributes.size;
        const blockProps = useBlockProps.save({
            className: `auclair-icon-tile is-${size}`,
            style: { '--auclair-icon-accent': accent },
        });
        return (_jsxs("span", { ...blockProps, children: [_jsx("span", { className: "auclair-icon-tile__glow" }), _jsx("span", { className: "auclair-icon-tile__icon", dangerouslySetInnerHTML: {
                        __html: iconSvg(icon, size === 'large' ? 32 : 24),
                    } })] }));
    },
});
