<?php

declare(strict_types=1);

require __DIR__ . '/common.php';

header('Content-Type: text/html; charset=utf-8');

$tabGroups = [
    'site' => [
        'title' => 'Сайт',
        'items' => [
            ['key' => 'home', 'label' => 'Главная'],
            ['key' => 'about', 'label' => 'О компании'],
            ['key' => 'licenses', 'label' => 'Лицензии'],
            ['key' => 'contacts', 'label' => 'Контакты и сайт'],
        ],
    ],
    'content' => [
        'title' => 'Контент',
        'items' => [
            ['key' => 'projects', 'label' => 'Проекты и клиенты'],
            ['key' => 'blog', 'label' => 'Блог'],
            ['key' => 'faq', 'label' => 'FAQ'],
            ['key' => 'reviews', 'label' => 'Отзывы'],
        ],
    ],
    'services' => [
        'title' => 'Услуги',
        'items' => [
            ['key' => 'services', 'label' => 'Услуги'],
            ['key' => 'maintenance', 'label' => 'Обслуживание'],
            ['key' => 'consulting', 'label' => 'Консалтинг'],
            ['key' => 'price', 'label' => 'Прайс'],
        ],
    ],
    'admin' => [
        'title' => 'Админка',
        'items' => [
            ['key' => 'settings', 'label' => 'Настройки'],
        ],
    ],
];

$tabs = [];
foreach ($tabGroups as $group) {
    foreach ($group['items'] as $item) {
        $tabs[] = $item['key'];
    }
}
$requestMethod = $_SERVER['REQUEST_METHOD'] ?? 'GET';
$requestedTab = (string) ($_GET['tab'] ?? 'home');
$activeTab = in_array($requestedTab, $tabs, true) ? $requestedTab : 'home';

if ($requestMethod === 'POST') {
    $action = (string) ($_POST['action'] ?? '');

    if ($action === 'logout') {
        admin_logout();
        header('Location: ./index.php');
        exit;
    }

    if ($action === 'login') {
        $username = trim((string) ($_POST['username'] ?? ''));
        $password = (string) ($_POST['password'] ?? '');

        if (admin_login($username, $password)) {
            admin_flash('success', 'Вход выполнен.');
            header('Location: ./index.php');
            exit;
        }

        admin_flash('error', 'Неверный логин или пароль.');
        header('Location: ./index.php');
        exit;
    }

    if (!admin_is_logged_in()) {
        admin_flash('error', 'Сессия истекла. Войдите заново.');
        header('Location: ./index.php');
        exit;
    }

    if (!admin_verify_csrf($_POST['csrf_token'] ?? null)) {
        admin_flash('error', 'Не удалось проверить форму. Обновите страницу и попробуйте снова.');
        header('Location: ./index.php?tab=' . rawurlencode($activeTab));
        exit;
    }

    try {
        if ($action === 'save-password') {
            $currentPassword = (string) ($_POST['current_password'] ?? '');
            $newPassword = (string) ($_POST['new_password'] ?? '');
            $confirmPassword = (string) ($_POST['confirm_password'] ?? '');

            if (!admin_verify_password($currentPassword)) {
                throw new RuntimeException('Текущий пароль указан неверно.');
            }

            if (mb_strlen($newPassword, 'UTF-8') < 8) {
                throw new RuntimeException('Новый пароль должен быть не короче 8 символов.');
            }

            if ($newPassword !== $confirmPassword) {
                throw new RuntimeException('Подтверждение пароля не совпадает.');
            }

            admin_update_password($newPassword);

            admin_flash('success', 'Пароль администратора обновлен.');
            header('Location: ./index.php?tab=settings');
            exit;
        }

        if ($action === 'create-manual-backup') {
            $backupPath = admin_create_manual_backup();

            admin_flash('success', 'Ручная резервная копия создана: ' . $backupPath);
            header('Location: ./index.php?tab=settings');
            exit;
        }

        if ($action === 'save-projects') {
            $projects = admin_normalize_projects((array) ($_POST['projects'] ?? []));
            $clients = admin_multiline_to_array((string) ($_POST['clients_text'] ?? ''));

            admin_write_json('projects', [
                'projects' => $projects,
                'featuredClient' => [
                    'eyebrow' => trim((string) ($_POST['featured_client']['eyebrow'] ?? 'Ключевой кейс')),
                    'title' => trim((string) ($_POST['featured_client']['title'] ?? '')),
                    'description' => trim((string) ($_POST['featured_client']['description'] ?? '')),
                ],
                'clients' => $clients,
            ]);

            admin_flash('success', 'Проекты и список клиентов сохранены.');
            header('Location: ./index.php?tab=projects');
            exit;
        }

        if ($action === 'save-blog') {
            $articles = admin_normalize_entries((array) ($_POST['articles'] ?? []), true);
            $news = admin_normalize_entries((array) ($_POST['news'] ?? []), false);

            admin_write_json('blog', [
                'articles' => $articles,
                'news' => $news,
            ]);

            admin_flash('success', 'Блог сохранен.');
            header('Location: ./index.php?tab=blog');
            exit;
        }

        if ($action === 'save-home') {
            admin_write_json('home', admin_normalize_home((array) ($_POST['home'] ?? [])));

            admin_flash('success', 'Главная страница сохранена.');
            header('Location: ./index.php?tab=home');
            exit;
        }

        if ($action === 'save-about') {
            admin_write_json('about', admin_normalize_about((array) ($_POST['about'] ?? [])));

            admin_flash('success', 'Страница "О компании" сохранена.');
            header('Location: ./index.php?tab=about');
            exit;
        }

        if ($action === 'save-licenses') {
            admin_write_json('licenses', admin_normalize_licenses((array) ($_POST['licenses'] ?? [])));

            admin_flash('success', 'Лицензии и сертификаты сохранены.');
            header('Location: ./index.php?tab=licenses');
            exit;
        }

        if ($action === 'save-contacts') {
            admin_write_json('site', admin_normalize_site((array) ($_POST['site'] ?? [])));
            admin_write_json('contacts', admin_normalize_contacts((array) ($_POST['contacts'] ?? [])));

            admin_flash('success', 'Контакты, шапка и подвал сохранены.');
            header('Location: ./index.php?tab=contacts');
            exit;
        }

        if ($action === 'save-faq') {
            admin_write_json('faq', admin_normalize_faq((array) ($_POST['faq'] ?? [])));

            admin_flash('success', 'FAQ сохранен.');
            header('Location: ./index.php?tab=faq');
            exit;
        }

        if ($action === 'save-reviews') {
            admin_write_json('reviews', admin_normalize_reviews((array) ($_POST['reviews'] ?? [])));

            admin_flash('success', 'Отзывы сохранены.');
            header('Location: ./index.php?tab=reviews');
            exit;
        }
        if ($action === 'save-services') {
            admin_write_json('services', admin_normalize_services((array) ($_POST['services_page'] ?? [])));

            admin_flash('success', 'Страница услуг сохранена.');
            header('Location: ./index.php?tab=services');
            exit;
        }

        if ($action === 'save-maintenance') {
            admin_write_json('maintenance', admin_normalize_maintenance((array) ($_POST['maintenance_page'] ?? [])));

            admin_flash('success', 'Страница обслуживания сохранена.');
            header('Location: ./index.php?tab=maintenance');
            exit;
        }

        if ($action === 'save-consulting') {
            admin_write_json('consulting', admin_normalize_consulting((array) ($_POST['consulting_page'] ?? [])));

            admin_flash('success', 'Страница консалтинга сохранена.');
            header('Location: ./index.php?tab=consulting');
            exit;
        }

        if ($action === 'save-price') {
            admin_write_json('price', admin_normalize_price((array) ($_POST['price_page'] ?? [])));

            admin_flash('success', 'Страница цен сохранена.');
            header('Location: ./index.php?tab=price');
            exit;
        }
    } catch (Throwable $exception) {
        admin_flash('error', 'Не удалось сохранить изменения: ' . $exception->getMessage());
        header('Location: ./index.php?tab=' . rawurlencode($activeTab));
        exit;
    }
}

$flash = admin_pull_flash();
$csrfToken = admin_csrf_token();
$currentAdminUsername = (string) ($_SESSION['ceef_admin_username'] ?? 'admin');
$recentAdminBackups = admin_recent_backups();

function render_project_item(array $project, int $index): void
{
    $imagesText = implode("\n", is_array($project['images'] ?? null) ? $project['images'] : []);
    ?>
    <div class="entry-card" data-entry-item>
      <div class="entry-toolbar">
        <strong>Проект <?= $index + 1 ?></strong>
        <div class="entry-toolbar-actions">
          <button type="button" class="ghost" data-move-up>Вверх</button>
          <button type="button" class="ghost" data-move-down>Вниз</button>
          <button type="button" class="danger" data-remove-entry>Удалить</button>
        </div>
      </div>
      <div class="field-grid">
        <label>Служебный ID
          <input type="text" data-name="id" value="<?= admin_escape((string) ($project['id'] ?? '')) ?>">
        </label>
        <label>Папка / slug
          <input type="text" data-name="slug" value="<?= admin_escape((string) ($project['slug'] ?? '')) ?>">
        </label>
        <label>Название
          <input type="text" data-name="title" value="<?= admin_escape((string) ($project['title'] ?? '')) ?>">
        </label>
        <label>Категория
          <input type="text" data-name="category" value="<?= admin_escape((string) ($project['category'] ?? '')) ?>">
        </label>
      </div>
      <label>Описание
        <textarea data-name="description" rows="3"><?= admin_escape((string) ($project['description'] ?? '')) ?></textarea>
      </label>
      <label>Фото проекта
        <textarea data-name="images_text" rows="5" placeholder="/media/projects/project-folder/photo-1.jpg&#10;/media/projects/project-folder/photo-2.jpg"><?= admin_escape($imagesText) ?></textarea>
      </label>
    </div>
    <?php
}

function render_blog_item(array $entry, int $index, bool $withContent): void
{
    ?>
    <div class="entry-card" data-entry-item>
      <div class="entry-toolbar">
        <strong><?= $withContent ? 'Статья' : 'Новость' ?> <?= $index + 1 ?></strong>
        <div class="entry-toolbar-actions">
          <button type="button" class="ghost" data-move-up>Вверх</button>
          <button type="button" class="ghost" data-move-down>Вниз</button>
          <button type="button" class="danger" data-remove-entry>Удалить</button>
        </div>
      </div>
      <div class="field-grid">
        <label>Служебный ID
          <input type="text" data-name="id" value="<?= admin_escape((string) ($entry['id'] ?? '')) ?>">
        </label>
        <label>Slug
          <input type="text" data-name="slug" value="<?= admin_escape((string) ($entry['slug'] ?? '')) ?>">
        </label>
        <label>Категория
          <input type="text" data-name="category" value="<?= admin_escape((string) ($entry['category'] ?? '')) ?>">
        </label>
        <label>Дата
          <input type="text" data-name="date" value="<?= admin_escape((string) ($entry['date'] ?? '')) ?>">
        </label>
        <?php if ($withContent): ?>
          <label>Время чтения
            <input type="text" data-name="readTime" value="<?= admin_escape((string) ($entry['readTime'] ?? '')) ?>">
          </label>
        <?php endif; ?>
        <label>Картинка
          <input type="text" data-name="image" value="<?= admin_escape((string) ($entry['image'] ?? '')) ?>">
        </label>
      </div>
      <label>Заголовок
        <input type="text" data-name="title" value="<?= admin_escape((string) ($entry['title'] ?? '')) ?>">
      </label>
      <label>Краткое описание
        <textarea data-name="excerpt" rows="3"><?= admin_escape((string) ($entry['excerpt'] ?? '')) ?></textarea>
      </label>
      <?php if ($withContent): ?>
        <label class="checkbox-row">
          <input type="checkbox" data-name="featured" value="1" <?= !empty($entry['featured']) ? 'checked' : '' ?>>
          Рекомендованная статья
        </label>
        <label>Полный текст статьи
          <textarea data-name="content" rows="14"><?= admin_escape((string) ($entry['content'] ?? '')) ?></textarea>
        </label>
      <?php endif; ?>
    </div>
    <?php
}

function admin_lines($value): string
{
    return implode("\n", is_array($value) ? $value : []);
}

function admin_link_lines(array $items): string
{
    $lines = [];

    foreach ($items as $item) {
        $label = trim((string) (($item['label'] ?? $item['name']) ?? ''));
        $href = trim((string) ($item['href'] ?? ''));

        if ($label === '' || $href === '') {
            continue;
        }

        $lines[] = $label . ' | ' . $href;
    }

    return implode("\n", $lines);
}

function render_home_card_item(array $card, int $index): void
{
    ?>
    <div class="entry-card" data-entry-item>
      <div class="entry-toolbar">
        <strong>Карточка <?= $index + 1 ?></strong>
        <div class="entry-toolbar-actions">
          <button type="button" class="ghost" data-move-up>Вверх</button>
          <button type="button" class="ghost" data-move-down>Вниз</button>
          <button type="button" class="danger" data-remove-entry>Удалить</button>
        </div>
      </div>
      <div class="field-grid">
        <label>Иконка
          <input type="text" data-name="icon" value="<?= admin_escape((string) ($card['icon'] ?? 'shield')) ?>">
        </label>
        <label>Цвет
          <input type="text" data-name="color" value="<?= admin_escape((string) ($card['color'] ?? 'blue')) ?>">
        </label>
        <label>Заголовок
          <input type="text" data-name="title" value="<?= admin_escape((string) ($card['title'] ?? '')) ?>">
        </label>
      </div>
      <label>Описание
        <textarea data-name="description" rows="3"><?= admin_escape((string) ($card['description'] ?? '')) ?></textarea>
      </label>
    </div>
    <?php
}

function render_direction_item(array $direction, int $index): void
{
    ?>
    <div class="entry-card" data-entry-item>
      <div class="entry-toolbar">
        <strong>Направление <?= $index + 1 ?></strong>
        <div class="entry-toolbar-actions">
          <button type="button" class="ghost" data-move-up>Вверх</button>
          <button type="button" class="ghost" data-move-down>Вниз</button>
          <button type="button" class="danger" data-remove-entry>Удалить</button>
        </div>
      </div>
      <div class="field-grid">
        <label>Иконка
          <input type="text" data-name="icon" value="<?= admin_escape((string) ($direction['icon'] ?? 'zap')) ?>">
        </label>
        <label>Цвет
          <input type="text" data-name="color" value="<?= admin_escape((string) ($direction['color'] ?? 'orange')) ?>">
        </label>
        <label>Ссылка
          <input type="text" data-name="link" value="<?= admin_escape((string) ($direction['link'] ?? 'Services')) ?>">
        </label>
        <label>Заголовок
          <input type="text" data-name="title" value="<?= admin_escape((string) ($direction['title'] ?? '')) ?>">
        </label>
      </div>
      <label>Описание
        <textarea data-name="description" rows="3"><?= admin_escape((string) ($direction['description'] ?? '')) ?></textarea>
      </label>
      <label>Пункты списка
        <textarea data-name="features_text" rows="5"><?= admin_escape(admin_lines($direction['features'] ?? [])) ?></textarea>
      </label>
    </div>
    <?php
}

function render_stat_item(array $stat, int $index): void
{
    ?>
    <div class="entry-card" data-entry-item>
      <div class="entry-toolbar">
        <strong>Показатель <?= $index + 1 ?></strong>
        <div class="entry-toolbar-actions">
          <button type="button" class="ghost" data-move-up>Вверх</button>
          <button type="button" class="ghost" data-move-down>Вниз</button>
          <button type="button" class="danger" data-remove-entry>Удалить</button>
        </div>
      </div>
      <div class="field-grid">
        <label>Значение
          <input type="text" data-name="value" value="<?= admin_escape((string) ($stat['value'] ?? '')) ?>">
        </label>
        <label>Подпись
          <input type="text" data-name="label" value="<?= admin_escape((string) ($stat['label'] ?? '')) ?>">
        </label>
        <label>Иконка
          <input type="text" data-name="icon" value="<?= admin_escape((string) ($stat['icon'] ?? 'users')) ?>">
        </label>
      </div>
    </div>
    <?php
}

function render_advantage_item(array $advantage, int $index): void
{
    ?>
    <div class="entry-card" data-entry-item>
      <div class="entry-toolbar">
        <strong>Преимущество <?= $index + 1 ?></strong>
        <div class="entry-toolbar-actions">
          <button type="button" class="ghost" data-move-up>Вверх</button>
          <button type="button" class="ghost" data-move-down>Вниз</button>
          <button type="button" class="danger" data-remove-entry>Удалить</button>
        </div>
      </div>
      <div class="field-grid">
        <label>Иконка
          <input type="text" data-name="icon" value="<?= admin_escape((string) ($advantage['icon'] ?? 'shield')) ?>">
        </label>
        <label>Цвет
          <input type="text" data-name="color" value="<?= admin_escape((string) ($advantage['color'] ?? 'green')) ?>">
        </label>
        <label>Заголовок
          <input type="text" data-name="title" value="<?= admin_escape((string) ($advantage['title'] ?? '')) ?>">
        </label>
      </div>
      <label>Описание
        <textarea data-name="description" rows="3"><?= admin_escape((string) ($advantage['description'] ?? '')) ?></textarea>
      </label>
    </div>
    <?php
}

function render_step_item(array $step, int $index): void
{
    ?>
    <div class="entry-card" data-entry-item>
      <div class="entry-toolbar">
        <strong>Шаг <?= $index + 1 ?></strong>
        <div class="entry-toolbar-actions">
          <button type="button" class="ghost" data-move-up>Вверх</button>
          <button type="button" class="ghost" data-move-down>Вниз</button>
          <button type="button" class="danger" data-remove-entry>Удалить</button>
        </div>
      </div>
      <div class="field-grid">
        <label>Номер шага
          <input type="text" data-name="step" value="<?= admin_escape((string) ($step['step'] ?? '')) ?>">
        </label>
        <label>Заголовок
          <input type="text" data-name="title" value="<?= admin_escape((string) ($step['title'] ?? '')) ?>">
        </label>
      </div>
      <label>Описание
        <textarea data-name="description" rows="3"><?= admin_escape((string) ($step['description'] ?? '')) ?></textarea>
      </label>
    </div>
    <?php
}

function render_regulation_item(array $regulation, int $index): void
{
    ?>
    <div class="entry-card" data-entry-item>
      <div class="entry-toolbar">
        <strong>Документ <?= $index + 1 ?></strong>
        <div class="entry-toolbar-actions">
          <button type="button" class="ghost" data-move-up>Вверх</button>
          <button type="button" class="ghost" data-move-down>Вниз</button>
          <button type="button" class="danger" data-remove-entry>Удалить</button>
        </div>
      </div>
      <label>Название
        <input type="text" data-name="title" value="<?= admin_escape((string) ($regulation['title'] ?? '')) ?>">
      </label>
      <label>Описание
        <textarea data-name="description" rows="3"><?= admin_escape((string) ($regulation['description'] ?? '')) ?></textarea>
      </label>
    </div>
    <?php
}

function render_license_category_item(array $category, int $index): void
{
    ?>
    <div class="entry-card" data-entry-item>
      <div class="entry-toolbar">
        <strong>Категория <?= $index + 1 ?></strong>
        <div class="entry-toolbar-actions">
          <button type="button" class="ghost" data-move-up>Вверх</button>
          <button type="button" class="ghost" data-move-down>Вниз</button>
          <button type="button" class="danger" data-remove-entry>Удалить</button>
        </div>
      </div>
      <div class="field-grid">
        <label>ID
          <input type="text" data-name="id" value="<?= admin_escape((string) ($category['id'] ?? '')) ?>">
        </label>
        <label>Название
          <input type="text" data-name="label" value="<?= admin_escape((string) ($category['label'] ?? '')) ?>">
        </label>
      </div>
    </div>
    <?php
}

function render_license_item(array $item, int $index): void
{
    $previewImage = (string) ($item['previewImage'] ?? '');
    $singleImage = (string) ($item['image'] ?? '');
    $imagesText = admin_lines($item['images'] ?? []);
    ?>
    <div class="entry-card" data-entry-item>
      <div class="entry-toolbar">
        <strong>Документ <?= $index + 1 ?></strong>
        <div class="entry-toolbar-actions">
          <button type="button" class="ghost" data-move-up>Вверх</button>
          <button type="button" class="ghost" data-move-down>Вниз</button>
          <button type="button" class="danger" data-remove-entry>Удалить</button>
        </div>
      </div>
      <div class="field-grid">
        <label>Служебный ID
          <input type="text" data-name="id" value="<?= admin_escape((string) ($item['id'] ?? '')) ?>">
        </label>
        <label>Категория
          <input type="text" data-name="category" value="<?= admin_escape((string) ($item['category'] ?? '')) ?>">
        </label>
        <label>Кем выдан
          <input type="text" data-name="issuer" value="<?= admin_escape((string) ($item['issuer'] ?? '')) ?>">
        </label>
        <label>Номер
          <input type="text" data-name="number" value="<?= admin_escape((string) ($item['number'] ?? '')) ?>">
        </label>
        <label>Срок действия
          <input type="text" data-name="validUntil" value="<?= admin_escape((string) ($item['validUntil'] ?? '')) ?>">
        </label>
        <label>Превью
          <input type="text" data-name="previewImage" value="<?= admin_escape((string) ($item['previewImage'] ?? '')) ?>">
        </label>
        <label>Одиночное изображение
          <input type="text" data-name="image" value="<?= admin_escape((string) ($item['image'] ?? '')) ?>">
        </label>
      </div>
      <div class="inline-upload-grid">
        <div class="inline-upload-card" data-inline-upload data-upload-type="licenses" data-upload-target="previewImage" data-upload-mode="replace" data-upload-folder-source="id">
          <div class="inline-upload-title">Загрузить превью с ПК</div>
          <div class="inline-upload-help">Файл загрузится в папку лицензии по служебному ID и подставится в поле “Превью”.</div>
          <div class="inline-upload-controls">
            <input type="file" data-inline-upload-input accept=".jpg,.jpeg,.png,.webp">
            <button type="button" class="ghost" data-inline-upload-button>Загрузить</button>
          </div>
          <div class="upload-result" data-inline-upload-result hidden><?= admin_escape($previewImage) ?></div>
        </div>
        <div class="inline-upload-card" data-inline-upload data-upload-type="licenses" data-upload-target="image" data-upload-mode="replace" data-upload-folder-source="id">
          <div class="inline-upload-title">Загрузить основное изображение</div>
          <div class="inline-upload-help">Подходит для одиночного изображения документа или карточки.</div>
          <div class="inline-upload-controls">
            <input type="file" data-inline-upload-input accept=".jpg,.jpeg,.png,.webp">
            <button type="button" class="ghost" data-inline-upload-button>Загрузить</button>
          </div>
          <div class="upload-result" data-inline-upload-result hidden><?= admin_escape($singleImage) ?></div>
        </div>
        <div class="inline-upload-card" data-inline-upload data-upload-type="licenses" data-upload-target="images_text" data-upload-mode="append" data-upload-folder-source="id">
          <div class="inline-upload-title">Загрузить страницы в галерею</div>
          <div class="inline-upload-help">Можно выбрать несколько файлов. Новые пути добавятся в “Галерея страниц”.</div>
          <div class="inline-upload-controls">
            <input type="file" data-inline-upload-input accept=".jpg,.jpeg,.png,.webp" multiple>
            <button type="button" class="ghost" data-inline-upload-button>Загрузить</button>
          </div>
          <div class="upload-result" data-inline-upload-result hidden><?= admin_escape($imagesText) ?></div>
        </div>
      </div>
      <label>Название документа
        <input type="text" data-name="title" value="<?= admin_escape((string) ($item['title'] ?? '')) ?>">
      </label>
      <label>Галерея страниц
        <textarea data-name="images_text" rows="5"><?= admin_escape(admin_lines($item['images'] ?? [])) ?></textarea>
      </label>
    </div>
    <?php
}

function render_faq_item(array $item, int $index): void
{
    ?>
    <div class="entry-card" data-entry-item>
      <div class="entry-toolbar">
        <strong>Вопрос <?= $index + 1 ?></strong>
        <div class="entry-toolbar-actions">
          <button type="button" class="ghost" data-move-up>Вверх</button>
          <button type="button" class="ghost" data-move-down>Вниз</button>
          <button type="button" class="danger" data-remove-entry>Удалить</button>
        </div>
      </div>
      <label>Вопрос
        <input type="text" data-name="question" value="<?= admin_escape((string) ($item['question'] ?? '')) ?>">
      </label>
      <label>Ответ
        <textarea data-name="answer" rows="5"><?= admin_escape((string) ($item['answer'] ?? '')) ?></textarea>
      </label>
    </div>
    <?php
}

function render_review_item(array $item, int $index): void
{
    ?>
    <div class="entry-card" data-entry-item>
      <div class="entry-toolbar">
        <strong>Отзыв <?= $index + 1 ?></strong>
        <div class="entry-toolbar-actions">
          <button type="button" class="ghost" data-move-up>Вверх</button>
          <button type="button" class="ghost" data-move-down>Вниз</button>
          <button type="button" class="danger" data-remove-entry>Удалить</button>
        </div>
      </div>
      <div class="field-grid">
        <label>Служебный ID
          <input type="text" data-name="id" value="<?= admin_escape((string) ($item['id'] ?? '')) ?>">
        </label>
        <label>Автор
          <input type="text" data-name="author" value="<?= admin_escape((string) ($item['author'] ?? '')) ?>">
        </label>
        <label>Должность / компания
          <input type="text" data-name="position" value="<?= admin_escape((string) ($item['position'] ?? '')) ?>">
        </label>
        <label>Инициалы
          <input type="text" data-name="initials" value="<?= admin_escape((string) ($item['initials'] ?? '')) ?>">
        </label>
        <label>Рейтинг
          <input type="number" min="1" max="5" data-name="rating" value="<?= admin_escape((string) ($item['rating'] ?? '5')) ?>">
        </label>
      </div>
      <label>Текст отзыва
        <textarea data-name="text" rows="5"><?= admin_escape((string) ($item['text'] ?? '')) ?></textarea>
      </label>
    </div>
    <?php
}

function render_services_tab_item(array $tab, int $index): void
{
    ?>
    <div class="entry-card" data-entry-item>
      <div class="entry-toolbar">
        <strong>Вкладка <?= $index + 1 ?></strong>
        <div class="entry-toolbar-actions">
          <button type="button" class="ghost" data-move-up>Вверх</button>
          <button type="button" class="ghost" data-move-down>Вниз</button>
          <button type="button" class="danger" data-remove-entry>Удалить</button>
        </div>
      </div>
      <div class="field-grid">
        <label>ID
          <input type="text" data-name="id" value="<?= admin_escape((string) ($tab['id'] ?? '')) ?>">
        </label>
        <label>Название
          <input type="text" data-name="name" value="<?= admin_escape((string) ($tab['name'] ?? '')) ?>">
        </label>
        <label>Иконка
          <input type="text" data-name="icon" value="<?= admin_escape((string) ($tab['icon'] ?? 'shield')) ?>">
        </label>
      </div>
    </div>
    <?php
}

function render_services_section_item(array $section, int $index): void
{
    $servicesText = [];

    foreach ((array) ($section['services'] ?? []) as $service) {
        $name = trim((string) ($service['name'] ?? ''));
        $detail = trim((string) ($service['detail'] ?? ''));
        if ($name !== '') {
            $servicesText[] = $name . ($detail !== '' ? ' | ' . $detail : '');
        }
    }
    ?>
    <div class="entry-card" data-entry-item>
      <div class="entry-toolbar">
        <strong>Раздел <?= $index + 1 ?></strong>
        <div class="entry-toolbar-actions">
          <button type="button" class="ghost" data-move-up>Вверх</button>
          <button type="button" class="ghost" data-move-down>Вниз</button>
          <button type="button" class="danger" data-remove-entry>Удалить</button>
        </div>
      </div>
      <div class="field-grid">
        <label>ID
          <input type="text" data-name="id" value="<?= admin_escape((string) ($section['id'] ?? '')) ?>">
        </label>
        <label>Заголовок
          <input type="text" data-name="title" value="<?= admin_escape((string) ($section['title'] ?? '')) ?>">
        </label>
      </div>
      <label>Описание
        <textarea data-name="description" rows="3"><?= admin_escape((string) ($section['description'] ?? '')) ?></textarea>
      </label>
      <label>Услуги в разделе
        <textarea data-name="services_text" rows="8" placeholder="Название | Подпись&#10;Название | Подпись"><?= admin_escape(implode("\n", $servicesText)) ?></textarea>
      </label>
    </div>
    <?php
}

function render_maintenance_advantage_item(array $item, int $index): void
{
    ?>
    <div class="entry-card" data-entry-item>
      <div class="entry-toolbar">
        <strong>Преимущество <?= $index + 1 ?></strong>
        <div class="entry-toolbar-actions">
          <button type="button" class="ghost" data-move-up>Вверх</button>
          <button type="button" class="ghost" data-move-down>Вниз</button>
          <button type="button" class="danger" data-remove-entry>Удалить</button>
        </div>
      </div>
      <div class="field-grid">
        <label>Иконка
          <input type="text" data-name="icon" value="<?= admin_escape((string) ($item['icon'] ?? 'shield')) ?>">
        </label>
        <label>Заголовок
          <input type="text" data-name="title" value="<?= admin_escape((string) ($item['title'] ?? '')) ?>">
        </label>
      </div>
      <label>Текст
        <textarea data-name="text" rows="3"><?= admin_escape((string) ($item['text'] ?? '')) ?></textarea>
      </label>
    </div>
    <?php
}

function render_maintenance_service_item(array $item, int $index): void
{
    ?>
    <div class="entry-card" data-entry-item>
      <div class="entry-toolbar">
        <strong>Услуга <?= $index + 1 ?></strong>
        <div class="entry-toolbar-actions">
          <button type="button" class="ghost" data-move-up>Вверх</button>
          <button type="button" class="ghost" data-move-down>Вниз</button>
          <button type="button" class="danger" data-remove-entry>Удалить</button>
        </div>
      </div>
      <div class="field-grid">
        <label>ID
          <input type="text" data-name="id" value="<?= admin_escape((string) ($item['id'] ?? '')) ?>">
        </label>
        <label>Иконка
          <input type="text" data-name="icon" value="<?= admin_escape((string) ($item['icon'] ?? 'wrench')) ?>">
        </label>
        <label>Короткий заголовок
          <input type="text" data-name="title" value="<?= admin_escape((string) ($item['title'] ?? '')) ?>">
        </label>
        <label>Заголовок блока
          <input type="text" data-name="subtitle" value="<?= admin_escape((string) ($item['subtitle'] ?? '')) ?>">
        </label>
        <label>Цена
          <input type="text" data-name="price" value="<?= admin_escape((string) ($item['price'] ?? '')) ?>">
        </label>
      </div>
      <label>Описание
        <textarea data-name="description" rows="4"><?= admin_escape((string) ($item['description'] ?? '')) ?></textarea>
      </label>
      <label>Состав работ
        <textarea data-name="works_text" rows="8"><?= admin_escape(admin_lines($item['works'] ?? [])) ?></textarea>
      </label>
      <label>Периодичность
        <textarea data-name="periodicity_text" rows="4"><?= admin_escape(admin_lines($item['periodicity'] ?? [])) ?></textarea>
      </label>
    </div>
    <?php
}

function render_consulting_advantage_item(array $item, int $index): void
{
    ?>
    <div class="entry-card" data-entry-item>
      <div class="entry-toolbar">
        <strong>Преимущество <?= $index + 1 ?></strong>
        <div class="entry-toolbar-actions">
          <button type="button" class="ghost" data-move-up>Вверх</button>
          <button type="button" class="ghost" data-move-down>Вниз</button>
          <button type="button" class="danger" data-remove-entry>Удалить</button>
        </div>
      </div>
      <label>Заголовок
        <input type="text" data-name="title" value="<?= admin_escape((string) ($item['title'] ?? '')) ?>">
      </label>
      <label>Описание
        <textarea data-name="description" rows="3"><?= admin_escape((string) ($item['description'] ?? '')) ?></textarea>
      </label>
    </div>
    <?php
}

function render_consulting_service_item(array $item, int $index): void
{
    ?>
    <div class="entry-card" data-entry-item>
      <div class="entry-toolbar">
        <strong>Услуга <?= $index + 1 ?></strong>
        <div class="entry-toolbar-actions">
          <button type="button" class="ghost" data-move-up>Вверх</button>
          <button type="button" class="ghost" data-move-down>Вниз</button>
          <button type="button" class="danger" data-remove-entry>Удалить</button>
        </div>
      </div>
      <div class="field-grid">
        <label>Иконка
          <input type="text" data-name="icon" value="<?= admin_escape((string) ($item['icon'] ?? 'file-text')) ?>">
        </label>
        <label>Цена
          <input type="text" data-name="price" value="<?= admin_escape((string) ($item['price'] ?? '')) ?>">
        </label>
      </div>
      <label>Заголовок
        <input type="text" data-name="title" value="<?= admin_escape((string) ($item['title'] ?? '')) ?>">
      </label>
      <label>Описание
        <textarea data-name="description" rows="4"><?= admin_escape((string) ($item['description'] ?? '')) ?></textarea>
      </label>
      <label>Пункты списка
        <textarea data-name="details_text" rows="7"><?= admin_escape(admin_lines($item['details'] ?? [])) ?></textarea>
      </label>
    </div>
    <?php
}

function render_price_option_item(array $item, int $index, string $priceField, string $title): void
{
    ?>
    <div class="entry-card" data-entry-item>
      <div class="entry-toolbar">
        <strong><?= admin_escape($title) ?> <?= $index + 1 ?></strong>
        <div class="entry-toolbar-actions">
          <button type="button" class="ghost" data-move-up>Вверх</button>
          <button type="button" class="ghost" data-move-down>Вниз</button>
          <button type="button" class="danger" data-remove-entry>Удалить</button>
        </div>
      </div>
      <div class="field-grid">
        <label>ID
          <input type="text" data-name="id" value="<?= admin_escape((string) ($item['id'] ?? '')) ?>">
        </label>
        <label>Название
          <input type="text" data-name="label" value="<?= admin_escape((string) ($item['label'] ?? '')) ?>">
        </label>
        <label><?= admin_escape($priceField === 'basePrice' ? 'Базовая цена' : 'Множитель') ?>
          <input type="text" data-name="<?= admin_escape($priceField) ?>" value="<?= admin_escape((string) ($item[$priceField] ?? '')) ?>">
        </label>
      </div>
    </div>
    <?php
}

function render_price_table_item(array $item, int $index): void
{
    ?>
    <div class="entry-card" data-entry-item>
      <div class="entry-toolbar">
        <strong>Строка прайса <?= $index + 1 ?></strong>
        <div class="entry-toolbar-actions">
          <button type="button" class="ghost" data-move-up>Вверх</button>
          <button type="button" class="ghost" data-move-down>Вниз</button>
          <button type="button" class="danger" data-remove-entry>Удалить</button>
        </div>
      </div>
      <div class="field-grid">
        <label>Наименование
          <input type="text" data-name="name" value="<?= admin_escape((string) ($item['name'] ?? '')) ?>">
        </label>
        <label>Ед. изм.
          <input type="text" data-name="unit" value="<?= admin_escape((string) ($item['unit'] ?? '')) ?>">
        </label>
        <label>Цена
          <input type="text" data-name="price" value="<?= admin_escape((string) ($item['price'] ?? '')) ?>">
        </label>
      </div>
    </div>
    <?php
}

if (!admin_is_logged_in()):
?>
<!DOCTYPE html>
<html lang="ru">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Админка ЦЭФ</title>
  <style>
    body { margin: 0; font-family: Arial, sans-serif; background: linear-gradient(180deg,#edf3fb 0%,#f8fafc 100%); color: #132235; min-height: 100vh; display: grid; place-items: center; padding: 24px; }
    .card { width: min(100%, 440px); background: #fff; border: 1px solid #d8e0ea; border-radius: 24px; padding: 32px; box-shadow: 0 30px 60px rgba(19,34,53,.12); }
    h1 { margin: 0 0 10px; font-size: 32px; }
    p { margin: 0 0 18px; color: #5f6f82; line-height: 1.5; }
    label { display: block; margin-bottom: 16px; font-weight: 700; }
    input { width: 100%; margin-top: 8px; border: 1px solid #d8e0ea; border-radius: 14px; padding: 14px 16px; font-size: 16px; box-sizing: border-box; }
    button { width: 100%; border: 0; border-radius: 14px; padding: 14px 18px; font-size: 16px; font-weight: 700; color: #fff; background: #f97316; cursor: pointer; }
    .flash { margin-bottom: 16px; border-radius: 14px; padding: 12px 14px; font-weight: 700; }
    .flash.error { background: #ffe9e7; color: #a33028; }
    .flash.success { background: #e7f8ee; color: #247646; }
    code { background: #eef3f8; border-radius: 8px; padding: 2px 8px; }
  </style>
</head>
<body>
  <form class="card" method="post" action="./index.php">
    <h1>Админка ЦЭФ</h1>
    <p>Панель управления для Reg.ru. Здесь можно редактировать проекты, клиентов, статьи и новости без пересборки сайта.</p>
    <?php if ($flash): ?><div class="flash <?= admin_escape($flash['type']) ?>"><?= admin_escape($flash['message']) ?></div><?php endif; ?>
    <input type="hidden" name="action" value="login">
    <label>Логин
      <input type="text" name="username" autocomplete="username" required>
    </label>
    <label>Пароль
      <input type="password" name="password" autocomplete="current-password" required>
    </label>
    <button type="submit">Войти</button>
    <p style="margin-top:16px;font-size:14px;">Доступы можно поменять в <code>public/admin/auth-config.php</code>.</p>
  </form>
</body>
</html>
<?php
exit;
endif;

$projectsContent = admin_read_json('projects');
$blogContent = admin_read_json('blog');
$homeContent = admin_read_json('home');
$aboutContent = admin_read_json('about');
$licensesContent = admin_read_json('licenses');
$siteContent = admin_read_json('site');
$contactsContent = admin_read_json('contacts');
$faqContent = admin_read_json('faq');
$reviewsContent = admin_read_json('reviews');
$servicesPageContent = admin_read_json('services');
$maintenancePageContent = admin_read_json('maintenance');
$consultingPageContent = admin_read_json('consulting');
$pricePageContent = admin_read_json('price');
$projects = is_array($projectsContent['projects'] ?? null) ? $projectsContent['projects'] : [];
$clients = is_array($projectsContent['clients'] ?? null) ? $projectsContent['clients'] : [];
$featuredClient = is_array($projectsContent['featuredClient'] ?? null) ? $projectsContent['featuredClient'] : [];
$articles = is_array($blogContent['articles'] ?? null) ? $blogContent['articles'] : [];
$news = is_array($blogContent['news'] ?? null) ? $blogContent['news'] : [];
$heroCards = is_array($homeContent['hero_cards'] ?? null) ? $homeContent['hero_cards'] : [];
$directions = is_array($homeContent['directions'] ?? null) ? $homeContent['directions'] : [];
$stats = is_array($aboutContent['stats'] ?? null) ? $aboutContent['stats'] : [];
$advantages = is_array($aboutContent['advantages'] ?? null) ? $aboutContent['advantages'] : [];
$approachSteps = is_array($aboutContent['approachSteps'] ?? null) ? $aboutContent['approachSteps'] : [];
$regulations = is_array($aboutContent['regulations'] ?? null) ? $aboutContent['regulations'] : [];
$introParagraphs = is_array($aboutContent['introParagraphs'] ?? null) ? $aboutContent['introParagraphs'] : [];
$licenseCategories = is_array($licensesContent['categories'] ?? null) ? $licensesContent['categories'] : [];
$licenseItems = is_array($licensesContent['items'] ?? null) ? $licensesContent['items'] : [];
$siteNavigationText = admin_link_lines(is_array($siteContent['navigation'] ?? null) ? $siteContent['navigation'] : []);
$siteFooterSectionsText = admin_link_lines(is_array($siteContent['footerSections'] ?? null) ? $siteContent['footerSections'] : []);
$siteFooterDocumentsText = admin_link_lines(is_array($siteContent['footerDocuments'] ?? null) ? $siteContent['footerDocuments'] : []);
$faqItems = is_array($faqContent['items'] ?? null) ? $faqContent['items'] : [];
$reviewItems = is_array($reviewsContent['items'] ?? null) ? $reviewsContent['items'] : [];
$servicesTabs = is_array($servicesPageContent['tabs'] ?? null) ? $servicesPageContent['tabs'] : [];
$servicesSections = is_array($servicesPageContent['sections'] ?? null) ? $servicesPageContent['sections'] : [];
$maintenanceAdvantages = is_array($maintenancePageContent['advantages'] ?? null) ? $maintenancePageContent['advantages'] : [];
$maintenanceServices = is_array($maintenancePageContent['services'] ?? null) ? $maintenancePageContent['services'] : [];
$consultingAdvantages = is_array($consultingPageContent['advantages'] ?? null) ? $consultingPageContent['advantages'] : [];
$consultingServices = is_array($consultingPageContent['services'] ?? null) ? $consultingPageContent['services'] : [];
$priceServiceOptions = is_array($pricePageContent['serviceOptions'] ?? null) ? $pricePageContent['serviceOptions'] : [];
$priceVoltageOptions = is_array($pricePageContent['voltageOptions'] ?? null) ? $pricePageContent['voltageOptions'] : [];
$priceUrgencyOptions = is_array($pricePageContent['urgencyOptions'] ?? null) ? $pricePageContent['urgencyOptions'] : [];
$priceTableItems = is_array($pricePageContent['priceTable'] ?? null) ? $pricePageContent['priceTable'] : [];
?>
<!DOCTYPE html>
<html lang="ru">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Админка ЦЭФ</title>
  <style>
    :root { --bg:#eef3f9; --panel:#fff; --line:#d8e0ea; --line-strong:#c7d1dc; --text:#132235; --muted:#5f6f82; --accent:#f97316; --accent-dark:#dd6510; --danger:#d13f34; --danger-dark:#b7342a; --shadow:0 24px 50px rgba(19,34,53,.08); }
    * { box-sizing: border-box; }
    body { margin: 0; font-family: Arial, sans-serif; background: linear-gradient(180deg,#edf3fb 0%,#f8fafc 100%); color: var(--text); }
    .shell { max-width: 1400px; margin: 0 auto; padding: 24px; }
    .topbar { display:flex; flex-wrap:wrap; justify-content:space-between; gap:16px; align-items:center; margin-bottom:24px; }
    .topbar h1 { margin:0 0 6px; font-size:34px; }
    .topbar p { margin:0; color:var(--muted); max-width:760px; line-height:1.5; }
    .actions { display:flex; flex-wrap:wrap; gap:10px; align-items:center; }
    .panel { background:var(--panel); border:1px solid var(--line); border-radius:24px; box-shadow:var(--shadow); overflow:hidden; }
    .tabs { display:grid; gap:14px; padding:18px; border-bottom:1px solid var(--line); background:#f7fafc; }
    .tabs-group { display:grid; gap:10px; padding:14px 16px; border:1px solid var(--line); border-radius:18px; background:#fff; }
    .tabs-group-links { display:flex; flex-wrap:wrap; gap:8px; }
    .tabs-title { font-size:12px; font-weight:800; letter-spacing:.08em; text-transform:uppercase; color:var(--muted); }
    .tab-link { text-decoration:none; padding:12px 16px; border-radius:14px; font-weight:700; color:var(--muted); background:#fff; border:1px solid var(--line); }
    .tab-link.active { color:#fff; background:var(--accent); border-color:var(--accent); }
    .content { padding:24px; display:grid; gap:24px; }
    .notice,.flash { border-radius:18px; padding:14px 16px; line-height:1.5; }
    .notice { background:#fff8f2; border:1px solid #ffd5b6; color:#8d4b14; }
    .flash.success { background:#e7f8ee; color:#247646; }
    .flash.error { background:#ffe9e7; color:#a33028; }
    .section-card { border:1px solid var(--line); border-radius:22px; padding:22px; background:#fff; }
    .section-card h2,.section-card h3 { margin:0 0 10px; }
    .section-card p { margin:0 0 16px; color:var(--muted); line-height:1.5; }
    .button-row { display:flex; flex-wrap:wrap; gap:10px; margin-top:14px; }
    .button,button { border:0; border-radius:14px; padding:12px 16px; font-weight:700; cursor:pointer; text-decoration:none; display:inline-flex; align-items:center; justify-content:center; gap:8px; background:var(--accent); color:#fff; }
    .button:hover,button:hover { background:var(--accent-dark); }
    .ghost { background:#f2f5f8; color:var(--text); }
    .ghost:hover { background:#e6ecf2; }
    .danger { background:var(--danger); }
    .danger:hover { background:var(--danger-dark); }
    .field-grid { display:grid; gap:14px; grid-template-columns:repeat(auto-fit,minmax(220px,1fr)); margin-bottom:14px; }
    label { display:block; font-weight:700; margin-bottom:14px; }
    input[type="text"],input[type="password"],textarea,input[type="file"] { width:100%; margin-top:8px; border:1px solid var(--line-strong); border-radius:14px; padding:12px 14px; background:#fff; color:var(--text); }
    textarea { resize:vertical; min-height:96px; }
    .entry-list { display:grid; gap:18px; margin-top:18px; }
    .entry-card { border:1px solid var(--line); border-radius:20px; padding:18px; background:#fbfdff; }
    .entry-toolbar { display:flex; justify-content:space-between; align-items:center; gap:12px; margin-bottom:14px; }
    .entry-toolbar-actions { display:flex; flex-wrap:wrap; gap:8px; }
    .entry-toolbar button { padding:10px 12px; font-size:14px; }
    .checkbox-row { display:flex; align-items:center; gap:10px; font-weight:700; }
    .checkbox-row input { width:auto; margin:0; }
    .upload-result { margin-top:12px; border-radius:14px; background:#f3f7fb; border:1px solid var(--line); padding:12px 14px; white-space:pre-wrap; color:var(--text); }
    .backup-list { display:grid; gap:12px; }
    .backup-card { border:1px solid var(--line); border-radius:18px; background:#fbfdff; padding:16px 18px; }
    .backup-card-top { display:flex; justify-content:space-between; align-items:flex-start; gap:12px; margin-bottom:8px; flex-wrap:wrap; }
    .backup-badge { display:inline-flex; align-items:center; border-radius:999px; padding:6px 10px; font-size:12px; font-weight:800; letter-spacing:.03em; }
    .backup-badge.manual { background:#e8f3ff; color:#195ea8; }
    .backup-badge.auto { background:#fff3e8; color:#a85012; }
    .backup-files { margin:8px 0 0; padding-left:18px; color:var(--muted); }
    .image-preview-host { margin-top:12px; }
    .image-preview-grid { display:grid; gap:12px; grid-template-columns:repeat(auto-fit,minmax(132px,1fr)); margin-top:12px; }
    .image-preview-card { border:1px solid var(--line); border-radius:16px; background:#fbfdff; overflow:hidden; }
    .image-preview-thumb { display:block; width:100%; aspect-ratio:4/3; object-fit:cover; background:#eef3f9; }
    .image-preview-meta { padding:10px 12px; font-size:13px; color:var(--muted); line-height:1.4; word-break:break-all; }
    .image-preview-empty { margin-top:12px; border:1px dashed var(--line); border-radius:14px; padding:12px 14px; color:var(--muted); font-size:13px; }
    .inline-upload-grid { display:grid; gap:14px; grid-template-columns:repeat(auto-fit,minmax(240px,1fr)); margin:0 0 14px; }
    .inline-upload-card { border:1px solid var(--line); border-radius:18px; background:#fff; padding:14px; }
    .inline-upload-title { font-weight:800; margin-bottom:6px; }
    .inline-upload-help { color:var(--muted); font-size:13px; line-height:1.5; margin-bottom:12px; }
    .inline-upload-controls { display:grid; gap:10px; }
    .inline-upload-card .upload-result { margin-top:10px; }
    .muted { color:var(--muted); font-size:14px; }
    .footer-actions { position:sticky; bottom:0; background:rgba(255,255,255,.92); backdrop-filter:blur(10px); border-top:1px solid var(--line); margin:0 -24px -24px; padding:16px 24px; display:flex; justify-content:space-between; gap:12px; flex-wrap:wrap; align-items:center; }
    code { background:#eef3f8; border-radius:8px; padding:2px 6px; }
    @media (max-width:800px) { .shell { padding:14px; } .content { padding:16px; } .footer-actions { margin:0 -16px -16px; padding:14px 16px; } .entry-toolbar { align-items:flex-start; flex-direction:column; } .tabs-group { padding:12px 14px; } .tabs-group-links { flex-direction:column; } .tabs-title { min-width:0; } }
  </style>
</head>
<body>
  <div class="shell">
    <div class="topbar">
      <div>
        <h1>Админка ЦЭФ</h1>
        <p>Простая панель для Reg.ru: редактирование проектов, клиентов, статей и новостей без пересборки сайта. Изменения сохраняются прямо в <code>/data/*.json</code>.</p>
      </div>
      <div class="actions">
        <a class="button ghost" href="/" target="_blank" rel="noreferrer">Открыть сайт</a>
        <form method="post" action="./index.php" style="margin:0;">
          <input type="hidden" name="action" value="logout">
          <button type="submit" class="ghost">Выйти</button>
        </form>
      </div>
    </div>
    <div class="panel">
      <nav class="tabs">
        <?php foreach ($tabGroups as $group): ?>
          <div class="tabs-group">
            <div class="tabs-title"><?= admin_escape((string) $group['title']) ?></div>
            <div class="tabs-group-links">
              <?php foreach ($group['items'] as $item): ?>
                <a class="tab-link <?= $activeTab === $item['key'] ? 'active' : '' ?>" href="./index.php?tab=<?= admin_escape((string) $item['key']) ?>"><?= admin_escape((string) $item['label']) ?></a>
              <?php endforeach; ?>
            </div>
          </div>
        <?php endforeach; ?>
      </nav>
      <div class="content">
        <?php if ($flash): ?><div class="flash <?= admin_escape($flash['type']) ?>"><?= admin_escape($flash['message']) ?></div><?php endif; ?>
        <div class="notice">Изменения из этой админки появляются на сайте сразу после сохранения. Важно: если позже заново собрать сайт локально и загрузить новый <code>dist</code>, серверные правки из админки будут перезаписаны локальными файлами.</div>
        <?php if ($activeTab === 'home'): ?>
          <form method="post" action="./index.php?tab=home">
            <input type="hidden" name="action" value="save-home">
            <input type="hidden" name="csrf_token" value="<?= admin_escape($csrfToken) ?>">
            <section class="section-card">
              <h2>Главная страница</h2>
              <p>Здесь редактируются SEO, первый экран, карточки преимуществ и блок направлений работ.</p>
              <div class="field-grid">
                <label>SEO title
                  <input type="text" name="home[seoTitle]" value="<?= admin_escape((string) ($homeContent['seoTitle'] ?? '')) ?>">
                </label>
                <label>Бейдж
                  <input type="text" name="home[hero_badge]" value="<?= admin_escape((string) ($homeContent['hero_badge'] ?? '')) ?>">
                </label>
                <label>Заголовок
                  <input type="text" name="home[hero_title]" value="<?= admin_escape((string) ($homeContent['hero_title'] ?? '')) ?>">
                </label>
                <label>Выделенный текст
                  <input type="text" name="home[hero_highlight]" value="<?= admin_escape((string) ($homeContent['hero_highlight'] ?? '')) ?>">
                </label>
                <label>Текст кнопки
                  <input type="text" name="home[hero_button]" value="<?= admin_escape((string) ($homeContent['hero_button'] ?? '')) ?>">
                </label>
              </div>
              <label>SEO description
                <textarea name="home[seoDescription]" rows="3"><?= admin_escape((string) ($homeContent['seoDescription'] ?? '')) ?></textarea>
              </label>
              <label>Подзаголовок первого экрана
                <textarea name="home[hero_subtitle]" rows="4"><?= admin_escape((string) ($homeContent['hero_subtitle'] ?? '')) ?></textarea>
              </label>
            </section>
            <section class="section-card">
              <h2>Карточки под первым экраном</h2>
              <p>Иконки: <code>shield</code>, <code>zap</code>, <code>clock</code>. Цвета: <code>blue</code>, <code>orange</code>, <code>green</code>.</p>
              <div class="button-row"><button type="button" class="ghost" data-add-entry="#home-cards-list" data-template="#home-card-template">Добавить карточку</button></div>
              <div id="home-cards-list" class="entry-list" data-list-prefix="home[hero_cards]" data-entry-label="Карточка"><?php foreach ($heroCards as $index => $card) { render_home_card_item($card, $index); } ?></div>
            </section>
            <section class="section-card">
              <h2>Направления работ</h2>
              <div class="field-grid">
                <label>Заголовок блока
                  <input type="text" name="home[directions_title]" value="<?= admin_escape((string) ($homeContent['directions_title'] ?? '')) ?>">
                </label>
              </div>
              <label>Подзаголовок блока
                <textarea name="home[directions_subtitle]" rows="3"><?= admin_escape((string) ($homeContent['directions_subtitle'] ?? '')) ?></textarea>
              </label>
              <div class="button-row"><button type="button" class="ghost" data-add-entry="#directions-list" data-template="#direction-template">Добавить направление</button></div>
              <div id="directions-list" class="entry-list" data-list-prefix="home[directions]" data-entry-label="Направление"><?php foreach ($directions as $index => $direction) { render_direction_item($direction, $index); } ?></div>
            </section>
            <div class="footer-actions"><div class="muted">Сохраняется в <code>/data/home.json</code></div><button type="submit">Сохранить главную</button></div>
          </form>
        <?php endif; ?>
        <?php if ($activeTab === 'projects'): ?>
          <form method="post" action="./index.php?tab=projects">
            <input type="hidden" name="action" value="save-projects">
            <input type="hidden" name="csrf_token" value="<?= admin_escape($csrfToken) ?>">
            <section class="section-card">
              <h2>Проекты</h2>
              <p>Порядок карточек на сайте идет сверху вниз. Для фото указывайте готовые пути через новую строку. Если slug пустой, он создастся из названия.</p>
              <div class="section-card" style="background:#f8fbff;">
                <h3>Загрузка фото проекта</h3>
                <p>Загрузчик кладет файлы в <code>/media/projects/имя-папки</code>, а затем возвращает готовые пути, которые можно вставить в поле фото проекта.</p>
                <div class="field-grid">
                  <label>Папка проекта<input type="text" id="projects-upload-folder" placeholder="black-stream"></label>
                  <label>Файлы<input type="file" id="projects-upload-files" multiple accept=".jpg,.jpeg,.png,.webp"></label>
                </div>
                <div class="button-row"><button type="button" id="projects-upload-button">Загрузить фото проекта</button></div>
                <div id="projects-upload-result" class="upload-result" hidden></div>
              </div>
              <div class="button-row"><button type="button" class="ghost" data-add-entry="#projects-list" data-template="#project-template">Добавить проект</button></div>
              <div id="projects-list" class="entry-list" data-list-prefix="projects"><?php foreach ($projects as $index => $project) { render_project_item($project, $index); } ?></div>
            </section>
            <section class="section-card">
              <h2>Ключевой клиент</h2>
              <div class="field-grid">
                <label>Подпись<input type="text" name="featured_client[eyebrow]" value="<?= admin_escape((string) ($featuredClient['eyebrow'] ?? 'Ключевой кейс')) ?>"></label>
                <label>Название<input type="text" name="featured_client[title]" value="<?= admin_escape((string) ($featuredClient['title'] ?? '')) ?>"></label>
              </div>
              <label>Описание<textarea name="featured_client[description]" rows="4"><?= admin_escape((string) ($featuredClient['description'] ?? '')) ?></textarea></label>
            </section>
            <section class="section-card">
              <h2>Список клиентов</h2>
              <p>Один клиент на строку.</p>
              <label>Клиенты<textarea name="clients_text" rows="10"><?= admin_escape(implode("\n", $clients)) ?></textarea></label>
            </section>
            <div class="footer-actions"><div class="muted">Сохраняется в <code>/data/projects.json</code></div><button type="submit">Сохранить проекты и клиентов</button></div>
          </form>
        <?php endif; ?>
        <?php if ($activeTab === 'blog'): ?>
          <form method="post" action="./index.php?tab=blog">
            <input type="hidden" name="action" value="save-blog">
            <input type="hidden" name="csrf_token" value="<?= admin_escape($csrfToken) ?>">
            <section class="section-card">
              <h2>Статьи</h2>
              <p>Для подзаголовков используйте строки вида <code>## Заголовок</code>, для списков <code>- пункт</code>.</p>
              <div class="section-card" style="background:#f8fbff;">
                <h3>Загрузка картинки для блога</h3>
                <p>Файлы загружаются в <code>/media/blog</code>. После загрузки скопируйте готовый путь и вставьте его в поле картинки статьи или новости.</p>
                <div class="field-grid"><label>Файлы<input type="file" id="blog-upload-files" multiple accept=".jpg,.jpeg,.png,.webp"></label></div>
                <div class="button-row"><button type="button" id="blog-upload-button">Загрузить картинку для блога</button></div>
                <div id="blog-upload-result" class="upload-result" hidden></div>
              </div>
              <div class="button-row"><button type="button" class="ghost" data-add-entry="#articles-list" data-template="#article-template">Добавить статью</button></div>
              <div id="articles-list" class="entry-list" data-list-prefix="articles"><?php foreach ($articles as $index => $article) { render_blog_item($article, $index, true); } ?></div>
            </section>
            <section class="section-card">
              <h2>Новости</h2>
              <p>Короткие карточки без полного текста.</p>
              <div class="button-row"><button type="button" class="ghost" data-add-entry="#news-list" data-template="#news-template">Добавить новость</button></div>
              <div id="news-list" class="entry-list" data-list-prefix="news"><?php foreach ($news as $index => $entry) { render_blog_item($entry, $index, false); } ?></div>
            </section>
            <div class="footer-actions"><div class="muted">Сохраняется в <code>/data/blog.json</code></div><button type="submit">Сохранить блог</button></div>
          </form>
        <?php endif; ?>
        <?php if ($activeTab === 'about'): ?>
          <form method="post" action="./index.php?tab=about">
            <input type="hidden" name="action" value="save-about">
            <input type="hidden" name="csrf_token" value="<?= admin_escape($csrfToken) ?>">
            <section class="section-card">
              <h2>Страница “О компании”</h2>
              <div class="field-grid">
                <label>SEO title
                  <input type="text" name="about[seoTitle]" value="<?= admin_escape((string) ($aboutContent['seoTitle'] ?? '')) ?>">
                </label>
                <label>Заголовок
                  <input type="text" name="about[heroTitle]" value="<?= admin_escape((string) ($aboutContent['heroTitle'] ?? '')) ?>">
                </label>
              </div>
              <label>SEO description
                <textarea name="about[seoDescription]" rows="3"><?= admin_escape((string) ($aboutContent['seoDescription'] ?? '')) ?></textarea>
              </label>
              <label>Подзаголовок
                <textarea name="about[heroSubtitle]" rows="4"><?= admin_escape((string) ($aboutContent['heroSubtitle'] ?? '')) ?></textarea>
              </label>
            </section>
            <section class="section-card">
              <h2>Показатели</h2>
              <div class="button-row"><button type="button" class="ghost" data-add-entry="#stats-list" data-template="#stats-template">Добавить показатель</button></div>
              <div id="stats-list" class="entry-list" data-list-prefix="about[stats]" data-entry-label="Показатель"><?php foreach ($stats as $index => $stat) { render_stat_item($stat, $index); } ?></div>
            </section>
            <section class="section-card">
              <h2>Вводный блок</h2>
              <div class="field-grid">
                <label>Заголовок
                  <input type="text" name="about[introTitle]" value="<?= admin_escape((string) ($aboutContent['introTitle'] ?? '')) ?>">
                </label>
              </div>
              <label>Абзацы
                <textarea name="about[introParagraphs_text]" rows="6"><?= admin_escape(implode("\n", $introParagraphs)) ?></textarea>
              </label>
            </section>
            <section class="section-card">
              <h2>Преимущества</h2>
              <div class="button-row"><button type="button" class="ghost" data-add-entry="#advantages-list" data-template="#advantage-template">Добавить преимущество</button></div>
              <div id="advantages-list" class="entry-list" data-list-prefix="about[advantages]" data-entry-label="Преимущество"><?php foreach ($advantages as $index => $advantage) { render_advantage_item($advantage, $index); } ?></div>
            </section>
            <section class="section-card">
              <h2>Подход к работе</h2>
              <div class="field-grid">
                <label>Заголовок блока
                  <input type="text" name="about[approachTitle]" value="<?= admin_escape((string) ($aboutContent['approachTitle'] ?? '')) ?>">
                </label>
              </div>
              <div class="button-row"><button type="button" class="ghost" data-add-entry="#steps-list" data-template="#approach-template">Добавить шаг</button></div>
              <div id="steps-list" class="entry-list" data-list-prefix="about[approachSteps]" data-entry-label="Шаг"><?php foreach ($approachSteps as $index => $step) { render_step_item($step, $index); } ?></div>
            </section>
            <section class="section-card">
              <h2>Нормативная база</h2>
              <div class="field-grid">
                <label>Заголовок блока
                  <input type="text" name="about[regulationsTitle]" value="<?= admin_escape((string) ($aboutContent['regulationsTitle'] ?? '')) ?>">
                </label>
              </div>
              <label>Подзаголовок
                <textarea name="about[regulationsSubtitle]" rows="3"><?= admin_escape((string) ($aboutContent['regulationsSubtitle'] ?? '')) ?></textarea>
              </label>
              <div class="button-row"><button type="button" class="ghost" data-add-entry="#regulations-list" data-template="#regulation-template">Добавить документ</button></div>
              <div id="regulations-list" class="entry-list" data-list-prefix="about[regulations]" data-entry-label="Документ"><?php foreach ($regulations as $index => $regulation) { render_regulation_item($regulation, $index); } ?></div>
            </section>
            <section class="section-card">
              <h2>Блок лицензий на странице</h2>
              <div class="field-grid">
                <label>Заголовок
                  <input type="text" name="about[licensesTitle]" value="<?= admin_escape((string) ($aboutContent['licensesTitle'] ?? '')) ?>">
                </label>
              </div>
              <label>Подзаголовок
                <textarea name="about[licensesSubtitle]" rows="3"><?= admin_escape((string) ($aboutContent['licensesSubtitle'] ?? '')) ?></textarea>
              </label>
            </section>
            <div class="footer-actions"><div class="muted">Сохраняется в <code>/data/about.json</code></div><button type="submit">Сохранить страницу “О компании”</button></div>
          </form>
        <?php endif; ?>
        <?php if ($activeTab === 'licenses'): ?>
          <form method="post" action="./index.php?tab=licenses">
            <input type="hidden" name="action" value="save-licenses">
            <input type="hidden" name="csrf_token" value="<?= admin_escape($csrfToken) ?>">
            <section class="section-card">
              <h2>Страница лицензий</h2>
              <div class="field-grid">
                <label>SEO title
                  <input type="text" name="licenses[seoTitle]" value="<?= admin_escape((string) ($licensesContent['seoTitle'] ?? '')) ?>">
                </label>
                <label>Бейдж
                  <input type="text" name="licenses[pageBadge]" value="<?= admin_escape((string) ($licensesContent['pageBadge'] ?? '')) ?>">
                </label>
                <label>Заголовок
                  <input type="text" name="licenses[pageTitle]" value="<?= admin_escape((string) ($licensesContent['pageTitle'] ?? '')) ?>">
                </label>
              </div>
              <label>SEO description
                <textarea name="licenses[seoDescription]" rows="3"><?= admin_escape((string) ($licensesContent['seoDescription'] ?? '')) ?></textarea>
              </label>
              <label>Подзаголовок
                <textarea name="licenses[pageSubtitle]" rows="3"><?= admin_escape((string) ($licensesContent['pageSubtitle'] ?? '')) ?></textarea>
              </label>
            </section>
            <section class="section-card">
              <h2>Категории</h2>
              <div class="button-row"><button type="button" class="ghost" data-add-entry="#license-categories-list" data-template="#category-template">Добавить категорию</button></div>
              <div id="license-categories-list" class="entry-list" data-list-prefix="licenses[categories]" data-entry-label="Категория"><?php foreach ($licenseCategories as $index => $category) { render_license_category_item($category, $index); } ?></div>
            </section>
            <section class="section-card">
              <h2>Загрузка файлов лицензий</h2>
              <div class="field-grid">
                <label>Подпапка<input type="text" id="licenses-upload-folder" placeholder="iso-9001"></label>
                <label>Файлы<input type="file" id="licenses-upload-files" multiple accept=".jpg,.jpeg,.png,.webp"></label>
              </div>
              <div class="button-row"><button type="button" id="licenses-upload-button">Загрузить файлы лицензий</button></div>
              <div id="licenses-upload-result" class="upload-result" hidden></div>
            </section>
            <section class="section-card">
              <h2>Документы</h2>
              <p>Если документ многостраничный, вставляйте пути картинок в поле галереи, каждый с новой строки.</p>
              <div class="button-row"><button type="button" class="ghost" data-add-entry="#license-items-list" data-template="#license-template">Добавить документ</button></div>
              <div id="license-items-list" class="entry-list" data-list-prefix="licenses[items]" data-entry-label="Документ"><?php foreach ($licenseItems as $index => $item) { render_license_item($item, $index); } ?></div>
            </section>
            <div class="footer-actions"><div class="muted">Сохраняется в <code>/data/licenses.json</code></div><button type="submit">Сохранить лицензии</button></div>
          </form>
        <?php endif; ?>
        <?php if ($activeTab === 'contacts'): ?>
          <form method="post" action="./index.php?tab=contacts">
            <input type="hidden" name="action" value="save-contacts">
            <input type="hidden" name="csrf_token" value="<?= admin_escape($csrfToken) ?>">
            <section class="section-card">
              <h2>Шапка, подвал и общие контакты</h2>
              <p>Для ссылок используй формат <code>Название | Страница</code>, по одной записи на строку.</p>
              <div class="field-grid">
                <label>Короткое название
                  <input type="text" name="site[brand][shortName]" value="<?= admin_escape((string) ($siteContent['brand']['shortName'] ?? '')) ?>">
                </label>
                <label>Полное название
                  <input type="text" name="site[brand][fullName]" value="<?= admin_escape((string) ($siteContent['brand']['fullName'] ?? '')) ?>">
                </label>
                <label>Телефон для показа
                  <input type="text" name="site[header][phoneDisplay]" value="<?= admin_escape((string) ($siteContent['header']['phoneDisplay'] ?? '')) ?>">
                </label>
                <label>Ссылка телефона
                  <input type="text" name="site[header][phoneHref]" value="<?= admin_escape((string) ($siteContent['header']['phoneHref'] ?? '')) ?>">
                </label>
                <label>Статус в шапке
                  <input type="text" name="site[header][statusText]" value="<?= admin_escape((string) ($siteContent['header']['statusText'] ?? '')) ?>">
                </label>
                <label>Кнопка в шапке
                  <input type="text" name="site[header][quoteButtonLabel]" value="<?= admin_escape((string) ($siteContent['header']['quoteButtonLabel'] ?? '')) ?>">
                </label>
                <label>Страница кнопки
                  <input type="text" name="site[header][quoteButtonPage]" value="<?= admin_escape((string) ($siteContent['header']['quoteButtonPage'] ?? '')) ?>">
                </label>
                <label>Email
                  <input type="text" name="site[contacts][email]" value="<?= admin_escape((string) ($siteContent['contacts']['email'] ?? '')) ?>">
                </label>
                <label>Адрес
                  <input type="text" name="site[contacts][address]" value="<?= admin_escape((string) ($siteContent['contacts']['address'] ?? '')) ?>">
                </label>
                <label>Telegram URL
                  <input type="text" name="site[contacts][telegramUrl]" value="<?= admin_escape((string) ($siteContent['contacts']['telegramUrl'] ?? '')) ?>">
                </label>
                <label>VK URL
                  <input type="text" name="site[contacts][vkUrl]" value="<?= admin_escape((string) ($siteContent['contacts']['vkUrl'] ?? '')) ?>">
                </label>
                <label>WhatsApp URL
                  <input type="text" name="site[contacts][whatsappUrl]" value="<?= admin_escape((string) ($siteContent['contacts']['whatsappUrl'] ?? '')) ?>">
                </label>
              </div>
              <label>Примечание у логотипа
                <input type="text" name="site[brand][licenseNote]" value="<?= admin_escape((string) ($siteContent['brand']['licenseNote'] ?? '')) ?>">
              </label>
              <label>Описание в подвале
                <textarea name="site[brand][footerDescription]" rows="3"><?= admin_escape((string) ($siteContent['brand']['footerDescription'] ?? '')) ?></textarea>
              </label>
              <div class="field-grid">
                <label>Заголовок разделов в подвале
                  <input type="text" name="site[footer][sectionsTitle]" value="<?= admin_escape((string) ($siteContent['footer']['sectionsTitle'] ?? '')) ?>">
                </label>
                <label>Заголовок документов в подвале
                  <input type="text" name="site[footer][documentsTitle]" value="<?= admin_escape((string) ($siteContent['footer']['documentsTitle'] ?? '')) ?>">
                </label>
              </div>
              <label>Копирайт
                <input type="text" name="site[footer][copyright]" value="<?= admin_escape((string) ($siteContent['footer']['copyright'] ?? '')) ?>">
              </label>
              <label>Навигация в шапке
                <textarea name="site[navigation_text]" rows="8"><?= admin_escape($siteNavigationText) ?></textarea>
              </label>
              <label>Ссылки в подвале
                <textarea name="site[footerSections_text]" rows="5"><?= admin_escape($siteFooterSectionsText) ?></textarea>
              </label>
              <label>Документы в подвале
                <textarea name="site[footerDocuments_text]" rows="4"><?= admin_escape($siteFooterDocumentsText) ?></textarea>
              </label>
            </section>
            <section class="section-card">
              <h2>Страница контактов</h2>
              <div class="field-grid">
                <label>SEO title
                  <input type="text" name="contacts[seoTitle]" value="<?= admin_escape((string) ($contactsContent['seoTitle'] ?? '')) ?>">
                </label>
                <label>Заголовок страницы
                  <input type="text" name="contacts[pageTitle]" value="<?= admin_escape((string) ($contactsContent['pageTitle'] ?? '')) ?>">
                </label>
                <label>Заголовок блока
                  <input type="text" name="contacts[infoTitle]" value="<?= admin_escape((string) ($contactsContent['infoTitle'] ?? '')) ?>">
                </label>
                <label>Подпись телефона
                  <input type="text" name="contacts[phoneLabel]" value="<?= admin_escape((string) ($contactsContent['phoneLabel'] ?? '')) ?>">
                </label>
                <label>Подпись email
                  <input type="text" name="contacts[emailLabel]" value="<?= admin_escape((string) ($contactsContent['emailLabel'] ?? '')) ?>">
                </label>
                <label>Подпись адреса
                  <input type="text" name="contacts[addressLabel]" value="<?= admin_escape((string) ($contactsContent['addressLabel'] ?? '')) ?>">
                </label>
                <label>Подпись соцсетей
                  <input type="text" name="contacts[socialsLabel]" value="<?= admin_escape((string) ($contactsContent['socialsLabel'] ?? '')) ?>">
                </label>
                <label>Кнопка Telegram
                  <input type="text" name="contacts[telegramLabel]" value="<?= admin_escape((string) ($contactsContent['telegramLabel'] ?? '')) ?>">
                </label>
                <label>Кнопка VK
                  <input type="text" name="contacts[vkLabel]" value="<?= admin_escape((string) ($contactsContent['vkLabel'] ?? '')) ?>">
                </label>
                <label>Заголовок формы
                  <input type="text" name="contacts[formTitle]" value="<?= admin_escape((string) ($contactsContent['formTitle'] ?? '')) ?>">
                </label>
                <label>Успешная отправка: заголовок
                  <input type="text" name="contacts[formSuccessTitle]" value="<?= admin_escape((string) ($contactsContent['formSuccessTitle'] ?? '')) ?>">
                </label>
                <label>Кнопка отправки
                  <input type="text" name="contacts[formSubmitLabel]" value="<?= admin_escape((string) ($contactsContent['formSubmitLabel'] ?? '')) ?>">
                </label>
              </div>
              <label>SEO description
                <textarea name="contacts[seoDescription]" rows="3"><?= admin_escape((string) ($contactsContent['seoDescription'] ?? '')) ?></textarea>
              </label>
              <label>Вступительный текст
                <textarea name="contacts[introText]" rows="3"><?= admin_escape((string) ($contactsContent['introText'] ?? '')) ?></textarea>
              </label>
              <label>Успешная отправка: текст
                <textarea name="contacts[formSuccessText]" rows="2"><?= admin_escape((string) ($contactsContent['formSuccessText'] ?? '')) ?></textarea>
              </label>
              <label>Текст во время отправки
                <input type="text" name="contacts[formLoadingLabel]" value="<?= admin_escape((string) ($contactsContent['formLoadingLabel'] ?? '')) ?>">
              </label>
            </section>
            <div class="footer-actions"><div class="muted">Сохраняется в <code>/data/site.json</code> и <code>/data/contacts.json</code></div><button type="submit">Сохранить контакты и сайт</button></div>
          </form>
        <?php endif; ?>
        <?php if ($activeTab === 'faq'): ?>
          <form method="post" action="./index.php?tab=faq">
            <input type="hidden" name="action" value="save-faq">
            <input type="hidden" name="csrf_token" value="<?= admin_escape($csrfToken) ?>">
            <section class="section-card">
              <h2>Страница FAQ</h2>
              <div class="field-grid">
                <label>SEO title
                  <input type="text" name="faq[seoTitle]" value="<?= admin_escape((string) ($faqContent['seoTitle'] ?? '')) ?>">
                </label>
                <label>Бейдж
                  <input type="text" name="faq[badge]" value="<?= admin_escape((string) ($faqContent['badge'] ?? '')) ?>">
                </label>
                <label>Заголовок
                  <input type="text" name="faq[title]" value="<?= admin_escape((string) ($faqContent['title'] ?? '')) ?>">
                </label>
                <label>Заголовок CTA
                  <input type="text" name="faq[ctaTitle]" value="<?= admin_escape((string) ($faqContent['ctaTitle'] ?? '')) ?>">
                </label>
                <label>Кнопка звонка
                  <input type="text" name="faq[callButtonLabel]" value="<?= admin_escape((string) ($faqContent['callButtonLabel'] ?? '')) ?>">
                </label>
                <label>Кнопка WhatsApp
                  <input type="text" name="faq[whatsappButtonLabel]" value="<?= admin_escape((string) ($faqContent['whatsappButtonLabel'] ?? '')) ?>">
                </label>
                <label>Кнопка формы
                  <input type="text" name="faq[formButtonLabel]" value="<?= admin_escape((string) ($faqContent['formButtonLabel'] ?? '')) ?>">
                </label>
              </div>
              <label>SEO description
                <textarea name="faq[seoDescription]" rows="3"><?= admin_escape((string) ($faqContent['seoDescription'] ?? '')) ?></textarea>
              </label>
              <label>Подзаголовок
                <textarea name="faq[subtitle]" rows="3"><?= admin_escape((string) ($faqContent['subtitle'] ?? '')) ?></textarea>
              </label>
              <label>Текст CTA
                <textarea name="faq[ctaText]" rows="2"><?= admin_escape((string) ($faqContent['ctaText'] ?? '')) ?></textarea>
              </label>
            </section>
            <section class="section-card">
              <h2>Вопросы и ответы</h2>
              <div class="button-row"><button type="button" class="ghost" data-add-entry="#faq-items-list" data-template="#faq-template">Добавить вопрос</button></div>
              <div id="faq-items-list" class="entry-list" data-list-prefix="faq[items]" data-entry-label="Вопрос"><?php foreach ($faqItems as $index => $item) { render_faq_item($item, $index); } ?></div>
            </section>
            <div class="footer-actions"><div class="muted">Сохраняется в <code>/data/faq.json</code></div><button type="submit">Сохранить FAQ</button></div>
          </form>
        <?php endif; ?>
        <?php if ($activeTab === 'reviews'): ?>
          <form method="post" action="./index.php?tab=reviews">
            <input type="hidden" name="action" value="save-reviews">
            <input type="hidden" name="csrf_token" value="<?= admin_escape($csrfToken) ?>">
            <section class="section-card">
              <h2>Страница отзывов</h2>
              <div class="field-grid">
                <label>SEO title
                  <input type="text" name="reviews[seoTitle]" value="<?= admin_escape((string) ($reviewsContent['seoTitle'] ?? '')) ?>">
                </label>
                <label>Заголовок страницы
                  <input type="text" name="reviews[title]" value="<?= admin_escape((string) ($reviewsContent['title'] ?? '')) ?>">
                </label>
                <label>Заголовок на главной
                  <input type="text" name="reviews[homeTitle]" value="<?= admin_escape((string) ($reviewsContent['homeTitle'] ?? '')) ?>">
                </label>
              </div>
              <label>SEO description
                <textarea name="reviews[seoDescription]" rows="3"><?= admin_escape((string) ($reviewsContent['seoDescription'] ?? '')) ?></textarea>
              </label>
              <label>Подзаголовок
                <textarea name="reviews[subtitle]" rows="3"><?= admin_escape((string) ($reviewsContent['subtitle'] ?? '')) ?></textarea>
              </label>
            </section>
            <section class="section-card">
              <h2>Отзывы</h2>
              <div class="button-row"><button type="button" class="ghost" data-add-entry="#review-items-list" data-template="#review-template">Добавить отзыв</button></div>
              <div id="review-items-list" class="entry-list" data-list-prefix="reviews[items]" data-entry-label="Отзыв"><?php foreach ($reviewItems as $index => $item) { render_review_item($item, $index); } ?></div>
            </section>
            <div class="footer-actions"><div class="muted">Сохраняется в <code>/data/reviews.json</code></div><button type="submit">Сохранить отзывы</button></div>
          </form>
        <?php endif; ?>
        <?php if ($activeTab === 'services'): ?>
          <form method="post" action="./index.php?tab=services">
            <input type="hidden" name="action" value="save-services">
            <input type="hidden" name="csrf_token" value="<?= admin_escape($csrfToken) ?>">
            <section class="section-card">
              <h2>Страница услуг</h2>
              <div class="field-grid">
                <label>SEO title
                  <input type="text" name="services_page[seoTitle]" value="<?= admin_escape((string) ($servicesPageContent['seoTitle'] ?? '')) ?>">
                </label>
                <label>Бейдж
                  <input type="text" name="services_page[badgeLabel]" value="<?= admin_escape((string) ($servicesPageContent['badgeLabel'] ?? '')) ?>">
                </label>
                <label>Заголовок
                  <input type="text" name="services_page[pageTitle]" value="<?= admin_escape((string) ($servicesPageContent['pageTitle'] ?? '')) ?>">
                </label>
                <label>Текст кнопки CTA
                  <input type="text" name="services_page[ctaButtonLabel]" value="<?= admin_escape((string) ($servicesPageContent['ctaButtonLabel'] ?? '')) ?>">
                </label>
              </div>
              <label>SEO description
                <textarea name="services_page[seoDescription]" rows="3"><?= admin_escape((string) ($servicesPageContent['seoDescription'] ?? '')) ?></textarea>
              </label>
              <label>Подзаголовок
                <textarea name="services_page[pageSubtitle]" rows="3"><?= admin_escape((string) ($servicesPageContent['pageSubtitle'] ?? '')) ?></textarea>
              </label>
              <label>Заголовок CTA
                <input type="text" name="services_page[ctaTitle]" value="<?= admin_escape((string) ($servicesPageContent['ctaTitle'] ?? '')) ?>">
              </label>
              <label>Текст CTA
                <textarea name="services_page[ctaText]" rows="3"><?= admin_escape((string) ($servicesPageContent['ctaText'] ?? '')) ?></textarea>
              </label>
            </section>
            <section class="section-card">
              <h2>Вкладки</h2>
              <div class="button-row"><button type="button" class="ghost" data-add-entry="#services-tabs-list" data-template="#services-tab-template">Добавить вкладку</button></div>
              <div id="services-tabs-list" class="entry-list" data-list-prefix="services_page[tabs]" data-entry-label="Вкладка"><?php foreach ($servicesTabs as $index => $item) { render_services_tab_item($item, $index); } ?></div>
            </section>
            <section class="section-card">
              <h2>Разделы контента</h2>
              <p>Для списка услуг используй формат <code>Название | Подпись</code>, по одной записи на строку.</p>
              <div class="button-row"><button type="button" class="ghost" data-add-entry="#services-sections-list" data-template="#services-section-template">Добавить раздел</button></div>
              <div id="services-sections-list" class="entry-list" data-list-prefix="services_page[sections]" data-entry-label="Раздел"><?php foreach ($servicesSections as $index => $item) { render_services_section_item($item, $index); } ?></div>
            </section>
            <div class="footer-actions"><div class="muted">Сохраняется в <code>/data/services.json</code></div><button type="submit">Сохранить услуги</button></div>
          </form>
        <?php endif; ?>
        <?php if ($activeTab === 'maintenance'): ?>
          <form method="post" action="./index.php?tab=maintenance">
            <input type="hidden" name="action" value="save-maintenance">
            <input type="hidden" name="csrf_token" value="<?= admin_escape($csrfToken) ?>">
            <section class="section-card">
              <h2>Страница обслуживания</h2>
              <div class="field-grid">
                <label>SEO title
                  <input type="text" name="maintenance_page[seoTitle]" value="<?= admin_escape((string) ($maintenancePageContent['seoTitle'] ?? '')) ?>">
                </label>
                <label>Бейдж
                  <input type="text" name="maintenance_page[badgeLabel]" value="<?= admin_escape((string) ($maintenancePageContent['badgeLabel'] ?? '')) ?>">
                </label>
                <label>Заголовок
                  <input type="text" name="maintenance_page[pageTitle]" value="<?= admin_escape((string) ($maintenancePageContent['pageTitle'] ?? '')) ?>">
                </label>
                <label>Кнопка блока расчета
                  <input type="text" name="maintenance_page[estimateButtonLabel]" value="<?= admin_escape((string) ($maintenancePageContent['estimateButtonLabel'] ?? '')) ?>">
                </label>
              </div>
              <label>SEO description
                <textarea name="maintenance_page[seoDescription]" rows="3"><?= admin_escape((string) ($maintenancePageContent['seoDescription'] ?? '')) ?></textarea>
              </label>
              <label>Подзаголовок
                <textarea name="maintenance_page[pageSubtitle]" rows="3"><?= admin_escape((string) ($maintenancePageContent['pageSubtitle'] ?? '')) ?></textarea>
              </label>
              <label>Заголовок блока расчета
                <input type="text" name="maintenance_page[estimateTitle]" value="<?= admin_escape((string) ($maintenancePageContent['estimateTitle'] ?? '')) ?>">
              </label>
              <label>Текст блока расчета
                <textarea name="maintenance_page[estimateText]" rows="3"><?= admin_escape((string) ($maintenancePageContent['estimateText'] ?? '')) ?></textarea>
              </label>
            </section>
            <section class="section-card">
              <h2>Преимущества</h2>
              <div class="button-row"><button type="button" class="ghost" data-add-entry="#maintenance-advantages-list" data-template="#maintenance-advantage-template">Добавить преимущество</button></div>
              <div id="maintenance-advantages-list" class="entry-list" data-list-prefix="maintenance_page[advantages]" data-entry-label="Преимущество"><?php foreach ($maintenanceAdvantages as $index => $item) { render_maintenance_advantage_item($item, $index); } ?></div>
            </section>
            <section class="section-card">
              <h2>Услуги обслуживания</h2>
              <div class="button-row"><button type="button" class="ghost" data-add-entry="#maintenance-services-list" data-template="#maintenance-service-template">Добавить услугу</button></div>
              <div id="maintenance-services-list" class="entry-list" data-list-prefix="maintenance_page[services]" data-entry-label="Услуга"><?php foreach ($maintenanceServices as $index => $item) { render_maintenance_service_item($item, $index); } ?></div>
            </section>
            <div class="footer-actions"><div class="muted">Сохраняется в <code>/data/maintenance.json</code></div><button type="submit">Сохранить обслуживание</button></div>
          </form>
        <?php endif; ?>
        <?php if ($activeTab === 'consulting'): ?>
          <form method="post" action="./index.php?tab=consulting">
            <input type="hidden" name="action" value="save-consulting">
            <input type="hidden" name="csrf_token" value="<?= admin_escape($csrfToken) ?>">
            <section class="section-card">
              <h2>Страница консалтинга</h2>
              <div class="field-grid">
                <label>SEO title
                  <input type="text" name="consulting_page[seoTitle]" value="<?= admin_escape((string) ($consultingPageContent['seoTitle'] ?? '')) ?>">
                </label>
                <label>Бейдж
                  <input type="text" name="consulting_page[badgeLabel]" value="<?= admin_escape((string) ($consultingPageContent['badgeLabel'] ?? '')) ?>">
                </label>
                <label>Заголовок
                  <input type="text" name="consulting_page[pageTitle]" value="<?= admin_escape((string) ($consultingPageContent['pageTitle'] ?? '')) ?>">
                </label>
                <label>Верхняя кнопка
                  <input type="text" name="consulting_page[ctaButtonLabel]" value="<?= admin_escape((string) ($consultingPageContent['ctaButtonLabel'] ?? '')) ?>">
                </label>
                <label>Нижняя кнопка
                  <input type="text" name="consulting_page[ctaBottomButtonLabel]" value="<?= admin_escape((string) ($consultingPageContent['ctaBottomButtonLabel'] ?? '')) ?>">
                </label>
              </div>
              <label>SEO description
                <textarea name="consulting_page[seoDescription]" rows="3"><?= admin_escape((string) ($consultingPageContent['seoDescription'] ?? '')) ?></textarea>
              </label>
              <label>Подзаголовок
                <textarea name="consulting_page[pageSubtitle]" rows="3"><?= admin_escape((string) ($consultingPageContent['pageSubtitle'] ?? '')) ?></textarea>
              </label>
              <label>Заголовок CTA
                <input type="text" name="consulting_page[ctaTitle]" value="<?= admin_escape((string) ($consultingPageContent['ctaTitle'] ?? '')) ?>">
              </label>
              <label>Текст CTA
                <textarea name="consulting_page[ctaText]" rows="3"><?= admin_escape((string) ($consultingPageContent['ctaText'] ?? '')) ?></textarea>
              </label>
            </section>
            <section class="section-card">
              <h2>Преимущества</h2>
              <div class="button-row"><button type="button" class="ghost" data-add-entry="#consulting-advantages-list" data-template="#consulting-advantage-template">Добавить преимущество</button></div>
              <div id="consulting-advantages-list" class="entry-list" data-list-prefix="consulting_page[advantages]" data-entry-label="Преимущество"><?php foreach ($consultingAdvantages as $index => $item) { render_consulting_advantage_item($item, $index); } ?></div>
            </section>
            <section class="section-card">
              <h2>Услуги консалтинга</h2>
              <div class="button-row"><button type="button" class="ghost" data-add-entry="#consulting-services-list" data-template="#consulting-service-template">Добавить услугу</button></div>
              <div id="consulting-services-list" class="entry-list" data-list-prefix="consulting_page[services]" data-entry-label="Услуга"><?php foreach ($consultingServices as $index => $item) { render_consulting_service_item($item, $index); } ?></div>
            </section>
            <div class="footer-actions"><div class="muted">Сохраняется в <code>/data/consulting.json</code></div><button type="submit">Сохранить консалтинг</button></div>
          </form>
        <?php endif; ?>
        <?php if ($activeTab === 'price'): ?>
          <form method="post" action="./index.php?tab=price">
            <input type="hidden" name="action" value="save-price">
            <input type="hidden" name="csrf_token" value="<?= admin_escape($csrfToken) ?>">
            <section class="section-card">
              <h2>Страница цен и калькулятор</h2>
              <div class="field-grid">
                <label>SEO title
                  <input type="text" name="price_page[seoTitle]" value="<?= admin_escape((string) ($pricePageContent['seoTitle'] ?? '')) ?>">
                </label>
                <label>Заголовок страницы
                  <input type="text" name="price_page[pageTitle]" value="<?= admin_escape((string) ($pricePageContent['pageTitle'] ?? '')) ?>">
                </label>
                <label>Заголовок калькулятора
                  <input type="text" name="price_page[calculatorTitle]" value="<?= admin_escape((string) ($pricePageContent['calculatorTitle'] ?? '')) ?>">
                </label>
                <label>Кнопка заказа
                  <input type="text" name="price_page[orderButtonLabel]" value="<?= admin_escape((string) ($pricePageContent['orderButtonLabel'] ?? '')) ?>">
                </label>
                <label>Заголовок таблицы
                  <input type="text" name="price_page[tableTitle]" value="<?= admin_escape((string) ($pricePageContent['tableTitle'] ?? '')) ?>">
                </label>
                <label>Подпись итога
                  <input type="text" name="price_page[resultLabel]" value="<?= admin_escape((string) ($pricePageContent['resultLabel'] ?? '')) ?>">
                </label>
              </div>
              <label>SEO description
                <textarea name="price_page[seoDescription]" rows="3"><?= admin_escape((string) ($pricePageContent['seoDescription'] ?? '')) ?></textarea>
              </label>
              <div class="field-grid">
                <label>Подпись вида услуги
                  <input type="text" name="price_page[serviceLabel]" value="<?= admin_escape((string) ($pricePageContent['serviceLabel'] ?? '')) ?>">
                </label>
                <label>Подпись напряжения
                  <input type="text" name="price_page[voltageLabel]" value="<?= admin_escape((string) ($pricePageContent['voltageLabel'] ?? '')) ?>">
                </label>
                <label>Подпись срочности
                  <input type="text" name="price_page[urgencyLabel]" value="<?= admin_escape((string) ($pricePageContent['urgencyLabel'] ?? '')) ?>">
                </label>
                <label>Подпись объема
                  <input type="text" name="price_page[volumeLabel]" value="<?= admin_escape((string) ($pricePageContent['volumeLabel'] ?? '')) ?>">
                </label>
              </div>
              <label>Подсказка объема
                <textarea name="price_page[volumeHint]" rows="2"><?= admin_escape((string) ($pricePageContent['volumeHint'] ?? '')) ?></textarea>
              </label>
              <label>Текст примечания
                <textarea name="price_page[noteText]" rows="2"><?= admin_escape((string) ($pricePageContent['noteText'] ?? '')) ?></textarea>
              </label>
              <div class="field-grid">
                <label>Заголовок колонки "Наименование"
                  <input type="text" name="price_page[tableHeaders][name]" value="<?= admin_escape((string) ($pricePageContent['tableHeaders']['name'] ?? '')) ?>">
                </label>
                <label>Заголовок колонки "Ед. изм."
                  <input type="text" name="price_page[tableHeaders][unit]" value="<?= admin_escape((string) ($pricePageContent['tableHeaders']['unit'] ?? '')) ?>">
                </label>
                <label>Заголовок колонки "Цена"
                  <input type="text" name="price_page[tableHeaders][price]" value="<?= admin_escape((string) ($pricePageContent['tableHeaders']['price'] ?? '')) ?>">
                </label>
              </div>
              <h3>Значения по умолчанию</h3>
              <div class="field-grid">
                <label>ID услуги
                  <input type="text" name="price_page[defaults][service]" value="<?= admin_escape((string) ($pricePageContent['defaults']['service'] ?? '')) ?>">
                </label>
                <label>ID напряжения
                  <input type="text" name="price_page[defaults][voltage]" value="<?= admin_escape((string) ($pricePageContent['defaults']['voltage'] ?? '')) ?>">
                </label>
                <label>ID срочности
                  <input type="text" name="price_page[defaults][urgency]" value="<?= admin_escape((string) ($pricePageContent['defaults']['urgency'] ?? '')) ?>">
                </label>
                <label>Объем
                  <input type="text" name="price_page[defaults][volume]" value="<?= admin_escape((string) ($pricePageContent['defaults']['volume'] ?? '')) ?>">
                </label>
                <label>Минимум объема
                  <input type="text" name="price_page[defaults][volumeMin]" value="<?= admin_escape((string) ($pricePageContent['defaults']['volumeMin'] ?? '')) ?>">
                </label>
                <label>Максимум объема
                  <input type="text" name="price_page[defaults][volumeMax]" value="<?= admin_escape((string) ($pricePageContent['defaults']['volumeMax'] ?? '')) ?>">
                </label>
              </div>
            </section>
            <section class="section-card">
              <h2>Опции калькулятора: услуги</h2>
              <div class="button-row"><button type="button" class="ghost" data-add-entry="#price-service-options-list" data-template="#price-service-option-template">Добавить услугу</button></div>
              <div id="price-service-options-list" class="entry-list" data-list-prefix="price_page[serviceOptions]" data-entry-label="Услуга"><?php foreach ($priceServiceOptions as $index => $item) { render_price_option_item($item, $index, 'basePrice', 'Услуга'); } ?></div>
            </section>
            <section class="section-card">
              <h2>Опции калькулятора: напряжение</h2>
              <div class="button-row"><button type="button" class="ghost" data-add-entry="#price-voltage-options-list" data-template="#price-voltage-option-template">Добавить вариант</button></div>
              <div id="price-voltage-options-list" class="entry-list" data-list-prefix="price_page[voltageOptions]" data-entry-label="Напряжение"><?php foreach ($priceVoltageOptions as $index => $item) { render_price_option_item($item, $index, 'multiplier', 'Напряжение'); } ?></div>
            </section>
            <section class="section-card">
              <h2>Опции калькулятора: срочность</h2>
              <div class="button-row"><button type="button" class="ghost" data-add-entry="#price-urgency-options-list" data-template="#price-urgency-option-template">Добавить вариант</button></div>
              <div id="price-urgency-options-list" class="entry-list" data-list-prefix="price_page[urgencyOptions]" data-entry-label="Срочность"><?php foreach ($priceUrgencyOptions as $index => $item) { render_price_option_item($item, $index, 'multiplier', 'Срочность'); } ?></div>
            </section>
            <section class="section-card">
              <h2>Строки прайса</h2>
              <div class="button-row"><button type="button" class="ghost" data-add-entry="#price-table-list" data-template="#price-table-template">Добавить строку</button></div>
              <div id="price-table-list" class="entry-list" data-list-prefix="price_page[priceTable]" data-entry-label="Строка прайса"><?php foreach ($priceTableItems as $index => $item) { render_price_table_item($item, $index); } ?></div>
            </section>
            <div class="footer-actions"><div class="muted">Сохраняется в <code>/data/price.json</code></div><button type="submit">Сохранить прайс</button></div>
          </form>
        <?php endif; ?>
        <?php if ($activeTab === 'settings'): ?>
          <section class="section-card">
            <h2>Настройки админки</h2>
            <p>Здесь можно создать ручную резервную копию перед крупными изменениями и сменить пароль администратора. Резервные копии JSON также создаются автоматически перед каждым сохранением.</p>
            <div class="field-grid">
              <label>Текущий логин
                <input type="text" value="<?= admin_escape($currentAdminUsername) ?>" disabled>
              </label>
              <label>Автобэкапы
                <input type="text" value="/admin/_storage/backups/" disabled>
              </label>
              <label>Ручные копии
                <input type="text" value="/admin/_storage/manual-backups/" disabled>
              </label>
            </div>
          </section>
          <form method="post" action="./index.php?tab=settings">
            <input type="hidden" name="action" value="create-manual-backup">
            <input type="hidden" name="csrf_token" value="<?= admin_escape($csrfToken) ?>">
            <section class="section-card">
              <h2>Ручная резервная копия</h2>
              <p>Создайте отдельную копию всех JSON и настроек доступа перед масштабными правками на сайте.</p>
              <div class="footer-actions"><div class="muted">Копия создастся в <code>/admin/_storage/manual-backups/</code></div><button type="submit">Создать резервную копию</button></div>
            </section>
          </form>
          <form method="post" action="./index.php?tab=settings">
            <input type="hidden" name="action" value="save-password">
            <input type="hidden" name="csrf_token" value="<?= admin_escape($csrfToken) ?>">
            <section class="section-card">
              <h2>Смена пароля</h2>
              <div class="field-grid">
                <label>Текущий пароль
                  <input type="password" name="current_password" autocomplete="current-password" required>
                </label>
                <label>Новый пароль
                  <input type="password" name="new_password" autocomplete="new-password" minlength="8" required>
                </label>
                <label>Подтверждение нового пароля
                  <input type="password" name="confirm_password" autocomplete="new-password" minlength="8" required>
                </label>
              </div>
              <div class="footer-actions"><div class="muted">Файл доступа хранится в <code>/admin/auth-config.php</code></div><button type="submit">Сменить пароль</button></div>
            </section>
          </form>
          <section class="section-card">
            <h2>Последние резервные копии</h2>
            <?php if ($recentAdminBackups === []): ?>
              <p>Пока резервных копий нет. Они появятся после первого сохранения или ручного бэкапа.</p>
            <?php else: ?>
              <div class="backup-list">
                <?php foreach ($recentAdminBackups as $backup): ?>
                  <article class="backup-card">
                    <div class="backup-card-top">
                      <div>
                        <div class="backup-badge <?= $backup['type'] === 'manual' ? 'manual' : 'auto' ?>"><?= admin_escape((string) $backup['label']) ?></div>
                        <div style="margin-top:8px;"><code><?= admin_escape((string) $backup['path']) ?></code></div>
                      </div>
                      <strong><?= admin_escape(date('d.m.Y H:i', (int) $backup['timestamp'])) ?></strong>
                    </div>
                    <?php if ($backup['files'] !== []): ?>
                      <ul class="backup-files">
                        <?php foreach ($backup['files'] as $fileName): ?>
                          <li><?= admin_escape((string) $fileName) ?></li>
                        <?php endforeach; ?>
                      </ul>
                    <?php endif; ?>
                  </article>
                <?php endforeach; ?>
              </div>
            <?php endif; ?>
          </section>
        <?php endif; ?>
      </div>
    </div>
  </div>
  <template id="project-template"><div class="entry-card" data-entry-item><div class="entry-toolbar"><strong>Новый проект</strong><div class="entry-toolbar-actions"><button type="button" class="ghost" data-move-up>Вверх</button><button type="button" class="ghost" data-move-down>Вниз</button><button type="button" class="danger" data-remove-entry>Удалить</button></div></div><div class="field-grid"><label>Служебный ID<input type="text" data-name="id"></label><label>Папка / slug<input type="text" data-name="slug"></label><label>Название<input type="text" data-name="title"></label><label>Категория<input type="text" data-name="category"></label></div><label>Описание<textarea data-name="description" rows="3"></textarea></label><label>Фото проекта<textarea data-name="images_text" rows="5" placeholder="/media/projects/project-folder/photo-1.jpg&#10;/media/projects/project-folder/photo-2.jpg"></textarea></label></div></template>
  <template id="article-template"><div class="entry-card" data-entry-item><div class="entry-toolbar"><strong>Новая статья</strong><div class="entry-toolbar-actions"><button type="button" class="ghost" data-move-up>Вверх</button><button type="button" class="ghost" data-move-down>Вниз</button><button type="button" class="danger" data-remove-entry>Удалить</button></div></div><div class="field-grid"><label>Служебный ID<input type="text" data-name="id"></label><label>Slug<input type="text" data-name="slug"></label><label>Категория<input type="text" data-name="category"></label><label>Дата<input type="text" data-name="date"></label><label>Время чтения<input type="text" data-name="readTime"></label><label>Картинка<input type="text" data-name="image"></label></div><label>Заголовок<input type="text" data-name="title"></label><label>Краткое описание<textarea data-name="excerpt" rows="3"></textarea></label><label class="checkbox-row"><input type="checkbox" data-name="featured" value="1">Рекомендованная статья</label><label>Полный текст статьи<textarea data-name="content" rows="14"></textarea></label></div></template>
  <template id="news-template"><div class="entry-card" data-entry-item><div class="entry-toolbar"><strong>Новая новость</strong><div class="entry-toolbar-actions"><button type="button" class="ghost" data-move-up>Вверх</button><button type="button" class="ghost" data-move-down>Вниз</button><button type="button" class="danger" data-remove-entry>Удалить</button></div></div><div class="field-grid"><label>Служебный ID<input type="text" data-name="id"></label><label>Slug<input type="text" data-name="slug"></label><label>Категория<input type="text" data-name="category"></label><label>Дата<input type="text" data-name="date"></label><label>Картинка<input type="text" data-name="image"></label></div><label>Заголовок<input type="text" data-name="title"></label><label>Краткое описание<textarea data-name="excerpt" rows="3"></textarea></label></div></template>
  <template id="home-card-template"><div class="entry-card" data-entry-item><div class="entry-toolbar"><strong>Карточка</strong><div class="entry-toolbar-actions"><button type="button" class="ghost" data-move-up>Вверх</button><button type="button" class="ghost" data-move-down>Вниз</button><button type="button" class="danger" data-remove-entry>Удалить</button></div></div><div class="field-grid"><label>Иконка<input type="text" data-name="icon" placeholder="shield"></label><label>Цвет<input type="text" data-name="color" placeholder="blue"></label><label>Заголовок<input type="text" data-name="title"></label></div><label>Описание<textarea data-name="description" rows="3"></textarea></label></div></template>
  <template id="direction-template"><div class="entry-card" data-entry-item><div class="entry-toolbar"><strong>Направление</strong><div class="entry-toolbar-actions"><button type="button" class="ghost" data-move-up>Вверх</button><button type="button" class="ghost" data-move-down>Вниз</button><button type="button" class="danger" data-remove-entry>Удалить</button></div></div><div class="field-grid"><label>Иконка<input type="text" data-name="icon" placeholder="zap"></label><label>Цвет<input type="text" data-name="color" placeholder="orange"></label><label>Ссылка<input type="text" data-name="link" placeholder="Services"></label><label>Заголовок<input type="text" data-name="title"></label></div><label>Описание<textarea data-name="description" rows="3"></textarea></label><label>Пункты списка<textarea data-name="features_text" rows="5"></textarea></label></div></template>
  <template id="stats-template"><div class="entry-card" data-entry-item><div class="entry-toolbar"><strong>Показатель</strong><div class="entry-toolbar-actions"><button type="button" class="ghost" data-move-up>Вверх</button><button type="button" class="ghost" data-move-down>Вниз</button><button type="button" class="danger" data-remove-entry>Удалить</button></div></div><div class="field-grid"><label>Значение<input type="text" data-name="value"></label><label>Подпись<input type="text" data-name="label"></label><label>Иконка<input type="text" data-name="icon" placeholder="users"></label></div></div></template>
  <template id="advantage-template"><div class="entry-card" data-entry-item><div class="entry-toolbar"><strong>Преимущество</strong><div class="entry-toolbar-actions"><button type="button" class="ghost" data-move-up>Вверх</button><button type="button" class="ghost" data-move-down>Вниз</button><button type="button" class="danger" data-remove-entry>Удалить</button></div></div><div class="field-grid"><label>Иконка<input type="text" data-name="icon" placeholder="shield"></label><label>Цвет<input type="text" data-name="color" placeholder="green"></label><label>Заголовок<input type="text" data-name="title"></label></div><label>Описание<textarea data-name="description" rows="3"></textarea></label></div></template>
  <template id="approach-template"><div class="entry-card" data-entry-item><div class="entry-toolbar"><strong>Шаг</strong><div class="entry-toolbar-actions"><button type="button" class="ghost" data-move-up>Вверх</button><button type="button" class="ghost" data-move-down>Вниз</button><button type="button" class="danger" data-remove-entry>Удалить</button></div></div><div class="field-grid"><label>Номер шага<input type="text" data-name="step"></label><label>Заголовок<input type="text" data-name="title"></label></div><label>Описание<textarea data-name="description" rows="3"></textarea></label></div></template>
  <template id="regulation-template"><div class="entry-card" data-entry-item><div class="entry-toolbar"><strong>Документ</strong><div class="entry-toolbar-actions"><button type="button" class="ghost" data-move-up>Вверх</button><button type="button" class="ghost" data-move-down>Вниз</button><button type="button" class="danger" data-remove-entry>Удалить</button></div></div><label>Название<input type="text" data-name="title"></label><label>Описание<textarea data-name="description" rows="3"></textarea></label></div></template>
  <template id="category-template"><div class="entry-card" data-entry-item><div class="entry-toolbar"><strong>Категория</strong><div class="entry-toolbar-actions"><button type="button" class="ghost" data-move-up>Вверх</button><button type="button" class="ghost" data-move-down>Вниз</button><button type="button" class="danger" data-remove-entry>Удалить</button></div></div><div class="field-grid"><label>ID<input type="text" data-name="id"></label><label>Название<input type="text" data-name="label"></label></div></div></template>
  <template id="license-template"><div class="entry-card" data-entry-item><div class="entry-toolbar"><strong>Документ</strong><div class="entry-toolbar-actions"><button type="button" class="ghost" data-move-up>Вверх</button><button type="button" class="ghost" data-move-down>Вниз</button><button type="button" class="danger" data-remove-entry>Удалить</button></div></div><div class="field-grid"><label>Служебный ID<input type="text" data-name="id"></label><label>Категория<input type="text" data-name="category"></label><label>Кем выдан<input type="text" data-name="issuer"></label><label>Номер<input type="text" data-name="number"></label><label>Срок действия<input type="text" data-name="validUntil"></label><label>Превью<input type="text" data-name="previewImage"></label><label>Одиночное изображение<input type="text" data-name="image"></label></div><div class="inline-upload-grid"><div class="inline-upload-card" data-inline-upload data-upload-type="licenses" data-upload-target="previewImage" data-upload-mode="replace" data-upload-folder-source="id"><div class="inline-upload-title">Загрузить превью с ПК</div><div class="inline-upload-help">Файл загрузится в папку лицензии по служебному ID и подставится в поле “Превью”.</div><div class="inline-upload-controls"><input type="file" data-inline-upload-input accept=".jpg,.jpeg,.png,.webp"><button type="button" class="ghost" data-inline-upload-button>Загрузить</button></div><div class="upload-result" data-inline-upload-result hidden></div></div><div class="inline-upload-card" data-inline-upload data-upload-type="licenses" data-upload-target="image" data-upload-mode="replace" data-upload-folder-source="id"><div class="inline-upload-title">Загрузить основное изображение</div><div class="inline-upload-help">Подходит для одиночного изображения документа или карточки.</div><div class="inline-upload-controls"><input type="file" data-inline-upload-input accept=".jpg,.jpeg,.png,.webp"><button type="button" class="ghost" data-inline-upload-button>Загрузить</button></div><div class="upload-result" data-inline-upload-result hidden></div></div><div class="inline-upload-card" data-inline-upload data-upload-type="licenses" data-upload-target="images_text" data-upload-mode="append" data-upload-folder-source="id"><div class="inline-upload-title">Загрузить страницы в галерею</div><div class="inline-upload-help">Можно выбрать несколько файлов. Новые пути добавятся в “Галерея страниц”.</div><div class="inline-upload-controls"><input type="file" data-inline-upload-input accept=".jpg,.jpeg,.png,.webp" multiple><button type="button" class="ghost" data-inline-upload-button>Загрузить</button></div><div class="upload-result" data-inline-upload-result hidden></div></div></div><label>Название документа<input type="text" data-name="title"></label><label>Галерея страниц<textarea data-name="images_text" rows="5"></textarea></label></div></template>
  <template id="faq-template"><div class="entry-card" data-entry-item><div class="entry-toolbar"><strong>Вопрос</strong><div class="entry-toolbar-actions"><button type="button" class="ghost" data-move-up>Вверх</button><button type="button" class="ghost" data-move-down>Вниз</button><button type="button" class="danger" data-remove-entry>Удалить</button></div></div><label>Вопрос<input type="text" data-name="question"></label><label>Ответ<textarea data-name="answer" rows="5"></textarea></label></div></template>
  <template id="review-template"><div class="entry-card" data-entry-item><div class="entry-toolbar"><strong>Отзыв</strong><div class="entry-toolbar-actions"><button type="button" class="ghost" data-move-up>Вверх</button><button type="button" class="ghost" data-move-down>Вниз</button><button type="button" class="danger" data-remove-entry>Удалить</button></div></div><div class="field-grid"><label>Служебный ID<input type="text" data-name="id"></label><label>Автор<input type="text" data-name="author"></label><label>Должность / компания<input type="text" data-name="position"></label><label>Инициалы<input type="text" data-name="initials"></label><label>Рейтинг<input type="number" min="1" max="5" data-name="rating" value="5"></label></div><label>Текст отзыва<textarea data-name="text" rows="5"></textarea></label></div></template>
  <template id="services-tab-template"><div class="entry-card" data-entry-item><div class="entry-toolbar"><strong>Вкладка</strong><div class="entry-toolbar-actions"><button type="button" class="ghost" data-move-up>Вверх</button><button type="button" class="ghost" data-move-down>Вниз</button><button type="button" class="danger" data-remove-entry>Удалить</button></div></div><div class="field-grid"><label>ID<input type="text" data-name="id"></label><label>Название<input type="text" data-name="name"></label><label>Иконка<input type="text" data-name="icon" placeholder="shield"></label></div></div></template>
  <template id="services-section-template"><div class="entry-card" data-entry-item><div class="entry-toolbar"><strong>Раздел</strong><div class="entry-toolbar-actions"><button type="button" class="ghost" data-move-up>Вверх</button><button type="button" class="ghost" data-move-down>Вниз</button><button type="button" class="danger" data-remove-entry>Удалить</button></div></div><div class="field-grid"><label>ID<input type="text" data-name="id"></label><label>Заголовок<input type="text" data-name="title"></label></div><label>Описание<textarea data-name="description" rows="3"></textarea></label><label>Услуги в разделе<textarea data-name="services_text" rows="8" placeholder="Название | Подпись&#10;Название | Подпись"></textarea></label></div></template>
  <template id="maintenance-advantage-template"><div class="entry-card" data-entry-item><div class="entry-toolbar"><strong>Преимущество</strong><div class="entry-toolbar-actions"><button type="button" class="ghost" data-move-up>Вверх</button><button type="button" class="ghost" data-move-down>Вниз</button><button type="button" class="danger" data-remove-entry>Удалить</button></div></div><div class="field-grid"><label>Иконка<input type="text" data-name="icon" placeholder="shield"></label><label>Заголовок<input type="text" data-name="title"></label></div><label>Текст<textarea data-name="text" rows="3"></textarea></label></div></template>
  <template id="maintenance-service-template"><div class="entry-card" data-entry-item><div class="entry-toolbar"><strong>Услуга</strong><div class="entry-toolbar-actions"><button type="button" class="ghost" data-move-up>Вверх</button><button type="button" class="ghost" data-move-down>Вниз</button><button type="button" class="danger" data-remove-entry>Удалить</button></div></div><div class="field-grid"><label>ID<input type="text" data-name="id"></label><label>Иконка<input type="text" data-name="icon" placeholder="wrench"></label><label>Короткий заголовок<input type="text" data-name="title"></label><label>Заголовок блока<input type="text" data-name="subtitle"></label><label>Цена<input type="text" data-name="price"></label></div><label>Описание<textarea data-name="description" rows="4"></textarea></label><label>Состав работ<textarea data-name="works_text" rows="8"></textarea></label><label>Периодичность<textarea data-name="periodicity_text" rows="4"></textarea></label></div></template>
  <template id="consulting-advantage-template"><div class="entry-card" data-entry-item><div class="entry-toolbar"><strong>Преимущество</strong><div class="entry-toolbar-actions"><button type="button" class="ghost" data-move-up>Вверх</button><button type="button" class="ghost" data-move-down>Вниз</button><button type="button" class="danger" data-remove-entry>Удалить</button></div></div><label>Заголовок<input type="text" data-name="title"></label><label>Описание<textarea data-name="description" rows="3"></textarea></label></div></template>
  <template id="consulting-service-template"><div class="entry-card" data-entry-item><div class="entry-toolbar"><strong>Услуга</strong><div class="entry-toolbar-actions"><button type="button" class="ghost" data-move-up>Вверх</button><button type="button" class="ghost" data-move-down>Вниз</button><button type="button" class="danger" data-remove-entry>Удалить</button></div></div><div class="field-grid"><label>Иконка<input type="text" data-name="icon" placeholder="file-text"></label><label>Цена<input type="text" data-name="price"></label></div><label>Заголовок<input type="text" data-name="title"></label><label>Описание<textarea data-name="description" rows="4"></textarea></label><label>Пункты списка<textarea data-name="details_text" rows="7"></textarea></label></div></template>
  <template id="price-service-option-template"><div class="entry-card" data-entry-item><div class="entry-toolbar"><strong>Услуга</strong><div class="entry-toolbar-actions"><button type="button" class="ghost" data-move-up>Вверх</button><button type="button" class="ghost" data-move-down>Вниз</button><button type="button" class="danger" data-remove-entry>Удалить</button></div></div><div class="field-grid"><label>ID<input type="text" data-name="id"></label><label>Название<input type="text" data-name="label"></label><label>Базовая цена<input type="text" data-name="basePrice"></label></div></div></template>
  <template id="price-voltage-option-template"><div class="entry-card" data-entry-item><div class="entry-toolbar"><strong>Напряжение</strong><div class="entry-toolbar-actions"><button type="button" class="ghost" data-move-up>Вверх</button><button type="button" class="ghost" data-move-down>Вниз</button><button type="button" class="danger" data-remove-entry>Удалить</button></div></div><div class="field-grid"><label>ID<input type="text" data-name="id"></label><label>Название<input type="text" data-name="label"></label><label>Множитель<input type="text" data-name="multiplier"></label></div></div></template>
  <template id="price-urgency-option-template"><div class="entry-card" data-entry-item><div class="entry-toolbar"><strong>Срочность</strong><div class="entry-toolbar-actions"><button type="button" class="ghost" data-move-up>Вверх</button><button type="button" class="ghost" data-move-down>Вниз</button><button type="button" class="danger" data-remove-entry>Удалить</button></div></div><div class="field-grid"><label>ID<input type="text" data-name="id"></label><label>Название<input type="text" data-name="label"></label><label>Множитель<input type="text" data-name="multiplier"></label></div></div></template>
  <template id="price-table-template"><div class="entry-card" data-entry-item><div class="entry-toolbar"><strong>Строка прайса</strong><div class="entry-toolbar-actions"><button type="button" class="ghost" data-move-up>Вверх</button><button type="button" class="ghost" data-move-down>Вниз</button><button type="button" class="danger" data-remove-entry>Удалить</button></div></div><div class="field-grid"><label>Наименование<input type="text" data-name="name"></label><label>Ед. изм.<input type="text" data-name="unit"></label><label>Цена<input type="text" data-name="price"></label></div></div></template>
  <script>
    const csrfToken = <?= json_encode($csrfToken, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES) ?>;
    const previewFieldSelector = 'input[data-name="image"], input[data-name="previewImage"], textarea[data-name="images_text"]';
    function ensureDuplicateButton(entry) {
      const actions = entry.querySelector('.entry-toolbar-actions');
      if (!actions || actions.querySelector('[data-duplicate-entry]')) return;
      const button = document.createElement('button');
      button.type = 'button';
      button.className = 'ghost';
      button.dataset.duplicateEntry = 'true';
      button.textContent = 'Дублировать';
      const removeButton = actions.querySelector('[data-remove-entry]');
      if (removeButton) {
        actions.insertBefore(button, removeButton);
      } else {
        actions.appendChild(button);
      }
    }
    function isPreviewablePath(path) {
      return /^(\/|https?:\/\/|data:image\/)/i.test(path);
    }
    function extractPreviewPaths(field) {
      const rawValue = String(field.value || '').trim();
      if (!rawValue) return [];
      const items = field.matches('textarea') ? rawValue.split(/\r?\n+/) : [rawValue];
      return items
        .map((item) => item.trim())
        .filter((item, index, list) => item && isPreviewablePath(item) && list.indexOf(item) === index);
    }
    function buildPreviewCard(path) {
      const card = document.createElement('article');
      card.className = 'image-preview-card';
      const image = document.createElement('img');
      image.className = 'image-preview-thumb';
      image.src = path;
      image.alt = '';
      image.loading = 'lazy';
      image.decoding = 'async';
      const meta = document.createElement('div');
      meta.className = 'image-preview-meta';
      meta.textContent = path;
      card.append(image, meta);
      return card;
    }
    function ensurePreviewHost(target) {
      let host = target.nextElementSibling;
      if (!host || !host.classList.contains('image-preview-host')) {
        host = document.createElement('div');
        host.className = 'image-preview-host';
        target.insertAdjacentElement('afterend', host);
      }
      return host;
    }
    function renderPreviewPaths(target, paths) {
      const host = ensurePreviewHost(target);
      host.textContent = '';
      if (!paths.length) {
        host.hidden = true;
        return;
      }
      host.hidden = false;
      const grid = document.createElement('div');
      grid.className = 'image-preview-grid';
      paths.forEach((path) => grid.appendChild(buildPreviewCard(path)));
      host.appendChild(grid);
    }
    function bindPreviewField(field) {
      if (field.dataset.previewBound === 'true') {
        renderPreviewPaths(field, extractPreviewPaths(field));
        return;
      }
      field.dataset.previewBound = 'true';
      const sync = () => renderPreviewPaths(field, extractPreviewPaths(field));
      field.addEventListener('input', sync);
      field.addEventListener('change', sync);
      sync();
    }
    function bindPreviewFields(root = document) {
      root.querySelectorAll(previewFieldSelector).forEach(bindPreviewField);
    }
    function uniquePaths(paths) {
      return paths.filter((item, index) => item && paths.indexOf(item) === index);
    }
    function setUploadResult(result, message, hidden = false) {
      if (!result) return;
      result.hidden = hidden;
      result.textContent = message;
    }
    function updateTargetField(field, files, mode) {
      if (!field) return;
      if (field.matches('textarea')) {
        const current = field.value
          .split(/\r?\n+/)
          .map((item) => item.trim())
          .filter(Boolean);
        const next = mode === 'append' ? uniquePaths([...current, ...files]) : uniquePaths(files);
        field.value = next.join('\n');
      } else {
        field.value = files[0] || '';
      }
      field.dispatchEvent(new Event('input', { bubbles: true }));
      field.dispatchEvent(new Event('change', { bubbles: true }));
    }
    async function uploadIntoEntry(widget) {
      const entry = widget.closest('[data-entry-item]');
      const input = widget.querySelector('[data-inline-upload-input]');
      const result = widget.querySelector('[data-inline-upload-result]');
      if (!entry || !input) return;
      const files = input.files;
      if (!files || files.length === 0) {
        setUploadResult(result, 'Выберите хотя бы один файл.');
        return;
      }
      const targetName = widget.dataset.uploadTarget;
      const targetField = entry.querySelector(`[data-name="${targetName}"]`);
      if (!targetField) {
        setUploadResult(result, 'Не найдено поле, в которое нужно подставить файл.');
        return;
      }
      const folderSource = widget.dataset.uploadFolderSource || '';
      const folderField = folderSource ? entry.querySelector(`[data-name="${folderSource}"]`) : null;
      const folder = folderField ? String(folderField.value || '').trim() : '';
      if (widget.dataset.uploadType === 'licenses' && !folder) {
        setUploadResult(result, 'Сначала заполните служебный ID. Он используется как папка для файлов.');
        return;
      }
      const formData = new FormData();
      formData.append('csrf_token', csrfToken);
      formData.append('upload_type', widget.dataset.uploadType || 'licenses');
      if (folder) formData.append('folder', folder);
      Array.from(files).forEach((file) => formData.append('images[]', file));
      setUploadResult(result, 'Загрузка...');
      try {
        const response = await fetch('./upload.php', { method: 'POST', body: formData });
        const payload = await response.json();
        if (!response.ok || !payload.ok) throw new Error(payload.message || 'Ошибка загрузки.');
        updateTargetField(targetField, payload.files || [], widget.dataset.uploadMode || 'replace');
        setUploadResult(result, (payload.files || []).join('\n'), (payload.files || []).length === 0);
        input.value = '';
      } catch (error) {
        setUploadResult(result, error.message || 'Не удалось загрузить файлы.');
      }
    }
    function prepareClonedEntry(entry) {
      entry.querySelectorAll('[data-preview-bound]').forEach((field) => {
        delete field.dataset.previewBound;
      });
      entry.querySelectorAll('.image-preview-host').forEach((host) => host.remove());
      ensureDuplicateButton(entry);
      bindPreviewFields(entry);
    }
    function reindexList(list) {
      const prefix = list.dataset.listPrefix;
      const label = list.dataset.entryLabel || 'Запись';
      list.querySelectorAll('[data-entry-item]').forEach((entry, index) => {
        ensureDuplicateButton(entry);
        const title = entry.querySelector('.entry-toolbar strong');
        if (title) title.textContent = `${label} ${index + 1}`;
        if (title && prefix === 'projects') title.textContent = `Проект ${index + 1}`;
        if (title && prefix === 'articles') title.textContent = `Статья ${index + 1}`;
        if (title && prefix === 'news') title.textContent = `Новость ${index + 1}`;
        entry.querySelectorAll('[data-name]').forEach((field) => { field.name = `${prefix}[${index}][${field.dataset.name}]`; });
      });
      bindPreviewFields(list);
    }
    document.querySelectorAll('[data-list-prefix]').forEach(reindexList);
    bindPreviewFields(document);
    document.querySelectorAll('[data-add-entry]').forEach((button) => { button.addEventListener('click', () => { const list = document.querySelector(button.dataset.addEntry); const template = document.querySelector(button.dataset.template); if (!list || !template) return; const clone = template.content.firstElementChild.cloneNode(true); prepareClonedEntry(clone); list.appendChild(clone); reindexList(list); }); });
    document.addEventListener('click', (event) => {
      const removeButton = event.target.closest('[data-remove-entry]');
      if (removeButton) { const entry = removeButton.closest('[data-entry-item]'); const list = removeButton.closest('[data-list-prefix]'); if (entry && list) { entry.remove(); reindexList(list); } }
      const duplicateButton = event.target.closest('[data-duplicate-entry]');
      if (duplicateButton) { const entry = duplicateButton.closest('[data-entry-item]'); const list = duplicateButton.closest('[data-list-prefix]'); if (entry && list) { const clone = entry.cloneNode(true); prepareClonedEntry(clone); entry.insertAdjacentElement('afterend', clone); reindexList(list); } }
      const moveUpButton = event.target.closest('[data-move-up]');
      if (moveUpButton) { const entry = moveUpButton.closest('[data-entry-item]'); const previous = entry && entry.previousElementSibling; const list = moveUpButton.closest('[data-list-prefix]'); if (entry && previous && list) { list.insertBefore(entry, previous); reindexList(list); } }
      const moveDownButton = event.target.closest('[data-move-down]');
      if (moveDownButton) { const entry = moveDownButton.closest('[data-entry-item]'); const next = entry && entry.nextElementSibling; const list = moveDownButton.closest('[data-list-prefix]'); if (entry && next && list) { list.insertBefore(next, entry); reindexList(list); } }
      const inlineUploadButton = event.target.closest('[data-inline-upload-button]');
      if (inlineUploadButton) { const widget = inlineUploadButton.closest('[data-inline-upload]'); if (widget) uploadIntoEntry(widget); }
    });
    async function uploadFiles({ type, folder, input, result }) {
      const files = input.files;
      renderPreviewPaths(result, []);
      if (!files || files.length === 0) { result.hidden = false; result.textContent = 'Выберите хотя бы один файл.'; return; }
      const formData = new FormData();
      formData.append('csrf_token', csrfToken);
      formData.append('upload_type', type);
      if (folder) formData.append('folder', folder);
      Array.from(files).forEach((file) => formData.append('images[]', file));
      result.hidden = false;
      result.textContent = 'Загрузка...';
      try {
        const response = await fetch('./upload.php', { method: 'POST', body: formData });
        const payload = await response.json();
        if (!response.ok || !payload.ok) throw new Error(payload.message || 'Ошибка загрузки.');
        result.textContent = payload.files.join('\n');
        renderPreviewPaths(result, payload.files);
        input.value = '';
      } catch (error) {
        result.textContent = error.message || 'Не удалось загрузить файлы.';
      }
    }
    const projectsUploadButton = document.getElementById('projects-upload-button');
    if (projectsUploadButton) projectsUploadButton.addEventListener('click', () => uploadFiles({ type: 'projects', folder: document.getElementById('projects-upload-folder').value.trim(), input: document.getElementById('projects-upload-files'), result: document.getElementById('projects-upload-result') }));
    const blogUploadButton = document.getElementById('blog-upload-button');
    if (blogUploadButton) blogUploadButton.addEventListener('click', () => uploadFiles({ type: 'blog', folder: '', input: document.getElementById('blog-upload-files'), result: document.getElementById('blog-upload-result') }));
    const licensesUploadButton = document.getElementById('licenses-upload-button');
    if (licensesUploadButton) licensesUploadButton.addEventListener('click', () => uploadFiles({ type: 'licenses', folder: document.getElementById('licenses-upload-folder').value.trim(), input: document.getElementById('licenses-upload-files'), result: document.getElementById('licenses-upload-result') }));
  </script>
</body>
</html>
