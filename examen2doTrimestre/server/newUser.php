<?php

$data = file_get_contents('php://input');

$data = json_decode($data);
$aleat = rand(0,1);

if ($aleat <= 0.5) {
    $dataResp = [
        "login" => $data->login,
        "status" => "saved"     // Simulamos que el usuario nuevo se ha guardado en la BBDD
    ];
}   
else if (($aleat > 0.5) and ($aleat <= 0.75)) {
    $dataResp = [
        "login" => $data->login,
        "status" => "invalid"     // Simulamos que el usuario nuevo NO se ha podido guardar en la BBDD
    ];
}
else {
    $dataResp = [
        "login" => $data->login,
        "status" => "exist"     // Simulamos que el usuario nuevo YA EXISTE en la BBDD
    ];
}

echo json_encode($dataResp);

?>