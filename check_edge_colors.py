from PIL import Image
import numpy as np
import glob

# Inspect edge pixels of multiple frames
for frame_path in ["public/frames/center.webp", "public/frames/frame_0.webp", "public/frames/frame_32.webp"]:
    im = Image.open(frame_path)
    arr = np.array(im)
    # Check edges
    left_edge = arr[:, 0, :3]
    right_edge = arr[:, -1, :3]
    top_edge = arr[0, :, :3]
    
    # Calculate median of edge pixels
    all_edge = np.vstack([left_edge, right_edge, top_edge])
    median_rgb = np.median(all_edge, axis=0).astype(int)
    hex_col = f"#{median_rgb[0]:02x}{median_rgb[1]:02x}{median_rgb[2]:02x}"
    
    print(f"{frame_path}:")
    print(f"  Median edge RGB: {median_rgb}, HEX: {hex_col}")
    print(f"  Top-left (0,0): {arr[0,0,:3]}")
    print(f"  Top-right (0,-1): {arr[0,-1,:3]}")
    print(f"  Mid-left (H//2, 0): {arr[arr.shape[0]//2, 0, :3]}")
    print(f"  Mid-right (H//2, -1): {arr[arr.shape[0]//2, -1, :3]}")
