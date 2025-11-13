# Custom Block

The `RP_Custom_Block` class is a utility class designed to register custom Gutenberg blocks in a WordPress theme, along with handling JavaScript and PHP translations. This class allows for flexible paths for each block, enabling multiple blocks to share a single `build` directory but have unique subdirectories within it.

## Overview

The `RP_Custom_Block` class registers a custom block in WordPress using specified block names, paths, and text domains. This class automates:

1. Registering the block type.
2. Loading JavaScript translations for the block editor.
3. Loading PHP translations for front-end and back-end localization.

This is particularly useful when building custom blocks with translations for multi-language sites, and when using a structure where blocks share a `build` directory with subdirectories for each block.

## Properties

- **$block_names** (`array`): Stores the names of the blocks to be registered.
- **$paths** (`array`): Stores the paths for each block within the `blocks` directory.
- **$domain** (`string`): Text domain for loading translations. Defaults to `'default-domain'` if not specified.

## Constructor

### `__construct( $block_names, $paths, $domain )`

The constructor method initializes the class properties and sets up the necessary actions to register the block and load translations.

- **Parameters**:
  - `$block_names` (`array|string`): Name(s) of the block(s) to register.
  - `$paths` (`array|string`): Paths to the build directories for the block(s).
  - `$domain` (`string`): Text domain for translations.

## Methods

### `initialize_blocks`

Sets up the actions needed to initialize the blocks. This method is called within the constructor and registers three actions:

- `register_blocks`: Registers each block with WordPress on `init`.
- `load_js_translations`: Loads JavaScript translations on `init`.
- `load_php_translations`: Loads PHP translations on `after_setup_theme`.

**Code Example**:

```php
private function initialize_blocks() {
    add_action( 'init', [ $this, 'register_blocks' ] );
    add_action( 'init', [ $this, 'load_js_translations' ] );
    add_action( 'after_setup_theme', [ $this, 'load_php_translations' ] );
}
```

### `register_blocks`

Registers each block specified in `$block_names` with its respective path from `$paths`.

**Code Example**:

```php
public function register_blocks() {
    foreach ( $this->block_names as $index => $block_name ) {
        $path = isset( $this->paths[ $index ] ) ? $this->paths[ $index ] : "build/$block_name";
        register_block_type( get_template_directory() . "/blocks/{$path}" );
    }
}
```

### `load_js_translations`

Loads JavaScript translations for each block, registering the translations for the editor script of each block with the specified text domain.

**Code Example**:

```php
public function load_js_translations() {
    foreach ( $this->block_names as $index => $block_name ) {
        wp_set_script_translations(
            "{$block_name}-editor-script",
            $this->domain,
            get_template_directory() . "/blocks/{$this->paths[ $index ]}/languages"
        );
    }
}
```

### `load_php_translations`

Loads PHP translations using the `load_theme_textdomain` function. This allows PHP strings in the blocks to be translated according to the specified text domain, using the languages folder of the first block.

**Code Example**:

```php
public function load_php_translations() {
    load_theme_textdomain( $this->domain, get_template_directory() . "/blocks/{$this->paths[0]}/languages" );
}
```

## Usage Examples

```php
 new RP_Custom_Block( 'rp-hero', 'rp-hero/build/', 'hero' );
```

This will register the rp-hero block.

```php
new RP_Custom_Block(
    array( 'rp-accordions', 'rp-accordion' ),
    array( 'rp-accordions/build/accordions', 'rp-accordions/build/accordion' ),
    'accordions'
);
```

This will:

- Register the `rp-accordions` block using the path `blocks/rp-accordions/build/accordions`
- Register the `rp-accordion` block using the path `blocks/rp-accordions/build/accordion`

The `RP_Custom_Block` class automatically handles block registration and localization, making it straightforward to add additional blocks by instantiating new objects with the required block names, paths, and text domain.
