<?php

declare(strict_types=1);

namespace Drupal\ai_dashboard\Service;

use Drupal\ai_dashboard\Entity\ProjectTaskInterface;
use Drupal\Core\Entity\EntityTypeManagerInterface;
use Drupal\user\Entity\User;

/**
 * Validates and applies API payloads to ProjectTask entities.
 */
final class TaskValidator {

  private const ALLOWED_CATEGORIES = ['learning', 'project', 'research', 'other'];
  private const ALLOWED_PRIORITIES = ['low', 'medium', 'high'];
  private const ALLOWED_STATUSES = ['planned', 'in_progress', 'completed'];

  public function __construct(
    private readonly EntityTypeManagerInterface $entityTypeManager,
  ) {}

  /**
   * Validate create payload; returns list of error messages.
   *
   * @return string[]
   */
  public function validateCreate(array $data): array {
    $errors = [];
    if (empty(trim((string) ($data['title'] ?? '')))) {
      $errors[] = 'Title is required.';
    }
    elseif (mb_strlen((string) $data['title']) > 255) {
      $errors[] = 'Title must be 255 characters or fewer.';
    }
    if (empty($data['ownerId'])) {
      $errors[] = 'Owner is required.';
    }
    elseif (!$this->userExists((int) $data['ownerId'])) {
      $errors[] = 'Owner does not exist.';
    }
    if (empty($data['category']) || !in_array($data['category'], self::ALLOWED_CATEGORIES, TRUE)) {
      $errors[] = 'Valid category is required.';
    }
    if (empty($data['priority']) || !in_array($data['priority'], self::ALLOWED_PRIORITIES, TRUE)) {
      $errors[] = 'Valid priority is required.';
    }
    $status = $data['status'] ?? 'planned';
    if (!in_array($status, self::ALLOWED_STATUSES, TRUE)) {
      $errors[] = 'Valid status is required.';
    }
    if (!empty($data['dueDate']) && !$this->isValidDate((string) $data['dueDate'])) {
      $errors[] = 'Due date must be a valid date (YYYY-MM-DD).';
    }
    return $errors;
  }

  /**
   * Validate update payload; returns list of error messages.
   *
   * @return string[]
   */
  public function validateUpdate(array $data): array {
    $errors = [];
    if (array_key_exists('title', $data)) {
      if (empty(trim((string) $data['title']))) {
        $errors[] = 'Title cannot be empty.';
      }
      elseif (mb_strlen((string) $data['title']) > 255) {
        $errors[] = 'Title must be 255 characters or fewer.';
      }
    }
    if (array_key_exists('ownerId', $data)) {
      if (empty($data['ownerId'])) {
        $errors[] = 'Owner is required.';
      }
      elseif (!$this->userExists((int) $data['ownerId'])) {
        $errors[] = 'Owner does not exist.';
      }
    }
    if (array_key_exists('category', $data) && !in_array($data['category'], self::ALLOWED_CATEGORIES, TRUE)) {
      $errors[] = 'Invalid category.';
    }
    if (array_key_exists('priority', $data) && !in_array($data['priority'], self::ALLOWED_PRIORITIES, TRUE)) {
      $errors[] = 'Invalid priority.';
    }
    if (array_key_exists('status', $data) && !in_array($data['status'], self::ALLOWED_STATUSES, TRUE)) {
      $errors[] = 'Invalid status.';
    }
    if (array_key_exists('dueDate', $data) && $data['dueDate'] !== NULL && $data['dueDate'] !== '' && !$this->isValidDate((string) $data['dueDate'])) {
      $errors[] = 'Due date must be a valid date (YYYY-MM-DD).';
    }
    return $errors;
  }

  /**
   * Apply validated data to a task entity.
   */
  public function apply(ProjectTaskInterface $task, array $data, bool $isCreate = FALSE): void {
    if ($isCreate || array_key_exists('title', $data)) {
      $task->set('title', trim((string) ($data['title'] ?? $task->get('title')->value)));
    }
    if ($isCreate || array_key_exists('description', $data)) {
      $task->set('description', (string) ($data['description'] ?? ''));
    }
    if ($isCreate || array_key_exists('category', $data)) {
      $task->set('category', $data['category'] ?? $task->get('category')->value);
    }
    if ($isCreate || array_key_exists('priority', $data)) {
      $task->set('priority', $data['priority'] ?? $task->get('priority')->value);
    }
    if ($isCreate || array_key_exists('status', $data)) {
      $task->set('status', $data['status'] ?? $task->get('status')->value);
    }
    if ($isCreate || array_key_exists('ownerId', $data)) {
      $task->set('owner_id', (int) $data['ownerId']);
    }
    if ($isCreate || array_key_exists('dueDate', $data)) {
      $dueDate = $data['dueDate'] ?? NULL;
      $task->set('due_date', ($dueDate === NULL || $dueDate === '') ? NULL : $this->normalizeDate((string) $dueDate));
    }
  }

  /**
   * Check if a user ID exists.
   */
  private function userExists(int $uid): bool {
    return (bool) User::load($uid);
  }

  /**
   * Validate date string.
   */
  private function isValidDate(string $date): bool {
    $normalized = $this->normalizeDate($date);
    return $normalized !== NULL;
  }

  /**
   * Normalize date to Y-m-d storage format.
   */
  private function normalizeDate(string $date): ?string {
    if (preg_match('/^\d{4}-\d{2}-\d{2}/', $date, $matches)) {
      return $matches[0];
    }
    $timestamp = strtotime($date);
    if ($timestamp === FALSE) {
      return NULL;
    }
    return gmdate('Y-m-d', $timestamp);
  }

}
