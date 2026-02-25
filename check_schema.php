<?php
try {
    $db = new PDO('sqlite:../change-management-php/cms.db');
    $result = $db->query("SELECT name, sql FROM sqlite_master WHERE type='table'");
    while ($row = $result->fetch(PDO::FETCH_ASSOC)) {
        echo "TABLE: " . $row['name'] . "\n" . $row['sql'] . "\n\n";
    }
} catch (Exception $e) {
    echo "ERROR: " . $e->getMessage() . "\n";
}
