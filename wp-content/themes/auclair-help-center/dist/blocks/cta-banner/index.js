import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { registerBlockType } from '@wordpress/blocks';
import { useBlockProps, RichText, InspectorControls, LinkControl } from '@wordpress/block-editor';
import { PanelBody, ColorPicker, Popover, Button as WPButton } from '@wordpress/components';
import { __ } from '@wordpress/i18n';
import { useState } from '@wordpress/element';
import metadata from './block.json';
import { iconSvg } from '../icon-tile/icons';
const noop = () => undefined;
const Panel = ({ heading, body, buttonLabel, buttonUrl, accent, editable, onChangeHeading = noop, onChangeBody = noop, onChangeButtonLabel = noop, }) => (_jsxs("div", { className: "auclair-cta-banner auclair-ring-hover", style: { '--auclair-ring-accent': accent }, children: [_jsxs("span", { className: "auclair-icon-tile is-large", style: { '--auclair-icon-accent': accent }, children: [_jsx("span", { className: "auclair-icon-tile__glow" }), _jsx("span", { className: "auclair-icon-tile__icon", dangerouslySetInnerHTML: { __html: iconSvg('question-circle', 28) } })] }), _jsx("div", { className: "auclair-cta-banner__body", children: editable ? (_jsxs(_Fragment, { children: [_jsx(RichText, { tagName: "h2", className: "auclair-cta-banner__heading", value: heading, onChange: onChangeHeading, allowedFormats: [] }), _jsx(RichText, { tagName: "p", className: "auclair-cta-banner__text", value: body, onChange: onChangeBody, allowedFormats: [] })] })) : (_jsxs(_Fragment, { children: [_jsx(RichText.Content, { tagName: "h2", className: "auclair-cta-banner__heading", value: heading }), _jsx(RichText.Content, { tagName: "p", className: "auclair-cta-banner__text", value: body })] })) }), editable ? (_jsx(RichText, { tagName: "span", className: "auclair-button is-primary auclair-cta-banner__button", value: buttonLabel, onChange: onChangeButtonLabel, allowedFormats: [] })) : (_jsx(RichText.Content, { tagName: "a", className: "auclair-button is-primary auclair-cta-banner__button", value: buttonLabel, 
            // @ts-ignore -- href is a valid prop on the rendered anchor tag.
            href: buttonUrl }))] }));
registerBlockType(metadata.name, {
    edit: ({ attributes, setAttributes }) => {
        const heading = attributes.heading;
        const body = attributes.body;
        const buttonLabel = attributes.buttonLabel;
        const buttonUrl = attributes.buttonUrl;
        const accent = attributes.accent;
        const [isEditingLink, setIsEditingLink] = useState(false);
        const blockProps = useBlockProps();
        return (_jsxs(_Fragment, { children: [_jsx(InspectorControls, { children: _jsxs(PanelBody, { title: __('Settings', 'auclair'), children: [_jsx("p", { children: __('Button URL', 'auclair') }), _jsx(WPButton, { variant: "secondary", onClick: () => setIsEditingLink(true), children: buttonUrl || __('Add link', 'auclair') }), isEditingLink && (_jsx(Popover, { onClose: () => setIsEditingLink(false), children: _jsx(LinkControl, { value: { url: buttonUrl }, onChange: (value) => setAttributes({ buttonUrl: value?.url || '' }) }) })), _jsx("p", { children: __('Accent colour', 'auclair') }), _jsx(ColorPicker, { color: accent, onChange: (accent) => setAttributes({ accent }), enableAlpha: false })] }) }), _jsx("div", { ...blockProps, children: _jsx(Panel, { heading: heading, body: body, buttonLabel: buttonLabel, buttonUrl: buttonUrl, accent: accent, editable: true, onChangeHeading: (heading) => setAttributes({ heading }), onChangeBody: (body) => setAttributes({ body }), onChangeButtonLabel: (buttonLabel) => setAttributes({ buttonLabel }) }) })] }));
    },
    save: ({ attributes }) => {
        const heading = attributes.heading;
        const body = attributes.body;
        const buttonLabel = attributes.buttonLabel;
        const buttonUrl = attributes.buttonUrl;
        const accent = attributes.accent;
        const blockProps = useBlockProps.save();
        return (_jsx("div", { ...blockProps, children: _jsx(Panel, { heading: heading, body: body, buttonLabel: buttonLabel, buttonUrl: buttonUrl, accent: accent, editable: false }) }));
    },
});
