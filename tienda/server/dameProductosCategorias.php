<?php

//objeto JSON
$objetosJSON = file_get_contents("PRODUCTS.json");
$objetosJSON = json_decode($objetosJSON)->products;

if ($_POST){


    $categoria = "";
    if (isset($_POST["categoria"])){
        $categoria = trim($_POST["categoria"]);
    }


    $productosCategoria = [];


    foreach ($objetosJSON as $clave => $producto){

        if ($producto->category === $categoria){
            array_push($productosCategoria, $producto);
        }
    }


    if (count($productosCategoria) === 0){ //Si no se han encontrado productos
        $obJSON = [
            "error" => false 
        ];
    }
    else{
        $obJSON = [
            "products" => $productosCategoria
        ];
    }


    echo json_encode($obJSON);  

}


?>