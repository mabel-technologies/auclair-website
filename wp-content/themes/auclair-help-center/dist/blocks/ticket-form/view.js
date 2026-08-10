import { store, getContext, getElement } from '@wordpress/interactivity';
// One ticket-form is expected per page; the selected File object is kept
// out of context because Interactivity context is serialised to JSON.
let selectedFile = null;
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
function validate(context) {
    const errors = {};
    if (!context.categoryId) {
        errors.category = 'Select a category.';
    }
    if (!context.subject.trim()) {
        errors.subject = 'Subject is required.';
    }
    else if (context.subject.length > 120) {
        errors.subject = 'Subject must be 120 characters or fewer.';
    }
    if (!context.description.trim()) {
        errors.description = 'Please add some details.';
    }
    if (!context.email.trim()) {
        errors.email = 'Email is required.';
    }
    else if (!EMAIL_PATTERN.test(context.email.trim())) {
        errors.email = 'Enter a valid email address.';
    }
    return errors;
}
store('auclair', {
    state: {
        get isSelectedCategory() {
            const context = getContext();
            return context.categoryOptionId === context.categoryId;
        },
        get attachmentLabel() {
            const context = getContext();
            return context.fileName || context.attachmentPlaceholder;
        },
    },
    actions: {
        toggleCategory(event) {
            event.stopPropagation();
            const context = getContext();
            context.categoryOpen = !context.categoryOpen;
        },
        closeCategoryOnOutsideClick(event) {
            const context = getContext();
            if (!context.categoryOpen) {
                return;
            }
            const { ref } = getElement();
            const wrapper = ref.closest('.auclair-ticket-form__select');
            if (wrapper && !wrapper.contains(event.target)) {
                context.categoryOpen = false;
            }
        },
        closeCategoryOnEscape(event) {
            if (event.key !== 'Escape') {
                return;
            }
            const context = getContext();
            if (context.categoryOpen) {
                context.categoryOpen = false;
                getElement().ref.focus();
            }
        },
        selectCategory() {
            const context = getContext();
            if (context.categoryOptionId === undefined) {
                return;
            }
            context.categoryId = context.categoryOptionId;
            context.categoryLabel = context.categoryOptionLabel ?? '';
            context.categoryOpen = false;
            delete context.errors.category;
        },
        setSubject(event) {
            const context = getContext();
            context.subject = event.target.value;
        },
        setDescription(event) {
            const context = getContext();
            context.description = event.target.value;
        },
        setEmail(event) {
            const context = getContext();
            context.email = event.target.value;
        },
        setWebsite(event) {
            const context = getContext();
            context.website = event.target.value;
        },
        openFilePicker() {
            const { ref } = getElement();
            const input = ref.querySelector('input[type="file"]');
            input?.click();
        },
        setFile(event) {
            const context = getContext();
            const input = event.target;
            const file = input.files?.[0] ?? null;
            if (!file) {
                selectedFile = null;
                context.fileName = '';
                return;
            }
            if (context.allowedTypes.length && !context.allowedTypes.includes(file.type)) {
                context.errors = { ...context.errors, attachment: 'That file type is not supported.' };
                input.value = '';
                selectedFile = null;
                context.fileName = '';
                return;
            }
            if (file.size > context.maxUploadBytes) {
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
        *submitTicket(event) {
            event.preventDefault();
            const context = getContext();
            const errors = validate(context);
            if (Object.keys(errors).length > 0) {
                context.errors = errors;
                return;
            }
            if (context.website) {
                // Honeypot filled in — pretend to succeed without submitting.
                window.location.href = context.successUrl;
                return;
            }
            context.errors = {};
            context.submitting = true;
            context.submitError = '';
            const formData = new window.FormData();
            formData.append('category', String(context.categoryId));
            formData.append('subject', context.subject);
            formData.append('description', context.description);
            formData.append('email', context.email);
            if (selectedFile) {
                formData.append('attachment', selectedFile);
            }
            try {
                const response = (yield window.fetch(context.endpoint, {
                    method: 'POST',
                    headers: { 'X-WP-Nonce': context.nonce },
                    credentials: 'same-origin',
                    body: formData,
                }));
                const payload = (yield response.json());
                if (!response.ok) {
                    throw new Error(payload.message || 'Something went wrong. Please try again.');
                }
                window.location.href = payload.redirect || context.successUrl;
            }
            catch (error) {
                context.submitting = false;
                context.submitError = error instanceof Error ? error.message : 'Something went wrong. Please try again.';
            }
        },
    },
});
