<?php
// Подключение к базе данных
$pdo = new PDO('mysql:host=localhost;dbname=quotes_db', 'username', 'password');

// Получаем данные POST-запроса
$data = json_decode(file_get_contents('php://input'), true);

// Сохраняем статистику
$stmt = $pdo->prepare("
  INSERT INTO statistics (average, deviation, mode, min, max, total_quotes, timestamp)
  VALUES (:average, :deviation, :mode, :min, :max, :total_quotes, :timestamp)
");
$stmt->execute([
    ':average' => $data['average'],
    ':deviation' => $data['deviation'],
    ':mode' => $data['mode'],
    ':min' => $data['min'],
    ':max' => $data['max'],
    ':total_quotes' => $data['totalQuotes'],
    ':timestamp' => $data['timestamp']
]);

echo json_encode(['status' => 'success']);
?>
