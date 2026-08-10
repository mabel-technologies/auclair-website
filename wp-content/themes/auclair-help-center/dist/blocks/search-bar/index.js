import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { registerBlockType } from '@wordpress/blocks';
import { useBlockProps, InspectorControls } from '@wordpress/block-editor';
import { PanelBody, TextControl, ToggleControl } from '@wordpress/components';
import { __ } from '@wordpress/i18n';
import metadata from './block.json';
const markup = (placeholder, action, liveSuggest) => (_jsxs("div", { className: "auclair-search-bar", "data-wp-interactive": "auclair", "data-wp-context": JSON.stringify({ action, liveSuggest }), children: [_jsx("span", { className: "auclair-search-bar__icon", "aria-hidden": "true", children: _jsxs("svg", { width: "20", height: "20", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "1.5", strokeLinecap: "round", strokeLinejoin: "round", children: [_jsx("circle", { cx: "11", cy: "11", r: "7" }), _jsx("line", { x1: "21", y1: "21", x2: "16.65", y2: "16.65" })] }) }), _jsx("input", { type: "text", className: "auclair-search-bar__input", placeholder: placeholder, "data-wp-bind--value": "state.searchQuery", "data-wp-on--input": "actions.setSearchQuery", "data-wp-on--keydown": "actions.handleSearchKeydown", "aria-label": __('Search for help', 'auclair') }), _jsx("ul", { className: "auclair-search-bar__suggestions", hidden: true, "data-wp-bind--hidden": "!state.hasSuggestions", children: _jsx("template", { "data-wp-each--item": "state.suggestions", children: _jsx("li", { children: _jsx("a", { "data-wp-bind--href": "context.item.url", "data-wp-text": "context.item.title" }) }) }) })] }));
registerBlockType(metadata.name, {
    edit: ({ attributes, setAttributes }) => {
        const placeholder = attributes.placeholder;
        const action = attributes.action;
        const liveSuggest = attributes.liveSuggest;
        const blockProps = useBlockProps();
        return (_jsxs(_Fragment, { children: [_jsx(InspectorControls, { children: _jsxs(PanelBody, { title: __('Settings', 'auclair'), children: [_jsx(TextControl, { label: __('Placeholder', 'auclair'), value: placeholder, onChange: (placeholder) => setAttributes({ placeholder }) }), _jsx(TextControl, { label: __('Search action URL', 'auclair'), help: __('Use %s as the query placeholder.', 'auclair'), value: action, onChange: (action) => setAttributes({ action }) }), _jsx(ToggleControl, { label: __('Live suggestions', 'auclair'), checked: !!liveSuggest, onChange: (liveSuggest) => setAttributes({ liveSuggest }) })] }) }), _jsx("div", { ...blockProps, children: markup(placeholder, action, liveSuggest) })] }));
    },
    save: ({ attributes }) => {
        const placeholder = attributes.placeholder;
        const action = attributes.action;
        const liveSuggest = attributes.liveSuggest;
        const blockProps = useBlockProps.save();
        return _jsx("div", { ...blockProps, children: markup(placeholder, action, liveSuggest) });
    },
});
