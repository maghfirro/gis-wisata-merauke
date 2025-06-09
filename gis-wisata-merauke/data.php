<?php
include('db.php');

$sql = "SELECT * FROM `WISATA MERAUKE`";
$result = $conn->query($sql);

$wisata = [];

if ($result->num_rows > 0) {
    while($row = $result->fetch_assoc()) {
        $wisata[] = [
            'name' => $row['name'],
            'lat' => $row['latitude'],
            'lon' => $row['longitude'],
            'category' => $row['category'],
            'desc' => $row['description'],
            'history' => $row['history'], 
            'img' => $row['image_url']
        ];
    }
}
$conn->close();

header('Content-Type: application/json');
echo json_encode($wisata);
?>
