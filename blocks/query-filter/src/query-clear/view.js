import { store, getElement } from '@wordpress/interactivity';

const { state: clearState, actions, effects } = store('query-filter', {
    state: {
        hasActiveFilters: false,
        lastUrl: window.location.href
    },
    effects: {
        checkActiveFilters() {
            const url = new URL(window.location.href);
            const hasSearch = url.searchParams.has('s');
            const queryPrefix = hasSearch ? '' : 'query-';

            for (const [key, value] of url.searchParams.entries()) {
                if ((key.startsWith(queryPrefix) || key === 's') && value && value.length > 0) {
                    clearState.hasActiveFilters = true;
                    return;
                }
            }
            clearState.hasActiveFilters = false;
        }
    },
    actions: {
        *clearFilters(event) {
            event.preventDefault();
            
            clearState.hasActiveFilters = false;
            
            const currentUrl = new URL(window.location.href);
            const hasSearch = currentUrl.searchParams.has('s');
            const queryPrefix = hasSearch ? '' : 'query-';
            
            const paramsToKeep = Array.from(currentUrl.searchParams.entries())
                .filter(([key]) => !key.startsWith(queryPrefix) && key !== 's');
            
            currentUrl.search = '';
            paramsToKeep.forEach(([key, value]) => {
                currentUrl.searchParams.set(key, value);
            });

            const { actions: routerActions } = yield import('@wordpress/interactivity-router');
            yield routerActions.navigate(currentUrl.toString());
        }
    },
    callbacks: {
        init() {
            effects.checkActiveFilters();

            const observer = new MutationObserver(() => {
                const currentUrl = window.location.href;
                if (currentUrl !== clearState.lastUrl) {
                    clearState.lastUrl = currentUrl;
                    effects.checkActiveFilters();
                }
            });

            observer.observe(document.documentElement, {
                childList: true,
                subtree: true
            });
        }
    }
});