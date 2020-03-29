from django.shortcuts import render
from django.http import HttpResponse
from django.views.decorators.csrf import csrf_exempt
from .models import Video
# from .models2 import Video

import json
import io
import numpy as np

import tensorflow as tf
from tensorflow.python.keras.backend import set_session
from tensorflow.python.keras.models import load_model

modelo = tf.keras.models.load_model("./apps/tablero/ResNet50_3_A_B_faces_tensorFlow.h5")
print(modelo.summary())

# sess = tf.Session()
# graph = tf.get_default_graph()

# modelo = tf.keras.models.load_model("./apps/tablero/prueba")

# video = Video() 

# Create your views here.
def index2(request):
    # return HttpResponse("<h1>Hola pvto mundo</h1>")
    return render(request,"tablero2.html")

def rexChrome(request):
    return render(request,"rex-chrome.html")

@csrf_exempt
def post(request):
    video = Video() 
    video.newRequest(request.POST) 
    # predicciones = video.prediccion(graph,sess,modelo)
    predicciones = video.prediccion(modelo)

    print('prediccion',predicciones)
    return HttpResponse(json.dumps({'Prediccion':video.classes_name[str(np.argmax( predicciones))]}),content_type='application/json')
