# Custom Post Type

A reusable class to register custom post types with dynamic values in WordPress.

## Description

The `Custom_Post_Type` class provides a flexible way for developers to register and manage custom post types in WordPress. By using dynamic values for singular and plural names, menu icons, and more, this class simplifies the process of creating custom post types.

### Features:

- Dynamic post type registration.
- Supports multiple custom labels.
- Configurable menu icons.
- Custom rewrite slugs and capabilities.
- REST API support for custom post types.
- Automatic support for common WordPress features (title, editor, thumbnail, etc.).

## Installation

- Download the `Custom_Post_Type.php` file.
- Include the class in your theme or plugin:

```php
require_once get_template_directory() . '/classes/class-custom-post-type.php';
```

## Usage

To create and register a custom post type, follow these steps:

### Instantiate the `Custom_Post_Type` class with the following parameters:

- `$slug`: The singular URL-friendly slug for the custom post type (e.g., 'event').
- `$archive_slug`: The slug used for the archive page (e.g., 'events').
- `$menu_icon`: The WordPress Dashicon class for the admin menu icon (e.g., 'dashicons-tickets').
- `$singular`: The singular name for the custom post type (translatable string, e.g., `'Event'`).
- `$plural`: The plural name for the custom post type (translatable string, e.g., `'Events'`).
- `$args`: Additional arguments to override defaults.
- `$labels`: Custom labels to override defaults.

### Example Usage:

```php
new Custom_Post_Type(
    'event',                   // Singular slug.
    'events',                  // Archive slug.
    'dashicons-tickets',       // Menu icon.
    __( 'Event', 'starter' ),  // Singular label (translatable).
    __( 'Events', 'starter' ), // Plural label (translatable).
    array(                     // Arguments.
        'public'             => true,
        'publicly_queryable' => true,
    ),
    array(                     // Labels.
        'name' => __( 'Events', 'starter' ),
    )
);
```

### Class Parameters

- `$slug`: (string) The singular URL-friendly slug of the custom post type.
- `$archive_slug`: (string) The URL-friendly slug for the custom post type archive.
- `$menu_icon`: (string) Dashicon class for the post type menu icon.
- `$singular`: (string) Translatable singular name for labels.
- `$plural`: (string) Translatable plural name for labels.
- `$args`: (array) (Optional) Additional arguments to override the default registration settings.
- `$labels`: (array) (Optional) Custom labels to override default labels.

## Advanced Configuration

### Dynamic Post Type Labels

By default, the `Custom_Post_Type` class generates standard labels for the post type. Labels are configured dynamically based on the singular and plural names provided.

Example of dynamic labels:

```php
private function get_post_type_labels(): array {
    return array(
        'name'                  => $this->plural,
        'singular_name'         => $this->singular,
        'menu_name'             => $this->plural,
        'name_admin_bar'        => $this->singular,
        'archives'              => $this->singular . ' Archives',
        'attributes'            => $this->singular . ' Attributes',
        'parent_item_colon'     => 'Parent ' . mb_strtolower( $this->singular ) . ':',
        'all_items'             => 'All ' . mb_strtolower( $this->plural ),
        'add_new'               => 'Add New',
        'add_new_item'          => 'Add New ' . mb_strtolower( $this->singular ),
        'edit_item'             => 'Edit ' . mb_strtolower( $this->singular ),
        'new_item'              => 'New ' . mb_strtolower( $this->singular ),
        'view_item'             => 'View ' . mb_strtolower( $this->singular ),
        'view_items'            => 'View ' . mb_strtolower( $this->plural ),
        'search_items'          => 'Search ' . mb_strtolower( $this->singular ),
        'not_found'             => 'No ' . mb_strtolower( $this->plural ) . ' found',
        'not_found_in_trash'    => 'No ' . mb_strtolower( $this->plural ) . ' found in Trash',
        'featured_image'        => 'Featured Image',
        'set_featured_image'    => 'Set featured image',
        'remove_featured_image' => 'Remove featured image',
        'use_featured_image'    => 'Use as featured image',
        'insert_into_item'      => 'Insert into ' . mb_strtolower( $this->singular ),
        'uploaded_to_this_item' => 'Uploaded to this ' . mb_strtolower( $this->singular ),
        'items_list'            => $this->plural . ' list',
        'items_list_navigation' => $this->plural . ' list navigation',
        'filter_items_list'     => 'Filter ' . mb_strtolower( $this->plural ) . ' list',
    );
}
```

### Menu Icon Customization

The class accepts a `$menu_icon` parameter, allowing you to customize the icon that appears in the WordPress admin menu.

```php
new Custom_Post_Type(
    'event',
    'events',
    'dashicons-calendar',
    __( 'Event', 'starter' ),
    __( 'Events', 'starter' )
);
```

### Custom Rewrite Slugs

You can specify custom rewrite slugs for your post type:

```php
'rewrite' => array(
    'slug'       => 'custom-event-slug',
    'with_front' => false,
),
```

## Example: Complete Custom Post Type Registration

Here’s a complete example of how to use the `Custom_Post_Type` class to register an "event" post type:

```php
// Include the Custom_Post_Type class in functions.php or the relevant file.
require_once get_template_directory() . '/classes/Custom_Post_Type.php';

// Register the "event" custom post type.
new Custom_Post_Type(
    'event',
    'events',
    'dashicons-tickets',
    __( 'Event', 'starter' ),
    __( 'Events', 'starter' ),
    array(
        'public'             => true,
        'publicly_queryable' => true,
    ),
    array(
        'name' => __( 'Events', 'starter' ),
    )
);
```

This will register a new custom post type called "event" with the following features:

- Available in the WordPress admin menu with a ticket icon.
- Supports title, editor, excerpt, author, thumbnail, comments, and custom fields.
- Supports taxonomies for categories and tags.
- Publicly queryable and available in the REST API.

## Changelog

### 1.0.0

- Initial release of the `Custom_Post_Type` class