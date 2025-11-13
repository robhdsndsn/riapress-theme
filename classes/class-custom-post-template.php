<?php
/**
 * Class Custom_Post_Template
 *
 * A reusable class for assigning block editor templates to custom or core post types.
 *
 * @package starter
 */
class Custom_Post_Template {

    /**
     * The post type to assign the template to.
     *
     * @var string
     */
    private $post_type;

    /**
     * The block template array.
     *
     * @var array
     */
    private $template;

    /**
     * Custom_Post_Template constructor.
     * Initializes the class with dynamic values for the post type and template.
     *
     * @param string $post_type The post type to assign the template to.
     * @param array $template The block template for the post type.
     */
    public function __construct( string $post_type, array $template ) {
        $this->post_type = $post_type;
        $this->template = $template;

        add_action( 'init', array( $this, 'define_template' ) );
    }

    /**
     * Assigns the block editor template to the specified post type.
     *
     * @return void
     */
    public function define_template(): void {
        $post_type_object = get_post_type_object( $this->post_type );

        if ( $post_type_object ) {
            $post_type_object->template = $this->template;
            $post_type_object->template_lock = 'all'; // Optional: Lock the template (none, all, or insert)
        }
    }
}
