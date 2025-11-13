import { store, getElement } from '@wordpress/interactivity';

const { state } = store( 'query-filter', {
  actions: {
    *sortQuery( event ) {
      event.preventDefault();
      const { ref } = getElement();
      const select = ref.tagName === 'SELECT' ? ref : ref.querySelector( 'select' );
      const value = select.value;
      let sortBy = 'date', sortOrder = 'desc';
      if ( value === 'date-desc' ) { sortBy = 'date'; sortOrder = 'desc'; }
      if ( value === 'date-asc' ) { sortBy = 'date'; sortOrder = 'asc'; }
      if ( value === 'title-asc' ) { sortBy = 'title'; sortOrder = 'asc'; }
      if ( value === 'title-desc' ) { sortBy = 'title'; sortOrder = 'desc'; }
      state.sortBy = sortBy;
      state.sortOrder = sortOrder;

      // Find the hidden inputs for orderby and order
      const form = ref.closest( 'form' ) || ref;
      const orderbyInput = form.querySelector( 'input[type="hidden"][name$="orderby"]' );
      const orderInput = form.querySelector( 'input[type="hidden"][name$="order"]' );
      if ( orderbyInput ) orderbyInput.value = sortBy;
      if ( orderInput ) orderInput.value = sortOrder;

      // Build the new URL with updated orderby/order params
      const action = form.action;
      const url = new URL( action );
      // Add all form fields to the URL
      const formData = new FormData( form );
      for ( const [ key, val ] of formData.entries() ) {
        url.searchParams.set( key, val );
      }

      const { actions } = yield import( '@wordpress/interactivity-router' );
      yield actions.navigate( url.toString() );
    },
  },
} );
