import { store, getContext, getElement } from '@wordpress/interactivity';

interface Category {
	id: number;
	label: string;
	slug: string;
}

interface Errors {
	category?: string;
	subject?: string;
	description?: string;
	email?: string;
	attachment?: string;
}

interface Context {
	categories: Category[];
	categoryId: number;
	categoryLabel: string;
	categoryOpen: boolean;
	subject: string;
	description: string;
	email: string;
	website: string;
	fileName: string;
	attachmentPlaceholder: string;
	errors: Errors;
	submitting: boolean;
	submitError: string;
	nonce: string;
	endpoint: string;
	successUrl: string;
	maxUploadBytes: number;
	allowedTypes: string[];
	// Present only on a category <li>'s own data-wp-context.
	categoryOptionId?: number;
	categoryOptionLabel?: string;
}

// One ticket-form is expected per page; the selected File object is kept
// out of context because Interactivity context is serialised to JSON.
let selectedFile: File | null = null;

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function validate( context: Context ): Errors {
	const errors: Errors = {};

	if ( ! context.categoryId ) {
		errors.category = 'Select a category.';
	}

	if ( ! context.subject.trim() ) {
		errors.subject = 'Subject is required.';
	} else if ( context.subject.length > 120 ) {
		errors.subject = 'Subject must be 120 characters or fewer.';
	}

	if ( ! context.description.trim() ) {
		errors.description = 'Please add some details.';
	}

	if ( ! context.email.trim() ) {
		errors.email = 'Email is required.';
	} else if ( ! EMAIL_PATTERN.test( context.email.trim() ) ) {
		errors.email = 'Enter a valid email address.';
	}

	return errors;
}

store( 'auclair', {
	state: {
		get isSelectedCategory(): boolean {
			const context = getContext< Context >();
			return context.categoryOptionId === context.categoryId;
		},
		get attachmentLabel(): string {
			const context = getContext< Context >();
			return context.fileName || context.attachmentPlaceholder;
		},
	},
	actions: {
		toggleCategory( event: MouseEvent ) {
			event.stopPropagation();
			const context = getContext< Context >();
			context.categoryOpen = ! context.categoryOpen;
		},
		closeCategoryOnOutsideClick( event: MouseEvent ) {
			const context = getContext< Context >();

			if ( ! context.categoryOpen ) {
				return;
			}

			const { ref } = getElement();
			const wrapper = ( ref as HTMLElement ).closest( '.auclair-ticket-form__select' );

			if ( wrapper && ! wrapper.contains( event.target as Node ) ) {
				context.categoryOpen = false;
			}
		},
		closeCategoryOnEscape( event: KeyboardEvent ) {
			if ( event.key !== 'Escape' ) {
				return;
			}

			const context = getContext< Context >();

			if ( context.categoryOpen ) {
				context.categoryOpen = false;
				( getElement().ref as HTMLElement ).focus();
			}
		},
		selectCategory() {
			const context = getContext< Context >();

			if ( context.categoryOptionId === undefined ) {
				return;
			}

			context.categoryId = context.categoryOptionId;
			context.categoryLabel = context.categoryOptionLabel ?? '';
			context.categoryOpen = false;
			delete context.errors.category;
		},
		setSubject( event: InputEvent ) {
			const context = getContext< Context >();
			context.subject = ( event.target as HTMLInputElement ).value;
		},
		setDescription( event: InputEvent ) {
			const context = getContext< Context >();
			context.description = ( event.target as HTMLTextAreaElement ).value;
		},
		setEmail( event: InputEvent ) {
			const context = getContext< Context >();
			context.email = ( event.target as HTMLInputElement ).value;
		},
		setWebsite( event: InputEvent ) {
			const context = getContext< Context >();
			context.website = ( event.target as HTMLInputElement ).value;
		},
		openFilePicker() {
			const { ref } = getElement();
			const input = ( ref as HTMLElement ).querySelector< HTMLInputElement >( 'input[type="file"]' );
			input?.click();
		},
		setFile( event: InputEvent ) {
			const context = getContext< Context >();
			const input = event.target as HTMLInputElement;
			const file = input.files?.[ 0 ] ?? null;

			if ( ! file ) {
				selectedFile = null;
				context.fileName = '';
				return;
			}

			if ( context.allowedTypes.length && ! context.allowedTypes.includes( file.type ) ) {
				context.errors = { ...context.errors, attachment: 'That file type is not supported.' };
				input.value = '';
				selectedFile = null;
				context.fileName = '';
				return;
			}

			if ( file.size > context.maxUploadBytes ) {
				context.errors = { ...context.errors, attachment: 'That file is too large.' };
				input.value = '';
				selectedFile = null;
				context.fileName = '';
				return;
			}

			const { attachment, ...rest } = context.errors;
			context.errors = rest;
			selectedFile = file;
			context.fileName = file.name;
		},
		*submitTicket( event: SubmitEvent ) {
			event.preventDefault();

			const context = getContext< Context >();
			const errors = validate( context );

			if ( Object.keys( errors ).length > 0 ) {
				context.errors = errors;
				return;
			}

			if ( context.website ) {
				// Honeypot filled in — pretend to succeed without submitting.
				window.location.href = context.successUrl;
				return;
			}

			context.errors = {};
			context.submitting = true;
			context.submitError = '';

			const formData = new window.FormData();
			formData.append( 'category', String( context.categoryId ) );
			formData.append( 'subject', context.subject );
			formData.append( 'description', context.description );
			formData.append( 'email', context.email );

			if ( selectedFile ) {
				formData.append( 'attachment', selectedFile );
			}

			try {
				const response = ( yield window.fetch( context.endpoint, {
					method: 'POST',
					headers: { 'X-WP-Nonce': context.nonce },
					credentials: 'same-origin',
					body: formData,
				} ) ) as Response;

				const payload = ( yield response.json() ) as { redirect?: string; message?: string };

				if ( ! response.ok ) {
					throw new Error( payload.message || 'Something went wrong. Please try again.' );
				}

				window.location.href = payload.redirect || context.successUrl;
			} catch ( error ) {
				context.submitting = false;
				context.submitError = error instanceof Error ? error.message : 'Something went wrong. Please try again.';
			}
		},
	},
} );
