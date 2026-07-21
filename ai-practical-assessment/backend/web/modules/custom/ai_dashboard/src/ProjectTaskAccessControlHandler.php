<?php

declare(strict_types=1);

namespace Drupal\ai_dashboard;

use Drupal\Core\Access\AccessResult;
use Drupal\Core\Entity\EntityAccessControlHandler;
use Drupal\Core\Entity\EntityInterface;
use Drupal\Core\Session\AccountInterface;

/**
 * Access control handler for Project Task entities.
 */
final class ProjectTaskAccessControlHandler extends EntityAccessControlHandler {

  /**
   * {@inheritdoc}
   */
  protected function checkAccess(EntityInterface $entity, $operation, AccountInterface $account): AccessResult {
    if ($account->hasPermission('access ai dashboard api')) {
      return AccessResult::allowed()->cachePerPermissions();
    }
    return AccessResult::forbidden()->cachePerPermissions();
  }

  /**
   * {@inheritdoc}
   */
  protected function checkCreateAccess(AccountInterface $account, array $context, $entity_bundle = NULL): AccessResult {
    if ($account->hasPermission('access ai dashboard api')) {
      return AccessResult::allowed()->cachePerPermissions();
    }
    return AccessResult::forbidden()->cachePerPermissions();
  }

}
