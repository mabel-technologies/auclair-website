import { store, getContext, getElement } from '@wordpress/interactivity';

interface Suggestion {
	id: number;
	title: string;
	url: string;
}

interface Context {
	action: string;
	liveSuggest: boolean;
}

interface State {
	searchQuery: string;
	suggestions: Suggestion[];
	hasSuggestions: boolean;
}

interface Actions {
	setSearchQuery: () => Generator< unknown, void, unknown >;
	handleSearchKeydown: ( event: KeyboardEvent ) => void;
}

let suggestionRequestId = 0;

const { state } = store< { state: State; actions: Actions } >( 'auclair', {
	state: {
		searchQuery: '',
		suggestions: [],
		get hasSuggestions(): boolean {
			return this.suggestions.length > 0;
		},
	},
	actions: {
		*setSearchQuery() {
			const context = getContext< Context >();
			const { ref } = getElement();
			const value = ( ref as HTMLInputElement ).value;

			state.searchQuery = value;

			if ( ! context.liveSuggest || value.trim().length < 2 ) {
				state.suggestions = [];
				return;
			}

			const requestId = ++suggestionRequestId;

			const response = ( yield window.fetch(
				`/wp-json/wp/v2/kb_article?search=${ encodeURIComponent( value ) }&per_page=5&_fields=id,title,link`
			) ) as Response;

			if ( requestId !== suggestionRequestId || ! response.ok ) {
				return;
			}

			const results = ( yield response.json() ) as unknown;

			state.suggestions = ( results as Array< { id: number; title: { rendered: string }; link: string } > ).map(
				( result ) => ( {
					id: result.id,
					title: result.title.rendered,
					url: result.link,
				} )
			);
		},
		handleSearchKeydown( event: KeyboardEvent ) {
			if ( event.key !== 'Enter' ) {
				return;
			}

			const context = getContext< Context >();
			window.location.href = context.action.replace( '%s', encodeURIComponent( state.searchQuery ) );
		},
	},
} );
