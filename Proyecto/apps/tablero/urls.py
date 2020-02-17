from django.conf.urls import url, include
from apps.tablero.views import index,post

urlpatterns = [
    url('sendCap', post),
    url('', index),
    
]