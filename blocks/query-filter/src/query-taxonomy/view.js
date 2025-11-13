import { store, getElement } from '@wordpress/interactivity';

const { state, actions } = store('query-filter', {
    state: {
        get selectedTerms() {
            const { context } = getElement();
            return context?.selectedTerms ?? [];
        }
    },
    actions: {
        *navigate(event) {
            event.preventDefault();
            const { actions } = yield import('@wordpress/interactivity-router');
            yield actions.navigate(event.target.value);
        },
        *updateTerms(event) {
            event.preventDefault();
            const { ref } = getElement();
            const form = ref.closest('form');
            const checkboxes = form.querySelectorAll('input[type="checkbox"]');
            const selectedTerms = Array.from(checkboxes)
                .filter(cb => cb.checked)
                .map(cb => cb.value);
            
            const url = new URL(form.action);
            const queryVar = checkboxes[0].name.replace('[]', '');

            if (selectedTerms.length > 0) {
                url.searchParams.set(queryVar, selectedTerms.join(','));
            } else {
                url.searchParams.delete(queryVar);
            }

            // Remove the page parameter to reset pagination
            url.searchParams.delete(queryVar.replace(/^query-\d*-/, 'query-') + '-page');

            const { actions } = yield import('@wordpress/interactivity-router');
            yield actions.navigate(url.toString());
        }
    },
});
