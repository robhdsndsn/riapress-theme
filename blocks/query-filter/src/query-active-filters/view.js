/**
 * WordPress Interactivity API implementation for Query Active Filters.
 */
import { store, getContext } from '@wordpress/interactivity';
console.log('Query Active Filters store initialized');

const { state, actions } = store('query-active-filters', {
    state: {
        get filters() {
            return getContext().filters || [];
        },
        get queryId() {
            return getContext().queryId || 0;
        }
    },
    actions: {
        *removeFilter(event) {
            const param = event.target.dataset.filterParam;
            const value = event.target.dataset.filterValue;
            
            if (!param) return;
            
            event.preventDefault();
            
            const currentUrl = new URL(window.location.href);
            
            if (value && currentUrl.searchParams.has(param)) {
                // Handle multi-value taxonomy filters
                const currentValues = currentUrl.searchParams.get(param).split(',');
                const newValues = currentValues.filter(v => v !== value);
                
                if (newValues.length) {
                    currentUrl.searchParams.set(param, newValues.join(','));
                } else {
                    currentUrl.searchParams.delete(param);
                }
            } else {
                // Handle single value filters
                currentUrl.searchParams.delete(param);
            }
            
            // Use client-side navigation via the router
            const { actions: routerActions } = yield import('@wordpress/interactivity-router');
            yield routerActions.navigate(currentUrl.toString());
        }
    },
    callbacks: {
        init() {
            // Add a URL change observer
            const observer = new MutationObserver(() => {
                const currentUrl = window.location.href;
                if (currentUrl !== state.lastUrl) {
                    state.lastUrl = currentUrl;
                    effects.updateFiltersState();
                }
            });

            observer.observe(document.documentElement, {
                childList: true,
                subtree: true
            });
        }
    }
});
