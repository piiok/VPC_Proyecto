# from django.db import models
import cv2 as cv
import numpy as np
import json
import base64
from keras.models import model_from_json
import tensorflow as tf
import keras

import numpy as np
import pandas as pd
import matplotlib.pyplot as plt
from keras.utils.np_utils import to_categorical
from sklearn.externals import joblib
from sklearn.svm import SVC
from xgboost import XGBClassifier
from sklearn.neighbors import KNeighborsClassifier
from skimage.feature import (match_descriptors, corner_harris,
                             corner_peaks, ORB, plot_matches)
from sklearn.cluster import KMeans

class Video():
    img = []
    fondo = [] 
    iteracion = 0 #t
    red_neural = None
    Bow = None
    words = None
    classes_name = {
            '1':'Tres',
            '2':'Puño', 
            '3':'Palma', 
            '4':'Cara',
            '5':'Nada',
    }
    # filename = "./apps/tablero/CNN_proyecto_100x100x1_Single_NineOneSix_96_81"


    ''' SVM BUENO 91 EN TRAIN 77  , EN TEST '''
    # filename = "./apps/tablero/BoW_SVM_5.sav" #{'3': 1, 'A': 2, 'B': 3, 'faces': 4}
    # filename_words = "./apps/tablero/BoW_SVM_Words_5.sav"

    ''' NAIVE GAUSSIAN   90 TRAIN  ,  85 TEST '''
    # filename = "./apps/tablero/BoW_NG_1.sav" #{'3': 1, 'A': 2, 'B': 3, 'faces': 4}
    # filename_words = "./apps/tablero/BoW_NG_Words_1.sav"


    ''' KNN NO FUNCIONA NO SE POR QUÉ '''
    # ''' KNN   88 TRAIN  ,  78 TEST '''
    # # filename = "./apps/tablero/BoW_KNN_1.sav" #{'3': 1, 'A': 2, 'B': 3, 'faces': 4}
    # # filename_words = "./apps/tablero/BoW_KNN_1.sav"
    # ''' KNN   88 TRAIN  ,  78 TEST '''
    # filename = "./apps/tablero/BoW_KNN_2.sav" #{'3': 1, 'A': 2, 'B': 3, 'faces': 4}
    # filename_words = "./apps/tablero/BoW_KNN_2.sav"

    ''' SVM BUENO 96 EN TRAIN 85  , EN TEST '''
    # filename = "./apps/tablero/BoW_SVM_6.sav" #{'3': 1, 'A': 2, 'B': 3, 'faces': 4}
    # filename_words = "./apps/tablero/BoW_SVM_Words_6.sav"


    # filename = "./apps/tablero/BoW_XGB_1.sav" #{'3': 1, 'A': 2, 'B': 3, 'faces': 4}
    # filename_words = "./apps/tablero/BoW_XGB_Words_1.sav"

    # filename = "./apps/tablero/p5_jhoan"
    # filename = "./apps/tablero/CNN_proyecto_100x100x1_Single_NineOneSixNothing_93_85"
    

    # filename = "./apps/tablero/BoW_SVM_100x100x1_Single_NineOneSix_63.sav" //No sirve porque no guarde las palabras


    def __init__(self,post):
        self.img = self.Base64ToCVImg(post.get('img'))
        # cv.imwrite('img.jpg',self.img)

        # self.fondo = self.Base64ToCVImg(post.get('img')) if (post.get('fondo') == None) else self.Base64ToCVImg(post.get('fondo'))

        self.iteracion = int(post.get('iteracion'))

        # self.actFondo()
        # cv.imwrite('fondo.jpg',self.fondo)

        # self.red_neural = self.leerCNN(self.filename)

        self.Bow = self.leerModelo(self.filename)
        self.words = self.leerModelo(self.filename_words)

        return

    def prediccion(self):
        img_resize = cv.resize( cv.cvtColor(self.img, cv.COLOR_BGR2RGB) , (100,100))
        # img_resize = cv.resize(self.img , (100,100))
        gray = cv.cvtColor(img_resize,cv.COLOR_BGR2GRAY)
        ret, thresh = cv.threshold(gray,0,255,cv.THRESH_BINARY_INV+cv.THRESH_OTSU)
        cv.imwrite('img.jpg',thresh)
        img_expand = np.reshape(thresh , (-1,100,100,1))
        print("---------------",str(np.shape(img_expand)))
        predicciones = self.red_neural.predict(img_expand)[0]
        print("Predicciones")
        print(predicciones)
        print("SingleOne",predicciones[0])
        print("SingleNine",predicciones[1])
        print("SingleSix",predicciones[2])
        return predicciones

    def prediccionBoW(self):
        try:
            gray = cv.cvtColor(self.img, cv.COLOR_BGR2GRAY) 
            descriptor_extractor = ORB(n_keypoints=200)

            descriptor_extractor.detect_and_extract(gray)
            descriptor = descriptor_extractor.descriptors
            hist = self.build_histogram(descriptor, self.words)
            # hist = hist[0]

            print(hist)
            print(np.shape(hist))
            
            print("---------------",str(np.shape(hist)))
            predicciones = self.Bow.predict(np.r_[[hist]])
            print("Predicciones")
            print(predicciones)
            return predicciones
        except RuntimeError:
            return [5];

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

    def guardarCNN(self,filename, model):
        model_json = model.to_json()
        with open(filename+".json", "w") as json_file:
            json_file.write(model_json)
        model.save_weights(filename+".h5")
        print("Modelo Guardado")

    #return model
    def leerCNN(self, filename):
        json_file = open(filename+'.json', 'r')
        loaded_model_json = json_file.read()
        json_file.close()
        loaded_model = model_from_json(loaded_model_json)
        loaded_model.load_weights(filename+".h5")
        return loaded_model
        
    
    def guardarModelo(self, filename, model):
        joblib.dump(model, filename)
        print("Modelo Guardado")

    #return model
    def leerModelo(self, filename):
        return joblib.load(filename)

    def build_histogram(self,descriptor_list, cluster_alg):
        histogram = np.zeros(len(cluster_alg.cluster_centers_))
        cluster_result =  cluster_alg.predict(descriptor_list)
        for i in cluster_result:
            histogram[i] += 1.0
        return histogram
