import { store, getContext, getElement } from '@wordpress/interactivity';

interface Context {
	postId: number;
	nonce: string;
	endpoint: string;
	currentVote: '' | 'up' | 'down';
	votedUp: boolean;
	votedDown: boolean;
	submitting: boolean;
	error: string;
	thanksUp: string;
	thanksDown: string;
	showThanks: boolean;
	thanksMessage: string;
}

const THANKS_VISIBLE_MS = 4000;

interface Actions {
	castVote: () => Generator< unknown, void, unknown >;
}

store< { actions: Actions } >( 'auclair', {
	actions: {
		*castVote() {
			const context = getContext< Context >();

			const { ref } = getElement();
			const value = ref?.getAttribute( 'data-vote-value' );

			if ( 'up' !== value && 'down' !== value ) {
				return;
			}

			// Re-clicking the already-selected choice is a no-op — nothing
			// changed, so skip the round trip. Clicking the *other* button is
			// always allowed, even after a previous vote, so a visitor can
			// change their mind.
			if ( context.submitting || context.currentVote === value ) {
				return;
			}

			context.submitting = true;
			context.error = '';

			try {
				const response = ( yield window.fetch( context.endpoint, {
					method: 'POST',
					headers: { 'Content-Type': 'application/json', 'X-WP-Nonce': context.nonce },
					credentials: 'same-origin',
					body: JSON.stringify( { id: context.postId, value } ),
				} ) ) as Response;

				if ( ! response.ok ) {
					throw new Error();
				}

				context.currentVote = value;
				context.votedUp = 'up' === value;
				context.votedDown = 'down' === value;
				context.thanksMessage = 'up' === value ? context.thanksUp : context.thanksDown;
				context.showThanks = true;
				setTimeout( () => {
					context.showThanks = false;
				}, THANKS_VISIBLE_MS );
			} catch ( error ) {
				context.error = 'Something went wrong. Please try again.';
			} finally {
				context.submitting = false;
			}
		},
	},
} );
