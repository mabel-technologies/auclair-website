import { store, getContext, getElement } from '@wordpress/interactivity';

interface Context {
	action: string;
}

interface State {
	searchQuery: string;
}

interface Actions {
	setSearchQuery: () => void;
	handleSearchKeydown: ( event: KeyboardEvent ) => void;
	clearSearch: ( event: Event ) => void;
}

const { state } = store< { state: State; actions: Actions } >( 'auclair', {
	state: {
		searchQuery: '',
	},
	actions: {
		// The moment there's anything to search for, jump straight to the
		// results page — no need to wait for Enter. That page takes over
		// with its own live AJAX search for every keystroke after this one.
		setSearchQuery() {
			const context = getContext< Context >();
			const { ref } = getElement();
			const value = ( ref as HTMLInputElement ).value;

			state.searchQuery = value;

			if ( ! value.trim() ) {
				return;
			}

			window.location.href = context.action.replace( '%s', encodeURIComponent( value ) );
		},
		handleSearchKeydown( event: KeyboardEvent ) {
			if ( event.key !== 'Enter' ) {
				return;
			}

			const context = getContext< Context >();
			window.location.href = context.action.replace( '%s', encodeURIComponent( state.searchQuery ) );
		},
		clearSearch( event: Event ) {
			event.preventDefault();

			const { ref } = getElement();
			const root = ( ref as HTMLElement ).closest( '.auclair-search-bar' );
			const input = root?.querySelector< HTMLInputElement >( '.auclair-search-bar__input' );

			if ( ! input ) {
				return;
			}

			input.value = '';
			state.searchQuery = '';
			input.focus();
		},
	},
} );
