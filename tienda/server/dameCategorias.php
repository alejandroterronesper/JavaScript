<?php
$arrayCategorias = [];
//Petición httpRequest para obtener las categorias

$objetosJSON = file_get_contents("PRODUCTS.json");
$objetosJSON = json_decode($objetosJSON)->products;




foreach($objetosJSON as $clave => $producto){
    $categoria= $producto->category;

    //Si no está en el array se introduce la categoría, asi evitamos categorias repetidas
    if (!in_array($categoria, $arrayCategorias)){ 
        array_push($arrayCategorias, $categoria);
    }
}


 $JSON = [
    "categorias" => $arrayCategorias
 ];


 echo json_encode($JSON); 

?>