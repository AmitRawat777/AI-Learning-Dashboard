<?php

declare(strict_types=1);

namespace Drupal\ai_dashboard\Entity;

use Drupal\Core\Entity\ContentEntityBase;
use Drupal\Core\Entity\EntityChangedTrait;
use Drupal\Core\Entity\EntityTypeInterface;
use Drupal\Core\Field\BaseFieldDefinition;
use Drupal\user\EntityOwnerTrait;

/**
 * Defines the Project Task entity.
 *
 * @ContentEntityType(
 *   id = "project_task",
 *   label = @Translation("Project Task"),
 *   label_collection = @Translation("Project Tasks"),
 *   label_singular = @Translation("project task"),
 *   label_plural = @Translation("project tasks"),
 *   handlers = {
 *     "access" = "Drupal\ai_dashboard\ProjectTaskAccessControlHandler",
 *     "list_builder" = "Drupal\Core\Entity\EntityListBuilder",
 *     "form" = {
 *       "default" = "Drupal\Core\Entity\ContentEntityForm",
 *       "add" = "Drupal\Core\Entity\ContentEntityForm",
 *       "edit" = "Drupal\Core\Entity\ContentEntityForm",
 *       "delete" = "Drupal\Core\Entity\ContentEntityDeleteForm",
 *     },
 *     "route_provider" = {
 *       "html" = "Drupal\Core\Entity\Routing\AdminHtmlRouteProvider",
 *     },
 *   },
 *   base_table = "project_task",
 *   admin_permission = "access ai dashboard api",
 *   entity_keys = {
 *     "id" = "id",
 *     "uuid" = "uuid",
 *     "owner" = "owner_id",
 *     "label" = "title",
 *   },
 * )
 */
final class ProjectTask extends ContentEntityBase implements ProjectTaskInterface {

  use EntityChangedTrait;
  use EntityOwnerTrait;

  /**
   * {@inheritdoc}
   */
  public static function baseFieldDefinitions(EntityTypeInterface $entity_type): array {
    $fields = parent::baseFieldDefinitions($entity_type);

    $fields['title'] = BaseFieldDefinition::create('string')
      ->setLabel(t('Title'))
      ->setRequired(TRUE)
      ->setSettings(['max_length' => 255])
      ->setDisplayOptions('form', [
        'type' => 'string_textfield',
        'weight' => 0,
      ]);

    $fields['description'] = BaseFieldDefinition::create('text_long')
      ->setLabel(t('Description'))
      ->setDisplayOptions('form', [
        'type' => 'text_textarea',
        'weight' => 1,
      ]);

    $fields['category'] = BaseFieldDefinition::create('list_string')
      ->setLabel(t('Category'))
      ->setRequired(TRUE)
      ->setSettings([
        'allowed_values' => [
          'learning' => 'Learning',
          'project' => 'Project',
          'research' => 'Research',
          'other' => 'Other',
        ],
      ])
      ->setDefaultValue('learning');

    $fields['priority'] = BaseFieldDefinition::create('list_string')
      ->setLabel(t('Priority'))
      ->setRequired(TRUE)
      ->setSettings([
        'allowed_values' => [
          'low' => 'Low',
          'medium' => 'Medium',
          'high' => 'High',
        ],
      ])
      ->setDefaultValue('medium');

    $fields['status'] = BaseFieldDefinition::create('list_string')
      ->setLabel(t('Status'))
      ->setRequired(TRUE)
      ->setSettings([
        'allowed_values' => [
          'planned' => 'Planned',
          'in_progress' => 'In Progress',
          'completed' => 'Completed',
        ],
      ])
      ->setDefaultValue('planned');

    $fields['owner_id'] = BaseFieldDefinition::create('entity_reference')
      ->setLabel(t('Owner'))
      ->setRequired(TRUE)
      ->setSetting('target_type', 'user')
      ->setSetting('handler', 'default');

    $fields['due_date'] = BaseFieldDefinition::create('datetime')
      ->setLabel(t('Due date'))
      ->setRequired(FALSE)
      ->setSetting('datetime_type', 'date');

    $fields['created'] = BaseFieldDefinition::create('created')
      ->setLabel(t('Created'));

    $fields['changed'] = BaseFieldDefinition::create('changed')
      ->setLabel(t('Updated'));

    return $fields;
  }

}
