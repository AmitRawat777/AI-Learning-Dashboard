-- ProjectTask entity table schema
-- Created by Drupal entity system on module install.
-- See: backend/web/modules/custom/ai_dashboard/src/Entity/ProjectTask.php

CREATE TABLE IF NOT EXISTS project_task (
  id INT AUTO_INCREMENT PRIMARY KEY,
  uuid VARCHAR(128) NOT NULL,
  title VARCHAR(255) NOT NULL,
  description LONGTEXT,
  category VARCHAR(32) NOT NULL,
  priority VARCHAR(32) NOT NULL,
  status VARCHAR(32) NOT NULL,
  owner_id INT UNSIGNED NOT NULL,
  due_date VARCHAR(20),
  created INT NOT NULL,
  changed INT NOT NULL,
  UNIQUE KEY project_task_uuid (uuid),
  KEY project_task_owner (owner_id),
  KEY project_task_status (status)
);

-- Note: Drupal manages this table via entityDefinitionUpdateManager.
-- This file documents the schema for assessment reviewers.
-- Do not run manually unless setting up outside Drupal.
