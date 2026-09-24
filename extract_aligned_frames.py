import cv2
import numpy as np
import os
from PIL import Image

video_path = "public/character.mp4"
output_dir = "public/frames"
os.makedirs(output_dir, exist_ok=True)

cap = cv2.VideoCapture(video_path)
total_frames = int(cap.get(cv2.CAP_PROP_FRAME_COUNT))

all_frames = {}
for idx in range(total_frames):
    ret, frame = cap.read()
    if not ret:
        break
    all_frames[idx] = frame
cap.release()

def angle_to_video_frame(theta):
    theta = theta % (2 * np.pi)
    if theta <= 1.5 * np.pi:
        ratio = theta / (1.5 * np.pi)
        vf = 78.0 + ratio * (216.0 - 78.0)
    else:
        ratio = (theta - 1.5 * np.pi) / (0.5 * np.pi)
        vf = 32.0 + ratio * (78.0 - 32.0)
    return int(round(vf))

# Re-extract all 64 frames
for i in range(64):
    theta = (i / 64.0) * 2.0 * np.pi
    vf = angle_to_video_frame(theta)
    bgr_img = all_frames[vf]
    rgb_img = cv2.cvtColor(bgr_img, cv2.COLOR_BGR2RGB)
    pil_img = Image.fromarray(rgb_img)
    out_path = os.path.join(output_dir, f"frame_{i}.webp")
    pil_img.save(out_path, format="WEBP", quality=90, method=6)

# Center frame (looking straight at camera)
center_bgr = all_frames[230]
center_rgb = cv2.cvtColor(center_bgr, cv2.COLOR_BGR2RGB)
center_pil = Image.fromarray(center_rgb)
center_pil.save(os.path.join(output_dir, "center.webp"), format="WEBP", quality=92, method=6)

print("Re-extracted all 64 frames + center.webp with perfect viewer-aligned coordinate mapping!")
