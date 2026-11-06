<?php
use PHPMailer\PHPMailer\PHPMailer;

require __DIR__ . '/phpmailer/src/Exception.php';
require __DIR__ . '/phpmailer/src/PHPMailer.php';
require __DIR__ . '/phpmailer/src/SMTP.php';

// config.php vive un nivel arriba de public_html (no accesible desde la web)
$c = require __DIR__ . '/../../config.php';

header('Content-Type: application/json; charset=utf-8');

// CORS: solo hace falta cuando el front corre en otro origen (localhost en desarrollo)
$origen = $_SERVER['HTTP_ORIGIN'] ?? '';
if ($origen && in_array($origen, $c['origenes_permitidos'], true)) {
   header("Access-Control-Allow-Origin: $origen");
   header('Access-Control-Allow-Methods: POST, OPTIONS');
   header('Access-Control-Allow-Headers: Content-Type');
   header('Vary: Origin');
}
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') { http_response_code(204); exit; }

function responder(int $codigo, bool $ok): void {
   http_response_code($codigo);
   echo json_encode(['ok' => $ok]);
   exit;
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') responder(405, false);

// Rate limit: 5 envíos cada 15 minutos por IP
function limitar(string $ip, int $max = 5, int $ventana = 900): bool {
   $archivo = sys_get_temp_dir() . '/contacto_' . md5($ip) . '.json';
   $ahora = time();
   $hits = is_file($archivo) ? (json_decode(file_get_contents($archivo), true) ?: []) : [];
   $hits = array_values(array_filter($hits, fn($t) => $t > $ahora - $ventana));
   if (count($hits) >= $max) return false;
   $hits[] = $ahora;
   file_put_contents($archivo, json_encode($hits), LOCK_EX);
   return true;
}
if (!limitar($_SERVER['REMOTE_ADDR'] ?? '0')) responder(429, false);

// Lectura del JSON enviado por el formulario
$raw = file_get_contents('php://input');
if (strlen($raw) > 10240) responder(400, false);
$d = json_decode($raw, true);
if (!is_array($d)) responder(400, false);

// Honeypot: los bots completan este campo oculto
if (!empty($d['web'])) responder(200, true);

// Sin saltos de línea en campos que van a cabeceras (evita inyección de headers)
$limpio = fn($v) => is_string($v) ? trim(preg_replace('/[\r\n]+/', ' ', $v)) : '';
$nombre   = $limpio($d['nombre'] ?? '');
$email    = $limpio($d['email'] ?? '');
$telefono = $limpio($d['telefono'] ?? '');
$motivo   = $limpio($d['motivo'] ?? '');
$mensaje  = is_string($d['mensaje'] ?? null) ? trim($d['mensaje']) : '';

$motivos = ['Consulta general', 'Cotización', 'Reserva existente', 'Otro'];
if (
   $nombre === '' || mb_strlen($nombre) > 100 ||
   $mensaje === '' || mb_strlen($mensaje) > 3000 ||
   !filter_var($email, FILTER_VALIDATE_EMAIL) || strlen($email) > 150 ||
   strlen($telefono) > 40 ||
   !in_array($motivo, $motivos, true)
) responder(400, false);

function crearMailer(array $c): PHPMailer {
   $m = new PHPMailer(true);
   $m->isSMTP();
   $m->Host = $c['smtp_host'];
   $m->SMTPAuth = true;
   $m->Username = $c['smtp_user'];
   $m->Password = $c['smtp_pass'];
   $m->SMTPSecure = PHPMailer::ENCRYPTION_SMTPS;
   $m->Port = 465;
   $m->CharSet = 'UTF-8';
   return $m;
}

// 1) Aviso interno a la casilla de la empresa
try {
   $m = crearMailer($c);
   $m->setFrom($c['smtp_user'], 'Web ' . $c['empresa']);
   $m->addAddress($c['smtp_user']);
   $m->addReplyTo($email, $nombre); // al responder, le contestás al cliente
   $m->Subject = "Consulta web: $motivo - $nombre";
   $m->Body = "Nombre: $nombre\n" .
              "Email: $email\n" .
              'Teléfono: ' . ($telefono ?: '-') . "\n" .
              "Motivo: $motivo\n\n" .
              $mensaje;
   $m->send();
} catch (Throwable $e) {
   error_log('Aviso interno: ' . $e->getMessage());
   responder(500, false);
}

// 2) Respuesta automática al cliente.
// Si falla, igual respondemos ok: la consulta ya llegó a la empresa.
try {
   $h = fn($s) => htmlspecialchars($s, ENT_QUOTES, 'UTF-8');
   $m = crearMailer($c);
   $m->setFrom($c['smtp_user'], $c['empresa']);
   $m->addAddress($email, $nombre);
   $m->addReplyTo($c['smtp_user']);
   $m->addCustomHeader('Auto-Submitted', 'auto-replied');
   $m->isHTML(true);
   $m->Subject = 'Recibimos tu consulta - ' . $c['empresa'];
   $m->Body =
      '<div style="font-family:Arial,sans-serif;max-width:480px;line-height:1.5;color:#222">' .
      '<p>Hola <strong>' . $h($nombre) . '</strong>!</p>' .
      '<p>Recibimos tu consulta (<em>' . $h($motivo) . '</em>) y te vamos a responder en ' . $h($c['tiempo_respuesta']) . '.</p>' .
      '<p style="color:#666;font-size:13px">Este es un mensaje automático, no hace falta que lo respondas.</p>' .
      '<p>Saludos,<br>' . $h($c['empresa']) . '</p>' .
      '</div>';
   $m->AltBody = "Hola $nombre!\n\n" .
                 "Recibimos tu consulta ($motivo) y te vamos a responder en no más de {$c['tiempo_respuesta']}.\n\n" .
                 "Este es un mensaje automático, no hace falta que lo respondas.\n\n" .
                 "Gracias por comunicarte con nosotros, Saludos\n{$c['empresa']}";
   $m->send();
} catch (Throwable $e) {
   error_log('Respuesta automática: ' . $e->getMessage());
}

responder(200, true);