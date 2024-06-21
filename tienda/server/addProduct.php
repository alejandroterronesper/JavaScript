<?php

$errores = [];
$arrayCategorias = [];


$objetosJSON = file_get_contents("PRODUCTS.json");
$objetosJSON = json_decode($objetosJSON)->products;

//Cogemos el ultimo objeto, y sacamos su id
$ultimoID = $objetosJSON[count($objetosJSON) - 1]->id; 


foreach($objetosJSON as $clave => $producto){
    $categoria= $producto->category;
    if (!in_array($categoria, $arrayCategorias)){ 
        array_push($arrayCategorias, $categoria);
    }
}

//validamos los datos
if ($_POST){

    $titulo = "";
    if (isset($_POST["title"])){
        $titulo = trim($_POST["title"]);

        if ($titulo === ""){
            $errores["title"][] = "El nombre del producto no puede ir vacio";
        }
    }


    $descripcion = "";
    if (isset($_POST["description"])){
        $descripcion = trim($_POST["description"]);

        if ($titulo === ""){
            $errores["description"][] = "La descripción del producto no puede ir vacio";
        }
    }


    $precio = "";
    if (isset($_POST["price"])){
        $precio = floatval($_POST["price"] );


        if ($precio <= 0){
                $errores["price"][] = "El precio del producto no puede ser 0 o menor de 0";
        }


    }


    $descuento = "";
    if (isset($_POST["descuento"])){
        $descuento = floatval($_POST["descuento"] );


        if ($descuento < 0){
            $errores["descuento"][] = "El descuento del producto no puede ser menor de 0";
        }

    }

    $puntuacion = "";
    if (isset($_POST["rating"])){
        $puntuacion = floatval($_POST["rating"]);
        if ($puntuacion <= 0){
            $errores["rating"][] = "La puntuación del producto no puede ser 0 o menor de 0";
        }
    }


    $stock = "";
    if (isset($_POST["stock"])){
        $stock = intval($_POST["stock"]);

        if ($stock < 0){
            $errores["stock"][] = "El stock del producto no puede ser 0";
        }
    }


    $marca = "";
    if (isset($_POST["brand"])){
        $marca = trim($_POST["brand"]);


        if ($marca === ""){
            if ($stock < 0){
                $errores["brand"][] = "La marca del producto no puede ir vacía1";
            }
        }

    }


    $categoria = "";
    if (isset($_POST["category"])){
        $categoria = trim(($_POST["category"]));

        if (!in_array($categoria, $arrayCategorias)){
            $errores["category"][] = "Elige una categoría existente";

        }

    }


    $thumbnail = "";
    if (isset($_POST["thumbnail"])){

        $thumbnail = trim($_POST["thumbnail"]);

        if ($thumbnail === ""){
            $errores["thumbnail"][] = "Debe introducir una miniatura";

        }
    }


    $imagenes = [];
    if (isset($_POST["images"])){

        if (trim($_POST["images"]) === ""){
            $errores["images"][] = "Debe introducir diferentes imágenes";

        }
        else{
            $arrayAux = explode(",", $_POST["images"]);
       

            foreach($arrayAux as $clave => $valor){

                if (trim($valor) ==! ""){//evitamos introducir cadenas vacias
                    array_push($imagenes, trim($valor));
                }
            }

            if (count($imagenes) === 0){
                $errores["images"][] = "Debe introducir diferentes imágenes";
            }
            
        }

  

    }


    if (count( $errores) !== 0){


        //Si hay errores, no modificamos el fichero
        //enviamos errores al cliente

        $objetoJSON = [
            "errores" => $errores
        ];

        echo json_encode($objetoJSON);   //lo pasamos a la petición


    }
    else{ //pasamos array de errores

       $producto = [
        "id" => ($ultimoID + 1),
        "title" => $titulo,
        "description" => $descripcion,
        "price" => $precio,
        "discountPercentage" => $descuento,
        "rating" => $puntuacion,
        "stock" => $stock,
        "brand" => $marca,
        "category" =>  $categoria,
        "thumbnail" =>   $thumbnail,
        "images" => $imagenes 
       ];


       array_push($objetosJSON, $producto);


       $objetosJSON = [
        "products" => $objetosJSON //formato original del JSON
       ];

       $objResult = [
        "producto" =>  $producto 
       ];

    

       file_put_contents('PRODUCTS.json',  json_encode($objetosJSON));

       echo json_encode($objResult); //pasamos al servidor el objeto introducido
       

    }



}


?>