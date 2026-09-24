import cv2
import numpy as np

cap = cv2.VideoCapture("public/character.mp4")

# Load reference poses:
# UP (32), LEFT (78), DOWN (124), RIGHT (170), CENTER (230)
ref_frames = {32: "UP", 55: "UP-LEFT", 78: "LEFT", 101: "DOWN-LEFT", 124: "DOWN", 147: "DOWN-RIGHT", 170: "RIGHT", 193: "UP-RIGHT", 216: "UP", 230: "CENTER"}

# Let's inspect the motion rate by computing optical flow or feature tracking
# Let's track a specific feature, like the nose tip or chin or eyes, across frames 30 to 220
# We can also save a video or animated gif of frames 30 to 220 to see the exact motion speed.
cap.set(cv2.CAP_PROP_POS_FRAMES, 30)
frames_list = []
for f in range(30, 221):
    ret, frame = cap.read()
    if not ret: break
    frames_list.append((f, frame))

print(f"Captured {len(frames_list)} frames between 30 and 220.")

# Let's check frame differences between consecutive frames in this range
speeds = []
for i in range(1, len(frames_list)):
    f1, im1 = frames_list[i-1]
    f2, im2 = frames_list[i]
    diff = np.mean(np.abs(im2.astype(float) - im1.astype(float)))
    speeds.append((f2, diff))

# Print average speeds across the segments:
print("Speed 32..55 (UP->UP-LEFT):", np.mean([s[1] for s in speeds if 32 <= s[0] <= 55]))
print("Speed 55..78 (UP-LEFT->LEFT):", np.mean([s[1] for s in speeds if 55 < s[0] <= 78]))
print("Speed 78..101 (LEFT->DOWN-LEFT):", np.mean([s[1] for s in speeds if 78 < s[0] <= 101]))
print("Speed 101..124 (DOWN-LEFT->DOWN):", np.mean([s[1] for s in speeds if 101 < s[0] <= 124]))
print("Speed 124..147 (DOWN->DOWN-RIGHT):", np.mean([s[1] for s in speeds if 124 < s[0] <= 147]))
print("Speed 147..170 (DOWN-RIGHT->RIGHT):", np.mean([s[1] for s in speeds if 147 < s[0] <= 170]))
print("Speed 170..193 (RIGHT->UP-RIGHT):", np.mean([s[1] for s in speeds if 170 < s[0] <= 193]))
print("Speed 193..216 (UP-RIGHT->UP):", np.mean([s[1] for s in speeds if 193 < s[0] <= 216]))

cap.release()
