from django.shortcuts import render
from django.http import HttpResponse
# from .models import Video

import json
import base64
import cv2 as cv
import io
import matplotlib.pyplot as plt
import numpy as np

# Create your views here.
def index(request):
    # return HttpResponse("<h1>Hola pvto mundo</h1>")
    return render(request,"tablero.html")

# Create your views here.
def index2(request):
    # return HttpResponse("<h1>Hola pvto mundo</h1>")
    return render(request,"tablero2.html")

def post(request):
    # video = Video(request.POST)
    imgj = request.POST.get('imgJSON')
    # imgjson = json.loads(imgj)
    imgj = imgj.split(',')[1]
    nparr = np.fromstring(base64.b64decode(imgj), np.uint8)
    im = cv.imdecode(nparr, cv.IMREAD_ANYCOLOR)

    cv.imwrite('respuesta.jpg',im)
    print(type(imgj))
    return HttpResponse("holi"+imgj,content_type='application/json')