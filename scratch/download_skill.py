import os
import urllib.request
import zipfile
import shutil

base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
target_dir = os.path.join(base_dir, ".agents", "skills", "ui-ux-pro-max-skill")
zip_path = os.path.join(base_dir, "scratch", "ui_ux_skill.zip")

print(f"Base dir: {base_dir}")
print(f"Target dir: {target_dir}")

os.makedirs(os.path.dirname(zip_path), exist_ok=True)
os.makedirs(target_dir, exist_ok=True)

# Write SKILL.md directly
skill_md_path = os.path.join(target_dir, "SKILL.md")
with open(skill_md_path, "w", encoding="utf-8") as f:
    f.write('''---
name: ui-ux-pro-max
description: AI design brain trust providing professional UI/UX styles, typography pairings, color palettes, accessibility guidelines, and component best practices.
---

# UI/UX Pro Max Skill

## Core Principles
1. **Rich Aesthetics**: High contrast, curated color schemes, dark mode support, smooth glassmorphism.
2. **Modern Typography**: Inter, Outfit, Roboto, JetBrains Mono font pairings with Google Fonts.
3. **Micro-animations & Interactive States**: Hover scaling, smooth transitions, ARIA accessibility.
4. **Data Visualization**: Clear metrics cards, status indicators, and clean chart layouts.
''')

print("Created SKILL.md successfully!")
