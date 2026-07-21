<?php

declare(strict_types=1);

namespace Drupal\ai_dashboard\Controller;

use Drupal\ai_dashboard\Service\TaskSerializer;
use Drupal\Core\Controller\ControllerBase;
use Drupal\Core\Entity\EntityTypeManagerInterface;
use Symfony\Component\DependencyInjection\ContainerInterface;
use Symfony\Component\HttpFoundation\JsonResponse;

/**
 * Users API for owner selection (seeded users only).
 */
final class UserApiController extends ControllerBase {

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
   * List active users for the owner dropdown.
   */
  public function list(): JsonResponse {
    $storage = $this->entityTypeManager->getStorage('user');
    $ids = $storage->getQuery()
      ->accessCheck(FALSE)
      ->condition('status', 1)
      ->condition('uid', 0, '>')
      ->condition('mail', ai_dashboard_seeded_user_emails(), 'IN')
      ->sort('name')
      ->execute();

    $users = $storage->loadMultiple($ids);
    $data = [];
    foreach ($users as $user) {
      $data[] = $this->serializer->userToArray($user);
    }

    return new JsonResponse(['data' => $data]);
  }

}
