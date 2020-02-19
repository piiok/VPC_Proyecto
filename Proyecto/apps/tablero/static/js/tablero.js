const CSRF_TOKEN = getCookie('csrftoken');

/*
..#######..##....##.##........#######.....###....########..........########.....###.....######...########
.##.....##.###...##.##.......##.....##...##.##...##.....##.........##.....##...##.##...##....##..##......
.##.....##.####..##.##.......##.....##..##...##..##.....##.........##.....##..##...##..##........##......
.##.....##.##.##.##.##.......##.....##.##.....##.##.....##.#######.########..##.....##.##...####.######..
.##.....##.##..####.##.......##.....##.#########.##.....##.........##........#########.##....##..##......
.##.....##.##...###.##.......##.....##.##.....##.##.....##.........##........##.....##.##....##..##......
..#######..##....##.########..#######..##.....##.########..........##........##.....##..######...########
*/
// init();
window.onload = function () {
  // Load init
  // iniciarTransmision()
};


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
  imgPromedio: null,
  nroIteracion: 0,
  ultimoRegistro: 0,
  aps: 0,
  fps: 0,
  iterar: function (registroTemporal) {
    transmision.idEjecucion = window.requestAnimationFrame(transmision.enviar);
    transmision.nroIteracion++;

    transmision.actualizar(registroTemporal);
    transmision.dibujar();

    if ((registroTemporal - transmision.ultimoRegistro) > 999) {
      transmision.ultimoRegistro = registroTemporal;
      console.log("APS: " + transmision.aps + " | FPS: " + transmision.fps);
      transmision.aps = 0;
      transmision.fps = 0;
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
  enviar: function (registroTemporal) {

    var context = canvas.getContext('2d');
    context.drawImage(video, 0, 0, 640, 480);
    var imgData2 = context.getImageData(0, 0, 100, 100);
    var data2 = imgData2.data;
    var data = [];
    var count = 0;
    var banderaImgPromedio = transmision.imgPromedio == null;
    transmision.imgPromedio = [];
    // for (var i = 0; i < data2.length; i += 4) {
    //   var grayscale = parseInt(0.33 * data2[i] + 0.52 * data2[i + 1] + 0.15 * data2[i + 2]);
    //   data[count] = grayscale;
    //   if(banderaImgPromedio){
    //     transmision.imgPromedio[count] = grayscale;
    //   }else{
    //     transmision.imgPromedio[count] = Math.abs(transmision.imgPromedio[count] - grayscale);
    //   }
    //   count++;
    // }
    context
    console.log("Context");
    console.log(context);
    console.log("Imagen");
    console.log(imgData2);
    console.log("Data");
    console.log(data2);
    var imgJSON = JSON.stringify(data2);


    var form = new FormData();

    form.append('csrfmiddlewaretoken', CSRF_TOKEN);
    form.append('imgJSON', imgJSON);
    form.append('iteracion', transmision.nroIteracion);

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
          transmision.iterar(registroTemporal);
          console.log("ES json");
        } else {
          console.log("NO es json");
        }
      })
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
// let miCanvas = document.querySelector('#pizarra');
// let lineas = [];
// let correccionX = 0;
// let correccionY = 0;
// let pintarLinea = false;

// let posicion = miCanvas.getBoundingClientRect()
// correccionX = posicion.x;
// correccionY = posicion.y;

// miCanvas.width = window.innerWidth;
// miCanvas.height = window.innerHeight;

// //=====================================================================
// // RESIZE
// // Se decidio hacer reload por simplicidad 
// //=====================================================================
// $(window).resize(function () {
//   location.reload();
// });

// //======================================================================
// // FUNCIONES
// //======================================================================

// /**
//  * Funcion que empieza a dibujar la linea
//  */
// function empezarDibujo() {
//   pintarLinea = true;
//   lineas.push([]);
// };

// /**
//  * Funcion dibuja la linea
//  */
// function dibujarLinea(event) {
//   event.preventDefault();
//   if (pintarLinea) {
//     let ctx = miCanvas.getContext('2d')
//     // Estilos de linea
//     ctx.lineJoin = ctx.lineCap = 'round';
//     ctx.lineWidth = 5;

//     // Color de la linea
//     ctx.strokeStyle = 'red';

//     // Marca el nuevo punto
//     let nuevaPosicionX = 0;
//     let nuevaPosicionY = 0;
//     if (event.changedTouches == undefined) {
//       // Versión ratón
//       nuevaPosicionX = event.layerX;
//       nuevaPosicionY = event.layerY;
//     } else {
//       // Versión touch, pantalla tactil
//       nuevaPosicionX = event.changedTouches[0].pageX - correccionX;
//       nuevaPosicionY = event.changedTouches[0].pageY - correccionY;
//     }
//     // Guarda la linea
//     lineas[lineas.length - 1].push({
//       x: nuevaPosicionX,
//       y: nuevaPosicionY
//     });

//     // Redibuja todas las lineas guardadas
//     ctx.beginPath();
//     lineas.forEach(function (segmento) {
//       ctx.moveTo(segmento[0].x, segmento[0].y);
//       segmento.forEach(function (punto, index) {
//         ctx.lineTo(punto.x, punto.y);
//       });
//     });
//     ctx.stroke();
//   }
// }

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
  form.append('csrfmiddlewaretoken', CSRF_TOKEN);
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
// function pararDibujar() {
//   pintarLinea = false;
// }

//======================================================================
// EVENTOS
//======================================================================

// Eventos raton
// miCanvas.addEventListener('mousedown', empezarDibujo, false);
// miCanvas.addEventListener('mousemove', dibujarLinea, false);
// miCanvas.addEventListener('mouseup', pararDibujar, false);

// // Eventos pantallas táctiles
// miCanvas.addEventListener('touchstart', empezarDibujo, false);
// miCanvas.addEventListener('touchmove', dibujarLinea, false);




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
async function init() {
  try {
    const stream = await navigator.mediaDevices.getUserMedia(constraints);
    handleSuccess(stream);
  } catch (e) {
    errorMsgElement.innerHTML = `navigator.getUserMedia error:${e.toString()}`;
  }
}

// Success
function handleSuccess(stream) {
  window.stream = stream;
  video.srcObject = stream;
}



// Draw image
snap.addEventListener("click", /*()=>foto());*/

function () {
  const video = document.getElementById('video');
  const canvas = document.getElementById('canvas');
  var context = canvas.getContext('2d');
  context.drawImage(video,0,0);
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
});

/*
.##.......########.########.########...........######...#######...#######..##....##.####.########
.##.......##.......##.......##.....##.........##....##.##.....##.##.....##.##...##...##..##......
.##.......##.......##.......##.....##.........##.......##.....##.##.....##.##..##....##..##......
.##.......######...######...########..#######.##.......##.....##.##.....##.#####.....##..######..
.##.......##.......##.......##...##...........##.......##.....##.##.....##.##..##....##..##......
.##.......##.......##.......##....##..........##....##.##.....##.##.....##.##...##...##..##......
.########.########.########.##.....##..........######...#######...#######..##....##.####.########
*/
function getCookie(name) {
  var cookieValue = null;
  if (document.cookie && document.cookie != '') {
    var cookies = document.cookie.split(';');
    for (var i = 0; i < cookies.length; i++) {
      var cookie = cookies[i].trim();
      // Does this cookie string begin with the name we want?
      if (cookie.substring(0, name.length + 1) == (name + '=')) {
        cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
        break;
      }
    }
  }
  return cookieValue;
}






//--------------------------------

// var video = document.getElementById('video');
// var canvas;
// var context;
// var video;
// var dato;
// // Get access to the camera!
// async function con() {
//   if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
//     // Not adding `{ audio: true }` since we only want video now
//     navigator.mediaDevices.getUserMedia({ video: true }).then(function (stream) {
//       document.getElementById('video').src = window.URL.createObjectURL(stream);
//       document.getElementById('video').play();
//     });
//   }
//   else if (navigator.getUserMedia) { // Standard
//     navigator.getUserMedia({ video: true }, function (stream) {
//       video.src = stream;
//       video.play();
//     }, errBack);
//   } else if (navigator.webkitGetUserMedia) { // WebKit-prefixed
//     navigator.webkitGetUserMedia({ video: true }, function (stream) {
//       video.src = window.webkitURL.createObjectURL(stream);
//       video.play();
//     }, errBack);
//   } else if (navigator.mozGetUserMedia) { // Mozilla-prefixed
//     navigator.mozGetUserMedia({ video: true }, function (stream) {
//       video.src = window.URL.createObjectURL(stream);
//       video.play();
//     }, errBack);
//   }
// }
// function foto() {
//   canvas = document.getElementById('canvas');
//   context = canvas.getContext('2d');
//   video = document.getElementById('video');
//   context.drawImage(video, 0, 0, 640, 480);

// }

// con();