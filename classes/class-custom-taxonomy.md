
# Custom Taxonomy

A reusable class to register custom taxonomies for specified post types in WordPress.

## Description

The **Custom Taxonomy** class provides a flexible and dynamic way for developers to register and manage custom taxonomies. 
It allows for easy association with one or more post types, custom labels, and other customizable options, 
including support for REST API integration.

### Features:
- Dynamic taxonomy registration for one or more post types.
- Support for custom labels and rewrite rules.
- Hierarchical (like categories) or non-hierarchical (like tags) configurations.
- REST API support for custom taxonomies.
- Clean integration into the WordPress admin interface.


## Installation

1. Download the `Custom_Taxonomy.php` file.
2. Include the class in your theme or plugin:

```php
require_once get_template_directory() . '/classes/class-custom-taxonomy.php';
```

## Usage

To create and register a custom taxonomy, follow these steps:

Define your taxonomy details and instantiate the `Custom_Taxonomy` class with the following parameters:

- **`$post_types`**: The post types to associate the taxonomy with (string or array of strings).
- **`$slug`**: URL-friendly slug for the taxonomy.
- **`$singular`**: Singular name for the taxonomy.
- **`$plural`**: Plural name for the taxonomy.
- **`$args`**: Additional arguments for the taxonomy (optional).
- **`$labels`**: Custom labels to override default labels (optional).

### Example Without String Translation
```php
new Custom_Taxonomy(
    'event',            // Post type(s) singular or an array array( 'event', 'pages' ).
    'event-category',   // Slug.
    'Event Category',   // Singular label.
    'Event Categories', // Plural label.
    array(              // Optional args.
        'hierarchical' => true,
        'show_in_rest' => true,
    )
);
```

### Example With String Translation
```php
new Custom_Taxonomy(
    'event',                            // Post type.
    __( 'event-tag', 'starter' ),       // Translatable slug.
    __( 'Event Tag', 'starter' ),       // Translatable singular name.
    __( 'Event Tags', 'starter' ),      // Translatable plural name.
    array(                              // Optional args.
        'hierarchical' => false,
    ),
    array(                              // Custom labels with translations.
        'name'      => __( 'Event Tags', 'starter' ),
        'menu_name' => __( 'Event Tag', 'starter' ),
    )
);
```

## Supported Options

### Taxonomy Labels

The class dynamically generates standard labels for taxonomies. It can also be customized as needed:

```php
$default_labels = array(
    'name'          => $this->plural,
    'singular_name' => $this->singular,
    'menu_name'     => $this->plural,
    'all_items'     => 'All ' . mb_strtolower( $this->plural ),
    'edit_item'     => 'Edit ' . mb_strtolower( $this->singular ),
    'view_item'     => 'View ' . mb_strtolower( $this->singular ),
    'update_item'   => 'Update ' . mb_strtolower( $this->singular ),
    'add_new_item'  => 'Add New ' . mb_strtolower( $this->singular ),
    'new_item_name' => 'New ' . mb_strtolower( $this->singular ) . ' Name',
    'search_items'  => 'Search ' . mb_strtolower( $this->plural ),
    'parent_item'   => 'Parent ' . mb_strtolower( $this->singular ),
    'not_found'     => 'No ' . mb_strtolower( $this->plural ) . ' found',
);
```

### Additional Customization
You can specify additional options for your taxonomy:

```php
array(
    'hierarchical'      => true, // Choose between hierarchical (like categories) or not (like tags).
    'show_in_rest'      => true, // Enable REST API support.
    'show_ui'           => true, // Show in WordPress admin UI.
    'rewrite'           => array( 'slug' => $this->slug ), // Custom slug.
);
```

## Example
Here is a complete example for setting up a new custom taxonomy:

```php
// Include the Custom_Taxonomy class
require_once get_template_directory() . '/classes/Custom_Taxonomy.php';

// Register a taxonomy "Event Tag" for the "event" post type
new Custom_Taxonomy(
    'event',
    'event-tag',
    'Event Tag',
    'Event Tags',
    array(
        'hierarchical' => false,
        'show_in_rest' => true,
    )
);
```

## Changelog
1.0.0
Initial release of the Custom Taxonomy class.
