<?php

header('Content-Type: application/json; charset=utf-8');
header('Cache-Control: no-store, no-cache, must-revalidate, max-age=0');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    header('Allow: POST, OPTIONS');
    http_response_code(204);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode([
        'ok' => false,
        'message' => 'Method not allowed.',
    ], JSON_UNESCAPED_UNICODE);
    exit;
}

$rawBody = file_get_contents('php://input');
$payload = json_decode($rawBody ?: '{}', true);

if (!is_array($payload)) {
    http_response_code(400);
    echo json_encode([
        'ok' => false,
        'message' => 'Invalid JSON payload.',
    ], JSON_UNESCAPED_UNICODE);
    exit;
}

if (!empty($payload['website'])) {
    echo json_encode(['ok' => true], JSON_UNESCAPED_UNICODE);
    exit;
}

$config = [];
$configPath = __DIR__ . '/telegram-config.php';
if (is_file($configPath)) {
    $loadedConfig = require $configPath;
    if (is_array($loadedConfig)) {
        $config = $loadedConfig;
    }
}

$botToken = trim((string)($config['bot_token'] ?? getenv('TELEGRAM_BOT_TOKEN') ?? ''));
$chatId = trim((string)($config['chat_id'] ?? getenv('TELEGRAM_CHAT_ID') ?? ''));

if ($botToken === '' || $chatId === '') {
    http_response_code(500);
    echo json_encode([
        'ok' => false,
        'message' => 'Telegram server config is missing.',
    ], JSON_UNESCAPED_UNICODE);
    exit;
}

$normalize = static function ($value, $fallback = 'не указано') {
    $string = trim((string)$value);
    return $string === '' ? $fallback : $string;
};

$formType = trim((string)($payload['formType'] ?? 'contact'));
$subject = trim((string)($payload['subject'] ?? 'Новая заявка с сайта'));
$name = $normalize($payload['name'] ?? '', 'не указано');
$phone = $normalize($payload['phone'] ?? '', 'не указано');
$email = $normalize($payload['email'] ?? '', 'не указано');
$message = $normalize($payload['message'] ?? '', 'не указано');
$pageUrl = $normalize($payload['pageUrl'] ?? '', 'не указано');

if ($phone === 'не указано' && $message === 'не указано') {
    http_response_code(422);
    echo json_encode([
        'ok' => false,
        'message' => 'Phone or message is required.',
    ], JSON_UNESCAPED_UNICODE);
    exit;
}

$messageLines = [
    'Новая заявка с сайта ЦЭФ',
    '',
    'Тип формы: ' . $formType,
    'Тема: ' . $subject,
    'Имя: ' . $name,
    'Телефон: ' . $phone,
    'Email: ' . $email,
    'Сообщение: ' . $message,
    'Страница: ' . $pageUrl,
];

$telegramPayload = [
    'chat_id' => $chatId,
    'text' => implode("\n", $messageLines),
];

$telegramUrl = 'https://api.telegram.org/bot' . rawurlencode($botToken) . '/sendMessage';

$sendWithCurl = static function ($url, array $body) {
    $ch = curl_init($url);
    curl_setopt_array($ch, [
        CURLOPT_POST => true,
        CURLOPT_HTTPHEADER => ['Content-Type: application/json'],
        CURLOPT_POSTFIELDS => json_encode($body, JSON_UNESCAPED_UNICODE),
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_CONNECTTIMEOUT => 10,
        CURLOPT_TIMEOUT => 15,
    ]);

    $response = curl_exec($ch);
    $statusCode = (int)curl_getinfo($ch, CURLINFO_HTTP_CODE);
    $error = curl_error($ch);
    curl_close($ch);

    return [$statusCode, $response, $error];
};

$sendWithStream = static function ($url, array $body) {
    $context = stream_context_create([
        'http' => [
            'method' => 'POST',
            'header' => "Content-Type: application/json\r\n",
            'content' => json_encode($body, JSON_UNESCAPED_UNICODE),
            'timeout' => 15,
            'ignore_errors' => true,
        ],
    ]);

    $response = file_get_contents($url, false, $context);
    $statusCode = 0;
    if (!empty($http_response_header[0]) && preg_match('/\s(\d{3})\s/', $http_response_header[0], $matches)) {
        $statusCode = (int)$matches[1];
    }

    return [$statusCode, $response, null];
};

[$statusCode, $telegramResponse, $transportError] = function_exists('curl_init')
    ? $sendWithCurl($telegramUrl, $telegramPayload)
    : $sendWithStream($telegramUrl, $telegramPayload);

if ($transportError) {
    http_response_code(502);
    echo json_encode([
        'ok' => false,
        'message' => 'Telegram transport error.',
    ], JSON_UNESCAPED_UNICODE);
    exit;
}

$decodedResponse = json_decode($telegramResponse ?: '{}', true);
if ($statusCode < 200 || $statusCode >= 300 || !is_array($decodedResponse) || empty($decodedResponse['ok'])) {
    http_response_code(502);
    echo json_encode([
        'ok' => false,
        'message' => 'Telegram API rejected the request.',
    ], JSON_UNESCAPED_UNICODE);
    exit;
}

echo json_encode([
    'ok' => true,
], JSON_UNESCAPED_UNICODE);
