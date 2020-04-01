# HANDS WORLD - Proyecto VPC
<img src="https://gitlab.com/paolacaicedouis/hands_words-proyecto_vpc/-/raw/master/imgs/banner.png" alt="Banner" width="1000" height="300"> <br>
El proyecto tiene como fin identificar gestos realizados con la mano en tiempo real con el fin de interactuar y controlar un sistema informático sin contacto físico directo.

Integrantes: Paola Andrea Caicedo Gualdrón, Jhoan Manuel Diaz Higuera, Juan Felipe Peña Herrera.

Presentaciones del proyecto: [Click aquí](https://gitlab.com/paolacaicedouis/hands_words-proyecto_vpc)

# Dependencias


# Historia

## Primera fase
Este proyecto exploro muchos ambitos, en un inicio se exploraron clasificadores como KNN, SVM, XGB  haciendo un preprosesamiento de Bag Of Word (Dio resultados medianamente buenos pero cuando la imagen no tenía muchas "orillas", este generaba un error, ademas las prediciones resultaban un poco caoticas), se exploró keras con background en tensorflow 1.x lo cual funcionaba bien para redes pequeñas. Estos modelos recien mencionados se encuentran ubicados en la carpeta ./Proyecto/apps/tablero/ModelosAnteriores. [Click aquí](https://github.com/piiok/VPC_Proyecto/tree/master/Proyecto/apps/tablero/ModelosAnteriores)

## Segunda fase
Para la segunda fase se exploraró transferncia de aprendizaje (Transfer Learning) con las redes Densenet201, ResNet50, VGG16 e InceptionV3 pero se presentaron problemas ya que en un inicio por cada peticion el servidor recargaba el modelo en la RAM y en modelos grandes esto hacia que el tiempo de respuesta fuera de aprox. 2min, demasiado para implementacion en Gesture Control. Muchos de estos modelos quizas no puedan ser subidos debido a que el peso de estos excede los 100MB.

Se cambio la arquitectura de trabajo un poco pero se encontraron dificultades con keras, he investigando en internet encontramos que estos problemas se resolvian cambiandonos de backend a theano por esta razon destro del proyecto se pueden encontrar modelos con un subfijo '_theano'. Pero el entrenamiento de este tipo de modelos era muy tardío, y cuando se implemento el problema persistió. 

Mudamos todos los modelos anteriormente realizados a tensorFlow Keras, tensprflow==2.1.0., y con este redujimos el tiempo de respuesta de 2min aproximadamente a 500ms. Algo ya aplicable al problema de gesture control o reconocimineto de gestos en "tiempo real". El modelo que nos ofrecio mejor consistencia en las predicciones fue la VGG16 y en base esa se contruyo una <i>mini API</i> en JavaScript que solo requiere un diccionario con la funcion que debe realizar segun el gesto que detecte. De esto se realizaron 2 ejemplos. Uno con el juego de rex-chrome, al cual se puede acceder desde la ruta <b> http://127.0.0.1:8000/rex-chrome-gesture </b> y un pequeña plantilla con un video que se pausa y se reproduce segun sea el gesto al cual se puede acceder desde la ruta <b> http://127.0.0.1:8000/cocina-gesture </b>.

# Implementacion de la API
La implementacion de la api es muy sencilla, y el ejemplo mas facil es el de cocina-gesture, el cual solo requirió el siquiente codigo:

```
//importacion de css
<link rel="stylesheet" href="{% static 'css/gestureApi.css'%}">

//importacion del js requerido
<script src="{% static 'js/gestureApi.js'%}"></script>

//implementacion de funciones según el gesto
<script>
      
    gestureControl= { 
        'Tres': ()=>($(video).trigger('play')), 
        'Palma': ()=>($(video).trigger('pause')),
    };
      
</script>

```
En el ejemplo anterior se hace uso de jQuery, pero para implementacion de la api no se requiere.