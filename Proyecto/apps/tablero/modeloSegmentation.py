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

path_classes = '../../../../dataset_jhoan/'
path_classes_reshape = '../../../../dataset_jhoan_segmentation/'
classes_names = os.listdir(path_classes)
# classes_names = ['SingleNine','SingleSix','SingleOne']
# classes_names = ['faces']
print(classes_names)
array_imgs = []

for i in range(0,len(classes_names)):
  array_imgs = np.append(array_imgs,[ classes_names[i] + "/" + x for x in (np.array(os.listdir(path_classes + classes_names[i])))]);

print(array_imgs)

filename_foto = path_classes + array_imgs[3]
img_test = cv.cvtColor(cv.imread(filename_foto),cv.COLOR_BGR2RGB)
gray = cv.cvtColor(img_test,cv.COLOR_BGR2GRAY)
ret, thresh = cv.threshold(gray,0,255,cv.THRESH_BINARY_INV+cv.THRESH_OTSU)
filename = path_classes_reshape + array_imgs[3]
cv.imwrite(filename, thresh)
print(np.shape(ret),np.shape(thresh))
plt.imshow(thresh , cmap='gray'), plt.grid();


# img =cv.imread(path_classes+array_imgs[0])
# holi = cv.resize(img,(160,120))
# print(type(holi))
# cv.imwrite(filename, holi)
# plt.imshow(holi)
# plt.show()

for img_path in array_imgs:
  print(img_path)
  # filename = path_classes_reshape + img_path
  # img =cv.imread(path_classes+img_path)
  # holi = cv.resize(img,(160,120))
  # cv.imwrite(filename, holi) 

  filename_foto = path_classes + img_path
  img_test = cv.cvtColor(cv.imread(filename_foto),cv.COLOR_BGR2RGB)
  gray = cv.cvtColor(img_test,cv.COLOR_BGR2GRAY)
  ret, thresh = cv.threshold(gray,0,255,cv.THRESH_BINARY_INV+cv.THRESH_OTSU)
  filename = path_classes_reshape + img_path
  cv.imwrite(filename, thresh)

  
