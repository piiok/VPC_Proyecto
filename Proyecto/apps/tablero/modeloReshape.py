import cv2 as cv
import os
import sys
import numpy as np
import matplotlib.pyplot as plt
from skimage.transform import resize
import scipy.misc

print("-----------------------------------------------------")
print("                   LEYENDO CLASES")
print("-----------------------------------------------------")

path_classes = '../../../../EgoGesture_JPG/'
path_classes_reshape = '../../../../160x120x3EgoGesture_JPG/'
#classes_names = os.listdir(path_classes)
# classes_names = ['SingleNine','SingleSix','SingleOne']
classes_names = ['faces']
print(classes_names)
array_imgs = []

for i in range(0,len(classes_names)):
  array_imgs = np.append(array_imgs,[ classes_names[i] + "/" + x for x in (np.array(os.listdir(path_classes + classes_names[i])))]);

print(array_imgs)

#filename = path_classes_reshape + array_imgs[0]
#img =cv.imread(path_classes+array_imgs[0])
#holi = cv.resize(img,(160,120))
#print(type(holi))
#cv.imwrite(filename, holi)
#plt.imshow(holi)
#plt.show()

for img_path in array_imgs:
  print(img_path)
  filename = path_classes_reshape + img_path
  img =cv.imread(path_classes+img_path)
  holi = cv.resize(img,(160,120))
  cv.imwrite(filename, holi) 

  
