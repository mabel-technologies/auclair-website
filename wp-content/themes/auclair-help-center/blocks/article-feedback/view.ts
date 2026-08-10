import { store, getContext, getElement } from '@wordpress/interactivity';

interface Context {
	postId: number;
	nonce: string;
	endpoint: string;
	voted: boolean;
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

			if ( context.voted || context.submitting ) {
				return;
			}

			const { ref } = getElement();
			const value = ref?.getAttribute( 'data-vote-value' );

			if ( 'up' !== value && 'down' !== value ) {
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

				context.voted = true;
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
