<?php
/**
 * Class RP_Courses_Meta
 *
 * Manages custom meta fields and meta boxes for the "course" post type.
 *
 * @package rp
 */

/**
 * Manages custom meta fields and meta boxes for the "course" post type.
 */
class RP_COURSES_META {

	const META_COURSE_TIME = '_rp_course_time';
	const META_COURSE_TYPE = '_rp_course_type';
	const META_COURSE_URL = '_rp_course_url';
	const META_ENROLLMENT_FORM_ID = '_rp_enrollment_form_id';

	/**
	 * Class constructor.
	 */
	public function __construct() {
		add_action( 'init', array( $this, 'register_meta_fields' ) ); // Later priority
	}

	/**
	 * Register custom meta fields.
	 */
	public function register_meta_fields() {
		// error_log('COURSES META: Registering meta fields at priority 20');
		
		$meta_fields = array(
			self::META_COURSE_TIME         => 'sanitize_text_field',
			self::META_COURSE_TYPE         => 'sanitize_text_field',
			self::META_COURSE_URL          => 'sanitize_text_field',
			self::META_ENROLLMENT_FORM_ID  => 'sanitize_text_field',
		);

		foreach ( $meta_fields as $meta_key => $sanitize_callback ) {
			// error_log('COURSES META: Registering meta field: ' . $meta_key);
			$result = register_post_meta(
				'course',
				$meta_key,
				array(
					'show_in_rest'      => true,
					'single'            => true,
					'type'              => 'string',
					'sanitize_callback' => $sanitize_callback,
					'auth_callback'     => '__return_true',
                ),
                'course'
			);
			// error_log('COURSES META: Meta field registration result for ' . $meta_key . ': ' . ($result ? 'SUCCESS' : 'FAILED'));
		}
		
		// Debug: Check if meta fields are actually registered
		add_action('rest_api_init', function() {
			// error_log('COURSES META: REST API init - checking registered meta fields');
			$registered_meta = get_registered_meta_keys('post', 'course');
			// error_log('COURSES META: Registered meta fields for course: ' . print_r($registered_meta, true));
		});
	}

    /**
	 * Migrates data from specific old field to new prefixed field.
	 * Use this for individual field migrations if needed.
	 */
	public function migrate_course_time_from_old(): void {
		// Check if migration has already been run.
		if ( get_option( 'rp_course_time_migration_complete' ) ) {
			// error_log( 'Course time migration has already been run.' );
			return;
		}

		$courses = get_posts(
			array(
				'post_type'      => RP_Courses_Post_Type::NAME,
				'posts_per_page' => -1,
				'post_status'    => 'any',
			)
		);

		$migration_count = 0;
		foreach ( $courses as $course ) {
			$old_value = get_post_meta( $course->ID, 'course_time', true );
			$new_value = get_post_meta( $course->ID, self::META_COURSE_TIME, true );
			
			// Only migrate if old value exists and new value doesn't exist
			if ( ! empty( $old_value ) && empty( $new_value ) ) {
				update_post_meta( $course->ID, self::META_COURSE_TIME, $old_value );
				$migration_count++;
				// error_log( "Migrated course time for course ID {$course->ID}: {$old_value}" );
			} elseif ( ! empty( $new_value ) ) {
				// error_log( "Skipped course ID {$course->ID} - new field already has value: {$new_value}" );
			}
		}

		// Mark migration as complete.
		update_option( 'rp_course_time_migration_complete', true );
		error_log( "Course time migration completed. Migrated {$migration_count} courses." );
	}

	/**
	 * Migrates data from course_type field to new prefixed field.
	 */
	public function migrate_course_type_from_old(): void {
		// Check if migration has already been run.
		if ( get_option( 'rp_course_type_migration_complete' ) ) {
			error_log( 'Course type migration has already been run.' );
			return;
		}

		$courses = get_posts(
			array(
				'post_type'      => RP_Courses_Post_Type::NAME,
				'posts_per_page' => -1,
				'post_status'    => 'any',
			)
		);

		$migration_count = 0;
		foreach ( $courses as $course ) {
			$old_value = get_post_meta( $course->ID, 'course_type', true );
			$new_value = get_post_meta( $course->ID, self::META_COURSE_TYPE, true );
			
			// Only migrate if old value exists and new value doesn't exist
			if ( ! empty( $old_value ) && empty( $new_value ) ) {
				update_post_meta( $course->ID, self::META_COURSE_TYPE, $old_value );
				$migration_count++;
				// error_log( "Migrated course type for course ID {$course->ID}: {$old_value}" );
			} elseif ( ! empty( $new_value ) ) {
				// error_log( "Skipped course ID {$course->ID} - new field already has value: {$new_value}" );
			}
		}

		// Mark migration as complete.
		update_option( 'rp_course_type_migration_complete', true );
		// error_log( "Course type migration completed. Migrated {$migration_count} courses." );
	}

	/**
	 * Migrates data from course_url field to new prefixed field.
	 */
	public function migrate_course_url_from_old(): void {
		// Check if migration has already been run.
		if ( get_option( 'rp_course_url_migration_complete' ) ) {
			// error_log( 'Course URL migration has already been run.' );
			return;
		}

		$courses = get_posts(
			array(
				'post_type'      => RP_Courses_Post_Type::NAME,
				'posts_per_page' => -1,
				'post_status'    => 'any',
			)
		);

		$migration_count = 0;
		foreach ( $courses as $course ) {
			$old_value = get_post_meta( $course->ID, 'course_url', true );
			$new_value = get_post_meta( $course->ID, self::META_COURSE_URL, true );
			
			// Only migrate if old value exists and new value doesn't exist
			if ( ! empty( $old_value ) && empty( $new_value ) ) {
				update_post_meta( $course->ID, self::META_COURSE_URL, $old_value );
				$migration_count++;
				// error_log( "Migrated course URL for course ID {$course->ID}: {$old_value}" );
			} elseif ( ! empty( $new_value ) ) {
				// error_log( "Skipped course ID {$course->ID} - new field already has value: {$new_value}" );
			}
		}

		// Mark migration as complete.
		update_option( 'rp_course_url_migration_complete', true );
		error_log( "Course URL migration completed. Migrated {$migration_count} courses." );
	}

	/**
	 * Migrates data from enrollment_form_id field to new prefixed field.
	 */
	public function migrate_enrollment_form_id_from_old(): void {
		// Check if migration has already been run.
		if ( get_option( 'rp_enrollment_form_id_migration_complete' ) ) {
			// error_log( 'Enrollment form ID migration has already been run.' );
			return;
		}

		$courses = get_posts(
			array(
				'post_type'      => RP_Courses_Post_Type::NAME,
				'posts_per_page' => -1,
				'post_status'    => 'any',
			)
		);

		$migration_count = 0;
		foreach ( $courses as $course ) {
			$old_value = get_post_meta( $course->ID, 'enrollment_form_id', true );
			$new_value = get_post_meta( $course->ID, self::META_ENROLLMENT_FORM_ID, true );
			
			// Only migrate if old value exists and new value doesn't exist
			if ( ! empty( $old_value ) && empty( $new_value ) ) {
				update_post_meta( $course->ID, self::META_ENROLLMENT_FORM_ID, $old_value );
				$migration_count++;
				// error_log( "Migrated enrollment form ID for course ID {$course->ID}: {$old_value}" );
			} elseif ( ! empty( $new_value ) ) {
				// error_log( "Skipped course ID {$course->ID} - new field already has value: {$new_value}" );
			}
		}

		// Mark migration as complete.
		update_option( 'rp_enrollment_form_id_migration_complete', true );
		// error_log( "Enrollment form ID migration completed. Migrated {$migration_count} courses." );
	}

}

// Initialize the class.
new RP_COURSES_META();

// TODO: Uncomment the following lines to run the migration functions.
// ( new RP_COURSES_META() )->migrate_course_time_from_old(); // Remove this line after running once.
// ( new RP_COURSES_META() )->migrate_course_type_from_old(); // Remove this line after running once.
// ( new RP_COURSES_META() )->migrate_course_url_from_old(); // Remove this line after running once.
// ( new RP_COURSES_META() )->migrate_enrollment_form_id_from_old(); // Remove this line after running once.