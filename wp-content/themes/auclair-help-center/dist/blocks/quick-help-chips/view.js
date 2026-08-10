import { store, getContext } from '@wordpress/interactivity';
// Get a live reference to the shared 'auclair' state, owned by
// search-bar/view.ts, so a chip click can write into the same search query.
const { state } = store('auclair');
store('auclair', {
    actions: {
        fillSearchFromChip() {
            const context = getContext();
            state.searchQuery = context.chipLabel;
        },
    },
});
