import cv2
import numpy as np

cap = cv2.VideoCapture("public/character.mp4")
total_frames = int(cap.get(cv2.CAP_PROP_FRAME_COUNT))

# Let's inspect frame differences between consecutive frames to detect pauses, transitions, or movement segments
diffs = []
prev_gray = None
frames_data = []

face_cascade = cv2.CascadeClassifier(cv2.data.haarcascades + 'haarcascade_frontalface_default.xml')

for i in range(total_frames):
    ret, frame = cap.read()
    if not ret:
        break
    gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
    
    # Detect face if looking near frontal
    faces = face_cascade.detectMultiScale(gray, 1.1, 4)
    face_info = len(faces)
    
    if prev_gray is not None:
        diff = np.mean(np.abs(gray.astype(float) - prev_gray.astype(float)))
        diffs.append((i, diff, face_info))
    prev_gray = gray

cap.release()

print("Frame analysis sample (index, motion_diff, frontal_faces):")
for item in diffs[::10]:
    print(f"Frame {item[0]}: diff={item[1]:.2f}, frontal={item[2]}")

# Find frames where frontal face is detected strongly
frontals = [item[0] for item in diffs if item[2] > 0]
print(f"\nFrames with frontal face detected: {frontals}")
