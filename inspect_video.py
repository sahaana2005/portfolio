import cv2
import numpy as np
import os
from PIL import Image

video_path = "public/character.mp4"
cap = cv2.VideoCapture(video_path)

if not cap.isOpened():
    print("Error opening video")
    exit(1)

total_frames = int(cap.get(cv2.CAP_PROP_FRAME_COUNT))
fps = cap.get(cv2.CAP_PROP_FPS)
width = int(cap.get(cv2.CAP_PROP_FRAME_WIDTH))
height = int(cap.get(cv2.CAP_PROP_FRAME_HEIGHT))
duration = total_frames / fps if fps > 0 else 0

print(f"Video Info:")
print(f"Total frames: {total_frames}")
print(f"FPS: {fps}")
print(f"Dimensions: {width}x{height}")
print(f"Duration: {duration:.2f}s")

# Sample corner pixels across several frames to get solid background color
bg_colors = []
for i in range(min(10, total_frames)):
    ret, frame = cap.read()
    if ret:
        # Sample corners (top-left, top-right)
        tl = frame[10, 10]
        tr = frame[10, width - 10]
        bg_colors.append(tl)
        bg_colors.append(tr)

if bg_colors:
    mean_bgr = np.mean(bg_colors, axis=0).astype(int)
    hex_color = f"#{mean_bgr[2]:02x}{mean_bgr[1]:02x}{mean_bgr[0]:02x}"
    print(f"Detected Background Hex: {hex_color} (RGB: {mean_bgr[2]}, {mean_bgr[1]}, {mean_bgr[0]})")

cap.release()
