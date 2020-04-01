# HANDS WORLD - Proyecto VPC
<img src="https://gitlab.com/paolacaicedouis/hands_words-proyecto_vpc/-/raw/master/imgs/banner.png" alt="Banner" width="1000" height="300"> <br>
El proyecto tiene como fin identificar gestos realizados con la mano en tiempo real con el fin de interactuar y controlar un sistema informático sin contacto físico directo.

Integrantes: Paola Andrea Caicedo Gualdrón, Jhoan Manuel Diaz Higuera, Juan Felipe Peña Herrera.

Presentaciones del proyecto: [Click aquí](https://gitlab.com/paolacaicedouis/hands_words-proyecto_vpc)

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

# Dependencias
El principal es Python y use la v3.7.5, y el intalador esta en [./instaladores/python-3.7.5-amd64.exe](https://github.com/piiok/VPC_Proyecto/blob/master/instaladores/python-3.7.5-amd64.exe).
No recuerdo exactamente todo lo que instale pero con el comando python -m pip freeze, sale todo esto... tratare de poner enn negrita todo lo que realmente es necesario. Algunos se requieren o no segun el modelo que se utilice, pero teniendo en cuenta que el modelo definitivo que funciono fue la VGG16 con tf.keras pues solo se requieren los que señalare con <b>Negrita</b>.

- <b>Django==3.0.2</b>
- <b>numpy==1.18.0</b>
- <b>opencv-python==4.1.2.30</b>
- <b>tensorflow==2.1.0</b>
- absl-py==0.9.0
- asgiref==3.2.3
- astor==0.8.1
- attrs==19.3.0
- backcall==0.1.0
- bleach==3.1.1
- cachetools==4.0.0
- certifi==2019.11.28
- chardet==3.0.4
- colorama==0.4.3
- cycler==0.10.0
- decorator==4.4.2
- defusedxml==0.6.0
- entrypoints==0.3
- gast==0.2.2
- google-auth==1.12.0
- google-auth-oauthlib==0.4.1
- google-pasta==0.1.8
- grpcio==1.27.2
- h5py==2.10.0
- idna==2.9
- imageio==2.8.0
- importlib-metadata==1.5.0
- ipykernel==5.1.4
- ipython==7.13.0
- ipython-genutils==0.2.0
- ipywidgets==7.5.1
- jedi==0.16.0
- Jinja2==2.11.1
- joblib==0.14.1
- jsonschema==3.2.0
- jupyter-client==6.0.0
- jupyter-core==4.6.3
- Keras-Applications==1.0.8
- Keras-Preprocessing==1.1.0
- kiwisolver==1.1.0
- Markdown==3.2.1
- MarkupSafe==1.1.1
- matplotlib==3.1.3
- mistune==0.8.4
- nbconvert==5.6.1
- nbformat==5.0.4
- networkx==2.4
- notebook==6.0.3
- oauthlib==3.1.0
- opt-einsum==3.2.0
- pandas==1.0.1
- pandocfilters==1.4.2
- parso==0.6.2
- pickleshare==0.7.5
- Pillow==7.0.0
- prometheus-client==0.7.1
- prompt-toolkit==3.0.3
- protobuf==3.11.3
- pyasn1==0.4.8
- pyasn1-modules==0.2.8
- Pygments==2.5.2
- pyparsing==2.4.6
- pyrsistent==0.15.7
- python-dateutil==2.8.1
- pytz==2019.3
- PyWavelets==1.1.1
- pywin32==227
- pywinpty==0.5.7
- PyYAML==5.3
- pyzmq==19.0.0
- requests==2.23.0
- requests-oauthlib==1.3.0
- rsa==4.0
- scikit-image==0.16.2
- scikit-learn==0.22.2
- scipy==1.4.1
- Send2Trash==1.5.0
- six==1.14.0
- sklearn==0.0
- sqlparse==0.3.0
- tensorboard==2.1.1
- tensorflow-estimator==2.1.0
- termcolor==1.1.0
- terminado==0.8.3
- testpath==0.4.4
- Theano==1.0.4
- tornado==6.0.3
- traitlets==4.3.3
- urllib3==1.25.8
- virtualenv==16.7.9
- wcwidth==0.1.8
- webencodings==0.5.1
- Werkzeug==1.0.0
- widgetsnbextension==3.5.1
- wrapt==1.12.0
- xgboost==1.0.2
- zipp==3.0.0