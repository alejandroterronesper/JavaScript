<?php
//Se devuelve un solo producto
//buscando a partir de su nombre

$objetosJSON = file_get_contents("PRODUCTS.json");
$objetosJSON = json_decode($objetosJSON)->products;
$errores = [];
$respuestaProducto = "";
if ($_POST){

    $nombre = "";
    if (isset($_POST["nombreProducto"])){

        $nombre = trim($_POST["nombreProducto"]);

        if ($nombre === ""){
            $errores["title"][] = "Debe introducir un nombre";
        }


        //iteramos y buscamos
        foreach($objetosJSON as $clave => $producto){

            if ($nombre === $producto->title){
                $respuestaProducto = $producto;
                break; //si lo encontramos, salimos del bucle
            }
        }


        //validamos si se ha guardado el producto
        if($respuestaProducto === ""){
            $errores["title"][] = "No se ha encontrado producto con este nombre";
        }


        //Comprobamos si hay errores
        if (count($errores) === 0){//Si no hay errores, devolvemos producto

            
            $objetoJSON = [
                "product" => $respuestaProducto
            ];


            echo json_encode($objetoJSON);

        }
        else{ 


            $objetoJSON = [
                "errores" => $errores
            ];

            echo json_encode($objetoJSON);
        }
    }
}



?>