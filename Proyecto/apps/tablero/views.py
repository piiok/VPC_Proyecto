from django.shortcuts import render
from django.http import HttpResponse
from .models import Video

# Create your views here.
def index(request):
    # return HttpResponse("<h1>Hola pvto mundo</h1>")
    return render(request,"tablero.html")

def post(request):
    video = Video(request.POST)
    return HttpResponse("<h1>Hola pvto mundo</h1>")