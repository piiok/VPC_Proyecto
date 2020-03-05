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

img_test1 =io.imread('../../../../100x100EgoGesture_JPG/SingleEight/Avenue_Single_Eight_color_137.jpg')
descriptor_extractor = ORB(n_keypoints=400)
descriptor_extractor.detect_and_extract(rgb2gray(img_test1))
descriptors1 = descriptor_extractor.descriptors
keypoints1 = descriptor_extractor.keypoints

plt.imshow(img_test1); 
plt.scatter(keypoints1[:,1], keypoints1[:,0],c= "red",edgecolors="black", alpha=.6);


plt.show()
