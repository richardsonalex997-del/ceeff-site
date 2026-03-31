<?php

declare(strict_types=1);

$isHttps = (!empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off')
    || (isset($_SERVER['SERVER_PORT']) && (int) $_SERVER['SERVER_PORT'] === 443);

session_name('ceef_admin');
session_set_cookie_params([
    'httponly' => true,
    'samesite' => 'Lax',
    'secure' => $isHttps,
]);
session_start();

define('CEEF_ADMIN_ROOT', __DIR__);
define('CEEF_PUBLIC_ROOT', dirname(__DIR__));
define('CEEF_DATA_ROOT', CEEF_PUBLIC_ROOT . DIRECTORY_SEPARATOR . 'data');
define('CEEF_MEDIA_ROOT', CEEF_PUBLIC_ROOT . DIRECTORY_SEPARATOR . 'media');
define('CEEF_ADMIN_STORAGE_ROOT', CEEF_ADMIN_ROOT . DIRECTORY_SEPARATOR . '_storage');

const CEEF_DATA_FILES = [
    'projects' => CEEF_DATA_ROOT . DIRECTORY_SEPARATOR . 'projects.json',
    'blog' => CEEF_DATA_ROOT . DIRECTORY_SEPARATOR . 'blog.json',
    'home' => CEEF_DATA_ROOT . DIRECTORY_SEPARATOR . 'home.json',
    'about' => CEEF_DATA_ROOT . DIRECTORY_SEPARATOR . 'about.json',
    'licenses' => CEEF_DATA_ROOT . DIRECTORY_SEPARATOR . 'licenses.json',
    'site' => CEEF_DATA_ROOT . DIRECTORY_SEPARATOR . 'site.json',
    'contacts' => CEEF_DATA_ROOT . DIRECTORY_SEPARATOR . 'contacts.json',
    'faq' => CEEF_DATA_ROOT . DIRECTORY_SEPARATOR . 'faq.json',
    'reviews' => CEEF_DATA_ROOT . DIRECTORY_SEPARATOR . 'reviews.json',
    'services' => CEEF_DATA_ROOT . DIRECTORY_SEPARATOR . 'services.json',
    'maintenance' => CEEF_DATA_ROOT . DIRECTORY_SEPARATOR . 'maintenance.json',
    'consulting' => CEEF_DATA_ROOT . DIRECTORY_SEPARATOR . 'consulting.json',
    'price' => CEEF_DATA_ROOT . DIRECTORY_SEPARATOR . 'price.json',
];

const CEEF_ALLOWED_IMAGE_EXTENSIONS = ['jpg', 'jpeg', 'png', 'webp'];

function admin_config(): array
{
    $path = CEEF_ADMIN_ROOT . DIRECTORY_SEPARATOR . 'auth-config.php';

    if (!file_exists($path)) {
        $examplePath = CEEF_ADMIN_ROOT . DIRECTORY_SEPARATOR . 'auth-config.example.php';

        return file_exists($examplePath)
            ? require $examplePath
            : ['username' => 'admin', 'password_hash' => ''];
    }

    return require $path;
}

function admin_is_logged_in(): bool
{
    return !empty($_SESSION['ceef_admin_logged_in']);
}

function admin_login(string $username, string $password): bool
{
    $config = admin_config();
    $expectedUsername = (string) ($config['username'] ?? '');
    if ($username !== $expectedUsername || !admin_verify_password($password, $config)) {
        return false;
    }

    session_regenerate_id(true);
    $_SESSION['ceef_admin_logged_in'] = true;
    $_SESSION['ceef_admin_username'] = $expectedUsername;

    return true;
}

function admin_verify_password(string $password, ?array $config = null): bool
{
    $config = $config ?? admin_config();
    $expectedHash = (string) ($config['password_hash'] ?? '');
    $actualHash = hash('sha256', $password);

    return $expectedHash !== '' && hash_equals($expectedHash, $actualHash);
}

function admin_logout(): void
{
    $_SESSION = [];

    if (ini_get('session.use_cookies')) {
        $params = session_get_cookie_params();
        setcookie(
            session_name(),
            '',
            time() - 42000,
            $params['path'],
            $params['domain'],
            $params['secure'],
            $params['httponly']
        );
    }

    session_destroy();
}

function admin_csrf_token(): string
{
    if (empty($_SESSION['ceef_admin_csrf'])) {
        $_SESSION['ceef_admin_csrf'] = bin2hex(random_bytes(32));
    }

    return $_SESSION['ceef_admin_csrf'];
}

function admin_verify_csrf(?string $token): bool
{
    $sessionToken = $_SESSION['ceef_admin_csrf'] ?? '';

    return is_string($token) && $sessionToken !== '' && hash_equals($sessionToken, $token);
}

function admin_flash(string $type, string $message): void
{
    $_SESSION['ceef_admin_flash'] = ['type' => $type, 'message' => $message];
}

function admin_pull_flash(): ?array
{
    if (empty($_SESSION['ceef_admin_flash'])) {
        return null;
    }

    $flash = $_SESSION['ceef_admin_flash'];
    unset($_SESSION['ceef_admin_flash']);

    return $flash;
}

function admin_read_json(string $key): array
{
    $path = CEEF_DATA_FILES[$key] ?? null;

    if ($path === null || !file_exists($path)) {
        return [];
    }

    $contents = file_get_contents($path);

    if ($contents === false) {
        return [];
    }

    $data = json_decode($contents, true);

    return is_array($data) ? $data : [];
}

function admin_write_json(string $key, array $data): void
{
    $path = CEEF_DATA_FILES[$key] ?? null;

    if ($path === null) {
        throw new RuntimeException('Unknown data file requested.');
    }

    admin_backup_file($path, $key);

    $directory = dirname($path);

    if (!is_dir($directory)) {
        mkdir($directory, 0775, true);
    }

    $json = json_encode(
        $data,
        JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES,
    );

    if ($json === false) {
        throw new RuntimeException('Failed to encode JSON.');
    }

    file_put_contents($path, $json . PHP_EOL, LOCK_EX);
}

function admin_ensure_private_directory(string $directory): void
{
    if (!is_dir($directory)) {
        mkdir($directory, 0775, true);
    }

    $htaccessPath = $directory . DIRECTORY_SEPARATOR . '.htaccess';

    if (!file_exists($htaccessPath)) {
        file_put_contents($htaccessPath, "Require all denied\nDeny from all\n", LOCK_EX);
    }
}

function admin_backup_file(string $path, string $group): void
{
    if (!file_exists($path)) {
        return;
    }

    $backupDirectory = CEEF_ADMIN_STORAGE_ROOT . DIRECTORY_SEPARATOR . 'backups' . DIRECTORY_SEPARATOR . $group;
    admin_ensure_private_directory(CEEF_ADMIN_STORAGE_ROOT);
    admin_ensure_private_directory(CEEF_ADMIN_STORAGE_ROOT . DIRECTORY_SEPARATOR . 'backups');
    admin_ensure_private_directory($backupDirectory);

    $timestamp = date('Ymd-His');
    $backupPath = $backupDirectory . DIRECTORY_SEPARATOR . $timestamp . '-' . basename($path);
    copy($path, $backupPath);
}

function admin_auth_config_path(): string
{
    return CEEF_ADMIN_ROOT . DIRECTORY_SEPARATOR . 'auth-config.php';
}

function admin_update_password(string $newPassword): void
{
    $config = admin_config();
    $path = admin_auth_config_path();
    admin_backup_file($path, 'auth');

    $payload = "<?php\n\nreturn [\n"
        . "    'username' => " . var_export((string) ($config['username'] ?? 'admin'), true) . ",\n"
        . "    'password_hash' => hash('sha256', " . var_export($newPassword, true) . "),\n"
        . "];\n";

    file_put_contents($path, $payload, LOCK_EX);
}

function admin_create_manual_backup(): string
{
    $timestamp = date('Ymd-His');
    $backupDirectory = CEEF_ADMIN_STORAGE_ROOT . DIRECTORY_SEPARATOR . 'manual-backups' . DIRECTORY_SEPARATOR . $timestamp;
    admin_ensure_private_directory(CEEF_ADMIN_STORAGE_ROOT);
    admin_ensure_private_directory(CEEF_ADMIN_STORAGE_ROOT . DIRECTORY_SEPARATOR . 'manual-backups');
    admin_ensure_private_directory($backupDirectory);

    foreach (CEEF_DATA_FILES as $path) {
        if (file_exists($path)) {
            copy($path, $backupDirectory . DIRECTORY_SEPARATOR . basename($path));
        }
    }

    $authPath = admin_auth_config_path();
    if (file_exists($authPath)) {
        copy($authPath, $backupDirectory . DIRECTORY_SEPARATOR . basename($authPath));
    }

    return '_storage/manual-backups/' . $timestamp;
}

function admin_recent_backups(int $limit = 12): array
{
    $entries = [];

    $manualRoot = CEEF_ADMIN_STORAGE_ROOT . DIRECTORY_SEPARATOR . 'manual-backups';
    if (is_dir($manualRoot)) {
        $manualDirectories = glob($manualRoot . DIRECTORY_SEPARATOR . '*', GLOB_ONLYDIR) ?: [];
        foreach ($manualDirectories as $directory) {
            $files = array_values(array_filter(
                array_map('basename', glob($directory . DIRECTORY_SEPARATOR . '*') ?: []),
                static fn ($name) => $name !== '.htaccess'
            ));

            $entries[] = [
                'type' => 'manual',
                'label' => 'Ручная копия',
                'path' => '_storage/manual-backups/' . basename($directory),
                'timestamp' => (int) (filemtime($directory) ?: 0),
                'files' => $files,
            ];
        }
    }

    $autoRoot = CEEF_ADMIN_STORAGE_ROOT . DIRECTORY_SEPARATOR . 'backups';
    if (is_dir($autoRoot)) {
        $groups = glob($autoRoot . DIRECTORY_SEPARATOR . '*', GLOB_ONLYDIR) ?: [];
        foreach ($groups as $groupDirectory) {
            $groupName = basename($groupDirectory);
            $files = glob($groupDirectory . DIRECTORY_SEPARATOR . '*') ?: [];
            foreach ($files as $filePath) {
                if (!is_file($filePath) || basename($filePath) === '.htaccess') {
                    continue;
                }

                $entries[] = [
                    'type' => 'auto',
                    'label' => 'Автобэкап: ' . $groupName,
                    'path' => '_storage/backups/' . $groupName . '/' . basename($filePath),
                    'timestamp' => (int) (filemtime($filePath) ?: 0),
                    'files' => [basename($filePath)],
                ];
            }
        }
    }

    usort(
        $entries,
        static fn (array $left, array $right) => $right['timestamp'] <=> $left['timestamp']
    );

    return array_slice($entries, 0, max(1, $limit));
}

function admin_slugify(string $value): string
{
    $map = [
        'а' => 'a', 'б' => 'b', 'в' => 'v', 'г' => 'g', 'д' => 'd', 'е' => 'e',
        'ё' => 'e', 'ж' => 'zh', 'з' => 'z', 'и' => 'i', 'й' => 'y', 'к' => 'k',
        'л' => 'l', 'м' => 'm', 'н' => 'n', 'о' => 'o', 'п' => 'p', 'р' => 'r',
        'с' => 's', 'т' => 't', 'у' => 'u', 'ф' => 'f', 'х' => 'h', 'ц' => 'cz',
        'ч' => 'ch', 'ш' => 'sh', 'щ' => 'sch', 'ъ' => '', 'ы' => 'y', 'ь' => '',
        'э' => 'e', 'ю' => 'yu', 'я' => 'ya',
    ];

    $value = mb_strtolower(trim($value), 'UTF-8');
    $value = strtr($value, $map);
    $value = preg_replace('/[^a-z0-9]+/u', '-', $value) ?? '';
    $value = trim($value, '-');

    return $value !== '' ? $value : 'item';
}

function admin_escape(string $value): string
{
    return htmlspecialchars($value, ENT_QUOTES | ENT_SUBSTITUTE, 'UTF-8');
}

function admin_multiline_to_array(string $value): array
{
    $items = preg_split('/\R+/u', $value) ?: [];
    $items = array_map(
        static function ($item) {
            return trim((string) $item);
        },
        $items
    );
    $items = array_filter(
        $items,
        static function ($item) {
            return $item !== '';
        }
    );

    return array_values(array_unique($items));
}

function admin_trim_value($value): string
{
    return trim((string) $value);
}

function admin_multiline_to_links(string $value): array
{
    $lines = preg_split('/\R+/u', $value) ?: [];
    $links = [];

    foreach ($lines as $line) {
        $line = trim((string) $line);

        if ($line === '') {
            continue;
        }

        $parts = preg_split('/\s*\|\s*/u', $line, 2) ?: [];
        $label = trim((string) ($parts[0] ?? ''));
        $href = trim((string) ($parts[1] ?? ''));

        if ($label === '' || $href === '') {
            continue;
        }

        $links[] = [
            'label' => $label,
            'href' => $href,
        ];
    }

    return $links;
}

function admin_multiline_to_navigation(string $value): array
{
    $links = admin_multiline_to_links($value);

    return array_map(
        static function (array $item): array {
            return [
                'name' => $item['label'],
                'href' => $item['href'],
            ];
        },
        $links
    );
}

function admin_multiline_to_pairs(
    string $value,
    string $firstKey = 'name',
    string $secondKey = 'detail'
): array {
    $lines = preg_split('/\R+/u', $value) ?: [];
    $items = [];

    foreach ($lines as $line) {
        $line = trim((string) $line);

        if ($line === '') {
            continue;
        }

        $parts = preg_split('/\s*\|\s*/u', $line, 2) ?: [];
        $first = trim((string) ($parts[0] ?? ''));
        $second = trim((string) ($parts[1] ?? ''));

        if ($first === '') {
            continue;
        }

        $items[] = [
            $firstKey => $first,
            $secondKey => $second,
        ];
    }

    return $items;
}

function admin_normalize_projects(array $rawProjects): array
{
    $projects = [];

    foreach ($rawProjects as $project) {
        $title = trim((string) ($project['title'] ?? ''));
        $category = trim((string) ($project['category'] ?? ''));
        $description = trim((string) ($project['description'] ?? ''));
        $slug = trim((string) ($project['slug'] ?? ''));
        $id = trim((string) ($project['id'] ?? ''));
        $images = admin_multiline_to_array((string) ($project['images_text'] ?? ''));

        if ($title === '' && $category === '' && $description === '' && $images === []) {
            continue;
        }

        $normalizedSlug = $slug !== '' ? admin_slugify($slug) : admin_slugify($title);
        $normalizedId = $id !== '' ? admin_slugify($id) : $normalizedSlug;

        $projects[] = [
            'id' => $normalizedId,
            'slug' => $normalizedSlug,
            'title' => $title,
            'category' => $category,
            'description' => $description,
            'images' => $images,
        ];
    }

    return $projects;
}

function admin_normalize_entries(array $rawEntries, bool $withContent): array
{
    $entries = [];

    foreach ($rawEntries as $entry) {
        $title = trim((string) ($entry['title'] ?? ''));
        $excerpt = trim((string) ($entry['excerpt'] ?? ''));
        $category = trim((string) ($entry['category'] ?? ''));
        $date = trim((string) ($entry['date'] ?? ''));
        $image = trim((string) ($entry['image'] ?? ''));
        $slug = trim((string) ($entry['slug'] ?? ''));
        $id = trim((string) ($entry['id'] ?? ''));

        if ($title === '' && $excerpt === '' && $image === '') {
            continue;
        }

        $normalizedSlug = $slug !== '' ? admin_slugify($slug) : admin_slugify($title);
        $normalizedId = $id !== '' ? admin_slugify($id) : $normalizedSlug;

        $normalized = [
            'id' => $normalizedId,
            'slug' => $normalizedSlug,
            'title' => $title,
            'excerpt' => $excerpt,
            'category' => $category,
            'date' => $date,
            'image' => $image,
        ];

        if ($withContent) {
            $normalized['readTime'] = trim((string) ($entry['readTime'] ?? ''));
            $normalized['featured'] = !empty($entry['featured']);
            $normalized['content'] = trim((string) ($entry['content'] ?? ''));
        }

        $entries[] = $normalized;
    }

    return $entries;
}

function admin_normalize_home(array $rawHome): array
{
    $heroCards = [];

    foreach ((array) ($rawHome['hero_cards'] ?? []) as $card) {
        $title = admin_trim_value($card['title'] ?? '');
        $description = admin_trim_value($card['description'] ?? '');

        if ($title === '' && $description === '') {
            continue;
        }

        $heroCards[] = [
            'icon' => admin_trim_value($card['icon'] ?? 'shield') ?: 'shield',
            'title' => $title,
            'description' => $description,
            'color' => admin_trim_value($card['color'] ?? 'blue') ?: 'blue',
        ];
    }

    $directions = [];

    foreach ((array) ($rawHome['directions'] ?? []) as $direction) {
        $title = admin_trim_value($direction['title'] ?? '');
        $description = admin_trim_value($direction['description'] ?? '');
        $features = admin_multiline_to_array((string) ($direction['features_text'] ?? ''));

        if ($title === '' && $description === '' && $features === []) {
            continue;
        }

        $directions[] = [
            'icon' => admin_trim_value($direction['icon'] ?? 'zap') ?: 'zap',
            'title' => $title,
            'description' => $description,
            'features' => $features,
            'link' => admin_trim_value($direction['link'] ?? 'Services') ?: 'Services',
            'color' => admin_trim_value($direction['color'] ?? 'orange') ?: 'orange',
        ];
    }

    return [
        'seoTitle' => admin_trim_value($rawHome['seoTitle'] ?? ''),
        'seoDescription' => admin_trim_value($rawHome['seoDescription'] ?? ''),
        'hero_badge' => admin_trim_value($rawHome['hero_badge'] ?? ''),
        'hero_title' => admin_trim_value($rawHome['hero_title'] ?? ''),
        'hero_highlight' => admin_trim_value($rawHome['hero_highlight'] ?? ''),
        'hero_subtitle' => admin_trim_value($rawHome['hero_subtitle'] ?? ''),
        'hero_button' => admin_trim_value($rawHome['hero_button'] ?? ''),
        'hero_cards' => $heroCards,
        'directions_title' => admin_trim_value($rawHome['directions_title'] ?? ''),
        'directions_subtitle' => admin_trim_value($rawHome['directions_subtitle'] ?? ''),
        'directions' => $directions,
    ];
}

function admin_normalize_about(array $rawAbout): array
{
    $stats = [];

    foreach ((array) ($rawAbout['stats'] ?? []) as $stat) {
        $value = admin_trim_value($stat['value'] ?? '');
        $label = admin_trim_value($stat['label'] ?? '');

        if ($value === '' && $label === '') {
            continue;
        }

        $stats[] = [
            'value' => $value,
            'label' => $label,
            'icon' => admin_trim_value($stat['icon'] ?? 'users') ?: 'users',
        ];
    }

    $advantages = [];

    foreach ((array) ($rawAbout['advantages'] ?? []) as $advantage) {
        $title = admin_trim_value($advantage['title'] ?? '');
        $description = admin_trim_value($advantage['description'] ?? '');

        if ($title === '' && $description === '') {
            continue;
        }

        $advantages[] = [
            'title' => $title,
            'description' => $description,
            'icon' => admin_trim_value($advantage['icon'] ?? 'shield') ?: 'shield',
            'color' => admin_trim_value($advantage['color'] ?? 'green') ?: 'green',
        ];
    }

    $approachSteps = [];

    foreach ((array) ($rawAbout['approachSteps'] ?? []) as $step) {
        $title = admin_trim_value($step['title'] ?? '');
        $description = admin_trim_value($step['description'] ?? '');

        if ($title === '' && $description === '') {
            continue;
        }

        $approachSteps[] = [
            'step' => admin_trim_value($step['step'] ?? ''),
            'title' => $title,
            'description' => $description,
        ];
    }

    $regulations = [];

    foreach ((array) ($rawAbout['regulations'] ?? []) as $regulation) {
        $title = admin_trim_value($regulation['title'] ?? '');
        $description = admin_trim_value($regulation['description'] ?? '');

        if ($title === '' && $description === '') {
            continue;
        }

        $regulations[] = [
            'title' => $title,
            'description' => $description,
        ];
    }

    return [
        'seoTitle' => admin_trim_value($rawAbout['seoTitle'] ?? ''),
        'seoDescription' => admin_trim_value($rawAbout['seoDescription'] ?? ''),
        'heroTitle' => admin_trim_value($rawAbout['heroTitle'] ?? ''),
        'heroSubtitle' => admin_trim_value($rawAbout['heroSubtitle'] ?? ''),
        'stats' => $stats,
        'introTitle' => admin_trim_value($rawAbout['introTitle'] ?? ''),
        'introParagraphs' => admin_multiline_to_array((string) ($rawAbout['introParagraphs_text'] ?? '')),
        'advantages' => $advantages,
        'approachTitle' => admin_trim_value($rawAbout['approachTitle'] ?? ''),
        'approachSteps' => $approachSteps,
        'regulationsTitle' => admin_trim_value($rawAbout['regulationsTitle'] ?? ''),
        'regulationsSubtitle' => admin_trim_value($rawAbout['regulationsSubtitle'] ?? ''),
        'regulations' => $regulations,
        'licensesTitle' => admin_trim_value($rawAbout['licensesTitle'] ?? ''),
        'licensesSubtitle' => admin_trim_value($rawAbout['licensesSubtitle'] ?? ''),
    ];
}

function admin_normalize_licenses(array $rawLicenses): array
{
    $categories = [];

    foreach ((array) ($rawLicenses['categories'] ?? []) as $category) {
        $label = admin_trim_value($category['label'] ?? '');
        $id = admin_trim_value($category['id'] ?? '');

        if ($label === '' && $id === '') {
            continue;
        }

        $categories[] = [
            'id' => $id !== '' ? admin_slugify($id) : admin_slugify($label),
            'label' => $label,
        ];
    }

    $items = [];

    foreach ((array) ($rawLicenses['items'] ?? []) as $item) {
        $title = admin_trim_value($item['title'] ?? '');
        $issuer = admin_trim_value($item['issuer'] ?? '');
        $number = admin_trim_value($item['number'] ?? '');
        $image = admin_trim_value($item['image'] ?? '');
        $previewImage = admin_trim_value($item['previewImage'] ?? '');
        $images = admin_multiline_to_array((string) ($item['images_text'] ?? ''));

        if ($title === '' && $issuer === '' && $number === '' && $image === '' && $images === []) {
            continue;
        }

        $normalizedId = admin_trim_value($item['id'] ?? '');
        $normalizedId = $normalizedId !== '' ? admin_slugify($normalizedId) : admin_slugify($title);

        $normalized = [
            'id' => $normalizedId,
            'title' => $title,
            'issuer' => $issuer,
            'number' => $number,
            'validUntil' => admin_trim_value($item['validUntil'] ?? ''),
            'category' => admin_trim_value($item['category'] ?? ''),
        ];

        if ($previewImage !== '') {
            $normalized['previewImage'] = $previewImage;
        }

        if ($image !== '') {
            $normalized['image'] = $image;
        }

        if ($images !== []) {
            $normalized['images'] = $images;

            if ($image === '') {
                $normalized['image'] = $images[0];
            }
        }

        $items[] = $normalized;
    }

    return [
        'seoTitle' => admin_trim_value($rawLicenses['seoTitle'] ?? ''),
        'seoDescription' => admin_trim_value($rawLicenses['seoDescription'] ?? ''),
        'pageBadge' => admin_trim_value($rawLicenses['pageBadge'] ?? ''),
        'pageTitle' => admin_trim_value($rawLicenses['pageTitle'] ?? ''),
        'pageSubtitle' => admin_trim_value($rawLicenses['pageSubtitle'] ?? ''),
        'categories' => $categories,
        'items' => $items,
    ];
}

function admin_normalize_site(array $rawSite): array
{
    return [
        'navigation' => admin_multiline_to_navigation((string) ($rawSite['navigation_text'] ?? '')),
        'brand' => [
            'shortName' => admin_trim_value($rawSite['brand']['shortName'] ?? ''),
            'fullName' => admin_trim_value($rawSite['brand']['fullName'] ?? ''),
            'licenseNote' => admin_trim_value($rawSite['brand']['licenseNote'] ?? ''),
            'footerDescription' => admin_trim_value($rawSite['brand']['footerDescription'] ?? ''),
        ],
        'header' => [
            'phoneDisplay' => admin_trim_value($rawSite['header']['phoneDisplay'] ?? ''),
            'phoneHref' => admin_trim_value($rawSite['header']['phoneHref'] ?? ''),
            'statusText' => admin_trim_value($rawSite['header']['statusText'] ?? ''),
            'quoteButtonLabel' => admin_trim_value($rawSite['header']['quoteButtonLabel'] ?? ''),
            'quoteButtonPage' => admin_trim_value($rawSite['header']['quoteButtonPage'] ?? ''),
        ],
        'contacts' => [
            'email' => admin_trim_value($rawSite['contacts']['email'] ?? ''),
            'address' => admin_trim_value($rawSite['contacts']['address'] ?? ''),
            'telegramUrl' => admin_trim_value($rawSite['contacts']['telegramUrl'] ?? ''),
            'vkUrl' => admin_trim_value($rawSite['contacts']['vkUrl'] ?? ''),
            'whatsappUrl' => admin_trim_value($rawSite['contacts']['whatsappUrl'] ?? ''),
        ],
        'footerSections' => admin_multiline_to_links((string) ($rawSite['footerSections_text'] ?? '')),
        'footerDocuments' => admin_multiline_to_links((string) ($rawSite['footerDocuments_text'] ?? '')),
        'footer' => [
            'sectionsTitle' => admin_trim_value($rawSite['footer']['sectionsTitle'] ?? ''),
            'documentsTitle' => admin_trim_value($rawSite['footer']['documentsTitle'] ?? ''),
            'copyright' => admin_trim_value($rawSite['footer']['copyright'] ?? ''),
        ],
    ];
}

function admin_normalize_contacts(array $rawContacts): array
{
    return [
        'seoTitle' => admin_trim_value($rawContacts['seoTitle'] ?? ''),
        'seoDescription' => admin_trim_value($rawContacts['seoDescription'] ?? ''),
        'pageTitle' => admin_trim_value($rawContacts['pageTitle'] ?? ''),
        'infoTitle' => admin_trim_value($rawContacts['infoTitle'] ?? ''),
        'introText' => admin_trim_value($rawContacts['introText'] ?? ''),
        'phoneLabel' => admin_trim_value($rawContacts['phoneLabel'] ?? ''),
        'emailLabel' => admin_trim_value($rawContacts['emailLabel'] ?? ''),
        'addressLabel' => admin_trim_value($rawContacts['addressLabel'] ?? ''),
        'socialsLabel' => admin_trim_value($rawContacts['socialsLabel'] ?? ''),
        'telegramLabel' => admin_trim_value($rawContacts['telegramLabel'] ?? ''),
        'vkLabel' => admin_trim_value($rawContacts['vkLabel'] ?? ''),
        'formTitle' => admin_trim_value($rawContacts['formTitle'] ?? ''),
        'formSuccessTitle' => admin_trim_value($rawContacts['formSuccessTitle'] ?? ''),
        'formSuccessText' => admin_trim_value($rawContacts['formSuccessText'] ?? ''),
        'formSubmitLabel' => admin_trim_value($rawContacts['formSubmitLabel'] ?? ''),
        'formLoadingLabel' => admin_trim_value($rawContacts['formLoadingLabel'] ?? ''),
    ];
}

function admin_normalize_faq(array $rawFaq): array
{
    $items = [];

    foreach ((array) ($rawFaq['items'] ?? []) as $item) {
        $question = admin_trim_value($item['question'] ?? '');
        $answer = admin_trim_value($item['answer'] ?? '');

        if ($question === '' && $answer === '') {
            continue;
        }

        $items[] = [
            'question' => $question,
            'answer' => $answer,
        ];
    }

    return [
        'seoTitle' => admin_trim_value($rawFaq['seoTitle'] ?? ''),
        'seoDescription' => admin_trim_value($rawFaq['seoDescription'] ?? ''),
        'badge' => admin_trim_value($rawFaq['badge'] ?? ''),
        'title' => admin_trim_value($rawFaq['title'] ?? ''),
        'subtitle' => admin_trim_value($rawFaq['subtitle'] ?? ''),
        'ctaTitle' => admin_trim_value($rawFaq['ctaTitle'] ?? ''),
        'ctaText' => admin_trim_value($rawFaq['ctaText'] ?? ''),
        'callButtonLabel' => admin_trim_value($rawFaq['callButtonLabel'] ?? ''),
        'whatsappButtonLabel' => admin_trim_value($rawFaq['whatsappButtonLabel'] ?? ''),
        'formButtonLabel' => admin_trim_value($rawFaq['formButtonLabel'] ?? ''),
        'items' => $items,
    ];
}

function admin_normalize_reviews(array $rawReviews): array
{
    $items = [];

    foreach ((array) ($rawReviews['items'] ?? []) as $item) {
        $text = admin_trim_value($item['text'] ?? '');
        $author = admin_trim_value($item['author'] ?? '');
        $position = admin_trim_value($item['position'] ?? '');
        $initials = admin_trim_value($item['initials'] ?? '');

        if ($text === '' && $author === '') {
            continue;
        }

        $rating = (int) ($item['rating'] ?? 5);

        $items[] = [
            'id' => admin_trim_value($item['id'] ?? '') ?: admin_slugify($author . '-' . mb_substr($text, 0, 20, 'UTF-8')),
            'text' => $text,
            'author' => $author,
            'position' => $position,
            'rating' => max(1, min(5, $rating)),
            'initials' => $initials,
        ];
    }

    return [
        'seoTitle' => admin_trim_value($rawReviews['seoTitle'] ?? ''),
        'seoDescription' => admin_trim_value($rawReviews['seoDescription'] ?? ''),
        'title' => admin_trim_value($rawReviews['title'] ?? ''),
        'subtitle' => admin_trim_value($rawReviews['subtitle'] ?? ''),
        'homeTitle' => admin_trim_value($rawReviews['homeTitle'] ?? ''),
        'items' => $items,
    ];
}

function admin_normalize_services(array $rawServices): array
{
    $tabs = [];

    foreach ((array) ($rawServices['tabs'] ?? []) as $tab) {
        $id = admin_trim_value($tab['id'] ?? '');
        $name = admin_trim_value($tab['name'] ?? '');

        if ($id === '' && $name === '') {
            continue;
        }

        $tabs[] = [
            'id' => $id !== '' ? admin_slugify($id) : admin_slugify($name),
            'name' => $name,
            'icon' => admin_trim_value($tab['icon'] ?? 'shield') ?: 'shield',
        ];
    }

    $sections = [];

    foreach ((array) ($rawServices['sections'] ?? []) as $section) {
        $title = admin_trim_value($section['title'] ?? '');
        $description = admin_trim_value($section['description'] ?? '');
        $services = admin_multiline_to_pairs((string) ($section['services_text'] ?? ''));
        $id = admin_trim_value($section['id'] ?? '');

        if ($title === '' && $description === '' && $services === []) {
            continue;
        }

        $sections[] = [
            'id' => $id !== '' ? admin_slugify($id) : admin_slugify($title),
            'title' => $title,
            'description' => $description,
            'services' => $services,
        ];
    }

    return [
        'seoTitle' => admin_trim_value($rawServices['seoTitle'] ?? ''),
        'seoDescription' => admin_trim_value($rawServices['seoDescription'] ?? ''),
        'badgeLabel' => admin_trim_value($rawServices['badgeLabel'] ?? ''),
        'pageTitle' => admin_trim_value($rawServices['pageTitle'] ?? ''),
        'pageSubtitle' => admin_trim_value($rawServices['pageSubtitle'] ?? ''),
        'tabs' => $tabs,
        'sections' => $sections,
        'ctaTitle' => admin_trim_value($rawServices['ctaTitle'] ?? ''),
        'ctaText' => admin_trim_value($rawServices['ctaText'] ?? ''),
        'ctaButtonLabel' => admin_trim_value($rawServices['ctaButtonLabel'] ?? ''),
    ];
}

function admin_normalize_maintenance(array $rawMaintenance): array
{
    $advantages = [];

    foreach ((array) ($rawMaintenance['advantages'] ?? []) as $advantage) {
        $title = admin_trim_value($advantage['title'] ?? '');
        $text = admin_trim_value($advantage['text'] ?? '');

        if ($title === '' && $text === '') {
            continue;
        }

        $advantages[] = [
            'icon' => admin_trim_value($advantage['icon'] ?? 'shield') ?: 'shield',
            'title' => $title,
            'text' => $text,
        ];
    }

    $services = [];

    foreach ((array) ($rawMaintenance['services'] ?? []) as $service) {
        $title = admin_trim_value($service['title'] ?? '');
        $subtitle = admin_trim_value($service['subtitle'] ?? '');
        $description = admin_trim_value($service['description'] ?? '');
        $works = admin_multiline_to_array((string) ($service['works_text'] ?? ''));
        $periodicity = admin_multiline_to_array((string) ($service['periodicity_text'] ?? ''));
        $id = admin_trim_value($service['id'] ?? '');

        if ($title === '' && $subtitle === '' && $description === '' && $works === []) {
            continue;
        }

        $services[] = [
            'id' => $id !== '' ? admin_slugify($id) : admin_slugify($title),
            'icon' => admin_trim_value($service['icon'] ?? 'wrench') ?: 'wrench',
            'title' => $title,
            'subtitle' => $subtitle,
            'description' => $description,
            'works' => $works,
            'periodicity' => $periodicity,
            'price' => admin_trim_value($service['price'] ?? ''),
        ];
    }

    return [
        'seoTitle' => admin_trim_value($rawMaintenance['seoTitle'] ?? ''),
        'seoDescription' => admin_trim_value($rawMaintenance['seoDescription'] ?? ''),
        'badgeLabel' => admin_trim_value($rawMaintenance['badgeLabel'] ?? ''),
        'pageTitle' => admin_trim_value($rawMaintenance['pageTitle'] ?? ''),
        'pageSubtitle' => admin_trim_value($rawMaintenance['pageSubtitle'] ?? ''),
        'advantages' => $advantages,
        'services' => $services,
        'estimateTitle' => admin_trim_value($rawMaintenance['estimateTitle'] ?? ''),
        'estimateText' => admin_trim_value($rawMaintenance['estimateText'] ?? ''),
        'estimateButtonLabel' => admin_trim_value($rawMaintenance['estimateButtonLabel'] ?? ''),
    ];
}

function admin_normalize_consulting(array $rawConsulting): array
{
    $advantages = [];

    foreach ((array) ($rawConsulting['advantages'] ?? []) as $advantage) {
        $title = admin_trim_value($advantage['title'] ?? '');
        $description = admin_trim_value($advantage['description'] ?? '');

        if ($title === '' && $description === '') {
            continue;
        }

        $advantages[] = [
            'title' => $title,
            'description' => $description,
        ];
    }

    $services = [];

    foreach ((array) ($rawConsulting['services'] ?? []) as $service) {
        $title = admin_trim_value($service['title'] ?? '');
        $description = admin_trim_value($service['description'] ?? '');
        $details = admin_multiline_to_array((string) ($service['details_text'] ?? ''));

        if ($title === '' && $description === '' && $details === []) {
            continue;
        }

        $services[] = [
            'icon' => admin_trim_value($service['icon'] ?? 'file-text') ?: 'file-text',
            'title' => $title,
            'description' => $description,
            'details' => $details,
            'price' => admin_trim_value($service['price'] ?? ''),
        ];
    }

    return [
        'seoTitle' => admin_trim_value($rawConsulting['seoTitle'] ?? ''),
        'seoDescription' => admin_trim_value($rawConsulting['seoDescription'] ?? ''),
        'badgeLabel' => admin_trim_value($rawConsulting['badgeLabel'] ?? ''),
        'pageTitle' => admin_trim_value($rawConsulting['pageTitle'] ?? ''),
        'pageSubtitle' => admin_trim_value($rawConsulting['pageSubtitle'] ?? ''),
        'ctaButtonLabel' => admin_trim_value($rawConsulting['ctaButtonLabel'] ?? ''),
        'advantages' => $advantages,
        'services' => $services,
        'ctaTitle' => admin_trim_value($rawConsulting['ctaTitle'] ?? ''),
        'ctaText' => admin_trim_value($rawConsulting['ctaText'] ?? ''),
        'ctaBottomButtonLabel' => admin_trim_value($rawConsulting['ctaBottomButtonLabel'] ?? ''),
    ];
}

function admin_normalize_price(array $rawPrice): array
{
    $serviceOptions = [];

    foreach ((array) ($rawPrice['serviceOptions'] ?? []) as $option) {
        $label = admin_trim_value($option['label'] ?? '');
        $id = admin_trim_value($option['id'] ?? '');

        if ($label === '' && $id === '') {
            continue;
        }

        $serviceOptions[] = [
            'id' => $id !== '' ? admin_slugify($id) : admin_slugify($label),
            'label' => $label,
            'basePrice' => (float) ($option['basePrice'] ?? 0),
        ];
    }

    $voltageOptions = [];

    foreach ((array) ($rawPrice['voltageOptions'] ?? []) as $option) {
        $label = admin_trim_value($option['label'] ?? '');
        $id = admin_trim_value($option['id'] ?? '');

        if ($label === '' && $id === '') {
            continue;
        }

        $voltageOptions[] = [
            'id' => $id !== '' ? admin_slugify($id) : admin_slugify($label),
            'label' => $label,
            'multiplier' => (float) ($option['multiplier'] ?? 1),
        ];
    }

    $urgencyOptions = [];

    foreach ((array) ($rawPrice['urgencyOptions'] ?? []) as $option) {
        $label = admin_trim_value($option['label'] ?? '');
        $id = admin_trim_value($option['id'] ?? '');

        if ($label === '' && $id === '') {
            continue;
        }

        $urgencyOptions[] = [
            'id' => $id !== '' ? admin_slugify($id) : admin_slugify($label),
            'label' => $label,
            'multiplier' => (float) ($option['multiplier'] ?? 1),
        ];
    }

    $priceTable = [];

    foreach ((array) ($rawPrice['priceTable'] ?? []) as $item) {
        $name = admin_trim_value($item['name'] ?? '');
        $unit = admin_trim_value($item['unit'] ?? '');
        $price = admin_trim_value($item['price'] ?? '');

        if ($name === '' && $unit === '' && $price === '') {
            continue;
        }

        $priceTable[] = [
            'name' => $name,
            'unit' => $unit,
            'price' => $price,
        ];
    }

    return [
        'seoTitle' => admin_trim_value($rawPrice['seoTitle'] ?? ''),
        'seoDescription' => admin_trim_value($rawPrice['seoDescription'] ?? ''),
        'pageTitle' => admin_trim_value($rawPrice['pageTitle'] ?? ''),
        'calculatorTitle' => admin_trim_value($rawPrice['calculatorTitle'] ?? ''),
        'serviceLabel' => admin_trim_value($rawPrice['serviceLabel'] ?? ''),
        'voltageLabel' => admin_trim_value($rawPrice['voltageLabel'] ?? ''),
        'urgencyLabel' => admin_trim_value($rawPrice['urgencyLabel'] ?? ''),
        'volumeLabel' => admin_trim_value($rawPrice['volumeLabel'] ?? ''),
        'volumeHint' => admin_trim_value($rawPrice['volumeHint'] ?? ''),
        'resultLabel' => admin_trim_value($rawPrice['resultLabel'] ?? ''),
        'orderButtonLabel' => admin_trim_value($rawPrice['orderButtonLabel'] ?? ''),
        'tableTitle' => admin_trim_value($rawPrice['tableTitle'] ?? ''),
        'tableHeaders' => [
            'name' => admin_trim_value($rawPrice['tableHeaders']['name'] ?? ''),
            'unit' => admin_trim_value($rawPrice['tableHeaders']['unit'] ?? ''),
            'price' => admin_trim_value($rawPrice['tableHeaders']['price'] ?? ''),
        ],
        'noteText' => admin_trim_value($rawPrice['noteText'] ?? ''),
        'serviceOptions' => $serviceOptions,
        'voltageOptions' => $voltageOptions,
        'urgencyOptions' => $urgencyOptions,
        'defaults' => [
            'service' => admin_slugify(admin_trim_value($rawPrice['defaults']['service'] ?? '')),
            'voltage' => admin_slugify(admin_trim_value($rawPrice['defaults']['voltage'] ?? '')),
            'urgency' => admin_slugify(admin_trim_value($rawPrice['defaults']['urgency'] ?? '')),
            'volume' => (int) ($rawPrice['defaults']['volume'] ?? 1),
            'volumeMin' => (int) ($rawPrice['defaults']['volumeMin'] ?? 1),
            'volumeMax' => (int) ($rawPrice['defaults']['volumeMax'] ?? 50),
        ],
        'priceTable' => $priceTable,
    ];
}

function admin_upload_filename(string $name): string
{
    $extension = strtolower(pathinfo($name, PATHINFO_EXTENSION));
    $basename = pathinfo($name, PATHINFO_FILENAME);
    $basename = admin_slugify($basename);

    return $basename . ($extension !== '' ? '.' . $extension : '');
}

function admin_unique_upload_path(string $directory, string $filename): string
{
    $extension = strtolower(pathinfo($filename, PATHINFO_EXTENSION));
    $basename = pathinfo($filename, PATHINFO_FILENAME);
    $candidate = $filename;
    $counter = 1;

    while (file_exists($directory . DIRECTORY_SEPARATOR . $candidate)) {
        $candidate = $basename . '-' . $counter . ($extension !== '' ? '.' . $extension : '');
        $counter++;
    }

    return $candidate;
}

function admin_json_response(array $payload, int $status = 200)
{
    http_response_code($status);
    header('Content-Type: application/json; charset=utf-8');
    echo json_encode($payload, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
    exit;
}
