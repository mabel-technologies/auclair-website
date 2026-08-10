import { jsx as _jsx } from "react/jsx-runtime";
import { registerBlockType } from '@wordpress/blocks';
import { useBlockProps } from '@wordpress/block-editor';
import ServerSideRender from '@wordpress/server-side-render';
import metadata from './block.json';
registerBlockType(metadata.name, {
    edit: ({ attributes }) => {
        const blockProps = useBlockProps();
        return (_jsx("div", { ...blockProps, children: _jsx(ServerSideRender, { block: metadata.name, attributes: attributes }) }));
    },
    save: () => null,
});
