//-------------------------------------------------------------------------------------------------------------------------------------//
//------------------------------------------------------------JAVASCRIPT---------------------------------------------------------------//
//-------------------------------------------------------------------------------------------------------------------------------------//

document.getElementById("formularioBuscar").addEventListener("submit", function(event){
    event.preventDefault();
})
document.getElementById("formularioAdd").addEventListener("submit", function(event){
    event.preventDefault();
})
var arrayImagenes = new Array ();
var divRespuestas = document.getElementById("respuesta");
var divTotales = document.getElementById ("numProductosTotales");

/**
 * Se ocultan el resto de divs
 * y hacemos petición fetch para mostrar todos los productos 
 */
document.getElementById("mostrar").onclick = function (){

    //Cambiamos estilos de los divs
    document.getElementById("vistaMostrar").style = "display:block";
    document.getElementById("vistaBuscar").style = "display:none";
    document.getElementById("vistaObtenerCategorias").style = "display:none";
    document.getElementById("vistaAddProduct").style = "display:none";
    document.getElementById("vistaDeleteProduct").style = "display:none";


    //Borramos elementos de respuesta de posible petición anterior
    borraElementosNodo(divRespuestas)
    borraElementosNodo(divTotales)
    borraElementosNodo(document.getElementById("vistaDeleteProduct"));


    fetch ("http://localhost/DWEC/tienda/server/PRODUCTS.json", {
        method: "GET",
        headers: {"Content-Type": "application/json"}
    }
    )
    .then (function(resp){

        if (resp.ok){

            resp.text()
            .then(function(data){

                //Divs donde vamos a mostrar la información
                var divProductosTotales = document.getElementById("numProductosTotales");
                var divMostrar = document.getElementById("vistaMostrar");

                //Array de productos, a partir del objeto que nos devuelve
                //acedemos al array Products
                var arrayProductos = JSON.parse(data);
                arrayProductos = arrayProductos.products;

                //Borramos elementos de posibles peticiones
                //anteriores en ambos divs
                //para evitar productos repetidos
                borraElementosNodo(divProductosTotales);
                borraElementosNodo(divMostrar);
           

                //Creamos nodo p para divProductosTotales
                let nodoP = creaNodo("p", "Nº de productos:  " + arrayProductos.length)
                divProductosTotales.appendChild(nodoP);


                //Iteramos el array de productos para añadirlos al div
                for(let producto of arrayProductos){

                    divRespuestas.appendChild(addProductos(producto))

                }
            })

        }
    })
    .catch(function(e){
        console.log("Error: " + e);
    })
}



/**
 * Al pulsar se nos muestra un formulario
 * para buscar los productos filtrados
 */
document.getElementById("buscar").onclick = function (){
    document.getElementById("vistaMostrar").style = "display:none";
    document.getElementById("vistaBuscar").style = "display:block";
    document.getElementById("vistaObtenerCategorias").style = "display:none";
    document.getElementById("vistaAddProduct").style = "display:none";
    document.getElementById("vistaDeleteProduct").style = "display:none";


    //Borramos elementos de respuesta de posible petición anterior
    borraElementosNodo(divRespuestas)
    borraElementosNodo(divTotales)
    borraElementosNodo(document.getElementById("vistaDeleteProduct"));

    document.getElementById("buscarProducto").onclick = function (){
        var nombreProducto = document.getElementById("nombre").value;
        var precioMaximo = parseFloat(document.getElementById("precio").value);
        var cadena = "";
        if (nombreProducto === "" && (isNaN(precioMaximo))){
            alert("Debe introducir un parámetro para buscar el producto!");
        }

        if (nombreProducto !== "" && (!isNaN(precioMaximo))){ //se buscan los dos parámetros
            cadena = "nombre="+ nombreProducto +"&" + "precio=" +precioMaximo;

        }

        if (nombreProducto !== "" && (isNaN(precioMaximo))){
            cadena = "nombre="+ nombreProducto;
        }

        if (nombreProducto === "" && (!isNaN(precioMaximo))){
            cadena = "precio=" +precioMaximo;
        }

        if (cadena !== ""){ //Si la cadena no está vacía, hacemos petición por FETCH
   

            fetch ("http://localhost/DWEC/tienda/server/dameProductos.php",{
                method: "POST",
                headers: {"Content-Type":"application/x-www-form-urlencoded"}, 
                body: cadena

            })
            .then (function(response){

                if (response.ok){
                    response.text()
                    .then (function(resp){
                        var arrayFiltro = JSON.parse(resp);


                        //Se comprueban si han llegado resultados
                        if (arrayFiltro.error !== undefined){ //No ha llegado nada

                            borraElementosNodo(divRespuestas);
                            borraElementosNodo(divTotales)

                            if (arrayFiltro.error === false){
                                let nodoPNull = creaNodo ("p", "No se han encontrado productos con estas características", null);
                                divTotales.appendChild(nodoPNull);
                            }
                        }
                        else{

                            arrayFiltro = arrayFiltro.products;
                            let numProductosFiltrados = arrayFiltro.length
                            let divFiltro =  document.getElementById("vistaBuscar");
                            let divProductosTotales = document.getElementById("numProductosTotales")

                  
                            //Borramos elementos de posibles peticiones
                            //anteriores en ambos divs
                            //para evitar productos repetidos
                            borraElementosNodo(divTotales);
                            borraElementosNodo(divRespuestas);

              
                            //Creamos nodo p para divProductosTotales
                            let nodoP = creaNodo("p", "Nº de productos filtrados:  " + numProductosFiltrados)
                            divTotales.appendChild(nodoP);
                            
                            let divProductsResult = creaNodo("div", null, {"id": "productosFiltrados"});
                            for(let producto of arrayFiltro){
                                divRespuestas.appendChild(addProductos(producto))
                            }

                            divFiltro.appendChild(divProductsResult);
                        }
                        
                    })
                }
                

            })
            .catch(function(e){
                console.log("Error: " + e);
            })
        }

    }

}


/**
 * Al pulsar se hara una peticion http request
 * y generamos un combo con todas las categorias
 * 
 * al pulsar sobre una categoria, haremos otra peticion
 * para mostrar los porductos de dicha categoria
 */
document.getElementById("obtenerCategorias").onclick = function (){
    document.getElementById("vistaMostrar").style = "display:none";
    document.getElementById("vistaBuscar").style = "display:none";
    document.getElementById("vistaObtenerCategorias").style = "display:block";
    document.getElementById("vistaAddProduct").style = "display:none";
    document.getElementById("vistaDeleteProduct").style = "display:none";

    

    borraElementosNodo(document.getElementById("vistaObtenerCategorias"));
    borraElementosNodo(divRespuestas);
    borraElementosNodo(divTotales)
    borraElementosNodo(document.getElementById("vistaDeleteProduct"));


    var xhr = new XMLHttpRequest ();
    xhr.responseType = "json";
    var nodoSelect = creaNodo("select", null, {"id": "selectCategorias", "class": "miSelect"});
    let optDefecto = creaNodo("option", "--Elige una categoría--", {"value": "defecto"});
    nodoSelect.appendChild(optDefecto);
    nodoSelect.addEventListener("change", sacaProductosFiltrado)
    let formularioSelect = creaNodo("form",null, {"class": "formulario"})
    let formularioField = creaNodo ("fieldset");
    let formularioLegend = creaNodo ("legend", "Buscar por categoria");
    formularioField.appendChild(formularioLegend);
    xhr.onreadystatechange =  function (){

        if ((xhr.readyState == 4) && (xhr.status == 200)){
            var categoriasJSON =  xhr.response

            for (let categoria of categoriasJSON.categorias){
                let categoriaOption = creaNodo("option", categoria, {"value": categoria});
                nodoSelect.appendChild(categoriaOption);
            }

            formularioField.appendChild(nodoSelect);
            formularioSelect.appendChild(formularioField);
            //Añadimos el select al div
            document.getElementById("vistaObtenerCategorias").appendChild(formularioSelect);
        }

    }


    //siempre hay que poner ruta completa 
    xhr.open('GET', 'http://localhost/DWEC/tienda/server/dameCategorias.php');
    xhr.send();
}



/**
 * Función que saca los producos 
 * de filtrado
 */
function sacaProductosFiltrado (){

    var optionSelect =  document.getElementById("selectCategorias").value;

    borraElementosNodo(divRespuestas)
    borraElementosNodo(divTotales)

    if (optionSelect !== "defecto"){ //Cuando se elija una opción que no sea por defecto, hacemos httprequest


        var xhrProductsCategory = new XMLHttpRequest ();
        xhrProductsCategory.responseType = "json";

        xhrProductsCategory.onreadystatechange = function (){

            if ((xhrProductsCategory.readyState === 4) && (xhrProductsCategory.status == 200)){

                var productosCategoriaJSON = xhrProductsCategory.response;
                productosCategoriaJSON = productosCategoriaJSON.products;


                divTotales.appendChild(creaNodo("p", "Nº de productos filtrados: " + productosCategoriaJSON.length))
                for (let producto of productosCategoriaJSON){
                    divRespuestas.appendChild(addProductos(producto))

                }
            }


        }
  
        //siempre hay que poner ruta completa 
        xhrProductsCategory.open('POST', 'http://localhost/DWEC/tienda/server/dameProductosCategorias.php', true);
        xhrProductsCategory.setRequestHeader("Content-Type", "application/x-www-form-urlencoded"); 
        xhrProductsCategory.send("categoria="+ optionSelect);
    }

}




/**
 * Vista para mostrar formulario para crear producto
 */
document.getElementById("addProduct").onclick = function (){
    document.getElementById("vistaMostrar").style = "display:none";
    document.getElementById("vistaBuscar").style = "display:none";
    document.getElementById("vistaObtenerCategorias").style = "display:none";
    document.getElementById("vistaAddProduct").style = "display:block";
    document.getElementById("vistaDeleteProduct").style = "display:none";

    arrayImagenes = []; //vaciamos array de imagenes
    borraElementosNodo(document.getElementById("vistaObtenerCategorias"))
    borraElementosNodo(divRespuestas);
    borraElementosNodo(divTotales);
    borraElementosNodo(document.getElementById("category"));
    borraElementosNodo(document.getElementById("vistaDeleteProduct"));

    //Primero hacemos peticion para rellenar comboCategorias
    fetch ("http://localhost/DWEC/tienda/server/dameCategorias.php", {
        method: "GET",
        headers: {"Content-Type": "application/json"}
    }
    )
    .then (function(resp){

        if (resp.ok){

            resp.text()
            .then(function(data){

                var arrayCategorias = JSON.parse(data);
                arrayCategorias = arrayCategorias.categorias;
                let comboCategorias = document.getElementById("category");
                let defecto = creaNodo("option", "--Selecciona categoría--", {"value": "defecto"})
                comboCategorias.appendChild(defecto);
                for(let categoria of arrayCategorias){
                    let optCat = creaNodo("option", categoria, {"value": categoria});
                    comboCategorias.appendChild(optCat);
                }

            })

        }
    })
    .catch(function(e){
        console.log("Error: " + e);
    })


}

/**
 * Evento para añadir fotos secundarias al
 * array de fotos
 */
document.getElementById("addFoto").onclick = function (){
    //limpiamos div de respuestas
    borraElementosNodo(divRespuestas);

    //variable
    let fotoImg = document.getElementById("images").value;
    arrayImagenes.push(fotoImg);

    //Vaciamos campo
    document.getElementById("images").value = "";

}

/**
 * Al pulsar el boton se recogen datos de formulario y
 * se crea producto o devuelve un div con errores
 */
document.getElementById("creaProducto").onclick = function () {

    //Limpiamos respuesta de posible petición anterior
    borraElementosNodo(divRespuestas);
    
    //Recogemos valores de los campos

    //titulo
    let title = document.getElementById("title").value;

    //descripcion
    let description = document.getElementById("description").value;

    //precio
    let price = parseFloat(document.getElementById("price").value);

    //descuento
    let discountPercentage = parseFloat(document.getElementById("discountPercentage").value);

    //puntuacion
    let rating = parseFloat(document.getElementById("rating").value);

    //numero productos
    let stock = parseInt(document.getElementById("stock").value);

    //marca
    let brand = document.getElementById("brand").value;

    //categoria
    let category = document.getElementById("category").value;


    //thumbnail
    let thumbnail = document.getElementById("thumbnail").value;

    //imagenes
    let images = arrayImagenesComoCadena(arrayImagenes);

    let parametros = "";

    parametros = "title=" + title + "&description=" + description + 
    "&price=" + price + "&descuento=" + discountPercentage + "&rating=" + rating +
    "&stock=" + stock + "&brand=" + brand + "&category=" + category +
    "&thumbnail=" + thumbnail + "&images=" + images


    //PETICION POR FETCH
    fetch ("http://localhost/DWEC/tienda/server/addProduct.php", {
        method: "POST",
        headers: {"Content-Type":"application/x-www-form-urlencoded"}, 
        body: parametros

    })
    .then (function(response){


        if (response.ok){

            response.text()
            .then(function (resp) {

                var respuestaJSON = JSON.parse(resp);

                if (respuestaJSON.producto !== undefined){ //existe posicion producto
                    
                    //cuando se envien los datos
                    //vaciamos array
                    arrayImagenes = [];


                    //Mostramos el producto introducido
                    let addProducto = respuestaJSON.producto;

                    let divPro = addProductos(addProducto);
                    divRespuestas.appendChild(divPro);
                    alert("Producto añadido!")

                }
                else{//Si hay errores, se lo hacemos saber metemos los errores en el div de errores
                    
                    
                    let divError = creaNodo("div", null, {"class": "error"})
                    let errores = respuestaJSON.errores;

                    for(let error in errores){
                        let errorP = creaNodo ("p", errores[error]);

                        divError.appendChild(errorP);
                    }

                    divRespuestas.appendChild(divError);

                }
            })
        }
    })


}


/**
 * Al pulsar se carga un combo con los productos
 * 
 */
document.getElementById("deleteProducto").onclick = function (){
    document.getElementById("vistaMostrar").style = "display:none";
    document.getElementById("vistaBuscar").style = "display:none";
    document.getElementById("vistaObtenerCategorias").style = "display:none";
    document.getElementById("vistaAddProduct").style = "display:none";
    document.getElementById("vistaDeleteProduct").style = "display:block";


    //borramos nodos anteriores
    borraElementosNodo(divRespuestas)
    borraElementosNodo(divTotales)
    borraElementosNodo(document.getElementById("vistaDeleteProduct"));

    //creamos formulario
    let nodoFormDelete = creaNodo("form", null, {"class":"formulario", "id": "formularioDelete", "method": "POST"})
    let nodoFieldSetDelete = creaNodo ("fieldset", null, null);
    let nodoLegendDelete = creaNodo ("legend", "Elige un producto para borrar", null);
    let nodoSelectDelete = creaNodo("select", null, {"id":"selectDelete", "class": "miSelect"})
    let nodoOptionDefault = creaNodo ("option", "--Elige un producto para eliminar--", {"value": "defecto"})
    nodoSelectDelete.addEventListener("change", comboDeleteProducto) //le damos el evento de onchange para hacer peticion
    nodoSelectDelete.appendChild(nodoOptionDefault);
    
    
    //Petición para obtener nombre productos
    fetch ("http://localhost/DWEC/tienda/server/PRODUCTS.json", {
        method: "GET",
        headers: {"Content-Type": "application/json"}
    }
    )
    .then (function(resp){

        if (resp.ok){

            resp.text()
            .then(function(data){

                var arrayProductos = JSON.parse(data);
                arrayProductos = arrayProductos.products;


                //Iteramos el array de productos para añadirlos al select
                for(let producto of arrayProductos){

                   let optionDelete = creaNodo("option", producto.title, {"value":  producto.title})
                   nodoSelectDelete.appendChild(optionDelete);
                }


                //montamos formulario
                nodoFieldSetDelete.appendChild(nodoLegendDelete);
                nodoFieldSetDelete.appendChild(nodoSelectDelete);
                nodoFormDelete.appendChild(nodoFieldSetDelete);
                document.getElementById("vistaDeleteProduct").append(nodoFormDelete);

            })

        }
    })
    .catch(function(e){
        console.log("Error: " + e);
    })

}


/**
 * Función para el evento onchange
 * del combobox de borrar productos
 * cuando cambie el combo se llamará a la función
 * se recogerá el valor del por option
 * y se hara una petición FETCH 
 * para mostrar el producto, se preguntará si quiere borrarlo o no
 */
function comboDeleteProducto (){
    

    //Sacamos nombre producto
    let nombreProducto = document.getElementById("selectDelete").value

    //vaciamos respuestas
    borraElementosNodo(divRespuestas);

    if (nombreProducto === "defecto"){
        alert("Elige un producto")
        borraElementosNodo(divRespuestas)
    }
    else{//Si es distinto de defecto, hacemos peticion fetch
        fetch ("http://localhost/DWEC/tienda/server/dameProducto.php", {
            method: "POST",
            headers: {"Content-Type":"application/x-www-form-urlencoded"}, 
            body: "nombreProducto="+ nombreProducto
        })
        .then (function(resp){
    
            if (resp.ok){
    
                resp.text()
                .then(function(data){
    
                    var arrayProducto = JSON.parse(data);
                
                    if (arrayProducto.product !== undefined){//Se devuelve producto

                        //mostramos div, 
                        //se pregunta al usuario si lo quiere borrar

                        let nodoFormBotonBorrar = creaNodo ("form", null, { "class" : "formulario", "style" :"margin-top: 3%; text-align:center", "id": "formBotonBorrar"});
                        let nodoFielsetBoton = creaNodo ("fieldset", null, null);
                        let nodolegendBoton = creaNodo ("legend", "¿Quiere borrar el producto?", null);
                        let nodoBotonBorrar = creaNodo ("button", "Borrar producto", {"class": "boton", "id": "deleteProduct", "value": nombreProducto});

                        nodoFielsetBoton.appendChild(nodolegendBoton);
                        nodoFielsetBoton.appendChild(nodoBotonBorrar);
                        nodoFormBotonBorrar.appendChild(nodoFielsetBoton);

                        //le damos evento onclick al boton
                        nodoBotonBorrar.addEventListener("click", borrarProducto);

                        divRespuestas.appendChild(nodoFormBotonBorrar);

                        //Mostramos el producto elegido desde comboBox
                        let comboProduct = arrayProducto.product;

                        let divPro = addProductos(comboProduct);
                        divPro.style.marginLeft = "31.5%"
                        divRespuestas.appendChild(divPro);

                    }
                    else{ //Error, no se ha podido devolver el producto

                        let divError = creaNodo("div", null, {"class": "error"})
                        let errores = arrayProducto.errores;
    
                        for(let error in errores){
                            let errorP = creaNodo ("p", errores[error]);
    
                            divError.appendChild(errorP);
                        }
                        divRespuestas.setAttribute("style");
                        divRespuestas.appendChild(divError);
    
                    }


    
                })
    
            }
        })
        .catch(function(e){
            console.log("Error: " + e);
        })
    


    }
}


/**
 * Función que se llama cuando se pulsa el boton de borrar el producto
 * hacemos petición fetch para borrar el producto
 */
function borrarProducto (){

  
    document.getElementById("formBotonBorrar").addEventListener("submit", function(event){
        event.preventDefault();
    })
    
    let nombreProducto = document.getElementById("deleteProduct").value;



    if (nombreProducto !== ""){ //Si la cadena no está vacia, hacemos petición FETCH

        fetch ("http://localhost/DWEC/tienda/server/deleteProduct.php", {
            method: "POST",
            headers: {"Content-Type":"application/x-www-form-urlencoded"}, 
            body: "nombreProducto="+ nombreProducto
        })
        .then (function(resp){
    
            if (resp.ok){
    
                resp.text()
                .then(function(data){
    
                    var arrayProducto = JSON.parse(data);
                

                    if (arrayProducto.borrado === true){

                        alert("Producto borrado!");
                        borraElementosNodo(divRespuestas);

                        //Actualizamos el comboBox del delete
                        let comboDelete = document.getElementById("selectDelete");


                        let optionDelete = comboDelete.getElementsByTagName("option");

                        //Iteramos los options y borramos el que tenga el value del producto borrado
                        for (let option of optionDelete){

                            if (nombreProducto === option.value){
                                comboDelete.removeChild(option);
                                break; //al borrar la option salimos del bucle
                            }
                        }

                    }
                    else{ //Si está a false

                        let divError = creaNodo("div", null, {"class": "error"})
                        let errores = arrayProducto.errores;
    
                        for(let error in errores){
                            let errorP = creaNodo ("p", errores[error]);
    
                            divError.appendChild(errorP);
                        }
                        divRespuestas.setAttribute("style");
                        divRespuestas.appendChild(divError);
                    }


    
                })
    
            }
        })
        .catch(function(e){
            console.log("Error: " + e);
        })
    }
    else{
        alert("Elige un producto")
    }
}


/**
 * Función que convierte los elementos del
 * array imágenes en cadena con formato
 * imagen1, imagen2 ... lo usamos
 * para pasarlas como parametro al POST
 * @param {Array} arrayImagenes 
 * @returns {String}
 */
function arrayImagenesComoCadena (arrayImagenes){

    let cadena = "";

    for (let cont = 0; cont <= (arrayImagenes.length - 1); cont ++){
        if (cont === (arrayImagenes.length - 1)){
            cadena += arrayImagenes[cont]
        }
        else{
            cadena += arrayImagenes[cont] + ", "
        }
    }

    return cadena;

}


/**
 * Funcion que recibe como parámetro un nodo
 * y borra todos los elementos que tenga dentro
 * 
 * @param {Node} nodo 
 */
function borraElementosNodo (nodo){
    while (nodo.firstChild) {
        nodo.removeChild(nodo.firstChild);
    }
}


/**
 * Funcion que permite crear un nodo,
 * se le pasa como parametro una cadena que indica la etiqueta
 * una cadena que es el contenido que va dentro de la etiqueta
 * y un array con las diferentes propiedades del nodo
 * @param {String} tipoNodo 
 * @param {String | Null} contenido 
 * @param {Array | Null} atributos 
 * @returns {Node}
 */
function creaNodo (tipoNodo, contenido = null, atributos = null){

    let nodo = document.createElement(tipoNodo);

    if (contenido !== null){
        let addContenido = document.createTextNode(contenido);
        nodo.appendChild(addContenido);
    }

    if (atributos !== null){

        for(const clave in atributos){
            nodo.setAttribute(clave, atributos[clave]);
        }
    }

    return nodo;
}

/**
 * Función que devuelve un div con 
 * los datos de un producto
 * a partir de un objeto producto
 * que se le pasa como parámetro
 * 
 * @param {Object} producto 
 * @returns {Node} 
 */
function addProductos (producto){
    let nodoNombre = creaNodo("h4", producto.title);
    let nodoDescripcion = creaNodo("small", producto.description);
    let nodoPrecio = creaNodo("h4", "Precio: " + producto.price + " €");
    let descuento = creaNodo("h4", "Descuento: " + producto.discountPercentage + " %");
    let puntuacion = creaNodo("n4", "Puntuación: " + producto.rating);
    let unidades = creaNodo("h4", "Número de unidades: " + producto.stock);
    let fabricante = creaNodo("h4", "Fabricante: " + producto.brand);
    let categoria = creaNodo("h4", "Categoría: " + producto.category);
    let imgThumbnail = creaNodo("img", null, { "src": producto.thumbnail, "class": "thumbnail" });
    let divProducto = creaNodo("div", null, { "class": "productos" });
    let divImages = creaNodo("div", null, { "class": "divImages" });

    for (let imagen of producto.images) {
        let imgEti = creaNodo("img", null, { "src": imagen });

        divImages.appendChild(imgEti);
    }


    divProducto.appendChild(nodoNombre);
    divProducto.appendChild(nodoDescripcion);
    divProducto.appendChild(nodoPrecio);
    divProducto.appendChild(descuento);
    divProducto.appendChild(puntuacion);
    divProducto.appendChild(unidades);
    divProducto.appendChild(fabricante);
    divProducto.appendChild(categoria);
    divProducto.appendChild(imgThumbnail);
    divProducto.appendChild(divImages);

    return divProducto;
}