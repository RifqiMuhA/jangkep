import os
import glob
from rembg import remove
from PIL import Image

def process_images():
    input_dir = 'public/rempah'
    output_dir = 'public/rempah'
    
    # Find all webp and png files
    image_paths = glob.glob(f"{input_dir}/*.webp") + glob.glob(f"{input_dir}/*.png")
    
    print(f"Found {len(image_paths)} images to process.")
    
    for input_path in image_paths:
        try:
            # Skip if it's already a processed file (assuming we might re-run)
            filename = os.path.basename(input_path)
            name, ext = os.path.splitext(filename)
            output_path = os.path.join(output_dir, f"{name}.png")
            
            # If we're processing a webp and the png exists, we might skip, but let's just process all to be sure
            
            print(f"Processing {input_path}...")
            
            with open(input_path, 'rb') as i:
                input_data = i.read()
                
            output_data = remove(input_data)
            
            with open(output_path, 'wb') as o:
                o.write(output_data)
                
            print(f"Saved {output_path}")
            
            # Optional: delete the original webp if successful
            if ext.lower() == '.webp' and os.path.exists(output_path):
                os.remove(input_path)
                print(f"Removed original {input_path}")
                
        except Exception as e:
            print(f"Error processing {input_path}: {e}")

if __name__ == "__main__":
    process_images()
