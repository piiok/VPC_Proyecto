//Variables globales
var velocidad = 50;
var desplazamiento = 8;
var superficie = 267;
var ncactus = 600;
var bucle;
var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");
var ancho = canvas.width;
var alto = canvas.height;
var modal = document.getElementById("modal");

//Clases
class Objeto {
	constructor(){
		this.img = document.createElement("img");
	}
	choque(otro){
		if(this.fondo < otro.techo || this.techo > otro.fondo || this.derecha < otro.izquierda || this.izquierda > otro.derecha){
			return false;
		} else {
			return true;
		}
	}
}

class Mundo {
	constructor(){
		this.x = 0;
		this.y = superficie;
		this.tamano = 15000;
		this.espacio = 32;
		this.img = document.createElement("img");
		this.img.src = "static/imagenes/mundo.png";
		
		this.imgNube = document.createElement("img");
		this.imgNube.src = "static/imagenes/nube.png";
		this.nx = 350;
		this.ny = 50;
		this.nd = 250;
	}
	dibujar(){
		var tx = this.x;
		for(var i=0; i<=this.tamano;i++){
			ctx.drawImage(this.img, tx, this.y);
			tx+=this.espacio;
		}
		var tnx = this.nx;
		for(var i=0; i<=this.tamano;i++){
			ctx.drawImage(this.imgNube, tnx, this.ny);
			tnx+=this.nd;
		}
	}
	mover(){
		this.x-=desplazamiento;
		this.nx-=2;
	}
}
class Dinosaurio extends Objeto {
	constructor(){
		super();
		this.x = 35;
		this.w = 100;
		this.h = 116;
		this.y = superficie-this.h;
		this.img.src = "static/imagenes/trex.png";
		
		this.techo = this.y;
		this.fondo = this.y+this.h-15;
		
		this.bordeDerecha = 30;
		this.bordeIzquierda = 50;
		this.derecha = this.x+this.w-this.bordeDerecha;
		this.izquierda = this.x+this.bordeIzquierda;
		
	}
	dibujar(){
		ctx.drawImage(this.img, this.x, this.y);
	}
	actualizarBordes(){
		this.techo = this.y;
		this.fondo = this.y+this.h-15;
	}
}

class Cactus extends Objeto {
	constructor(x){
		super();
		this.x = x;
		this.hmin = 25;
		this.hmax = 40;
		this.h = this.generar(this.hmin, this.hmax);
		this.w = this.h*(0.58);
		this.y = superficie-this.h;
		this.nmin = 1;
		this.nmax = 3;
		this.n = this.generar(this.nmin, this.nmax);
		this.dmin = 250;
		this.dmax = 400;
		this.d = this.generar(this.dmin, this.dmax);
		this.siguiente = null;
		this.img.src = "static/imagenes/cactus.png";
		
		this.techo = this.y;
		this.fondo = this.y+this.h;
		this.derecha = this.x+this.w;
		this.izquierda = this.x;
	}
	dibujar(){
		var tx = this.x;
		for(var i=0;i<this.n;i++){
			ctx.drawImage(this.img, tx, this.y, this.w, this.h);
			tx+=this.w;
			this.derecha = tx;
		}
		if(this.siguiente != null){
			this.siguiente.dibujar();
		}
	}
	mover(){
		this.x-=desplazamiento;
		this.izquierda = this.x;
		if(this.siguiente != null){
			this.siguiente.mover();
		}
	}
	agregar(){
		if(this.siguiente == null){
			this.siguiente = new Cactus(this.x+this.d);
		} else{
			this.siguiente.agregar();
		}
	}
	generar(a,b){
		return Math.floor((Math.random() * b) + a);
	}
	verSiguiente(){
		return this.siguiente;
	}
}
class Tiempo {
	constructor(){
		this.nivel = 0;
		this.tiempo = 0;
		this.limite = 10000;
		this.intervalo = 1000/velocidad;
		
		this.sonido = document.createElement("audio");
		this.sonido.src = "static/imagenes/aviso.mp3";
	}
	dibujar(){
		ctx.font = "25px Arial";
		ctx.fillText(this.nivel.toString(), 550, 40);
	}
	
	tick(){
		this.tiempo+=this.intervalo;
		if(this.tiempo >= this.limite){
			this.tiempo = 0;
			this.nivel++;
			this.sonido.play();
			velocidad-=3;
			velocidadSalto-=2;
			this.intervalo = Math.floor(1000/velocidad);
			clearInterval(bucle);
			bucle = setInterval("frame()", velocidad);
		}
	}
	
}
//Objetos
var mundo = new Mundo();
var rex = new Dinosaurio();
var cactus = new Cactus(600);
for(i=0;i<=ncactus;i++){
	cactus.agregar();
}
var tiempo;
//funciones de control
var velocidadSalto = 25;
var desplazamientoSalto = 5;
var puedeSaltar = true;
var salto;
function subir(){
	rex.y-=desplazamientoSalto;
	rex.actualizarBordes();
	if(rex.y <= 2){
		clearInterval(salto);
		salto = setInterval("bajar()", velocidadSalto);
	}
}
function bajar(){
	rex.y+=desplazamientoSalto;
	rex.actualizarBordes();
	if(rex.y >= (superficie-rex.h)){
		clearInterval(salto);
		puedeSaltar = true;
	}
}
function iniciarSalto(){
	salto = setInterval("subir()", velocidadSalto);
	puedeSaltar = false;
}
function saltar(event){
	if(event.keyCode == 38){
		if(puedeSaltar){
			iniciarSalto();
		}
	}
}
function findeJuego(){
	clearInterval(bucle);
	modal.style.display = "block";
	document.getElementById("imgbtn").src = "static/imagenes/otravez.png";
	mundo = new Mundo();
	rex = new Dinosaurio();
	velocidad = 50;
	velocidadSalto = 25;
	cactus = new Cactus(600);
	for(i=0;i<=ncactus;i++){
	cactus.agregar();
	}
}
function choqueCactus(){
	var temp = cactus;
	while(temp != null){
		if(temp.choque(rex)){
			//fin de juego
			findeJuego();
			break;
		} else {
			temp = temp.verSiguiente();
		}
	}
}
function destruirCactus(){
	if(cactus.derecha < 0){
		cactus = cactus.verSiguiente();
	}
}
//funciones globales
function dibujar(){
	ctx.clearRect(0,0,ancho, alto);
	mundo.dibujar();
	rex.dibujar();
	cactus.dibujar();
	tiempo.dibujar();
}
function frame(){
	dibujar();
	mundo.mover();
	cactus.mover();
	tiempo.tick();
	choqueCactus();
	destruirCactus();
}
function iniciar(){
	modal.style.display = "none";
	bucle = setInterval("frame()", velocidad);
	tiempo = new Tiempo();
}

