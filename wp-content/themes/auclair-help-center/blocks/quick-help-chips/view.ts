import { store, getContext } from '@wordpress/interactivity';

interface Context {
	chipLabel: string;
}

interface State {
	searchQuery: string;
}

// Get a live reference to the shared 'auclair' state, owned by
// search-bar/view.ts, so a chip click can write into the same search query.
const { state } = store< { state: State } >( 'auclair' );

store( 'auclair', {
	actions: {
		fillSearchFromChip() {
			const context = getContext< Context >();
			state.searchQuery = context.chipLabel;
		},
	},
} );
