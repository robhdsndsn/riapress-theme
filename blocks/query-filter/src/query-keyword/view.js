import { store, getElement } from '@wordpress/interactivity';

const { state } = store('query-filter', {
    actions: {
        *search(event) {
            event.preventDefault();
            const { ref } = getElement();
            let action, name, value;

            if (ref.tagName === 'FORM') {
                const input = ref.querySelector('input[type="search"]');
                action = ref.action;
                name = input.name;
                value = input.value;
            } else {
                action = ref.closest('form').action;
                name = ref.name;
                value = ref.value;
            }

            // Don't navigate if the search didn't really change
            if (value === state.searchValue) return;

            state.searchValue = value;

            const url = new URL(action);
            if (value || name === 's') {
                url.searchParams.set(name, value);
            } else {
                url.searchParams.delete(name);
            }

            const { actions } = yield import('@wordpress/interactivity-router');
            yield actions.navigate(url.toString());
        },
    },
});