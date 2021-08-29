let pagina = 1;
const cita = {
    nombre:'',
    fecha: '',
    hora: '',
    servicios: []
}


document.addEventListener('DOMContentLoaded', function(){
    iniciarApp();
});

function iniciarApp(){
    mostrarServicios();
    //Resalta el DIV actual segun el tab al que se presiona
    mostrarSeccion();
    //Oculta o muestra una seccion segun el tab que presiones
    cambiarSeccion();
    paginaSiguiente();
    paginaAnterior();

    //Comprueba la pagina actual para ocultar o mostrar l apaginacion
    botonesPaginador();

    //Muestra el resumen de la cita o mensaje de error
    mostrarResumen();

    //Almacena el nombre de la cita

    nombreCita();

    //Almacenar la fecha

    fechaCita();

    //Deshabilitar las fechas antiguas
    desahabilitarFechaAnterior();


    //Almacena la hora de la cita
    horaCita();

}
function mostrarSeccion(){
     //Eliminar mostrar-seccion de la sección anterior

     const seccionAnterior = document.querySelector('.mostrar-seccion');
     if(seccionAnterior){
        seccionAnterior.classList.remove('mostrar-seccion');
     }

    const seccionActual = document.querySelector(`#paso-${pagina}`);
    seccionActual.classList.add('mostrar-seccion');

    //Eliminar la clase de actual en el tab anterior
     
     const tabAnterior = document.querySelector('.tabs .actual')
     if(tabAnterior){
        tabAnterior.classList.remove('actual');
     }
     

    //Resalta el tab actual

    const tab = document.querySelector(`[data-paso="${pagina}"]`);
    tab.classList.add(`actual`);



}

function cambiarSeccion(){
    const enlaces = document.querySelectorAll('.tabs button');


    enlaces.forEach(enlace  =>{
        enlace.addEventListener('click', e =>{
            e.preventDefault();

            pagina = parseInt(e.target.dataset.paso);

            



            //llamar a la funcion de mostrar seccion
            mostrarSeccion();
            botonesPaginador(); 

        })
    })
}
async function mostrarServicios(){
    try{
        const resultado = await fetch('./servicios.json');
        const db = await resultado.json();
        const {servicios}= db;

        //Generar el html
        servicios.forEach(servicio =>{
            const { id, nombre , precio} = servicio;


            //DOM Scripting
            //Generar nombre de servicio
            const nombreServicio = document.createElement('p')
            nombreServicio.textContent = nombre;
            nombreServicio.classList.add('nombre-servicio');


            //Generar el precio del servicio

            const precioServicio = document.createElement('p');
            precioServicio.textContent = `$ ${precio}`;
            precioServicio.classList.add('precio-servicio');

            //Generar div contenedor de servicio
            const servicioDiv = document.createElement('DIV');
            servicioDiv.classList.add('servicio');
            servicioDiv.dataset.idServicio = id;


            //Selecciona un servicio para la cita
            servicioDiv.onclick = seleccionarServicio;


            //Inyectar precio y nombre
            servicioDiv.appendChild(nombreServicio);
            servicioDiv.appendChild(precioServicio);
            //Inyectar en el html
            document.querySelector('#servicios').appendChild(servicioDiv);
        });

        

    }catch(error){
        console.log(error);
    }
}


function seleccionarServicio(e){
    let elemento;

    if(e.target.tagName ==='P'){
        elemento = e.target.parentElement;
        
    }else{
        elemento = e.target;
    }

    if(elemento.classList.contains('seleccionado')){
        elemento.classList.remove('seleccionado');

        const id = parseInt(elemento.dataset.idServicio);

        eliminarServicio(id);
    }else{
        elemento.classList.add('seleccionado');

        const servicioObj = {
            id: parseInt(elemento.dataset.idServicio),
            nombre:elemento.firstElementChild.textContent,//Extrae el nombre del producto
            precio: elemento.firstElementChild.nextElementSibling.textContent//Extrae el precio del producto
        }
        //console.log(servicoObj);

        agergarServicio(servicioObj);
    }
    
    
}

function eliminarServicio(id){
    const {servicios} = cita;
    cita.servicios = servicios.filter( servicio => servicio.id !== id );

    console.log(cita);
}
function agergarServicio(servicioObj){
    const {servicios} = cita;
    cita.servicios = [...servicios, servicioObj];
    console.log(cita);
}

function paginaSiguiente(){
    const paginaSiguiente = document.querySelector('#siguiente');
    paginaSiguiente.addEventListener('click', () =>{
        pagina++;

        botonesPaginador();
    })

}
function paginaAnterior(){
    const paginaAnterior = document.querySelector('#anterior');
    paginaAnterior.addEventListener('click', () =>{
        pagina--;
        botonesPaginador();
    })
}

function botonesPaginador( ){
    const paginaSiguiente = document.querySelector('#siguiente');
    const paginaAnterior = document.querySelector('#anterior');


    if(pagina ===1){
        paginaAnterior.classList.add('ocultar');
    }else if(pagina ===3){
        paginaSiguiente.classList.add('ocultar');
        paginaAnterior.classList.remove('ocultar');

        mostrarResumen();//Estamos en la pagina tres

    }else{
        paginaAnterior.classList.remove('ocultar');
        paginaSiguiente.classList.remove('ocultar');
    }
    mostrarSeccion();
}

function mostrarResumen(){
    //Destructuring
    const {nombre, fecha, hora, servicios} = cita;


    //Selecionar el resumen
    const resumenDiv = document.querySelector('.contenido-resumen');


    //Limpia el HTMl previo a introducir los datos de cita

    while(resumenDiv.firstChild){
        resumenDiv.removeChild(resumenDiv.firstChild);
    }

    if(Object.values(cita).includes('')){
        const noServicios = document.createElement('P');  
        noServicios.textContent = 'Faltan datos de Servicios, hora, fecha o nombre';

        noServicios.classList.add('invalidar-cita');

        //agregar a resumen Div
        resumenDiv.appendChild(noServicios);

        return;
    }
    const headingCita = document.createElement('H3');
    headingCita.textContent = 'Resumen de Cita';




    const nombreCita = document.createElement('P')
    nombreCita.innerHTML =`<span>Nombre:</span> ${nombre}`;

    const fechaCita = document.createElement('P')
    fechaCita.innerHTML =`<span>Fecha:</span> ${fecha}`;

    const horaCita = document.createElement('P')
    horaCita.innerHTML =`<span>Hora:</span> ${hora}`;

    const serviciosCita = document.createElement('DIV');
    serviciosCita.classList.add('resumen-servicios');

    const headingServicios = document.createElement('H3');
    headingServicios.textContent = 'Resumen de Servicios';

    serviciosCita.appendChild(headingServicios);

    let cantidad = 0;


    //Iterar sobre el arreglo de servicios

    servicios.forEach(servicio =>{
        const {nombre, precio} = servicio;
        const contenedorServicio = document.createElement('DIV');
        contenedorServicio.classList.add('contenedor-servicio');


        const textoServicio = document.createElement('P');
        textoServicio.textContent = nombre;

        const precioServicio = document.createElement('P');
        precioServicio.textContent = precio;
        precioServicio.classList.add('precio');

        const totalServicio = precio.split('$');

       // console.log(parseInt(totalServicio[1].trim()));
        cantidad += parseInt(totalServicio[1].trim());//Suma la cantidad
        //Colocar texto precio en el div

        contenedorServicio.appendChild(textoServicio);
        contenedorServicio.appendChild(precioServicio);

        serviciosCita.appendChild(contenedorServicio);
    });

    console.log(cantidad);
    resumenDiv.appendChild(headingCita);
    resumenDiv.appendChild(nombreCita);
    resumenDiv.appendChild(fechaCita);
    resumenDiv.appendChild(horaCita);


    resumenDiv.appendChild(serviciosCita);

    const cantidadPagar = document.createElement('P');
    cantidadPagar.classList.add('total');
    cantidadPagar.innerHTML =`<span>Total a pagar: </span>$ ${cantidad}`

    resumenDiv.appendChild(cantidadPagar);
}



function nombreCita(){
    const nombreInput = document.querySelector('#nombre');
    nombreInput.addEventListener('input', e =>{
        const nombreTexto = e.target.value.trim();

        if (nombreTexto === ''|| nombreTexto.length < 2){
            mostrarAlerta('nombre no valido', 'error')
        }else{
            const alerta = document.querySelector('.alerta');
            if(alerta){
                alerta.remove();
            }
            cita.nombre = nombreTexto 

        }
    })
}

function mostrarAlerta(mensaje, tipo){


    //Si hay una alerta previa no crear otra
    const alertaPrevia = document.querySelector('.alerta');
    if(alertaPrevia){
        return;
    }
    const alerta = document.createElement('DIV');
    alerta.textContent = mensaje;
    alerta.classList.add('alerta');

    if(tipo === 'error'){
        alerta.classList.add('error');
    }

    //Insertar en el html
    const formulario = document.querySelector('.formulario');
    formulario.appendChild(alerta);

    //Eliminar la alerta

    setTimeout(()=>{
        alerta.remove();
    }, 3000);
}

function fechaCita(){
    const fechaInput = document.querySelector('#fecha');
    fechaInput.addEventListener('input', e =>{
       
        const dia = new Date(e.target.value).getUTCDay();
        if([0, 6].includes(dia)){
            e.preventDefault();
            fechaInput.value = '';
            mostrarAlerta('Fines de Semana no validos', 'error')
        }else{
            cita.fecha = fechaInput.value;
            console.log(cita);
        }
    })
}

function desahabilitarFechaAnterior(){
    const inputFecha = document.querySelector('#fecha');

    const fechaAhora = new Date();
    const year = fechaAhora.getFullYear();
    const mes = fechaAhora.getMonth() +1;
    const dia = fechaAhora.getDate() +1;
    //Formato deseado: AAAA-MM-DD
    const fechaDesabilitar = `${year}-${mes < 10 ? `0${mes}` : mes}-${dia < 10 ? `0${dia}` : dia}`;

    inputFecha.min = fechaDesabilitar;
}

function horaCita(){
    const inputHora = document.querySelector('#hora');
    inputHora.addEventListener('input', e =>{
        const horaCita = e.target.value;
        const hora = horaCita.split(':');

        if(hora[0] < 8 || hora[0] > 18 ){
           mostrarAlerta('Hora no valida', 'error');
           setTimeout(()=>{
                inputHora.value = '';
           }, 3000);
           
        }else{
            cita.hora = horaCita;

            console.log(cita)
        }
    });
}