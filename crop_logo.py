#!/usr/bin/env python3
"""
Crop V3X logo to YouTube channel art requirements: 1024x576 pixels
"""

from PIL import Image
import sys
import os

def crop_for_youtube(input_path, output_path):
    """
    Crop image to YouTube channel art requirements (1024x576)
    Maintains aspect ratio and centers the crop
    """
    try:
        # Open the image
        with Image.open(input_path) as img:
            print(f"Original image size: {img.size}")
            
            # Target dimensions for YouTube
            target_width = 1024
            target_height = 576
            target_ratio = target_width / target_height
            
            # Get current dimensions
            current_width, current_height = img.size
            current_ratio = current_width / current_height
            
            if current_ratio > target_ratio:
                # Image is wider than target ratio, crop width
                new_height = current_height
                new_width = int(new_height * target_ratio)
                left = (current_width - new_width) // 2
                top = 0
                right = left + new_width
                bottom = current_height
            else:
                # Image is taller than target ratio, crop height
                new_width = current_width
                new_height = int(new_width / target_ratio)
                left = 0
                top = (current_height - new_height) // 2
                right = current_width
                bottom = top + new_height
            
            # Crop the image
            cropped = img.crop((left, top, right, bottom))
            
            # Resize to exact YouTube dimensions
            final_image = cropped.resize((target_width, target_height), Image.Resampling.LANCZOS)
            
            # Save the result
            final_image.save(output_path, 'PNG', quality=95)
            print(f"Cropped image saved as: {output_path}")
            print(f"Final size: {final_image.size}")
            
    except Exception as e:
        print(f"Error processing image: {e}")
        return False
    
    return True

if __name__ == "__main__":
    # You'll need to save your V3X logo image as 'v3x_logo.png' in this directory
    input_file = "v3x_logo.png"
    output_file = "v3x_logo_youtube_1024x576.png"
    
    if not os.path.exists(input_file):
        print(f"Please save your V3X logo image as '{input_file}' in the current directory")
        print("Then run this script again")
        sys.exit(1)
    
    success = crop_for_youtube(input_file, output_file)
    
    if success:
        print("\n✅ Successfully cropped logo for YouTube!")
        print(f"📁 Output file: {output_file}")
        print("📐 Dimensions: 1024x576 pixels (YouTube channel art requirements)")
    else:
        print("❌ Failed to crop image") 