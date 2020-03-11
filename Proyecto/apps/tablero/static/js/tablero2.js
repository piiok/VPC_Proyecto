// The buttons to start & stop stream and to capture the image
var btnStart = document.getElementById("btn-start");
var btnStop = document.getElementById("btn-stop");
var btnCapture = document.getElementById("btn-capture");

// The stream & capture
var stream = document.getElementById("stream");
var capture = document.getElementById("capture");
var snapshot = document.getElementById("snapshot");

// The video stream
var cameraStream = null;

// Attach listeners
btnStart.addEventListener("click", startStreaming);
btnStop.addEventListener("click", stopStreaming);
btnCapture.addEventListener("click", captureSnapshot);

// Start Streaming
function startStreaming() {

	var mediaSupport = 'mediaDevices' in navigator;

	if (mediaSupport && null == cameraStream) {

		navigator.mediaDevices.getUserMedia({ video: true })
			.then(function (mediaStream) {

				cameraStream = mediaStream;

				stream.srcObject = mediaStream;

				stream.play();
			})
			.catch(function (err) {

				console.log("Unable to access camera: " + err);
			});
	}
	else {

		alert('Your browser does not support media devices.');

		return;
	}
}

// Stop Streaming
function stopStreaming() {

	if (null != cameraStream) {

		var track = cameraStream.getTracks()[0];

		track.stop();
		stream.load();

		cameraStream = null;
	}
}

function captureSnapshot() {

	if (null != cameraStream) {

		var ctx = capture.getContext('2d');
		var img = new Image();

		ctx.drawImage(stream, 0, 0, capture.width, capture.height);

		img.src = capture.toDataURL("image/png");
		img.width = 240;

		snapshot.innerHTML = '';

		snapshot.appendChild(img);
	}
}



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
	fondo: null,
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

		if (null != cameraStream) {

			var ctx = capture.getContext('2d');
			var img = new Image();

			ctx.drawImage(stream, 0, 0, capture.width, capture.height);

			img.src = capture.toDataURL("image/png");
			img.width = 240;

			snapshot.innerHTML = '';

			snapshot.appendChild(img);


			var form = new FormData();
						
			form.append('img', img.src);
			form.append('iteracion', transmision.nroIteracion);
			if(transmision.fondo !=  null){
				form.append('fondo', transmision.fondo);
			}

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
						transmision.fondo = JSON.parse(res)['img']
						var prediccion = JSON.parse(res)['Prediccion']
						
						transmision.iterar(registroTemporal);
						console.log("Eso es: "+prediccion);
						// console.log("ES json");
					} else {
						console.log("NO es json");
					}
				})
		}


	},
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
  