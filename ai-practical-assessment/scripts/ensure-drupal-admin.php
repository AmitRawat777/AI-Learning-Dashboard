<?php

/**
 * @file
 * Ensure a Drupal administrator account exists for local development.
 *
 * Usage (inside DDEV):
 *   ddev drush php:script /var/www/html/scripts/ensure-drupal-admin.php
 */

declare(strict_types=1);

use Drupal\user\Entity\Role;
use Drupal\user\Entity\User;

$adminUser = getenv('DRUPAL_ADMIN_USER') ?: 'admin';
$adminPass = getenv('DRUPAL_ADMIN_PASS') ?: 'admin';
$adminMail = getenv('DRUPAL_ADMIN_MAIL') ?: "{$adminUser}@example.com";

$role = Role::load('administrator');
if (!$role) {
  Role::create([
    'id' => 'administrator',
    'label' => 'Administrator',
    'is_admin' => TRUE,
  ])->save();
  echo "Created administrator role.\n";
}

$account = user_load_by_name($adminUser);
if (!$account) {
  $account = User::create([
    'name' => $adminUser,
    'mail' => $adminMail,
    'pass' => $adminPass,
    'status' => 1,
  ]);
  $account->save();
  echo "Created admin user '{$adminUser}'.\n";
}

if (!$account->hasRole('administrator')) {
  $account->addRole('administrator');
  $account->save();
  echo "Granted administrator role to '{$adminUser}'.\n";
}

echo "Drupal admin ready: {$adminUser}\n";
