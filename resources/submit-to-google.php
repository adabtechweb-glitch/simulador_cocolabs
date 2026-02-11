<?php

/**
 * API de integración para Google Sheets y Google Forms.
 * Versión 1.1.7: Formato de respuesta compatible con JS (status: 'success')
 */

declare(strict_types=1);

namespace App;

use Exception;
use Google\Client;
use Google\Service\Sheets;

/**
 * CONFIGURACIÓN GLOBAL
 */
$currentPath = dirname($_SERVER['SCRIPT_FILENAME']);

$config = [
    'enable_cors'      => true,
    'allowed_origins'  => ['https://adabtech-dev.isora.com.co'],
    'spreadsheet_id'   => '1IvE3T8h0by40yEu5kZSNkIOxN5tqg5nAxrqMpYoUNPI',
    'range'            => 'CONSTANTS-Web-App!B1',
    'credentials_path' => $currentPath . '/../dependences/service-account-key.json',
    'autoload_path'    => $currentPath . '/../dependences/vendor/autoload.php',
    'google_form_url'  => 'https://docs.google.com/forms/d/e/1FAIpQLSfUS3iaygaxc1AzPAPOndYpA-qYARgvylTm8kQKj7dCupxWgA/formResponse',
];

/**
 * Middleware para gestión de CORS y protección de acceso directo.
 */
class CorsMiddleware
{
    public function __construct(private bool $enabled, private array $allowedOrigins) {}

    public function handle(): void
    {
        if (!$this->enabled) {
            header("Access-Control-Allow-Origin: *");
            header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
            header('Access-Control-Allow-Headers: Content-Type');
            return;
        }

        $origin  = rtrim($_SERVER['HTTP_ORIGIN'] ?? '', '/');
        $referer = $_SERVER['HTTP_REFERER'] ?? '';
        $host    = $_SERVER['HTTP_HOST'] ?? '';

        if (empty($origin) && empty($referer)) {
            $protocol = (!empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off') ? "https://" : "http://";
            header("Location: " . $protocol . $host . "/");
            exit;
        }

        $isAllowedOrigin = !empty($origin) && in_array($origin, $this->allowedOrigins, true);
        $isSameOrigin    = !empty($referer) && str_contains($referer, $host);

        if ($isAllowedOrigin || $isSameOrigin) {
            $headerOrigin = !empty($origin) ? $origin : (((!empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off') ? "https://" : "http://") . $host);

            header("Access-Control-Allow-Origin: $headerOrigin");
            header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
            header('Access-Control-Allow-Headers: Content-Type');
            header('Access-Control-Allow-Credentials: true');

            if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
                http_response_code(204);
                exit;
            }
            return;
        }

        http_response_code(403);
        header('Content-Type: application/json; charset=UTF-8');
        echo json_encode(['status' => 'error', 'data' => 'Origen no autorizado']);
        exit;
    }
}

/**
 * Enrutador basado en Path Info (soporta .php/)
 */
class Router
{
    private array $routes = [];

    public function get(string $path, callable $callback): void
    {
        $this->routes['GET'][$this->normalize($path)] = $callback;
    }

    public function post(string $path, callable $callback): void
    {
        $this->routes['POST'][$this->normalize($path)] = $callback;
    }

    private function normalize(string $path): string
    {
        return '/' . trim($path, '/');
    }

    public function dispatch(): void
    {
        $pathInfo = $_SERVER['PATH_INFO'] ?? '/';
        $path = $this->normalize($pathInfo);
        $method = $_SERVER['REQUEST_METHOD'];

        if (!isset($this->routes[$method][$path])) {
            $this->respondJson([
                'status' => 'error', 
                'data' => "Ruta no encontrada: $path"
            ], 404);
        }

        $callback = $this->routes[$method][$path];

        if ($method === 'GET') {
            call_user_func($callback);
        } elseif ($method === 'POST') {
            $payload = json_decode(file_get_contents('php://input') ?: '', true);
            call_user_func($callback, is_array($payload) ? $payload : []);
        }
    }

    public function respondJson(array $data, int $code = 200): never
    {
        http_response_code($code);
        header('Content-Type: application/json; charset=UTF-8');
        echo json_encode($data, JSON_UNESCAPED_UNICODE);
        exit;
    }
}

/**
 * Lector de Google Sheets.
 */
class GoogleSheetReader
{
    public function __construct(private string $spreadsheetId, private string $range, private string $credentialsPath, private string $autoloadPath) {}

    public function getValue(): array
    {
        if (!file_exists($this->autoloadPath)) return ['status' => 'error', 'data' => 'Error dependencias'];
        require_once $this->autoloadPath;

        try {
            $client = new Client();
            $client->setAuthConfig($this->credentialsPath);
            $client->addScope(Sheets::SPREADSHEETS_READONLY);
            $service = new Sheets($client);
            $response = $service->spreadsheets_values->get($this->spreadsheetId, $this->range);
            $values = $response->getValues();
            
            if (!empty($values) && isset($values[0][0])) {
                return ['status' => 'success', 'data' => (string)$values[0][0]];
            }
            return ['status' => 'error', 'data' => 'Celda vacía'];
        } catch (Exception $e) {
            return ['status' => 'error', 'data' => $e->getMessage()];
        }
    }
}

/**
 * Manejador de Google Forms.
 */
class GoogleFormHandler
{
    public function __construct(private string $formUrl) {}

    public function handle(array $payload): void
    {
        $c = $payload['clientData'] ?? [];
        $s = $payload['simulationResults'] ?? [];
        
        $fields = [
            'entry.1573315993' => trim((string)($c['name'] ?? '')),
            'entry.1585523748' => ($c['contactType'] ?? '') === 'whatsapp' ? (string)($c['contact'] ?? '') : '',
            'entry.350349042'  => trim((string)($c['segmento'] ?? 'Hogar')),
            'entry.1526130880' => trim((string)($c['ciudad'] ?? '')),
            'entry.815677826'  => trim((string)($c['departamento'] ?? '')),
            'entry.467572294'  => (string)round((float)($s['monthlySavings'] ?? 0)),
            'entry.2042215689' => (string)round((float)($s['monthlyConsumption'] ?? 0)),
            'entry.1325827111' => (string)round((float)($s['monthlyConsumption'] ?? 0)),
            'entry.1177548502' => 'Acepto el tratamiento de mis datos personales.',
            'emailAddress'     => ($c['contactType'] ?? '') === 'email' ? (string)($c['contact'] ?? '') : 'noreply@example.com',
        ];

        $ch = curl_init($this->formUrl);
        curl_setopt_array($ch, [
            CURLOPT_POST => true,
            CURLOPT_POSTFIELDS => http_build_query($fields),
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_TIMEOUT => 10,
            CURLOPT_USERAGENT => 'Mozilla/5.0 API-Proxy/1.1',
        ]);
        curl_exec($ch);
        $code = (int)curl_getinfo($ch, CURLINFO_HTTP_CODE);

        header('Content-Type: application/json');
        $isOk = ($code >= 200 && $code < 400);
        
        echo json_encode([
            'status' => $isOk ? 'success' : 'error', 
            'data'   => $isOk ? 'Éxito' : 'Error en Google Forms'
        ]);
        exit;
    }
}

/* --- EJECUCIÓN --- */

(new CorsMiddleware($config['enable_cors'], $config['allowed_origins']))->handle();

$router = new Router();

$router->get('/', static function () use ($config, $router): void {
    $reader = new GoogleSheetReader($config['spreadsheet_id'], $config['range'], $config['credentials_path'], $config['autoload_path']);
    $router->respondJson($reader->getValue());
});

$router->post('/', static function (array $payload) use ($config): void {
    (new GoogleFormHandler($config['google_form_url']))->handle($payload);
});

$router->dispatch();