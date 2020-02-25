from django.shortcuts import render
from django.http import HttpResponse
from django.views.decorators.csrf import csrf_exempt
from .models import Video

import json
import io

# Create your views here.
def index(request):
    # return HttpResponse("<h1>Hola pvto mundo</h1>")
    return render(request,"tablero.html")

# Create your views here.
def index2(request):
    # return HttpResponse("<h1>Hola pvto mundo</h1>")
    return render(request,"tablero2.html")


@csrf_exempt
def post(request):
    video = Video(request.POST)    
    return HttpResponse(json.dumps({'img':video.CVImgToBase64(video.fondo)}),content_type='application/json')