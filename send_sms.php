<?php
// ============================================================
//   AS-SALAAM CLINIC — Eskiz.uz SMS Yuborish API
// ============================================================
header('Content-Type: application/json');
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit;
}

$raw = file_get_contents('php://input');
$payload = json_decode($raw, true);

if (!$payload || !isset($payload['phone']) || !isset($payload['email']) || !isset($payload['password'])) {
    http_response_code(400);
    echo json_encode(['error' => 'Missing required fields (phone, email, password)']);
    exit;
}

$phone = $payload['phone'];
$message = isset($payload['message']) ? $payload['message'] : 'Bu Eskiz dan test';
$email = $payload['email'];
$password = $payload['password'];

// 1. Get Token from Eskiz.uz
$token_url = 'https://notify.eskiz.uz/api/auth/login';
$token_data = [
    'email' => $email,
    'password' => $password
];

$ch = curl_init($token_url);
curl_setopt_array($ch, [
    CURLOPT_RETURNTRANSFER => true,
    CURLOPT_POST           => true,
    CURLOPT_POSTFIELDS     => http_build_query($token_data),
    CURLOPT_SSL_VERIFYPEER => false,
]);
$token_response_str = curl_exec($ch);
$token_response = json_decode($token_response_str, true);
curl_close($ch);

if (!$token_response || !isset($token_response['data']['token'])) {
    http_response_code(401);
    echo json_encode([
        'error' => 'Failed to get token from Eskiz.uz. Check email and password.',
        'details' => $token_response
    ]);
    exit;
}

$token = $token_response['data']['token'];

// Format phone number to 998901234567 format (numbers only)
$clean_phone = preg_replace('/[^0-9]/', '', $phone);
// Ensure it starts with 998 and is 12 digits long
if (strlen($clean_phone) == 9) {
    $clean_phone = '998' . $clean_phone;
}

// 2. Send SMS
$sms_url = 'https://notify.eskiz.uz/api/message/sms/send';
$sms_data = [
    'mobile_phone' => $clean_phone,
    'message' => $message,
    'from' => '4546', // Test or default sender
];

$ch = curl_init($sms_url);
curl_setopt_array($ch, [
    CURLOPT_RETURNTRANSFER => true,
    CURLOPT_POST           => true,
    CURLOPT_POSTFIELDS     => http_build_query($sms_data),
    CURLOPT_HTTPHEADER     => [
        'Authorization: Bearer ' . $token
    ],
    CURLOPT_SSL_VERIFYPEER => false,
]);

$sms_response_str = curl_exec($ch);
$sms_response = json_decode($sms_response_str, true);
$err = curl_error($ch);
curl_close($ch);

if ($err) {
    http_response_code(500);
    echo json_encode(['error' => 'Curl error during SMS send', 'details' => $err]);
    exit;
}

echo json_encode([
    'success' => true,
    'eskiz_response' => $sms_response,
    'sent_to' => $clean_phone,
    'message' => $message
]);
