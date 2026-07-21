<?php

declare(strict_types=1);

namespace Drupal\ai_dashboard\Controller;

use Drupal\ai_dashboard\Entity\ProjectTaskInterface;
use Drupal\ai_dashboard\Service\TaskSerializer;
use Drupal\Core\Controller\ControllerBase;
use Drupal\Core\Entity\EntityTypeManagerInterface;
use Symfony\Component\DependencyInjection\ContainerInterface;
use Symfony\Component\HttpFoundation\JsonResponse;

/**
 * Dashboard summary counts API.
 */
final class SummaryApiController extends ControllerBase {

  public function __construct(
    EntityTypeManagerInterface $entityTypeManager,
    private readonly TaskSerializer $serializer,
  ) {
    $this->entityTypeManager = $entityTypeManager;
  }

  /**
   * {@inheritdoc}
   */
  public static function create(ContainerInterface $container): self {
    return new self(
      $container->get('entity_type.manager'),
      $container->get('ai_dashboard.task_serializer'),
    );
  }

  /**
   * Return dashboard summary counts from real task data.
   */
  public function summary(): JsonResponse {
    $storage = $this->entityTypeManager->getStorage('project_task');
    $tasks = $storage->loadMultiple(
      $storage->getQuery()->accessCheck(TRUE)->execute(),
    );

    $total = count($tasks);
    $completed = 0;
    $inProgress = 0;
    $overdue = 0;
    $highPriority = 0;

    foreach ($tasks as $task) {
      assert($task instanceof ProjectTaskInterface);
      $status = $task->get('status')->value;
      $priority = $task->get('priority')->value;

      if ($status === 'completed') {
        $completed++;
      }
      if ($status === 'in_progress') {
        $inProgress++;
      }
      if ($this->serializer->isOverdue($task)) {
        $overdue++;
      }
      if ($priority === 'high') {
        $highPriority++;
      }
    }

    return new JsonResponse([
      'data' => [
        'total' => $total,
        'completed' => $completed,
        'inProgress' => $inProgress,
        'overdue' => $overdue,
        'highPriority' => $highPriority,
      ],
    ]);
  }

}
