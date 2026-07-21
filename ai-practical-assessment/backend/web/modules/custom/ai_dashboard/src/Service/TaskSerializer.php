<?php

declare(strict_types=1);

namespace Drupal\ai_dashboard\Service;

use Drupal\ai_dashboard\Entity\ProjectTaskInterface;
use Drupal\Component\Datetime\TimeInterface;
use Drupal\Core\Datetime\DrupalDateTime;
use Drupal\user\UserInterface;

/**
 * Serializes ProjectTask entities to API arrays.
 */
final class TaskSerializer {

  public function __construct(
    private readonly TimeInterface $time,
  ) {}

  /**
   * Convert a task entity to an API response array.
   */
  public function toArray(ProjectTaskInterface $task): array {
    $owner = $task->getOwner();
    $dueDate = $task->get('due_date')->value;

    return [
      'id' => (int) $task->id(),
      'title' => $task->get('title')->value,
      'description' => $task->get('description')->value ?? '',
      'category' => $task->get('category')->value,
      'priority' => $task->get('priority')->value,
      'status' => $task->get('status')->value,
      'ownerId' => $owner instanceof UserInterface ? (int) $owner->id() : NULL,
      'ownerName' => $owner instanceof UserInterface ? $owner->getDisplayName() : '',
      'dueDate' => $dueDate ? $this->formatDate($dueDate) : NULL,
      'createdAt' => $this->formatTimestamp((int) $task->get('created')->value),
      'updatedAt' => $this->formatTimestamp((int) $task->get('changed')->value),
      'isOverdue' => $this->isOverdue($task),
    ];
  }

  /**
   * Serialize a user for the owner dropdown.
   */
  public function userToArray(UserInterface $user): array {
    $roles = array_values(array_diff($user->getRoles(), ['authenticated']));
    return [
      'id' => (int) $user->id(),
      'name' => $user->getDisplayName(),
      'email' => $user->getEmail(),
      'role' => $roles[0] ?? 'authenticated',
    ];
  }

  /**
   * Check if a task is overdue.
   */
  public function isOverdue(ProjectTaskInterface $task): bool {
    if ($task->get('status')->value === 'completed') {
      return FALSE;
    }
    $dueDate = $task->get('due_date')->value;
    if (!$dueDate) {
      return FALSE;
    }
    $due = new DrupalDateTime($dueDate, 'UTC');
    $due->setTime(23, 59, 59);
    return $due->getTimestamp() < $this->time->getRequestTime();
  }

  /**
   * Format a date field value as ISO 8601.
   */
  private function formatDate(string $value): string {
    $date = new DrupalDateTime($value, 'UTC');
    return $date->format('c');
  }

  /**
   * Format a Unix timestamp as ISO 8601.
   */
  private function formatTimestamp(int $timestamp): string {
    return gmdate('c', $timestamp);
  }

}
