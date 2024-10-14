<?php
$pdo = new PDO('mysql:host=localhost;dbname=quotes_db', 'username', 'password');

$data = json_decode(file_get_contents('php://input'), true);

if (isset($data['action']) && $data['action'] === 'save_statistics') {
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
} elseif (isset($data['action']) && $data['action'] === 'get_workers_without_salary') {
    $month_start = $data['month_start'];
    $month_end = $data['month_end'];

    $stmt = $pdo->prepare("
        SELECT w.id, w.name
        FROM workers w
        LEFT JOIN salaries s ON w.id = s.worker_id 
            AND s.date BETWEEN :month_start AND :month_end
        WHERE s.worker_id IS NULL
    ");
    $stmt->execute(['month_start' => $month_start, 'month_end' => $month_end]);

    $workers = $stmt->fetchAll(PDO::FETCH_ASSOC);

    echo json_encode(['status' => 'success', 'workers' => $workers]);
} else {
    echo json_encode(['status' => 'error', 'message' => 'Unknown action']);
}
?>
