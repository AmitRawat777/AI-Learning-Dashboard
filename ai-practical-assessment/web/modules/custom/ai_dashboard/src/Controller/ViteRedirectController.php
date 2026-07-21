<?php

declare(strict_types=1);

namespace Drupal\ai_dashboard\Controller;

use Drupal\Core\Controller\ControllerBase;
use Symfony\Component\HttpFoundation\RedirectResponse;
use Symfony\Component\HttpFoundation\Request;

/**
 * Redirects common app paths from Drupal to the Vite dev server.
 */
final class ViteRedirectController extends ControllerBase {

  /**
   * Redirect a path to the React app on port 5173.
   */
  public function redirectToVite(Request $request, string $destination = '', string $subpath = ''): RedirectResponse {
    $base = getenv('DDEV_PRIMARY_URL_WITHOUT_PORT');
    if (!$base) {
      $base = $request->getSchemeAndHttpHost();
    }

    $vite = rtrim($base, '/') . ':5173';
    $path = ltrim($destination, '/');
    if ($subpath !== '') {
      $path = 'tasks/' . ltrim($subpath, '/');
    }
    $target = $path !== '' ? $vite . '/' . $path : $vite . '/';

    $query = $request->getQueryString();
    if ($query) {
      $target .= '?' . $query;
    }

    return new RedirectResponse($target, 302);
  }

}
