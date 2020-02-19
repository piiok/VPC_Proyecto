# from django.db import models
import cv2 as cv
import json
# Create your models here.
class Video():
    img = []
    fondo = []
    def __init__(self,post):
        self.img = json.loads(post.get('imgJSON'))
        self.fondo = json.loads(post.get('fondoJSON'))
        return
    # def tracking():
