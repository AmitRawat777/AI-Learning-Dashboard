<?php

declare(strict_types=1);

namespace Drupal\ai_dashboard\Controller;

use Drupal\ai_dashboard\Entity\ProjectTaskInterface;
use Drupal\ai_dashboard\Service\TaskSerializer;
use Drupal\ai_dashboard\Service\TaskValidator;
use Drupal\Core\Controller\ControllerBase;
use Drupal\Core\Entity\EntityTypeManagerInterface;
use Symfony\Component\DependencyInjection\ContainerInterface;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;

/**
 * REST API controller for ProjectTask CRUD operations.
 */
final class TaskApiController extends ControllerBase {

  public function __construct(
    EntityTypeManagerInterface $entityTypeManager,
    private readonly TaskSerializer $serializer,
    private readonly TaskValidator $validator,
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
      $container->get('ai_dashboard.task_validator'),
    );
  }

  /**
   * List tasks with optional status filter and keyword search.
   */
  public function list(Request $request): JsonResponse {
    $storage = $this->entityTypeManager->getStorage('project_task');
    $query = $storage->getQuery()->accessCheck(TRUE)->sort('changed', 'DESC');

    $status = $request->query->get('status');
    if ($status && in_array($status, ['planned', 'in_progress', 'completed'], TRUE)) {
      $query->condition('status', $status);
    }

    $search = trim((string) $request->query->get('search', ''));
    if ($search !== '') {
      $or = $query->orConditionGroup()
        ->condition('title', '%' . $search . '%', 'LIKE')
        ->condition('description', '%' . $search . '%', 'LIKE');
      $query->condition($or);
    }

    $ids = $query->execute();
    $tasks = $storage->loadMultiple($ids);
    $data = array_map(
      fn (ProjectTaskInterface $task) => $this->serializer->toArray($task),
      $tasks,
    );

    return new JsonResponse(['data' => array_values($data)]);
  }

  /**
   * Get a single task by ID.
   */
  public function get(ProjectTaskInterface $project_task): JsonResponse {
    return new JsonResponse(['data' => $this->serializer->toArray($project_task)]);
  }

  /**
   * Create a new task.
   */
  public function post(Request $request): JsonResponse {
    $payload = json_decode($request->getContent(), TRUE) ?? [];
    $errors = $this->validator->validateCreate($payload);
    if ($errors !== []) {
      return new JsonResponse(['errors' => $errors], Response::HTTP_UNPROCESSABLE_ENTITY);
    }

    /** @var \Drupal\ai_dashboard\Entity\ProjectTaskInterface $task */
    $task = $this->entityTypeManager->getStorage('project_task')->create();
    $this->validator->apply($task, $payload, TRUE);

    $violations = $task->validate();
    if ($violations->count() > 0) {
      $messages = [];
      foreach ($violations as $violation) {
        $messages[] = (string) $violation->getMessage();
      }
      return new JsonResponse(['errors' => $messages], Response::HTTP_UNPROCESSABLE_ENTITY);
    }

    $task->save();
    return new JsonResponse(
      ['data' => $this->serializer->toArray($task), 'message' => 'Task created successfully.'],
      Response::HTTP_CREATED,
    );
  }

  /**
   * Update an existing task.
   */
  public function update(ProjectTaskInterface $project_task, Request $request): JsonResponse {
    $payload = json_decode($request->getContent(), TRUE) ?? [];
    $errors = $this->validator->validateUpdate($payload);
    if ($errors !== []) {
      return new JsonResponse(['errors' => $errors], Response::HTTP_UNPROCESSABLE_ENTITY);
    }

    $this->validator->apply($project_task, $payload);
    $violations = $project_task->validate();
    if ($violations->count() > 0) {
      $messages = [];
      foreach ($violations as $violation) {
        $messages[] = (string) $violation->getMessage();
      }
      return new JsonResponse(['errors' => $messages], Response::HTTP_UNPROCESSABLE_ENTITY);
    }

    $project_task->save();
    return new JsonResponse([
      'data' => $this->serializer->toArray($project_task),
      'message' => 'Task updated successfully.',
    ]);
  }

}
