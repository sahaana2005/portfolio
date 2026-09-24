import cv2
import numpy as np
import os
from PIL import Image

video_path = "public/character.mp4"
output_dir = "public/frames"
os.makedirs(output_dir, exist_ok=True)

cap = cv2.VideoCapture(video_path)
if not cap.isOpened():
    print("Error opening video")
    exit(1)

total_frames = int(cap.get(cv2.CAP_PROP_FRAME_COUNT))
print(f"Total video frames: {total_frames}")

# Calculate exact video frame for any angle theta in [0, 2*pi)
def angle_to_video_frame(theta):
    # theta in radians [0, 2*pi)
    # 0 = RIGHT, pi/2 = DOWN, pi = LEFT, 1.5*pi = UP
    theta = theta % (2 * np.pi)
    if theta <= 1.5 * np.pi:
        ratio = theta / (1.5 * np.pi)
        vf = 170.0 - ratio * (170.0 - 32.0)
    else:
        ratio = (theta - 1.5 * np.pi) / (0.5 * np.pi)
        vf = 216.0 - ratio * (216.0 - 170.0)
    return int(round(vf))

# Read all frames into memory or dictionary so we can quickly extract
all_frames = {}
for idx in range(total_frames):
    ret, frame = cap.read()
    if not ret:
        break
    all_frames[idx] = frame
cap.release()
print(f"Loaded {len(all_frames)} frames into memory.")

# Sample background color accurately from multiple frames and corners
corners = []
for f_idx in [32, 55, 78, 101, 124, 147, 170, 193, 216, 230]:
    frm = all_frames[f_idx]
    # Sample 4 corners
    corners.append(frm[5:25, 5:25])
    corners.append(frm[5:25, -25:-5])
    corners.append(frm[-25:-5, 5:25])
    corners.append(frm[-25:-5, -25:-5])

all_corners = np.concatenate([c.reshape(-1, 3) for c in corners], axis=0)
median_bgr = np.median(all_corners, axis=0).astype(int)
hex_color = f"#{median_bgr[2]:02x}{median_bgr[1]:02x}{median_bgr[0]:02x}"
print(f"Exact Background Color: HEX={hex_color}, RGB=({median_bgr[2]}, {median_bgr[1]}, {median_bgr[0]})")

# Save background color info
with open("scratch/bg_color.txt", "w") as f:
    f.write(f"{hex_color}\nRGB: {median_bgr[2]}, {median_bgr[1]}, {median_bgr[0]}\n")

# Pre-extract 64 WebP frames
print("Extracting 64 WebP circular frames...")
for i in range(64):
    theta = (i / 64.0) * 2.0 * np.pi
    vf = angle_to_video_frame(theta)
    bgr_img = all_frames[vf]
    rgb_img = cv2.cvtColor(bgr_img, cv2.COLOR_BGR2RGB)
    pil_img = Image.fromarray(rgb_img)
    out_path = os.path.join(output_dir, f"frame_{i}.webp")
    pil_img.save(out_path, format="WEBP", quality=90, method=6)

# Extract center neutral frame (frame 230)
center_bgr = all_frames[230]
center_rgb = cv2.cvtColor(center_bgr, cv2.COLOR_BGR2RGB)
center_pil = Image.fromarray(center_rgb)
center_pil.save(os.path.join(output_dir, "center.webp"), format="WEBP", quality=92, method=6)
print("Saved center.webp from frame 230.")

print("All 64 frames + center.webp successfully extracted!")
