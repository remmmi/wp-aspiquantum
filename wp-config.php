<?php
/**
 * The base configuration for WordPress
 *
 * The wp-config.php creation script uses this file during the installation.
 * You don't have to use the web site, you can copy this file to "wp-config.php"
 * and fill in the values.
 *
 * This file contains the following configurations:
 *
 * * Database settings
 * * Secret keys
 * * Database table prefix
 * * Localized language
 * * ABSPATH
 *
 * @link https://wordpress.org/support/article/editing-wp-config-php/
 *
 * @package WordPress
 */

// ** Database settings - You can get this info from your web host ** //
/** The name of the database for WordPress */
define( 'DB_NAME', 'wptest' );

/** Database username */
define( 'DB_USER', 'wptest' );

/** Database password */
define( 'DB_PASSWORD', 'wptest123' );

/** Database hostname */
define( 'DB_HOST', 'localhost' );

/** Database charset to use in creating database tables. */
define( 'DB_CHARSET', 'utf8' );

/** The database collate type. Don't change this if in doubt. */
define( 'DB_COLLATE', '' );

/**#@+
 * Authentication unique keys and salts.
 *
 * Change these to different unique phrases! You can generate these using
 * the {@link https://api.wordpress.org/secret-key/1.1/salt/ WordPress.org secret-key service}.
 *
 * You can change these at any point in time to invalidate all existing cookies.
 * This will force all users to have to log in again.
 *
 * @since 2.6.0
 */
define( 'AUTH_KEY',          '5y/F{V]<@!!t6}D7rGIr(UZ}+7oW8]ohR!_Zh7cOyDdNGqIX}@)[9_ToedoGIx+G' );
define( 'SECURE_AUTH_KEY',   'd/>|!SrNKw>iNCTmniVZzs[G|#+;[fApHUW=|}@s{{Hv/pF9V>;ZetSz,9owU7wx' );
define( 'LOGGED_IN_KEY',     '1e!hT2]vWn$+F=r_puIv{tcc2tufTk5` ,>ZSOHkC,aQ{d+:8*P)!tr%._}i8%60' );
define( 'NONCE_KEY',         '`wFK4::Ey9^:Z7q,bbA7c=.pAZX`RO{qhpzn(jO.YPar}b;kpu@0ir=mi.j&7U{H' );
define( 'AUTH_SALT',         'IW%Hbt36[]E`I.llYFWJCm>fT.(`dC757_[IpF&=ai:nBQ+&rJW);^;z&wOz:~B&' );
define( 'SECURE_AUTH_SALT',  '8z5=[J,V,_s<u= KW6_#7o/NVW)C-uRk|.SpVTZ_6@r] 1c5goKuQe8p~d@)rK$1' );
define( 'LOGGED_IN_SALT',    'ze)KnQgNS9J(k[trr~zm--e7(Y4QzYq(?;Z4|wZT`=I?::qOU~b|+?IZX2}/(;D;' );
define( 'NONCE_SALT',        '8%Z6`(3vHG<=Jv5H.|zG;!r{moUg,kx6aYM.~Y 69}7$nSruzU>d_E,`R;9cRTuh' );
define( 'WP_CACHE_KEY_SALT', '|SZ.}wu;ezQt0Ijdx7*-OyGldh[wOKP[QxUU)q/74_)Yi6SWwey9)?Fpb!J#8#ZD' );


/**#@-*/

/**
 * WordPress database table prefix.
 *
 * You can have multiple installations in one database if you give each
 * a unique prefix. Only numbers, letters, and underscores please!
 */
$table_prefix = 'wp_';


/* Add any custom values between this line and the "stop editing" line. */




/**
 * For developers: WordPress debugging mode.
 *
 * Change this to true to enable the display of notices during development.
 * It is strongly recommended that plugin and theme developers use WP_DEBUG
 * in their development environments.
 *
 * For information on other constants that can be used for debugging,
 * visit the documentation.
 *
 * @link https://wordpress.org/support/article/debugging-in-wordpress/
 */
if ( ! defined( 'WP_DEBUG' ) ) {
	define( 'WP_DEBUG', false );
}

/* That's all, stop editing! Happy publishing. */

/** Absolute path to the WordPress directory. */
if ( ! defined( 'ABSPATH' ) ) {
	define( 'ABSPATH', __DIR__ . '/' );
}

/** Sets up WordPress vars and included files. */
require_once ABSPATH . 'wp-settings.php';
