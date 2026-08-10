import { store, getContext, getElement } from '@wordpress/interactivity';
let suggestionRequestId = 0;
const { state } = store('auclair', {
    state: {
        searchQuery: '',
        suggestions: [],
        get hasSuggestions() {
            return this.suggestions.length > 0;
        },
    },
    actions: {
        *setSearchQuery() {
            const context = getContext();
            const { ref } = getElement();
            const value = ref.value;
            state.searchQuery = value;
            if (!context.liveSuggest || value.trim().length < 2) {
                state.suggestions = [];
                return;
            }
            const requestId = ++suggestionRequestId;
            const response = (yield window.fetch(`/wp-json/wp/v2/kb_article?search=${encodeURIComponent(value)}&per_page=5&_fields=id,title,link`));
            if (requestId !== suggestionRequestId || !response.ok) {
                return;
            }
            const results = (yield response.json());
            state.suggestions = results.map((result) => ({
                id: result.id,
                title: result.title.rendered,
                url: result.link,
            }));
        },
        handleSearchKeydown(event) {
            if (event.key !== 'Enter') {
                return;
            }
            const context = getContext();
            window.location.href = context.action.replace('%s', encodeURIComponent(state.searchQuery));
        },
    },
});
