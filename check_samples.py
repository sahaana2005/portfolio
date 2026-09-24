import cv2
import numpy as np
import glob
import os

files = sorted(glob.glob("scratch/frame_samples/frame_*.jpg"))
print(f"Total extracted test frames: {len(files)}")
print("Files:", [os.path.basename(f) for f in files[:10]], "...", [os.path.basename(f) for f in files[-10:]])
