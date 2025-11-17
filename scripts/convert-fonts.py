#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Convert TTF/OTF fonts to WOFF2 format
Requires: pip install fonttools[woff]
"""

import os
import sys
from pathlib import Path

# Fix encoding for Windows console
if sys.platform == 'win32':
    import codecs
    sys.stdout = codecs.getwriter('utf-8')(sys.stdout.buffer, 'strict')
    sys.stderr = codecs.getwriter('utf-8')(sys.stderr.buffer, 'strict')

try:
    from fontTools.ttLib import TTFont
except ImportError:
    print("[!] fonttools not installed. Installing...")
    os.system(f"{sys.executable} -m pip install fonttools[woff] --quiet")
    from fontTools.ttLib import TTFont

ROOT = Path(__file__).parent.parent
FONTS_DIR = ROOT / "frontend" / "public" / "fonts"

FONTS_TO_CONVERT = [
    "salena-regular.ttf",
    "salena-medium.ttf",
    "salena-semibold.ttf",
    "salena-bold.ttf",
    "DavigoDemoRegular-V4Bg0.ttf",
]

def convert_to_woff2(input_path, output_path):
    """Convert TTF/OTF to WOFF2"""
    try:
        font = TTFont(input_path)
        font.flavor = 'woff2'
        font.save(output_path)
        return True
    except Exception as e:
        print(f"   Error: {e}")
        return False

def main():
    print("Converting fonts to WOFF2...\n")
    
    converted = 0
    failed = 0
    
    for font_file in FONTS_TO_CONVERT:
        input_path = FONTS_DIR / font_file
        
        if not input_path.exists():
            # Try .otf extension
            input_path = input_path.with_suffix('.otf')
            if not input_path.exists():
                print(f"[!] Not found: {font_file}")
                failed += 1
                continue
        
        output_name = font_file.replace('.ttf', '.woff2').replace('.otf', '.woff2')
        output_path = FONTS_DIR / output_name
        
        print(f"Converting: {font_file} -> {output_name}...", end=" ")
        
        if convert_to_woff2(input_path, output_path):
            # Get file sizes
            input_size = input_path.stat().st_size / 1024
            output_size = output_path.stat().st_size / 1024
            reduction = ((input_size - output_size) / input_size) * 100
            print(f"OK ({input_size:.1f}KB -> {output_size:.1f}KB, -{reduction:.1f}%)")
            converted += 1
        else:
            print("FAILED")
            failed += 1
    
    print(f"\n[+] Conversion complete!")
    print(f"   Converted: {converted}")
    if failed > 0:
        print(f"   Failed: {failed}")

if __name__ == "__main__":
    main()

