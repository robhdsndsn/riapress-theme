
# Custom Meta Field

A reusable class to manage custom meta fields and meta boxes for any custom post type in WordPress, with support for the WordPress REST API.

## Description

The **Custom_Meta_Field** class provides an easy way for developers to manage and implement custom meta fields and meta boxes for WordPress post types, including custom post types. This class supports various field types (text, date, number, URL, boolean), input sanitization, and REST API compatibility.

### Features:
- Custom meta fields for any post type.
- Meta box integration in the WordPress post editor.
- REST API support for custom meta fields.
- Supports multiple field types (text, number, date, time, URL, boolean).
- Input sanitization for secure data handling.
- Permission-based editing.

## Installation

1. Download the `Custom_Meta_Field.php` file.
2. Include the class in your theme or plugin:

```php
require_once get_template_directory() . '/classes/class-custom-meta-field.php';
```

### Without String Translation (Basic Usage)

#### Meta Fields Configuration
```php
$event_custom_meta_fields = array(
    '_starter_event_date_start' => array(
        'label'             => 'Event Start Date',
        'type'              => 'date',
        'sanitize_callback' => 'sanitize_text_field',
    ),
    '_starter_event_time_start' => array(
        'label'             => 'Event Start Time',
        'type'              => 'time',
        'sanitize_callback' => 'sanitize_text_field',
    ),
    '_starter_event_date_end' => array(
        'label'             => 'Event End Date',
        'type'              => 'date',
        'sanitize_callback' => 'sanitize_text_field',
    ),
    '_starter_event_cost' => array(
        'label'             => 'Cost',
        'type'              => 'number',
        'sanitize_callback' => 'floatval',
    ),
);
```

### Initialize Meta Fields for "event" Post Type
```php
new Custom_Meta_Field( 'event', $event_custom_meta_fields );
```

### With String Translation (Enhanced Usage)

#### Meta Fields Configuration with string translation support
```php
$event_custom_meta_fields_translated = array(
    '_starter_event_date_start' => array(
        'label'             => __( 'Event Start Date', 'starter' ),
        'type'              => 'date',
        'sanitize_callback' => 'sanitize_text_field',
    ),
    '_starter_event_time_start' => array(
        'label'             => __( 'Event Start Time', 'starter' ),
        'type'              => 'time',
        'sanitize_callback' => 'sanitize_text_field',
    ),
    '_starter_event_date_end' => array(
        'label'             => __( 'Event End Date', 'starter' ),
        'type'              => 'date',
        'sanitize_callback' => 'sanitize_text_field',
    ),
    '_starter_event_link_ticket_new_tab' => array(
        'label'             => __( 'Open Ticket Link in New Tab', 'starter' ),
        'type'              => 'boolean',
        'sanitize_callback' => 'wp_validate_boolean',
    ),
    '_starter_event_pdf' => array(
        'label'             => __( 'Event PDF', 'starter' ),
        'button_label'      => __( 'Select PDF', 'starter' ),
        'type'              => 'file',
        'sanitize_callback' => 'wp_validate_boolean',
    ),
);
```

### Initialize Meta Fields for "event" Post Type with string translation support
```php
new Custom_Meta_Field( 'event', $event_custom_meta_fields_translated );
```

### Supported Field Types
The following field types are supported: 'string', 'boolean', 'integer', 'number', 'array', and 'object'.

## Example of Class Usage
Here is a complete example of how to use the `Custom_Meta_Field` class in a WordPress project:

```php
// Include the class in functions.php
require_once get_template_directory() . '/classes/Custom_Meta_Field.php';

// Define the meta fields
$meta_fields = array(
    '_starter_event_date_start' => array(
        'label' => __( 'Event Start Date', 'starter' ),
        'type'  => 'string',
        'sanitize_callback' => 'sanitize_text_field',
    ),
    '_starter_event_link_ticket' => array(
        'label' => 'Ticket Link',
        'type'  => 'string',
        'sanitize_callback' => 'esc_url_raw',
    ),
    '_starter_event_link_ticket_new_tab' => array(
        'label' => __( 'Open Ticket Link in New Tab', 'starter' ),
        'type'  => 'boolean',
        'sanitize_callback' => 'wp_validate_boolean',
    ),
);

// Initialize the meta fields for the "event" post type
new Custom_Meta_Field( 'event', $meta_fields );
```

## Changelog
1.0.0 - Initial release of the Custom Meta Field class.
1.0.1 - Added Radio Button and File Select field types.
1.0.2 - Added Post to Post field, single direction.
1.0.3 - Bug Fix: Post to Post field now saves meta.
1.0.4 - Removed classic meta box support.