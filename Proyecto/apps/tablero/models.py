# from django.db import models
import cv2 as cv
import numpy as np
import json
import base64
# Create your models here.
class Video():
    img = []
    fondo = [] 
    iteracion = 0 #t

    def __init__(self,post):
        self.img = self.Base64ToCVImg(post.get('img'))
        cv.imwrite('img.jpg',self.img)

        self.fondo = self.Base64ToCVImg(post.get('img')) if (post.get('fondo') == None) else self.Base64ToCVImg(post.get('fondo'))

        self.iteracion = int(post.get('iteracion'))

        self.actFondo()
        cv.imwrite('fondo.jpg',self.fondo)
        return

    def actFondo(self):
        alpha = ( 1 / self.iteracion )
        if( np.sum(self.fondo - self.img) != 0 ):
            self.fondo =  ( 1 - alpha ) * self.fondo + alpha * self.img 
        return 
    
    def Base64ToCVImg(self,postVar):
        imgj = postVar.split(',')[1]
        nparr = np.fromstring(base64.b64decode(imgj), np.uint8)
        im = cv.imdecode(nparr, cv.IMREAD_ANYCOLOR)
        return im

    def CVImgToBase64(self,im):
        string = base64.b64encode(cv.imencode('.jpg', im)[1]).decode()
        return "data:image/png;base64,"+string
    
