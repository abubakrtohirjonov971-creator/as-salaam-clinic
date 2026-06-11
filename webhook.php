<?php
// ============================================================
//   AS-SALAAM CLINIC — Telegram Bot Webhook (PHP 7.4 versiya)
// ============================================================

define('BOT_TOKEN', '8121379847:AAHKoY9Nj1HzPSOx4hIbV1CF6kYhnY91WSU');
define('CHAT_ID',   '8054469979');

// ---- Barcha kelgan ma'lumotni log ga yozish ----
$log_file = __DIR__ . '/debug_log.txt';
$raw = file_get_contents('php://input');

if (function_exists('getallheaders')) {
    $headers_all = getallheaders();
} else {
    $headers_all = [];
}

file_put_contents($log_file,
    "\n\n========== " . date('d.m.Y H:i:s') . " ==========\n" .
    "HEADERS:\n" . print_r($headers_all, true) . "\n" .
    "BODY:\n" . $raw . "\n",
    FILE_APPEND
);

// ---- Secret key tekshiruvsiz ishlash ----
$payload = json_decode($raw, true);

// Agar payload bo'sh bo'lsa, test xabari yuboramiz
if (!$payload || empty($payload)) {
    send_telegram("⚠️ Webhook chaqirildi lekin payload bo'sh!\n\nHeaders: " . json_encode($headers_all, JSON_UNESCAPED_UNICODE));
    http_response_code(200);
    echo 'OK - empty payload';
    exit;
}

$table  = isset($payload['table']) ? $payload['table'] : (isset($payload['schema']) ? $payload['schema'] : 'noma\'lum');
$type   = isset($payload['type']) ? $payload['type'] : 'noma\'lum';
$record = isset($payload['record']) ? $payload['record'] : [];
$old    = isset($payload['old_record']) ? $payload['old_record'] : [];

$action_emoji = 'ℹ️';
$action_uz = "O'zgarish";

switch ($type) {
    case 'INSERT':
        $action_emoji = '🆕';
        $action_uz = "Yangi qo'shildi";
        break;
    case 'UPDATE':
        $action_emoji = '✏️';
        $action_uz = 'Tahrirlandi';
        break;
    case 'DELETE':
        $action_emoji = '🗑️';
        $action_uz = "O'chirildi";
        break;
}

$message = '';

switch ($table) {

    case 'bookings':
        $name   = isset($record['name']) ? $record['name'] : (isset($old['name']) ? $old['name'] : '—');
        $rawphone  = isset($record['phone']) ? $record['phone'] : (isset($old['phone']) ? $old['phone'] : '—');
        // Clean hidden Telegram chat ID from phone field
        $phone = strpos($rawphone, '|tg:') !== false ? explode('|tg:', $rawphone)[0] : $rawphone;
        $tg_source = strpos($rawphone, '|tg:') !== false ? ' 🤖 Telegram Mini App orqali' : '';
        $date   = isset($record['date']) ? $record['date'] : (isset($old['date']) ? $old['date'] : '—');
        $time   = isset($record['time']) ? $record['time'] : (isset($old['time']) ? $old['time'] : '—');
        $doctor = isset($record['doctor']) ? $record['doctor'] : (isset($old['doctor']) ? $old['doctor'] : '—');
        $room   = isset($record['room']) ? $record['room'] : (isset($old['room']) ? $old['room'] : '—');
        $status = isset($record['status']) ? $record['status'] : (isset($old['status']) ? $old['status'] : '—');

        $message = "🏥 <b>AS-SALAAM CLINIC</b>\n";
        $message .= "━━━━━━━━━━━━━━━━━━\n";
        $message .= "$action_emoji <b>BRON: " . mb_strtoupper($action_uz) . "</b>\n\n";
        $message .= "👤 <b>Bemor:</b>  <code>$name</code>\n";
        $message .= "📞 <b>Aloqa:</b>  <code>$phone</code>$tg_source\n";
        $message .= "📅 <b>Sana:</b>    <code>$date</code>\n";
        $message .= "⏰ <b>Vaqt:</b>    <code>$time</code>\n";
        $message .= "🩺 <b>Shifokor:</b> <code>$doctor</code>\n";
        $message .= "🚪 <b>Xona:</b>    <code>$room</code>\n";
        $message .= "📊 <b>Status:</b>  <code>$status</code>\n";

        if ($type === 'UPDATE' && !empty($old)) {
            $changes = [];
            foreach (['status', 'date', 'time', 'doctor', 'room'] as $f) {
                if (isset($record[$f]) && isset($old[$f]) && $record[$f] !== $old[$f]) {
                    $changes[] = "  • <i>$f:</i> <s>{$old[$f]}</s> ➔ <b>{$record[$f]}</b>";
                }
            }
            if (!empty($changes)) {
                $message .= "\n🔄 <b>O'zgarishlar:</b>\n" . implode("\n", $changes);
            }
        }
        break;

    case 'patients':
        $name    = isset($record['name']) ? $record['name'] : (isset($old['name']) ? $old['name'] : '—');
        $phone   = isset($record['phone']) ? $record['phone'] : (isset($old['phone']) ? $old['phone'] : '—');
        $age     = isset($record['age']) ? $record['age'] : (isset($old['age']) ? $old['age'] : '—');
        $gender  = isset($record['gender']) ? $record['gender'] : (isset($old['gender']) ? $old['gender'] : '—');
        $disease = isset($record['disease']) ? $record['disease'] : (isset($old['disease']) ? $old['disease'] : '—');
        $status  = isset($record['status']) ? $record['status'] : (isset($old['status']) ? $old['status'] : '—');

        $message = "🏥 <b>AS-SALAAM CLINIC</b>\n";
        $message .= "━━━━━━━━━━━━━━━━━━\n";
        $message .= "$action_emoji <b>BEMOR: " . mb_strtoupper($action_uz) . "</b>\n\n";
        $message .= "👤 <b>Ism:</b>      <code>$name</code>\n";
        $message .= "📞 <b>Telefon:</b>  <code>$phone</code>\n";
        $message .= "🎂 <b>Yoshi:</b>    <code>$age</code> yosh\n";
        $message .= "⚧ <b>Jinsi:</b>    <code>$gender</code>\n";
        $message .= "🤒 <b>Tashxis:</b>  <code>$disease</code>\n";
        $message .= "📊 <b>Status:</b>   <code>$status</code>\n";
        break;

    case 'rooms':
        $number   = isset($record['number']) ? $record['number'] : (isset($old['number']) ? $old['number'] : '—');
        $type_r   = isset($record['type']) ? $record['type'] : (isset($old['type']) ? $old['type'] : '—');
        $floor    = isset($record['floor']) ? $record['floor'] : (isset($old['floor']) ? $old['floor'] : '—');
        $capacity = isset($record['capacity']) ? $record['capacity'] : (isset($old['capacity']) ? $old['capacity'] : '—');
        $status   = isset($record['status']) ? $record['status'] : (isset($old['status']) ? $old['status'] : '—');
        $price    = isset($record['price']) ? $record['price'] : (isset($old['price']) ? $old['price'] : '—');

        $message = "🏥 <b>AS-SALAAM CLINIC</b>\n";
        $message .= "━━━━━━━━━━━━━━━━━━\n";
        $message .= "$action_emoji <b>XONA: " . mb_strtoupper($action_uz) . "</b>\n\n";
        $message .= "🚪 <b>Xona №:</b>   <code>$number</code>\n";
        $message .= "🏷️ <b>Turi:</b>     <code>$type_r</code>\n";
        $message .= "🏢 <b>Qavat:</b>    <code>$floor</code>\n";
        $message .= "👥 <b>Sig'imi:</b>  <code>$capacity</code> kishi\n";
        $message .= "💰 <b>Narxi:</b>    <code>$price</code> so'm\n";
        $message .= "📊 <b>Status:</b>   <code>$status</code>\n";
        break;

    case 'doctors':
        $name       = isset($record['name']) ? $record['name'] : (isset($old['name']) ? $old['name'] : '—');
        $specialty  = isset($record['specialty']) ? $record['specialty'] : (isset($old['specialty']) ? $old['specialty'] : '—');
        $experience = isset($record['experience']) ? $record['experience'] : (isset($old['experience']) ? $old['experience'] : '—');
        $phone      = isset($record['phone']) ? $record['phone'] : (isset($old['phone']) ? $old['phone'] : '—');

        $message = "🏥 <b>AS-SALAAM CLINIC</b>\n";
        $message .= "━━━━━━━━━━━━━━━━━━\n";
        $message .= "$action_emoji <b>SHIFOKOR: " . mb_strtoupper($action_uz) . "</b>\n\n";
        $message .= "👨‍⚕️ <b>Ism:</b>       <code>$name</code>\n";
        $message .= "🩺 <b>Soha:</b>      <code>$specialty</code>\n";
        $message .= "⭐ <b>Tajriba:</b>   <code>$experience</code> yil\n";
        $message .= "📞 <b>Telefon:</b>   <code>$phone</code>\n";
        break;

    default:
        $message = "🏥 <b>AS-SALAAM CLINIC</b>\n";
        $message .= "━━━━━━━━━━━━━━━━━━\n";
        $message .= "$action_emoji <b>" . strtoupper($table) . " — $action_uz</b>\n\n";
        $message .= "<pre>" . json_encode($record ?: $old, JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT) . "</pre>";
        break;
}

$message .= "\n\n🕐 " . date('d.m.Y H:i', time() + 5 * 3600) . " (UTC+5)";
$message .= "\n🏥 <i>As-salaam Clinic</i>";

send_telegram($message);

http_response_code(200);
echo 'OK';

// ================================================================
function send_telegram($text)
{
    $url  = 'https://api.telegram.org/bot' . BOT_TOKEN . '/sendMessage';
    $data = [
        'chat_id'                  => CHAT_ID,
        'text'                     => $text,
        'parse_mode'               => 'HTML',
        'disable_web_page_preview' => true,
    ];

    $ch = curl_init($url);
    curl_setopt_array($ch, [
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_POST           => true,
        CURLOPT_POSTFIELDS     => http_build_query($data),
        CURLOPT_TIMEOUT        => 15,
        CURLOPT_SSL_VERIFYPEER => false,
    ]);
    $response = curl_exec($ch);
    $err = curl_error($ch);
    curl_close($ch);

    // Log
    file_put_contents(__DIR__ . '/debug_log.txt',
        "TG Response: $response\nCURL Error: $err\n",
        FILE_APPEND
    );
}
