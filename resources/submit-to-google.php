<?php

/**
 * ---------------------------------------------------------
 *  API Proxy de Integración Google Sheets & Google Forms
 * ---------------------------------------------------------
 *
 * @author    Adabtech
 * @version   1.2.0
 * @year      2026
 * @license   MIT
 *
 * Descripción:
 * Este archivo implementa un endpoint HTTP autónomo en PHP 8.1+
 * que actúa como proxy seguro entre una aplicación frontend y
 * los servicios de Google Sheets y Google Forms.
 *
 * La API permite:
 *   • Leer valores específicos desde Google Sheets (GET)
 *   • Enviar datos estructurados a Google Forms (POST)
 *
 * Está diseñado bajo un enfoque minimalista, desacoplado y
 * sin dependencias de frameworks externos.
*/

/**
 * =========================================================
 *  DESCRIPCIÓN GENERAL DEL SCRIPT
 * =========================================================
 *
 * Este script implementa una API ligera en PHP que funciona
 * como capa intermedia (proxy backend) entre el frontend
 * de una aplicación web y los servicios de Google.
 *
 * ---------------------------------------------------------
 *  ARQUITECTURA GENERAL
 * ---------------------------------------------------------
 *
 * El flujo de ejecución está compuesto por cuatro capas:
 *
 * 1. Configuración:
 *    - Definición de parámetros globales.
 *    - Identificadores de Google Sheets.
 *    - URL de Google Forms.
 *    - Rutas a credenciales y autoload.
 *
 * 2. Middleware CORS:
 *    - Valida el origen de la solicitud.
 *    - Permite únicamente dominios autorizados.
 *    - Bloquea accesos directos no válidos.
 *    - Gestiona solicitudes OPTIONS (preflight).
 *
 * 3. Router HTTP:
 *    - Enrutador minimalista basado en PATH_INFO.
 *    - Soporta métodos GET y POST.
 *    - Normaliza rutas.
 *    - Devuelve respuestas JSON estandarizadas.
 *
 * 4. Servicios de Integración:
 *    a) GoogleSheetReader:
 *       - Autentica mediante Service Account.
 *       - Consulta una celda específica.
 *       - Devuelve valor como respuesta JSON.
 *
 *    b) GoogleFormHandler:
 *       - Recibe payload estructurado.
 *       - Mapea datos a campos entry.xxxxx.
 *       - Envía información vía cURL POST.
 *       - Evalúa código HTTP de respuesta.
 *
 * ---------------------------------------------------------
 *  FLUJO DE EJECUCIÓN
 * ---------------------------------------------------------
 *
 * 1. Se ejecuta el Middleware de seguridad (CORS).
 * 2. Se inicializa el Router.
 * 3. Se registran las rutas:
 *
 *    GET  /
 *      → Lee configuración desde Google Sheets.
 *
 *    POST /
 *      → Recibe datos JSON y los envía a Google Forms.
 *
 * 4. Se despacha la solicitud según método y ruta.
 *
 * ---------------------------------------------------------
 *  FORMATO DE RESPUESTAS
 * ---------------------------------------------------------
 *
 * Todas las respuestas siguen el formato:
 *
 * {
 *   "status": "success" | "error",
 *   "data":   string | mixed
 * }
 *
 * Se utiliza Content-Type: application/json; charset=UTF-8
 * y códigos HTTP apropiados.
 *
 * ---------------------------------------------------------
 *  MEDIDAS DE SEGURIDAD IMPLEMENTADAS
 * ---------------------------------------------------------
 *
 * ✔ Validación de origen (CORS controlado)
 * ✔ Manejo de solicitudes preflight (OPTIONS)
 * ✔ Respuestas JSON estructuradas
 * ✔ Uso de credenciales de Service Account
 * ✔ No exposición directa de Google Forms
 * ✔ Tipado estricto (strict_types=1)
 *
 * ---------------------------------------------------------
 *  CONSIDERACIONES TÉCNICAS
 * ---------------------------------------------------------
 *
 * - Google Forms devuelve HTTP 200 incluso ante errores
 *   de validación de campos.
 *
 * - Este endpoint está diseñado como proxy ligero,
 *   no como sistema de persistencia intermedio.
 *
 * - Para entornos de alta criticidad se recomienda:
 *     • Implementar rate limiting
 *     • Añadir autenticación adicional (API Key / Token)
 *     • Registrar logs de auditoría
 *
 * =========================================================
*/

declare(strict_types=1);

namespace App;

use Exception;
use Google\Client;
use Google\Service\Sheets;

/**
 * Carga de dependencias y configuración de rutas.
 * Se utiliza $_SERVER['SCRIPT_FILENAME'] para evitar la resolución de
 * enlaces simbólicos y mantener la ruta relativa al host destino.
 */
$baseDirectory = dirname($_SERVER['SCRIPT_FILENAME']);

$config = [
    'enable_cors'      => true,
    'allowed_origins'  => ['https://adabtech-dev.isora.com.co'],
    'spreadsheet_id'   => '1IvE3T8h0by40yEu5kZSNkIOxN5tqg5nAxrqMpYoUNPI',
    'range'            => 'CONSTANTS-Web-App!B1',
    'credentials_path' => $baseDirectory . '/../dependences/service-account-key.json',
    'autoload_path'    => $baseDirectory . '/../dependences/vendor/autoload.php',
    'google_form_url'  => 'https://docs.google.com/forms/d/e/1FAIpQLSfUS3iaygaxc1AzPAPOndYpA-qYARgvylTm8kQKj7dCupxWgA/formResponse',
];

/**
 * Class CorsMiddleware
 *
 * Gestiona la seguridad de origen y las redirecciones de acceso directo.
 *
 * @package App
 */
class CorsMiddleware
{
    /**
     * @param bool  $enabled        Indica si el filtrado CORS está activo.
     * @param array $allowedOrigins Lista de dominios permitidos.
     */
    public function __construct(
        private bool $enabled,
        private array $allowedOrigins
    ) {
    }

    /**
     * Valida el origen de la solicitud y establece las cabeceras HTTP.
     * Redirige al home del host si el acceso es directo desde el navegador.
     *
     * @return void
     */
    public function handle(): void
    {
        if (!$this->enabled) {
            $this->setHeaders('*');
            return;
        }

        $origin  = rtrim($_SERVER['HTTP_ORIGIN'] ?? '', '/');
        $referer = $_SERVER['HTTP_REFERER'] ?? '';
        $host    = $_SERVER['HTTP_HOST'] ?? '';

        // Redirección de seguridad para accesos manuales
        if (empty($origin) && empty($referer)) {
            $protocol = (!empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off') ? "https://" : "http://";
            header("Location: " . $protocol . $host . "/");
            exit;
        }

        $isAllowed = (!empty($origin) && in_array($origin, $this->allowedOrigins, true)) ||
                     (!empty($referer) && str_contains($referer, $host));

        if ($isAllowed) {
            $currentOrigin = !empty($origin) ? $origin : (
                ((!empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off') ? "https://" : "http://") . $host
            );
            $this->setHeaders($currentOrigin);

            if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
                http_response_code(204);
                exit;
            }
            return;
        }

        $this->denyAccess();
    }

    /**
     * Establece las cabeceras de respuesta para CORS.
     *
     * @param string $origin
     * @return void
     */
    private function setHeaders(string $origin): void
    {
        header("Access-Control-Allow-Origin: $origin");
        header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
        header('Access-Control-Allow-Headers: Content-Type, Authorization');
        header('Access-Control-Allow-Credentials: true');
    }

    /**
     * Finaliza la ejecución con un error 403.
     *
     * @return never
     */
    private function denyAccess(): never
    {
        http_response_code(403);
        header('Content-Type: application/json; charset=UTF-8');
        echo json_encode(['status' => 'error', 'data' => 'Origen no autorizado']);
        exit;
    }
}

/**
 * Class Router
 *
 * Enrutador minimalista basado en PATH_INFO.
 *
 * @package App
 */
class Router
{
    /** @var array Registros de rutas organizados por método HTTP */
    private array $routes = [];

    /**
     * Registra una ruta GET.
     *
     * @param string   $path
     * @param callable $callback
     * @return void
     */
    public function get(string $path, callable $callback): void
    {
        $this->routes['GET'][$this->normalize($path)] = $callback;
    }

    /**
     * Registra una ruta POST.
     *
     * @param string   $path
     * @param callable $callback
     * @return void
     */
    public function post(string $path, callable $callback): void
    {
        $this->routes['POST'][$this->normalize($path)] = $callback;
    }

    /**
     * Ejecuta la lógica de enrutamiento.
     *
     * @return void
     */
    public function dispatch(): void
    {
        $path   = $this->normalize($_SERVER['PATH_INFO'] ?? '/');
        $method = $_SERVER['REQUEST_METHOD'];

        if (!isset($this->routes[$method][$path])) {
            $this->respondJson(['status' => 'error', 'data' => "Ruta no encontrada"], 404);
        }

        $callback = $this->routes[$method][$path];

        if ($method === 'GET') {
            call_user_func($callback);
        } elseif ($method === 'POST') {
            $payload = json_decode(file_get_contents('php://input') ?: '', true);
            call_user_func($callback, is_array($payload) ? $payload : []);
        }
    }

    /**
     * Normaliza la cadena de la ruta.
     *
     * @param string $path
     * @return string
     */
    private function normalize(string $path): string
    {
        return '/' . trim($path, '/');
    }

    /**
     * Envía una respuesta JSON estandarizada.
     *
     * @param array $data
     * @param int   $code
     * @return never
     */
    public function respondJson(array $data, int $code = 200): never
    {
        http_response_code($code);
        header('Content-Type: application/json; charset=UTF-8');
        echo json_encode($data, JSON_UNESCAPED_UNICODE);
        exit;
    }
}

/**
 * Class GoogleSheetReader
 *
 * Se encarga de la extracción de datos desde Google Sheets API.
 *
 * @package App
 */
class GoogleSheetReader
{
    public function __construct(
        private string $spreadsheetId,
        private string $range,
        private string $credentialsPath,
        private string $autoloadPath
    ) {
    }

    /**
     * Obtiene el valor de la celda configurada.
     *
     * @return array Responde con status 'success' o 'error'.
     */
    public function getValue(): array
    {
        if (!file_exists($this->autoloadPath)) {
            return ['status' => 'error', 'data' => 'Dependencias no instaladas'];
        }

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

            return ['status' => 'error', 'data' => 'Celda de configuración vacía'];
        } catch (Exception $e) {
            return ['status' => 'error', 'data' => 'API Error: ' . $e->getMessage()];
        }
    }
}

/**
 * Class GoogleFormHandler
 *
 * Gestiona el envío de datos estructurados hacia Google Forms.
 *
 * @package App
 */
class GoogleFormHandler
{
    public function __construct(private string $formUrl)
    {
    }

    /**
     * Procesa y envía el payload recibido.
     *
     * @param array $payload Datos provenientes del simulador.
     * @return array Resultado de la operación.
     */
    public function handle(array $payload): array
    {
        $client = $payload['clientData'] ?? [];
        $sim    = $payload['simulationResults'] ?? [];

        $fields = [
            'entry.1573315993' => trim((string)($client['name'] ?? '')),
            'entry.1585523748' => ($client['contactType'] ?? '') === 'whatsapp' ? (string)($client['contact'] ?? '') : '',
            'entry.350349042'  => trim((string)($client['segmento'] ?? 'Hogar')),
            'entry.1526130880' => trim((string)($client['ciudad'] ?? '')),
            'entry.815677826'  => trim((string)($client['departamento'] ?? '')),
            'entry.467572294'  => (string)round((float)($sim['monthlySavings'] ?? 0)),
            'entry.2042215689' => (string)round((float)($sim['monthlyConsumption'] ?? 0)),
            'entry.1325827111' => (string)round((float)($sim['monthlyConsumption'] ?? 0)),
            'entry.1177548502' => 'Acepto el tratamiento de mis datos personales.',
            'emailAddress'     => ($client['contactType'] ?? '') === 'email' ? (string)($client['contact'] ?? '') : 'noreply@example.com',
        ];

        $ch = curl_init($this->formUrl);
        curl_setopt_array($ch, [
            CURLOPT_POST           => true,
            CURLOPT_POSTFIELDS     => http_build_query($fields),
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_TIMEOUT        => 10,
            CURLOPT_USERAGENT      => 'Adabtech-Simulator-Proxy/1.2',
        ]);

        curl_exec($ch);
        $code = (int)curl_getinfo($ch, CURLINFO_HTTP_CODE);

        $isOk = ($code >= 200 && $code < 400);

        return [
            'status' => $isOk ? 'success' : 'error',
            'data'   => $isOk ? 'Datos enviados correctamente' : 'Error en la recepción de Google Forms'
        ];
    }
}

/* --- ORQUESTACIÓN DE LA APLICACIÓN --- */

// 1. Ejecución del Middleware de seguridad
$middleware = new CorsMiddleware($config['enable_cors'], $config['allowed_origins']);
$middleware->handle();

// 2. Inicialización del Enrutador
$router = new Router();

/**
 * Ruta de lectura (GET)
 * Se accede vía script.php o script.php/
 */
$router->get('/', static function () use ($config, $router): void {
    $reader = new GoogleSheetReader(
        $config['spreadsheet_id'],
        $config['range'],
        $config['credentials_path'],
        $config['autoload_path']
    );
    $router->respondJson($reader->getValue());
});

/**
 * Ruta de envío (POST)
 * Se accede vía script.php o script.php/
 */
$router->post('/', static function (array $payload) use ($config, $router): void {
    $handler = new GoogleFormHandler($config['google_form_url']);
    $router->respondJson($handler->handle($payload));
});

// 3. Lanzamiento
$router->dispatch();