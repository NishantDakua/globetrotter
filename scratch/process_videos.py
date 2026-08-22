import os
import subprocess

VID_DIR = "/mnt/linux-data/Hackathons/OdooxLDCE/public/videos"
POSTER_DIR = "/mnt/linux-data/Hackathons/OdooxLDCE/public/videos/posters"
OPT_VID_DIR = "/mnt/linux-data/Hackathons/OdooxLDCE/public/videos/optimized"

os.makedirs(POSTER_DIR, exist_ok=True)
os.makedirs(OPT_VID_DIR, exist_ok=True)

videos = [
    "15519794_3840_2160_24fps.mp4",
    "19096556-uhd_3840_2160_24fps.mp4",
    "20143557-uhd_3840_2160_24fps.mp4"
]

for v in videos:
    v_path = os.path.join(VID_DIR, v)
    base_name = os.path.splitext(v)[0]
    
    # 1. Extract poster frame at 1s as high quality WebP
    poster_path = os.path.join(POSTER_DIR, f"{base_name}.webp")
    cmd_poster = [
        "ffmpeg", "-y", "-ss", "00:00:01.000", "-i", v_path,
        "-vframes", "1", "-vf", "scale=1920:-1", "-q:v", "75", poster_path
    ]
    subprocess.run(cmd_poster, check=True)
    print(f"Extracted poster: {base_name}.webp ({os.path.getsize(poster_path)/1024:.1f} KB)")
    
    # 2. Encode optimized 1080p web-ready video (CRF 20, faststart for instant playback streaming)
    opt_v_path = os.path.join(OPT_VID_DIR, v)
    cmd_video = [
        "ffmpeg", "-y", "-i", v_path,
        "-vf", "scale='min(1920,iw)':-2",
        "-c:v", "libx264", "-crf", "20", "-preset", "medium",
        "-movflags", "+faststart", "-an", opt_v_path
    ]
    subprocess.run(cmd_video, check=True)
    orig_size = os.path.getsize(v_path) / (1024 * 1024)
    opt_size = os.path.getsize(opt_v_path) / (1024 * 1024)
    print(f"Optimized video: {v} ({orig_size:.2f} MB -> {opt_size:.2f} MB)")

print("\nVideo processing finished successfully!")
