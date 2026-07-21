<?php

declare(strict_types=1);

namespace Drupal\ai_dashboard\Entity;

use Drupal\Core\Entity\ContentEntityInterface;
use Drupal\user\EntityOwnerInterface;

/**
 * Interface for Project Task entities.
 */
interface ProjectTaskInterface extends ContentEntityInterface, EntityOwnerInterface {

}
