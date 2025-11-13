<?php

function rp_social_share_block_init() {
	register_block_type( __DIR__ . '/build', array(
		'view_script' => 'rp-social-share'
	) );
}

add_action( 'init', 'rp_social_share_block_init' );

function rp_social_share_front_end_scripts() {
	wp_register_script( 'rp-social-share', get_template_directory_uri() . '/blocks/rp-social-share/build/rp-social-share.js', array(),
		filemtime( get_template_directory() . '/blocks/rp-social-share/build' ), true );
}

add_action( 'wp_enqueue_scripts', 'rp_social_share_front_end_scripts', 999 );

function rp_social_share_head_cripts() {
	?>
	<script async defer data-pin-hover="false" data-pin-save="false" src="//assets.pinterest.com/js/pinit.js"></script>
	<?php
}

add_action( 'wp_head', 'rp_social_share_head_cripts' );

function rp_social_share_block_set_translations() {
	wp_set_script_translations(
		'rp-social-share-editor-script',
		'social-share',
		plugin_dir_path( __FILE__ ) . 'languages'
	);
}

add_action( 'init', 'rp_social_share_block_set_translations' );

// PHP side block translations
function rp_social_share_load_translations() {
	load_theme_textdomain( 'social-share', get_template_directory() . '/blocks/rp-social-share/languages' );
}

add_action( 'after_setup_theme', 'rp_social_share_load_translations' );
