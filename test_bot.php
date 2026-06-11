<?php
// ========================================
// AS-SALAAM CLINIC — TEST FAYLI
// Bu fayl faqat test uchun, keyin o'chirish kerak
// ========================================

define('BOT_TOKEN', '8121379847:AAHKoY9Nj1HzPSOx4hIbV1CF6kYhnY91WSU');
define('CHAT_ID',   '8054469979');

$url = 'https://api.telegram.org/bot' . BOT_TOKEN . '/sendMessage';
$data = [
    'chat_id'    => CHAT_ID,
    'text'       => '✅ TEST MUVAFFAQIYATLI! As-salaam Clinic boti ishlayapdi! 🏥',
    'parse_mode' => 'HTML',
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
$curl_error = curl_error($ch);
$http_code = curl_getinfo($ch, CURLINFO_HTTP_CODE);
curl_close($ch);

$result = json_decode($response, true);

echo "<h2>TEST NATIJASI:</h2>";
echo "<b>HTTP Status:</b> $http_code <br>";
echo "<b>CURL Error:</b> " . ($curl_error ?: 'Yo\'q') . "<br>";
echo "<b>Telegram Javobi:</b><br><pre>" . print_r($result, true) . "</pre>";

if (isset($result['ok']) && $result['ok'] === true) {
    echo "<h3 style='color:green'>✅ BOT ISHLAYAPDI! Telegramni tekshiring.</h3>";
} else {
    echo "<h3 style='color:red'>❌ XATOLIK! Yuqoridagi ma'lumotlarni tekshiring.</h3>";
    echo "<b>Xato:</b> " . ($result['description'] ?? 'Noma\'lum xato');
}
