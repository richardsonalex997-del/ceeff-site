<?php

declare(strict_types=1);

require __DIR__ . '/common.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    admin_json_response(['ok' => false, 'message' => 'Method not allowed.'], 405);
}

if (!admin_is_logged_in()) {
    admin_json_response(['ok' => false, 'message' => 'Нужно войти в админку.'], 401);
}

if (!admin_verify_csrf($_POST['csrf_token'] ?? null)) {
    admin_json_response(['ok' => false, 'message' => 'Неверный CSRF-токен.'], 403);
}

$uploadType = (string) ($_POST['upload_type'] ?? '');
$folder = trim((string) ($_POST['folder'] ?? ''));

if (!isset($_FILES['images'])) {
    admin_json_response(['ok' => false, 'message' => 'Файлы не получены.'], 422);
}

if ($uploadType === 'projects') {
    if ($folder === '') {
        admin_json_response(['ok' => false, 'message' => 'Укажите папку проекта.'], 422);
    }

    $safeFolder = admin_slugify($folder);
    $targetDirectory = CEEF_MEDIA_ROOT . DIRECTORY_SEPARATOR . 'projects' . DIRECTORY_SEPARATOR . $safeFolder;
    $publicBase = '/media/projects/' . $safeFolder;
} elseif ($uploadType === 'blog') {
    $targetDirectory = CEEF_MEDIA_ROOT . DIRECTORY_SEPARATOR . 'blog';
    $publicBase = '/media/blog';
} elseif ($uploadType === 'licenses') {
    $safeFolder = $folder !== '' ? admin_slugify($folder) : '';
    $targetDirectory = CEEF_MEDIA_ROOT . DIRECTORY_SEPARATOR . 'licenses'
        . ($safeFolder !== '' ? DIRECTORY_SEPARATOR . $safeFolder : '');
    $publicBase = '/media/licenses' . ($safeFolder !== '' ? '/' . $safeFolder : '');
} else {
    admin_json_response(['ok' => false, 'message' => 'Неизвестный тип загрузки.'], 422);
}

if (!is_dir($targetDirectory) && !mkdir($targetDirectory, 0775, true) && !is_dir($targetDirectory)) {
    admin_json_response(['ok' => false, 'message' => 'Не удалось создать папку для загрузки.'], 500);
}

$names = (array) ($_FILES['images']['name'] ?? []);
$tmpNames = (array) ($_FILES['images']['tmp_name'] ?? []);
$errors = (array) ($_FILES['images']['error'] ?? []);
$uploadedFiles = [];

foreach ($names as $index => $originalName) {
    $tmpName = (string) ($tmpNames[$index] ?? '');
    $errorCode = (int) ($errors[$index] ?? UPLOAD_ERR_NO_FILE);

    if ($errorCode !== UPLOAD_ERR_OK || $tmpName === '') {
        continue;
    }

    $extension = strtolower(pathinfo((string) $originalName, PATHINFO_EXTENSION));

    if (!in_array($extension, CEEF_ALLOWED_IMAGE_EXTENSIONS, true)) {
        continue;
    }

    $safeFilename = admin_upload_filename((string) $originalName);
    $safeFilename = admin_unique_upload_path($targetDirectory, $safeFilename);
    $targetPath = $targetDirectory . DIRECTORY_SEPARATOR . $safeFilename;

    if (!move_uploaded_file($tmpName, $targetPath)) {
        continue;
    }

    $uploadedFiles[] = $publicBase . '/' . $safeFilename;
}

if ($uploadedFiles === []) {
    admin_json_response(['ok' => false, 'message' => 'Не удалось загрузить файлы.'], 422);
}

admin_json_response([
    'ok' => true,
    'files' => $uploadedFiles,
    'message' => 'Файлы загружены.',
]);
