# Custom Post Template Class

A reusable class to assign block editor templates to custom or core post types in WordPress.

## Description

The **Custom_Post_Template** class allows developers to assign predefined block templates to any post type, whether custom or core post types (such as 'post' and 'page'). This ensures that when users create a new post of the specified type, it follows a defined block layout. The template can optionally be locked to prevent changes.

### Features:

- Assign block editor templates to any post type.
- Support for both custom and core post types.
- Optionally lock templates to restrict editing (none, all, or insert).
- Easy-to-configure template array structure.

## Installation

1. Download the `Custom_Post_Template.php` file.
2. Include the class in your theme or plugin:

```php
require_once get_template_directory() . '/classes/class-custom-post-template.php';
```

## Usage

To assign a block editor template to a post type, follow these steps:

- Define the template as an array, where each entry specifies a block and its settings.
- Instantiate the Custom_Post_Template class, passing in the following parameters:
- $post_type: The post type to assign the template to.
- $template: The block editor template for the post type.

### Example

```php
// Include the class in functions.php
require_once get_template_directory() . '/classes/Custom_Post_Template.php';
```

```php
// Define the block editor template
$event_template = array(
    array( 'core/paragraph', array(
        'placeholder' => 'Add event details here...',
    ) ),
    array( 'core/image', array() ),
    array( 'core/button', array(
        'placeholder' => __( 'Add a button...', 'starter' ), // With string translation.
    ) ),
);

// Assign the template to the "event" post type
new Custom_Post_Template( 'event', $event_template );
```

### Parameters

- $post_type (string) — The post type to assign the block editor template to. Example: 'event'.
- $template (array) — The block editor template structure. Example
```php
array(
    array( 'core/paragraph', array( 'placeholder' => 'Add event details...' ) ),
    array( 'core/image', array() ),
    array( 'core/button', array( 'text' => 'Register Now' ) ),
);
```

### Template Locking

You can optionally lock the template to restrict users from editing the structure. By default, the template is locked to 'all', meaning users can't change the structure or remove any blocks.

```php
$post_type_object->template_lock = 'all';  // Lock all blocks
```

**Possible values for template_lock:**

- 'none': No restrictions; users can edit everything.
- 'all': Prevent users from editing the structure or removing blocks.
- 'insert': Users can move blocks but can't insert new ones or remove them.

## Example with Template Locking

```php
$event_template = array(
    array( 'core/paragraph', array(
        'placeholder' => __( 'Add event details here...', 'starter' ),
    ) ),
    array( 'core/image', array() ),
    array( 'core/button', array(
        'placeholder' => __( 'Add a button...', 'starter' ),
    ) ),
);

// Assign the template to the "event" post type and lock it
new Custom_Post_Template( 'event', $event_template, 'starter' );
```

## Example of Class Usage

Here’s a complete example of how to use the Custom_Post_Template class:

```php
// Include the class in functions.php
require_once get_template_directory() . '/classes/Custom_Post_Template.php';

// Define the block template
$page_template = array(
    array( 'core/cover', array(
        'contentPosition' => 'center center',
        'dimRatio'        => 50,
    ) ),
    array( 'core/heading', array(
        'placeholder' => __( 'Add a heading...', 'starter' ),
    ) ),
    array( 'core/paragraph', array(
        'placeholder' => __( 'Add the page content here...', 'starter' ),
    ) ),
);

// Assign the template to the "page" post type
new Custom_Post_Template( 'page', $page_template, 'starter' );
```

## Changelog
1.0.0
Initial release of the Custom_Post_Template class.