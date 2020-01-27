from django.conf.urls import url, include
from apps.tablero.views import index

urlpatterns = [
    url('', index),
]