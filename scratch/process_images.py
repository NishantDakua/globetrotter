import os
from PIL import Image

IMG_DIR = "/mnt/linux-data/Hackathons/OdooxLDCE/public/images"
OUT_DIR = "/mnt/linux-data/Hackathons/OdooxLDCE/public/images/optimized"
os.makedirs(OUT_DIR, exist_ok=True)

# Image mapping for responsive variants
# Target widths: 480, 768, 1200, 1920
WIDTHS = [480, 768, 1200, 1920]

images = [f for f in os.listdir(IMG_DIR) if f.endswith(('.jpg', '.jpeg', '.png'))]

for img_name in sorted(images):
    src_path = os.path.join(IMG_DIR, img_name)
    base_name = os.path.splitext(img_name)[0]
    
    with Image.open(src_path) as im:
        # Convert to RGB if needed
        if im.mode in ("RGBA", "P"):
            im = im.convert("RGB")
        
        orig_width, orig_height = im.size
        aspect_ratio = orig_height / orig_width

        # Always save a high-quality WebP full version
        full_webp_path = os.path.join(OUT_DIR, f"{base_name}.webp")
        im.save(full_webp_path, "WEBP", quality=82, method=6)
        print(f"Saved full: {base_name}.webp ({os.path.getsize(full_webp_path)/1024:.1f} KB)")

        # Save responsive variants
        for target_w in WIDTHS:
            if target_w >= orig_width:
                continue
            target_h = int(target_w * aspect_ratio)
            resized = im.resize((target_w, target_h), Image.Resampling.LANCZOS)
            variant_path = os.path.join(OUT_DIR, f"{base_name}-{target_w}.webp")
            resized.save(variant_path, "WEBP", quality=80, method=6)
            print(f"Saved variant: {base_name}-{target_w}.webp ({os.path.getsize(variant_path)/1024:.1f} KB)")

print("\nImage processing finished successfully!")
