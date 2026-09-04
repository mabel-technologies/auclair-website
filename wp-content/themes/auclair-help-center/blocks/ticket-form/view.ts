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
	subjectMax: number;
	descriptionMin: number;
	// Fields the user has left once. Errors for a field stay hidden until
	// it has been blurred, so typing a half-finished email isn't an error.
	touched: Record< string, boolean >;
	// Present only on a category <li>'s own data-wp-context.
	categoryOptionId?: number;
	categoryOptionLabel?: string;
}

// One ticket-form is expected per page; the selected File object is kept
// out of context because Interactivity context is serialised to JSON.
let selectedFile: File | null = null;

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

type Field = 'category' | 'subject' | 'description' | 'email';

/**
 * Validate a single field. Returning undefined means the field is fine.
 *
 * Kept per-field so the same rules drive both the on-blur check and the
 * full check on submit — one source of truth for the messages.
 */
function validateField( context: Context, field: Field ): string | undefined {
	if ( 'category' === field ) {
		return context.categoryId ? undefined : 'Select a category.';
	}

	if ( 'subject' === field ) {
		if ( ! context.subject.trim() ) {
			return 'Subject is required.';
		}

		return context.subject.length > context.subjectMax
			? `Subject must be ${ context.subjectMax } characters or fewer.`
			: undefined;
	}

	if ( 'description' === field ) {
		const value = context.description.trim();

		if ( ! value ) {
			return 'Please add some details.';
		}

		return value.length < context.descriptionMin
			? `Please add at least ${ context.descriptionMin } characters so we can help.`
			: undefined;
	}

	const email = context.email.trim();

	if ( ! email ) {
		return 'Email is required.';
	}

	return EMAIL_PATTERN.test( email ) ? undefined : 'Enter a valid email address.';
}

const FIELDS: Field[] = [ 'category', 'subject', 'description', 'email' ];

function validate( context: Context ): Errors {
	const errors: Errors = {};

	FIELDS.forEach( ( field ) => {
		const message = validateField( context, field );

		if ( message ) {
			errors[ field ] = message;
		}
	} );

	return errors;
}

/**
 * Re-check one field and show or clear its error.
 *
 * While the user is still typing (`live`), an error is only ever cleared —
 * a field that has never been blurred stays quiet, and one already showing
 * an error clears the moment it becomes valid.
 */
function refreshField( context: Context, field: Field, live: boolean ) {
	const message = validateField( context, field );
	const { [ field ]: current, ...rest } = context.errors;

	if ( message && ( ! live || current ) && context.touched[ field ] ) {
		context.errors = { ...rest, [ field ]: message };
		return;
	}

	if ( ! message ) {
		context.errors = rest;
	}
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
		get subjectCount(): string {
			const context = getContext< Context >();
			return `${ context.subject.length }/${ context.subjectMax }`;
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
			context.touched = { ...context.touched, category: true };
			delete context.errors.category;
		},
		setSubject( event: InputEvent ) {
			const context = getContext< Context >();
			context.subject = ( event.target as HTMLInputElement ).value;
			refreshField( context, 'subject', true );
		},
		setDescription( event: InputEvent ) {
			const context = getContext< Context >();
			context.description = ( event.target as HTMLTextAreaElement ).value;
			refreshField( context, 'description', true );
		},
		setEmail( event: InputEvent ) {
			const context = getContext< Context >();
			context.email = ( event.target as HTMLInputElement ).value;
			refreshField( context, 'email', true );
		},
		blurSubject() {
			const context = getContext< Context >();
			context.touched = { ...context.touched, subject: true };
			refreshField( context, 'subject', false );
		},
		blurDescription() {
			const context = getContext< Context >();
			context.touched = { ...context.touched, description: true };
			refreshField( context, 'description', false );
		},
		blurEmail() {
			const context = getContext< Context >();
			context.touched = { ...context.touched, email: true };
			refreshField( context, 'email', false );
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
				// Submitting counts as touching every field, so errors that
				// were being held back now show.
				context.touched = FIELDS.reduce(
					( acc, field ) => ( { ...acc, [ field ]: true } ),
					{ ...context.touched }
				);
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
