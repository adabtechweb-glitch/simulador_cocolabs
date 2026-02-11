<?php

/**
 * 
 * @author    Coco Labs S.A.S.
 * @version   1.0.0
 * @year      2026
*/

/**
 * =========================================================
 * ENDPOINT DE ENVÍO A GOOGLE FORMS
 * =========================================================
 *
 * Este script implementa un endpoint HTTP en PHP (8.1+) encargado
 * de recibir datos en formato JSON mediante una solicitud POST,
 * validarlos, sanitizarlos y enviarlos a un formulario de Google Forms
 * utilizando una petición cURL.
 *
 * -------------------------
 * CONFIGURACIÓN INICIAL
 * -------------------------
 * - Se habilita la revisión estricta de tipos (strict_types=1).
 * - Se define la zona horaria a America/Bogota.
 * - El script está diseñado para ejecutarse como endpoint público,
 *   pero cualquier acceso no autorizado es redirigido al home (/).
 *
 * -------------------------
 * FLUJO DE EJECUCIÓN
 * -------------------------
 * 1. Se instancia la clase GoogleFormHandler con la URL del formulario
 *    de Google Forms.
 *
 * 2. Se ejecuta el método handleRequest(), que coordina todo el flujo:
 *
 *    a) Limpia cualquier buffer de salida previo para evitar
 *       respuestas corruptas.
 *
 *    b) Valida que la solicitud sea:
 *       - Método POST
 *       - Content-Type application/json
 *       Si la validación falla, se redirige inmediatamente al home.
 *
 *    c) Lee el cuerpo de la solicitud (php://input) y decodifica
 *       el payload JSON. Si el JSON es inválido, se redirige al home.
 *
 *    d) Mapea los datos del payload a los campos esperados por
 *       Google Forms:
 *       - Se extraen datos del cliente y resultados de simulación.
 *       - Se sanitizan los valores de texto para evitar XSS.
 *       - Se validan condiciones específicas (tipo de contacto,
 *         correo electrónico válido, valores por defecto).
 *
 *    e) Se envían los datos a Google Forms mediante una petición
 *       cURL POST:
 *       - Se construye la query con http_build_query().
 *       - Se valida el código HTTP de respuesta (2xx–3xx).
 *       - Si ocurre un error o el código no es válido, se redirige
 *         al home.
 *
 *    f) Si todo el proceso es exitoso, se devuelve una respuesta
 *       JSON con estado "success", un mensaje y un identificador único.
 *
 * -------------------------
 * SEGURIDAD Y DISEÑO
 * -------------------------
 * - No se exponen mensajes de error internos al cliente.
 * - Cualquier flujo inesperado termina en redirección.
 * - Se evita salida parcial o contenido no deseado.
 * - El cierre de recursos cURL se gestiona automáticamente por PHP.
 *
 * -------------------------
 * RESPUESTA FINAL
 * -------------------------
 * - Content-Type: application/json
 * - Estructura:
 *   {
 *     status: "success",
 *     message: "Procesado correctamente",
 *     id: string único
 *   }
 *
 * =========================================================
*/


/**
 * Habilitar la revisión estricta de tipos.
 */
declare(strict_types=1);

/**
 * Ajustar zona horaria
*/
date_default_timezone_set('America/Bogota');

/**
 * Endpoint para envío de datos a Google Forms.
 *
 * Cualquier acceso no autorizado redirige al home del dominio.
 *
 * PHP version 8.1+
 */

/**
 * Class GoogleFormHandler
 *
 * Maneja el procesamiento de payload JSON, validación, sanitización
 * y envío a Google Forms.
 */
class GoogleFormHandler
{
    /**
     * URL del formulario de Google Forms
     *
     * @var string
     */
    private string $formUrl;

    /**
     * Constructor
     *
     * @param string $formUrl URL del formulario Google Forms
     */
    public function __construct(string $formUrl)
    {
        $this->formUrl = $formUrl;
    }

    /**
     * Ejecuta el flujo principal del endpoint
     *
     * @return void
     */
    public function handleRequest(): void
    {
        $this->cleanOutput();

        if (!$this->isValidRequest()) {
            $this->redirectHome();
        }

        $payload = $this->getJsonPayload();

        $fields = $this->mapFields($payload);

        if (!$this->sendToGoogleForms($fields)) {
            $this->redirectHome();
        }

        $this->respondSuccess();
    }

    /**
     * Limpia cualquier buffer de salida previo
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
     * Valida si la solicitud es POST con JSON
     *
     * @return bool
     */
    private function isValidRequest(): bool
    {
        if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
            return false;
        }

        $contentType = $_SERVER['CONTENT_TYPE'] ?? '';
        return stripos($contentType, 'application/json') !== false;
    }

    /**
     * Redirige al home y termina ejecución
     *
     * @return never
     */
    private function redirectHome(): never
    {
        header('Location: /', true, 302);
        exit;
    }

    /**
     * Obtiene y decodifica el payload JSON
     *
     * @return array<string, mixed>
     */
    private function getJsonPayload(): array
    {
        $raw = file_get_contents('php://input');
        $payload = json_decode($raw, true);

        if (!is_array($payload)) {
            $this->redirectHome();
        }

        return $payload;
    }

    /**
     * Sanitiza un valor de texto
     *
     * @param string $value
     * @return string
     */
    private function sanitize(string $value): string
    {
        return htmlspecialchars(trim($value), ENT_QUOTES, 'UTF-8');
    }

    /**
     * Mapea los datos del payload a los campos de Google Forms
     *
     * @param array<string, mixed> $payload
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
            'entry.350349042'  => $this->sanitize((string) ($client['segmento'] ?? 'Hogar')),
            'entry.1526130880' => $this->sanitize((string) ($client['ciudad'] ?? '')),
            'entry.815677826'  => $this->sanitize((string) ($client['departamento'] ?? '')),
            'entry.467572294'  => (string) round((float) ($simulation['monthlySavings'] ?? 0)),
            'entry.2042215689' => (string) round((float) ($simulation['monthlyConsumption'] ?? 0)),
            'entry.1325827111' => (string) round((float) ($simulation['monthlyConsumption'] ?? 0)),
            'entry.1177548502' => 'Acepto el tratamiento de mis datos personales.',
            'emailAddress'     => ($contactType === 'email' && filter_var($contact, FILTER_VALIDATE_EMAIL))
                ? $contact
                : 'noreply@example.com',
        ];
    }

    /**
     * Envía los campos a Google Forms mediante cURL
     *
     * @param array<string, string> $fields
     * @return bool Devuelve true si el envío fue exitoso
     */
    private function sendToGoogleForms(array $fields): bool
    {
        $ch = curl_init($this->formUrl);

        curl_setopt_array($ch, [
            CURLOPT_POST           => true,
            CURLOPT_POSTFIELDS     => http_build_query($fields),
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_FOLLOWLOCATION => true,
            CURLOPT_TIMEOUT        => 5,
            CURLOPT_USERAGENT      => 'Mozilla/5.0',
        ]);

        curl_exec($ch);

        $httpCode = (int) curl_getinfo($ch, CURLINFO_HTTP_CODE);
        $error = curl_error($ch);

        return !$error && $httpCode >= 200 && $httpCode < 400;
    }

    /**
     * Envía la respuesta JSON de éxito
     *
     * @return void
     */
    private function respondSuccess(): void
    {
        header('Content-Type: application/json; charset=UTF-8');

        echo json_encode([
            'status'  => 'success',
            'message' => 'Procesado correctamente',
            'id'      => uniqid('', true),
        ]);

        exit;
    }
}

/* =========================================================
 | EJECUCIÓN
 ========================================================= */

$formUrl = 'https://docs.google.com/forms/d/e/1FAIpQLSfUS3iaygaxc1AzPAPOndYpA-qYARgvylTm8kQKj7dCupxWgA/formResponse';

$handler = new GoogleFormHandler($formUrl);
$handler->handleRequest();
