from django.conf.urls import url, include
from apps.tablero.views import *

urlpatterns = [
    url('sendCap', post),
    url('tablero', index2),
    url('', index),
    
    
]