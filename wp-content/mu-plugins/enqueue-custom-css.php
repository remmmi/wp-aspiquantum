<?php
/**
 * Enqueue custom.css from the active theme directory.
 * Loaded after all theme styles to ensure overrides work.
 */
add_action('wp_enqueue_scripts', function() {
    // Google Fonts: Playfair Display (headings) + Inter (body)
    wp_enqueue_style(
        'aspirateurs-google-fonts',
        'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=Playfair+Display:ital,wght@0,400;0,600;1,400;1,600&display=swap',
        [],
        null
    );

    $css_file = get_template_directory() . '/custom.css';
    if (file_exists($css_file)) {
        wp_enqueue_style(
            'aspirateurs-custom',
            get_template_directory_uri() . '/custom.css',
            ['aspirateurs-google-fonts'],
            filemtime($css_file)
        );
    }
}, 9999);
