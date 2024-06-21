<?php



$objetosJSON = file_get_contents("PRODUCTS.json");
$objetosJSON = json_decode($objetosJSON)->products;
$errores = [];
$borrado = false;
$arrayAuxiliar = []; //donde guardamos los productos
if ($_POST){


    $nombre = "";
    if (isset($_POST["nombreProducto"])){

        $nombre = trim($_POST["nombreProducto"]);

        if ($nombre === ""){
            $errores["title"][] = "Debes elegir un producto";
        }

        if (count($errores) === 0){ //Si no hay errores, itero el bucle, busco el producto y lo elimino

            foreach ($objetosJSON as $clave => $producto){

                if ($nombre !== $producto->title){ //Si encontramos el producto, lo elimino del array
                    array_push($arrayAuxiliar, $producto);
                }
            }

            if (count($arrayAuxiliar) === 0){ //No se ha borrado, lanzo error
                $errores["title"][] = "Error al borrar producto";
            }
        
        } 

    }


    if (count($errores) === 0){//Si hay error, reescribo fichero

        //reescribimos fichero

        $objetosJSON = [
            "products" => $arrayAuxiliar
        ];

        file_put_contents('PRODUCTS.json',  json_encode($objetosJSON));

        $jsonRespuesta = [
            "borrado" => true
        ];

        echo json_encode($jsonRespuesta);
    }
    else{ //Si hay errores, lanzo mensaje de error

        $jsonRespuesta = [
            "borrado" => false,
            "errores" => $errores
        ];


        echo json_encode($jsonRespuesta);

    }



}








?>