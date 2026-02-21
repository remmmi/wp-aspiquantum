<?php
// Allow application passwords over HTTP (dev/local environment only)
add_filter( 'wp_is_application_passwords_available', '__return_true' );
