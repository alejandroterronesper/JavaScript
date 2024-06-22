<?php

$usuarios=array(
array("nombre"=>"Antonio",
"pass"=>"antonio",
"apellidos"=>"Pérez Lorca",
"direc"=>"Calle Comedias, nº 34. 3ºC. Granada. CP:15300",
"email"=>"antoniopl@gmail.com",
"image"=>"images/antonio.png"
),
array("nombre"=>"Lucía",
"pass"=>"lucia",
"apellidos"=>"Corpas Nogales",
"direc"=>"Avenida Los Aviadores, nº 234. 4ºA. Sevilla. CP:11000",
"email"=>"luciacn@hotmail.com",
"image"=>"images/lucia.png"
),
array("nombre"=>"Manuel",
"pass"=>"manuel",
"apellidos"=>"Valdés Rubio",
"direc"=>"Calle Vísperas, nº 4. 1ºB. Fuengirola (Málaga). CP:15632",
"email"=>"manu@telefonica.com",
"image"=>"images/manuel.png"
),
array("nombre"=>"Estefanía",
"pass"=>"estefania",
"apellidos"=>"Sánchez Ruiz",
"direc"=>"Calle Bosque verde, nº 56. 8ºR. Dos Hermanas (Sevilla). CP:33400",
"email"=>"sanchezr@gmail.com",
"image"=>"images/estefania.png"
)
);

echo json_encode($usuarios);
?>