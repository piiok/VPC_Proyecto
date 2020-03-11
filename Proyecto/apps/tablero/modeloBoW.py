import cv2 as cv
import os
import sys
import numpy as np
import matplotlib.pyplot as plt
from ipywidgets import interact, interactive, fixed, interact_manual
import ipywidgets as widgets
from skimage import io
import random
from skimage.color import rgb2gray
from skimage.feature import (match_descriptors, corner_harris,
                             corner_peaks, ORB, plot_matches)
from sklearn.externals import joblib

#CLASIFICADORES
#from sklearn.svm import SVC
#from xgboost import XGBClassifier
from sklearn.naive_bayes import GaussianNB
#from sklearn.ensemble import RandomForestClassifier
#from sklearn.metrics import confusion_matrix
#from sklearn.neighbors import KNeighborsClassifier
from sklearn.metrics import f1_score, accuracy_score

print("-----------------------------------------------------")
print("                   LEYENDO CLASES")
print("-----------------------------------------------------")

path_classes = '../../../../dataset_jhoan_sin_brazo/'
#classes_names = os.listdir(path_classes)
# classes_names = classes_names[0:4]
classes_names = ['3','A','B','faces']
print(classes_names)
array_imgs = []

for i in range(0,len(classes_names)):
    array_imgs = np.append(array_imgs,[ classes_names[i] + "/" + x for x in (np.array(os.listdir(path_classes + classes_names[i])))]);



print (array_imgs)

print("-----------------------------------------------------")
print("               SEPARANDO TRAIN DE TEST")
print("-----------------------------------------------------")

porcent = 0.9 #Porcentaje de train

#Separar train de test
all_dates = random.sample(list(array_imgs),len(array_imgs))
array_imgs_train = np.array(all_dates[:int(len(all_dates)*porcent)])
array_imgs_test = np.array(all_dates[int(len(all_dates)*porcent):])

print (array_imgs_train.shape, array_imgs_test.shape)
print (array_imgs_train.shape[0]+ array_imgs_test.shape[0])
print (array_imgs_train[0])
print (array_imgs_test[0])

print("-----------------------------------------------------")
print("          LEYENDO IMGs Y EXTRAYENDO ORB")
print("-----------------------------------------------------")
descriptor_extractor = ORB(n_keypoints=150)
array_ORB = list();

for img_path in  array_imgs_train:
  img_test1 =io.imread(path_classes+img_path)
  descriptor_extractor.detect_and_extract(rgb2gray(img_test1))
  descriptors1 = descriptor_extractor.descriptors
  array_ORB.append(descriptors1)

array_ORB_2 = np.concatenate(array_ORB,axis=0)
print (array_ORB)
print(array_ORB_2)
print(array_ORB_2.shape)

print("-----------------------------------------------------")
print("                 ARREGLANDO DATOS")
print("-----------------------------------------------------")

from sklearn.cluster import KMeans
v_words = 70

km = KMeans(n_clusters = v_words, random_state=0).fit(array_ORB_2)

print(type(km))

def build_histogram(descriptor_list, cluster_alg):
    histogram = np.zeros(len(cluster_alg.cluster_centers_))
    cluster_result =  cluster_alg.predict(descriptor_list)
    for i in cluster_result:
        histogram[i] += 1.0
    return histogram

print (classes_names)
dic_classes = {}
for index, name in enumerate(classes_names):
    dic_classes[name] = index+1  

print(dic_classes)
X_train = []
Y_train = []
X_test = []
Y_test = []

for img_path in  array_imgs_train:
  img_test1 =cv.imread(path_classes+img_path,0)
  descriptor_extractor.detect_and_extract(img_test1)
  descriptor = descriptor_extractor.descriptors
  hist = build_histogram(descriptor, km)
  X_train.append(hist)
  path_split = img_path.split('/')
  Y_train.append(dic_classes[path_split[0]])

for img_path in  array_imgs_test:
  img_test1 =cv.imread(path_classes+img_path,0)
  descriptor_extractor.detect_and_extract(img_test1)
  descriptor = descriptor_extractor.descriptors
  hist = build_histogram(descriptor, km)
  X_test.append(hist)
  path_split = img_path.split('/')
  Y_test.append(dic_classes[path_split[0]])

X_train = np.r_[X_train];     
Y_train = np.r_[Y_train];
X_test = np.r_[X_test];     
Y_test = np.r_[Y_test];
print (X_train.shape, Y_train.shape, X_test.shape, Y_test.shape)


print("-----------------------------------------------------")
print("                ENTRENANDO EL MODELO")
print("-----------------------------------------------------")
#SV_est = SVC(kernel='rbf')
SV_est = GaussianNB()
#SV_est = KNeighborsClassifier(n_neighbors=3)
#SV_est = XGBClassifier()

# With Support vector Machine

SV_est.fit(X_train, Y_train)
# Hacer las predicciones en los dos conjuntos de datos
y_pred_train = SV_est.predict(X_train)
y_pred_test =  SV_est.predict(X_test) 

# F1 score - promedio ponderado
print("f1 score en entrenamiento: ", f1_score(Y_train, y_pred_train, average='weighted'))
print("f1 score en prueba: ", f1_score(Y_test, y_pred_test, average='weighted'))
# Accuracy score - promedio aritmetico
print("Accuracy score en entrenamiento: ",accuracy_score(Y_train, y_pred_train))
print("Accuracy score en prueba: ",accuracy_score(Y_test, y_pred_test))

filename = "BoW_NG_3.sav"
joblib.dump(SV_est, filename)
filename = "BoW_NG_Words_3.sav"
joblib.dump(km, filename)
print(filename)
print("Modelo Guardado")

