<?php

if ($_POST){

    $nombre  = "";
    if (isset($_POST["nombre"])){
        $nombre = mb_strtoupper(trim($_POST["nombre"]));

    }

    $precio = "";
    if (isset($_POST["precio"])){
        $precio = floatval($_POST["precio"]);
    }



    $objetosJSON = file_get_contents("PRODUCTS.json");
    $objetosJSON = json_decode($objetosJSON)->products;


    $products = [];

    foreach($objetosJSON as $clave => $producto){

        //Pasamos el nombre a mayusculas
        $nombreProducto = mb_strtoupper($producto->title);

        //solo filtrar por nombre
        if (($nombre !== "") && ($precio === "")){ 

            $encuentraCadena = (strpos($nombreProducto, $nombre));
            if ($encuentraCadena !== false){
                array_push($products, $producto);

            }
        }

        
        //solo filtrar por precio
        if (($nombre === "") && ($precio !== "")){ 

            if ($producto->price <= $precio){ //el precio debe ser igual o menor
                array_push($products, $producto);

            }
        }

        //Se filtra por ambos
        if (($nombre !== "") && ($precio !== "")){ 
            $encuentraCadena = (strpos($nombreProducto, $nombre));

            $comparaValor = $producto->price <= $precio;
    
            if ($encuentraCadena !== false && $comparaValor === true){
                array_push($products, $producto);
    
            }
        }
    }

    if (count($products) === 0){ //Si no se han encontrado productos
        $obJSON = [
            "error" => false 
        ];
    }
    else{
        $obJSON = [
            "products" => $products
        ];
    }




    echo json_encode($obJSON);  
}

?>