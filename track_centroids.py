import cv2
import numpy as np

cap = cv2.VideoCapture("public/character.mp4")
total_frames = int(cap.get(cv2.CAP_PROP_FRAME_COUNT))

# We know the background color is #e25580 (BGR: 128, 85, 226)
# Any pixel significantly different from background is the character!
bg_bgr = np.array([128, 85, 226], dtype=np.float32)

centroids = []
for i in range(total_frames):
    ret, frame = cap.read()
    if not ret:
        break
    
    # Character mask (distance from background color)
    diff = np.linalg.norm(frame.astype(np.float32) - bg_bgr, axis=2)
    # Head region roughly y: 50..400, x: 450..830
    head_mask = (diff[50:400, 450:830] > 30).astype(np.uint8)
    
    # Compute center of mass of head mask or dark pixels (hair / eyes)
    head_region = frame[50:400, 450:830]
    gray_head = cv2.cvtColor(head_region, cv2.COLOR_BGR2GRAY)
    
    # Dark features (eyes, nose, mouth, hair)
    dark_mask = (gray_head < 120) & (head_mask > 0)
    
    pts = np.argwhere(dark_mask)
    if len(pts) > 0:
        cy, cx = pts.mean(axis=0)
        centroids.append((i, cx, cy))
    else:
        centroids.append((i, 0, 0))

cap.release()

print("Extracted centroids for frames:")
# Print every 10 frames
for c in centroids[::10]:
    print(f"Frame {c[0]:3d}: x={c[1]:.1f}, y={c[2]:.1f}")

# Let's save a plot or CSV of centroids to see the circular trajectory!
with open("scratch/centroids.txt", "w") as f:
    for c in centroids:
        f.write(f"{c[0]},{c[1]:.2f},{c[2]:.2f}\n")

print("Saved scratch/centroids.txt")
