<?php

$datos = json_decode($_POST["datos"],true);

if (($datos["nombre"] == "Antonio") && ($datos["pass"]=="antonio"))
 echo "OK";
else if (($datos["nombre"] == "Lucía") && ($datos["pass"]=="lucia"))
 echo "OK";
else if (($datos["nombre"] == "Manuel") && ($datos["pass"]=="manuel"))
 echo "OK";
else if (($datos["nombre"] == "Estefanía") && ($datos["pass"]=="estefania"))
 echo "OK";
else
 echo "FAIL";
?>