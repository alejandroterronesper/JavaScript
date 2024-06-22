/**ALEJANDRO TERRONES PEREA */

//comprobar si hay usuarios
if (document.getElementById("usuarios").children === false){

    let parrafo = creaNodo("span", "No hay usuarios registrados");
    //añadimos nodo
    document.getElementById("usuarios").appendChild(parrafo);
}

var ruta = location.href;
console.log(ruta)

///peticion HTMLHTTP REQUEST
var xhr = new XMLHttpRequest ();
xhr.responseType = "json";
xhr.onreadystatechange =  function (){

    if ((xhr.readyState == 4) && (xhr.status == 200)){
        var arrayPersonas =  xhr.response

       
        if (arrayPersonas !== null){ 
        
            if (arrayPersonas.length === 0){
                let parrafo = creaNodo("span", "No hay usuarios registrados");
                //añadimos nodo
                document.getElementById("usuarios").appendChild(parrafo);
            }
            else{
                for (let persona of arrayPersonas){
                

                    console.log(ruta+ "server/"+ persona.image)
                    let imagen = creaNodo("img", null, {"src": ruta+"server/" 
                    + persona.image, "id": persona.nombre}) //coger de aqui para boton
                    let enlace = creaNodo ("a",persona.nombre + " (" + persona.email + ")" )
                    let etiquetaLi = creaNodo("li", null, {"class" : "registro"});
    
                    etiquetaLi.appendChild(imagen);
                    etiquetaLi.appendChild(enlace);
    
                    document.getElementById("usuarios").appendChild(etiquetaLi);
                }
    
    
                //botones para loguearse
                const botonesLogin = document.querySelectorAll(".registro");
                console.log(botonesLogin);
                botonesLogin.forEach(boton => {
                    //le ponemos evento al que pulsamos
                    boton.addEventListener("click", registroUsuario);
                })
                
            }

            
        }   
    }
    else{ //Si hay un error
        console.log("error conextion")
    }

}
 //siempre hay que poner ruta completa 
 xhr.open('POST', ruta+ "server/usuarios.php");  //METO POST
 xhr.send();


////WER WORKER///

//enlace pinchar
/**
 * funcion para registrar usuario
 */
function registroUsuario (){

    //borrar errores
    borraElementosNodo(document.getElementById("errores"))

    
    if (document.getElementById("operaciones") !== null){ //esto es para borrar cuando se `pulse enlace
        
        
        document.getElementById("operaciones").parentElement.removeChild(document.getElementById("operaciones"));
        
    }

    //cogemos nombre, this es el enlace pinchado
    let arrayImg = this.children[0]
    let sacaNombre = arrayImg.id

    console.log(sacaNombre)

    //se comprueba si existe esta cookie con el nombre pinchado

    if (comprobarCookie(sacaNombre) === true){

        //comprueno que coincide
        let valorCookie = obtenerCookie(sacaNombre);

        if (valorCookie === sacaNombre){//LOGUEADO


            let botonBorraCook = creaNodo("button", "No me recuerdes", {"id": sacaNombre}); //guardamos nombre para borar

            let div = creaNodo("div", null, {"id":"operaciones"})
            botonBorraCook.addEventListener("click", borrarCookie)
            div.appendChild(botonBorraCook);
            this.insertAdjacentElement("afterend",div)

            //ahora se sustituye el login span
            //SUSTIUIR LABEL
            let loginLabel = document.getElementById("usuarioConectado").innerText;
            let cadenaLog = loginLabel.split(":");


            cadenaLog = cadenaLog[0]+":"  + sacaNombre;

            document.getElementById("usuarioConectado").innerText = cadenaLog;

            //COMO ESTA LOGUEADO PETICION CADA 5 SEGUNDOS PARA EL XML
            peticionSegundos();


        }
        else{ //no coincide
                //creamos div para contenr informacion
            let div = creaNodo("div", null, {"id":"operaciones"});

            let inputPass = creaNodo("input", null, {"type": "password", "id": "pw"});
            let botonLog = creaNodo ("button", "Validar usuario " + sacaNombre, {"id": "botonLogin"});


            botonLog.addEventListener("click", logeaUser)

            div.appendChild(inputPass);
            div.appendChild(botonLog);


            //poner div al lado
            this.insertAdjacentElement("afterend",div)
        }

    }
    else{


        //creamos div para contenr informacion
        let div = creaNodo("div", null, {"id":"operaciones"});

        let inputPass = creaNodo("input", null, {"type": "password", "id": "pw"});
        let botonLog = creaNodo ("button", "Validar usuario " + sacaNombre, {"id": "botonLogin"});


        botonLog.addEventListener("click", logeaUser)

        div.appendChild(inputPass);
        div.appendChild(botonLog);


        //poner div al lado
        this.insertAdjacentElement("afterend",div)
    }


 
    

}



/**
 * si se pincha el boton le borramos la cookie al uyser
 */
function borrarCookie(){
    //alert (this.id)

    let nombreCOokie = this.id; //el this es un boton cogo id
    //para borrar cookie ponemos una fecha vieja
    let fechavieja = new Date (2020);


    //comprobar cookioe
    if (comprobarCookie(nombreCOokie) === true){

        if (obtenerCookie(nombreCOokie) === nombreCOokie){

            document.cookie = nombreCOokie +"=" + nombreCOokie + ";expires="+fechavieja.toUTCString() + ";path=/"
            alert("usuario borrado")


            //cuando borramos usuario borramos boton
            this.parentElement.removeChild(this);


        }
    }
    


}

/**
 * funcion para el boton de valida usuario
 */
function logeaUser (){

    //errores de antes
    borraElementosNodo(document.getElementById("errores"))


    //sacamos 
    let minombre = this.innerText.split("Validar usuario ") //se saca el nombre del boton
    minombre = minombre[1];

    //contraseña 
    let mipass = document.getElementById("pw").value;

    //objeto json
    var datos = new Object (
        {
            nombre: minombre,
            pass: mipass,
        }
    );


    //peticion al server con fetch
    fetch (ruta+"server/usuarios2.php", {
        method: "POST",
        headers: {"Content-Type":"application/x-www-form-urlencoded"}, // Poner solo si se envían datos
        body : "datos="+JSON.stringify(datos) //los datos se ponen en cadena
    })
    .then (function (respuesta){

        if (respuesta.ok){

            respuesta.text()
            .then (function (data){

                var respueta = data

                //respuestas del server
                if (respueta === "OK"){

                    //cookie
                    var fechaHoy = new Date ();
                    //dos dias despues de hoy 
                    const fechaCookie = new Date (fechaHoy.getTime() + (2*24*60*60*1000)) //le sumamos dos dias a hoy en milisegundos y sale
                   

                    //COOKIE
                    if (comprobarCookie("login") === true){ //comprobamos cookie
                        document.cookie = minombre +"=" + minombre + ";expires="+fechaCookie.toUTCString() + ";path=/"

                    }
                    else{
                        document.cookie = minombre +"=" + minombre + ";expires="+fechaCookie.toUTCString() + ";path=/"
                    }

                    let cadenaMensaje = "La aplicación recordará al usuario " + minombre + 
                    " hasta el dia " + fechaCookie.getDate() + " a las "  + fechaCookie.getHours() + 
                    ":" + fechaCookie.getMinutes() + ":" + fechaCookie.getSeconds();
                    
                    //alert
                    alert(cadenaMensaje);


                    //SUSTIUIR LABEL
                    let loginLabel = document.getElementById("usuarioConectado").innerText;
                    let cadenaLog = loginLabel.split(":");


                    cadenaLog = cadenaLog[0]+":"  + minombre;

                    document.getElementById("usuarioConectado").innerText = cadenaLog;
                    

                    //COMO HACE LOGIN PETICION CADA 5 SEGUNDOS
                    peticionSegundos();


                }



                if (respueta === "FAIL"){

                    if (minombre === ""){
                        let span = creaNodo ("span", "ERROR: LOGIN INCORRECTO");

                        document.getElementById("errores").appendChild(span);
                    }

                    else{
                        let span = creaNodo ("span", "ERROR: CONTRASEÑA INCORRECTO");

                        document.getElementById("errores").appendChild(span);
                    }
                   
                }

            })
        }

    })
    .catch (function (e){
        borraElementosNodo(document.getElementById("errores"))

        //error
        let span = creaNodo ("span", "ERROR CONEXION " + e, null);

        document.getElementById("errores").appendChild(span);
    })

    


}



//REGISTRARSEE
/**
 * evento que si se pierde el foco comprobamos en 
 * almacenamiento local
 */
document.getElementById("user").onblur = function (){
    borraElementosNodo(document.getElementById("errores"))
    let nombre = document.getElementById("user").value
    


    if (nombre !== ""){ //para que no de errores de cadena vacia


        if (!localStorage.userLocal){

            let arrayUser = new Array ();
            arrayUser.push(nombre +",");


            localStorage.userLocal = arrayUser; //se guarda en array
    
        }
        else { //Si existe la sesion local, sacamos datos
            let datosNombre = localStorage.userLocal
            
            
            let arrayNombre = datosNombre.split(",");

            if (arrayNombre.length !== 0 ){//comprobamos que no este vacio

                let encontrado = false;
                //primero iteramos el bucle
                for(let nombresViejos of arrayNombre){

                    if (nombresViejos === nombre){

                        encontrado=true //se encuentra
                    }

                }


                if (encontrado === true){

                    let error = creaNodo("span", "ERROR: USUARIO EN LOCAL YA EXISTE", null);

                    document.getElementById("errores").appendChild(error);

                    //esto para que no me logee sin querer
                    document.getElementById("user").value = ""
                }else{

                    let miArray = new Array ();
                    miArray.push(nombre);

                    //cogemos nombres antiguos
                    let nombre1 = arrayNombre[0]
                    let nombre2 = arrayNombre[1]

                    miArray.push(nombre1);

                    if (nombre2 !== ""){ //este puede exister o no
                        miArray.push(nombre2);
                    }


                    localStorage.userLocal = miArray; //se guarda en array

                    alert("Login "  + nombre +  " registrado")



                    //peticion cada 5 segundos para el xml
                    peticionSegundos();
                }
                

            }
           

            console.log(arrayNombre)
        
    
        }

    }
}


/**
 * gaurda user en local storage
 * se comprueba primero ahciendo una peticion
 * el newUser json
 */
document.getElementById("reg").onclick = function (){

    borraElementosNodo(document.getElementById("errores"))

    // alert("probadni")

    let nombre = document.getElementById("user").value
    let contra = document.getElementById("pass").value


    //sin campos vacios
    if ((nombre !== "") && (contra !== "")){



        var datos = new Object (

            {
                "login": nombre,
                "pas": contra
            }

        );


        //HACEMOS PETICION JSON FETCH
        fetch (ruta+"server/newUser.php", {
            method: "POST",
            headers: {"Content-Type":"application/json"}, // Poner solo si se envían datos
            body : JSON.stringify(datos) //los datos se ponen en cadena
        })
        .then (function (respuesta){


            if (respuesta.ok){

                respuesta.text()
                .then (function (data){

                    var arrayRespuesta = JSON.parse(data);


                    if (arrayRespuesta.status === "saved"){
                        // Simulamos que el usuario nuevo se ha guardado en la BBDD

                        alert("Usuario registrado: " + nombre); //REGISTRADO
                        peticionSegundos (); //PETICION 5 SEGUNDOS
                    }

                    if (arrayRespuesta.status === "invalid"){
                        // Simulamos que el usuario nuevo NO se ha podido guardar en la BBDD
                        let error = creaNodo("span", "ERROR: usuario INVALIDO", null);

                        document.getElementById("errores").appendChild(error);

                    }

                    if (arrayRespuesta.status === "exist"){
                        // Simulamos que el usuario nuevo YA EXISTE en la BBDD
                        let error = creaNodo("span", "ERROR: YA EXISTE EL USUARIO", null);

                        document.getElementById("errores").appendChild(error);
                        
                    }

                    console.log(respuesta)
                })

            }

        })
        .catch( function (e){
                // Simulamos que el usuario nuevo YA EXISTE en la BBDD
                let error = creaNodo("span", "ERROR: " + e, null);

                document.getElementById("errores").appendChild(error);
        })

    }
    else{
        let error = creaNodo("span", "ERROR: CAMPOS VACIOS", null);

                    document.getElementById("errores").appendChild(error);
    }

    
  

}



/**
 * funcion que saca el xml 
 * cuando hay user logueado
 * cada 5 segundos lo hace
 * 
 * HTTP REQUEST
 */
function peticionSegundos (){
    
    setInterval ( function(){

        let nodoMensajes =document.getElementById("mensajes");
    
    
        borraElementosNodo(nodoMensajes);
        var respXML = new XMLHttpRequest ();
    
        respXML.onreadystatechange = function (){
    
            console.log(respXML.readyState)
    
            if ((respXML.readyState == 4) && (respXML.status == 200)){
    
    
                const xml = respXML.responseXML
    
                let variable = xml.documentElement;
    
                let mensajes = variable.children
    
                for(let mensaje of mensajes){
    
                    let valor = mensaje.children
    
                    for (let conver of valor){
    
                        let parrafo = creaNodo ("p", conver.tagName + ": "  + conver.textContent)
                        nodoMensajes.appendChild(parrafo);
                    }
                }

                //se gaurda solo una vez
                if (("caches") in window === true){

                    caches.has("chatXML").then(function (respuesta){ //se comprueba si existe la cache

                        if (respuesta === false){ //se gaurda en cache

                            const myCache = caches.open("chatXML")
                            myCache
                            .then(function (cache){ //se guarda
                                return cache.add(ruta+"server/mensajes.xml") //se guarda cuando refresco
                            })
                           
                           
                        }

                    })
                }
    
            }
            }
    
            respXML.open('GET', ruta+'server/mensajes.xml'); 
            respXML.send();
    
    
    }, 5000)

}



leerXML()
/**
 * esto sirve
 * funcion que se llama cada 5 segundos
 */
function leerXML (){

    console.log("5 segundos");
    
}

//FUNCIONES 
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
 * Función que devuelve el valor de una cookie
 * @param {String} clave 
 * @returns {String}
 */
function obtenerCookie(clave) {
    var name = clave + "=";
    var ca = document.cookie.split(';'); // Obtenemos los campos de la cookie
    for (var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ')
            c = c.substring(1); // Eliminamos los espacios en blanco
        if (c.indexOf(name) == 0)
            return c.substring(name.length, c.length);
    }
    return "";
}


/**
 * Función que comprueba si una cookie existe o no
 * si existe, devuelve true si no
 * devuelve false
 * @param {String} clave 
 * @returns {Boolean}
 */
function comprobarCookie(clave) {
    var clave = obtenerCookie(clave);
    if (clave != "") {
        // La cookie existe.
        return true
    }
    else {
        // La cookie no existe.
        return false;
    }
}