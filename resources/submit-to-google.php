<?php

declare(strict_types=1);

namespace App;

date_default_timezone_set('America/Bogota');

/**
 * =========================================================
 * CONFIGURACIÓN
 * =========================================================
 */
$config = [
    'enable_cors' => true,
    'allowed_origins' => ['https://adabtech-dev.isora.com.co'],
];

/**
 * Class CorsMiddleware
 *
 * Gestiona la protección CORS y permite habilitar o deshabilitar según configuración.
 */
class CorsMiddleware
{
    /**
     * @param array<string> $allowedOrigins Lista de dominios permitidos
     */
    public function __construct(private array $allowedOrigins)
    {
    }

    /**
     * Maneja las cabeceras CORS.
     * Redirige a / si el origen no está permitido.
     *
     * @return void
     */
    public function handle(): void
    {
        $origin = $_SERVER['HTTP_ORIGIN'] ?? '';

        if ($origin && !in_array($origin, $this->allowedOrigins, true)) {
            $this->redirectHome();
        }

        if ($origin) {
            header("Access-Control-Allow-Origin: $origin");
        }

        header('Access-Control-Allow-Methods: POST, OPTIONS');
        header('Access-Control-Allow-Headers: Content-Type');

        if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
            http_response_code(204);
            exit;
        }
    }

    /**
     * Redirige al home del dominio.
     *
     * @return never
     */
    private function redirectHome(): never
    {
        header('Location: /', true, 302);
        exit;
    }
}

/**
 * Class Router
 *
 * Permite definir rutas POST y despachar la solicitud al callback correspondiente.
 */
class Router
{
    /**
     * @var array<string, array<string, callable>>
     */
    private array $routes = [];

    /**
     * Define una ruta POST.
     *
     * @param string   $path     Ruta relativa
     * @param callable $callback Callback que recibe el payload
     *
     * @return void
     */
    public function post(string $path, callable $callback): void
    {
        $this->routes[$path]['POST'] = $callback;
    }

    /**
     * Despacha la ruta según REQUEST_METHOD y URI.
     * Redirige a / si la ruta no existe o el método no coincide.
     *
     * @return void
     */
    public function dispatch(): void
    {
        $uri = '/';
        $method = $_SERVER['REQUEST_METHOD'];

        if (!isset($this->routes[$uri][$method])) {
            $this->redirectHome();
        }

        $payload = json_decode(file_get_contents('php://input') ?: '', true);

        if (!is_array($payload)) {
            $this->redirectHome();
        }

        call_user_func($this->routes[$uri][$method], $payload);
    }

    /**
     * Redirige al home del dominio.
     *
     * @return never
     */
    private function redirectHome(): never
    {
        header('Location: /', true, 302);
        exit;
    }
}

/**
 * Class GoogleFormHandler
 *
 * Procesa un payload, sanitiza los datos y los envía a un formulario de Google Forms.
 */
class GoogleFormHandler
{
    /**
     * URL del formulario.
     *
     * @var string
     */
    private string $formUrl;

    /**
     * Constructor.
     *
     * @param string $formUrl URL del formulario de Google Forms
     */
    public function __construct(string $formUrl)
    {
        $this->formUrl = $formUrl;
    }

    /**
     * Procesa el payload JSON y envía los datos al formulario.
     *
     * @param array<string, mixed> $payload Datos recibidos del router
     *
     * @return void
     */
    public function process(array $payload): void
    {
        $this->cleanOutput();

        if (empty($payload)) {
            $this->redirectHome();
        }

        $fields = $this->mapFields($payload);

        if (!$this->sendToGoogleForms($fields)) {
            $this->redirectHome();
        }

        $this->respondSuccess();
    }

    /**
     * Limpia cualquier buffer de salida.
     *
     * @return void
     */
    private function cleanOutput(): void
    {
        if (ob_get_length()) {
            ob_clean();
        }
    }

    /**
     * Sanitiza un valor de texto para prevenir XSS.
     *
     * @param string $value
     *
     * @return string
     */
    private function sanitize(string $value): string
    {
        return htmlspecialchars(trim($value), ENT_QUOTES, 'UTF-8');
    }

    /**
     * Mapea los datos del payload a los campos de Google Forms.
     *
     * @param array<string, mixed> $payload
     *
     * @return array<string, string>
     */
    private function mapFields(array $payload): array
    {
        $client = $payload['clientData'] ?? [];
        $simulation = $payload['simulationResults'] ?? [];

        $contactType = (string) ($client['contactType'] ?? '');
        $contact = (string) ($client['contact'] ?? '');

        return [
            'entry.1573315993' => $this->sanitize((string) ($client['name'] ?? '')),
            'entry.1585523748' => $contactType === 'whatsapp' ? $this->sanitize($contact) : '',
            'entry.350349042' => $this->sanitize((string) ($client['segmento'] ?? 'Hogar')),
            'entry.1526130880' => $this->sanitize((string) ($client['ciudad'] ?? '')),
            'entry.815677826' => $this->sanitize((string) ($client['departamento'] ?? '')),
            'entry.467572294' => (string) round((float) ($simulation['monthlySavings'] ?? 0)),
            'entry.2042215689' => (string) round((float) ($simulation['monthlyConsumption'] ?? 0)),
            'entry.1325827111' => (string) round((float) ($simulation['monthlyConsumption'] ?? 0)),
            'entry.1177548502' => 'Acepto el tratamiento de mis datos personales.',
            'emailAddress' => ($contactType === 'email' && filter_var($contact, FILTER_VALIDATE_EMAIL))
                ? $contact
                : 'noreply@example.com',
        ];
    }

    /**
     * Envía los campos a Google Forms mediante cURL.
     *
     * @param array<string, string> $fields
     *
     * @return bool
     */
    private function sendToGoogleForms(array $fields): bool
    {
        $ch = curl_init($this->formUrl);

        curl_setopt_array(
            $ch,
            [
                CURLOPT_POST => true,
                CURLOPT_POSTFIELDS => http_build_query($fields),
                CURLOPT_RETURNTRANSFER => true,
                CURLOPT_FOLLOWLOCATION => true,
                CURLOPT_TIMEOUT => 5,
                CURLOPT_USERAGENT => 'Mozilla/5.0',
            ]
        );

        curl_exec($ch);
        $code = (int) curl_getinfo($ch, CURLINFO_HTTP_CODE);
        $error = curl_error($ch);
        curl_close($ch);

        return !$error && $code >= 200 && $code < 400;
    }

    /**
     * Envía respuesta JSON de éxito.
     *
     * @return never
     */
    private function respondSuccess(): never
    {
        header('Content-Type: application/json; charset=UTF-8');
        echo json_encode(
            [
                'status' => 'success',
                'message' => 'Procesado correctamente',
                'id' => uniqid('', true),
            ]
        );
        exit;
    }

    /**
     * Redirige al home del dominio.
     *
     * @return never
     */
    private function redirectHome(): never
    {
        header('Location: /', true, 302);
        exit;
    }
}

/* ===================== INICIALIZACIÓN ===================== */

if ($config['enable_cors']) {
    (new CorsMiddleware($config['allowed_origins']))->handle();
}

$router = new Router();

/**
 * POST "/" - Envía el payload a GoogleFormHandler
 */
$router->post(
    '/',
    static function (array $payload) {
        $handler = new GoogleFormHandler(
            'https://docs.google.com/forms/d/e/1FAIpQLSfUS3iaygaxc1AzPAPOndYpA-qYARgvylTm8kQKj7dCupxWgA/formResponse'
        );
        $handler->process($payload);
    }
);

// Despachar la ruta
$router->dispatch();