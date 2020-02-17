/*
.########.##....##.##.....##.####..#######.
.##.......###...##.##.....##..##..##.....##
.##.......####..##.##.....##..##..##.....##
.######...##.##.##.##.....##..##..##.....##
.##.......##..####..##...##...##..##.....##
.##.......##...###...##.##....##..##.....##
.########.##....##....###....####..#######.
*/
//=====================================================
// BUCLE DE TRANSMISION
//=====================================================
//aps = actualizaciones por segundo, suele ser 60 veces por segundo
//fps = frames por segundo, suele ser 60 veces por segundo
var transmision = {
  idEjecucion: null,
  ultimoRegistro: 0,
  aps: 0,
  fps: 0,
  iterar: function (registroTemporal) {



    var context = canvas.getContext('2d');
    context.drawImage(video, 0, 0, 640, 480);
    var imgData2 = context.getImageData(0, 0, 100, 100);
    var data2 = imgData2.data;
    var data = [];
    var count = 0;
    for (var i = 0; i < data2.length; i += 4) {
      var grayscale = 0.33 * data2[i] + 0.52 * data2[i + 1] + 0.15 * data2[i + 2];
      data[count] = grayscale;
      count++;
    }
    // console.log(data);

    transmision.idEjecucion = window.requestAnimationFrame(transmision.iterar);

    transmision.actualizar(registroTemporal);
    transmision.dibujar();

    if ((registroTemporal - transmision.ultimoRegistro) > 999) {
      transmision.ultimoRegistro = registroTemporal;
      console.log("APS: " + transmision.aps + " | FPS: " + transmision.fps);
      transmision.aps = 0;
      transmision.fps = 0;
    } else {

    }
  },
  detener: function () {

  },
  actualizar: function (registroTemporal) {
    transmision.aps++;
  },
  dibujar: function (registroTemporal) {
    transmision.fps++;
  },
}

function iniciarTransmision() {
  console.log("Transmision iniciada");
  transmision.iterar(0);
}







/*
.########....###....########..##.......########.########...#######.
....##......##.##...##.....##.##.......##.......##.....##.##.....##
....##.....##...##..##.....##.##.......##.......##.....##.##.....##
....##....##.....##.########..##.......######...########..##.....##
....##....#########.##.....##.##.......##.......##...##...##.....##
....##....##.....##.##.....##.##.......##.......##....##..##.....##
....##....##.....##.########..########.########.##.....##..#######.
*/

//======================================================================
// VARIABLES
//======================================================================
let miCanvas = document.querySelector('#pizarra');
let lineas = [];
let correccionX = 0;
let correccionY = 0;
let pintarLinea = false;

let posicion = miCanvas.getBoundingClientRect()
correccionX = posicion.x;
correccionY = posicion.y;

miCanvas.width = window.innerWidth;
miCanvas.height = window.innerHeight;

//=====================================================================
// RESIZE
// Se decidio hacer reload por simplicidad 
//=====================================================================
$(window).resize(function () {
  location.reload();
});

//======================================================================
// FUNCIONES
//======================================================================

/**
 * Funcion que empieza a dibujar la linea
 */
function empezarDibujo() {
  pintarLinea = true;
  lineas.push([]);
};

/**
 * Funcion dibuja la linea
 */
function dibujarLinea(event) {
  event.preventDefault();
  if (pintarLinea) {
    let ctx = miCanvas.getContext('2d')
    // Estilos de linea
    ctx.lineJoin = ctx.lineCap = 'round';
    ctx.lineWidth = 5;

    // Color de la linea
    ctx.strokeStyle = 'red';

    // Marca el nuevo punto
    let nuevaPosicionX = 0;
    let nuevaPosicionY = 0;
    if (event.changedTouches == undefined) {
      // Versión ratón
      nuevaPosicionX = event.layerX;
      nuevaPosicionY = event.layerY;
    } else {
      // Versión touch, pantalla tactil
      nuevaPosicionX = event.changedTouches[0].pageX - correccionX;
      nuevaPosicionY = event.changedTouches[0].pageY - correccionY;
    }
    // Guarda la linea
    lineas[lineas.length - 1].push({
      x: nuevaPosicionX,
      y: nuevaPosicionY
    });

    // Redibuja todas las lineas guardadas
    ctx.beginPath();
    lineas.forEach(function (segmento) {
      ctx.moveTo(segmento[0].x, segmento[0].y);
      segmento.forEach(function (punto, index) {
        ctx.lineTo(punto.x, punto.y);
      });
    });
    ctx.stroke();
  }
}

/*
.########.##....##.##.....##.####....###....########..........########..########..##.....##.########.########.....###...
.##.......###...##.##.....##..##....##.##...##.....##.........##.....##.##.....##.##.....##.##.......##.....##...##.##..
.##.......####..##.##.....##..##...##...##..##.....##.........##.....##.##.....##.##.....##.##.......##.....##..##...##.
.######...##.##.##.##.....##..##..##.....##.########..#######.########..########..##.....##.######...########..##.....##
.##.......##..####..##...##...##..#########.##...##...........##........##...##...##.....##.##.......##.....##.#########
.##.......##...###...##.##....##..##.....##.##....##..........##........##....##..##.....##.##.......##.....##.##.....##
.########.##....##....###....####.##.....##.##.....##.........##........##.....##..#######..########.########..##.....##
*/
function enviarPrueba() {
  var form = new FormData();
  form.append(csrf_name, csrf_value);
  form.append('semestre', "holi");
  form.append('programa', "holi2");
  form.append('novedades', "holi3");

  fetch("/sendCap", {
    method: 'POST',
    body: form,
  })
    .then(function (response) {
      return response.text();
    })
    .catch((error) => (console.error(error.message)))
    .then(function (res) {
      if (isJSON(res)) {
        console.log("ES json");
      } else {
        console.log("NO es json");
      }
    })
}

function isJSON(str) {
  /* if connect.responseText is an error-code number... */
  if (parseInt(str)) return false;

  try {
    JSON.parse(str);
  } catch (e) {
    return false;
  }

  return true;
}

/**
 * Funcion que deja de dibujar la linea
 */
function pararDibujar() {
  pintarLinea = false;
}

//======================================================================
// EVENTOS
//======================================================================

// Eventos raton
miCanvas.addEventListener('mousedown', empezarDibujo, false);
miCanvas.addEventListener('mousemove', dibujarLinea, false);
miCanvas.addEventListener('mouseup', pararDibujar, false);

// Eventos pantallas táctiles
miCanvas.addEventListener('touchstart', empezarDibujo, false);
miCanvas.addEventListener('touchmove', dibujarLinea, false);




/*
.##......##.########.########......######.....###....##.....##
.##..##..##.##.......##.....##....##....##...##.##...###...###
.##..##..##.##.......##.....##....##........##...##..####.####
.##..##..##.######...########.....##.......##.....##.##.###.##
.##..##..##.##.......##.....##....##.......#########.##.....##
.##..##..##.##.......##.....##....##....##.##.....##.##.....##
..###..###..########.########......######..##.....##.##.....##
*/
'use strict';

const video = document.getElementById('video');
const canvas = document.getElementById('canvas');
const snap = document.getElementById("snap");
const errorMsgElement = document.querySelector('span#errorMsg');

const constraints = {
  audio: true,
  video: {
    width: 1280, height: 720
  }
};

// Access webcam
async function init(callback) {
  try {
    const stream = await navigator.mediaDevices.getUserMedia(constraints);
    handleSuccess(stream);
    callback();
  } catch (e) {
    errorMsgElement.innerHTML = `navigator.getUserMedia error:${e.toString()}`;
  }
}

// Success
function handleSuccess(stream) {
  window.stream = stream;
  video.srcObject = stream;
}

// Load init
init(() => iniciarTransmision());

// Draw image
// snap.addEventListener("click", function() {
  // var context = canvas.getContext('2d');
  // context.drawImage(video, 0, 0, 640, 480);
  // var imgData2 = context.getImageData(0, 0, 100, 100);
  // var data2=imgData2.data;
  // var data = [];
  // var count = 0;
  // for(var i = 0; i < data2.length; i += 4) {
  //   var grayscale= 0.33*data2[i]+0.52*data2[i+1]+0.15*data2[i+2];
  //   data[count] = grayscale;
  //   count++;
  // }
  // console.log(data);
// });



