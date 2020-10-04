import json
import os

TARGET_DIR = "ru"
OUTPUT_FILE = "initial_source.json"
OUTPUT_DATA = []
ALREADY_ADDED = set()
for (dirpath, dirnames, filenames) in os.walk(TARGET_DIR):
    for f in filenames:
        if not f.endswith(".json"):
            continue

        with open(os.path.join(TARGET_DIR, f)) as fp:
            input_data = json.load(fp)
        
        for k, v in input_data.items():
            if not k:
                continue
            if k in ALREADY_ADDED:
                continue
            ALREADY_ADDED.add(k)
            OUTPUT_DATA.append({
                "model": "translations.source", 
                "pk": len(OUTPUT_DATA) + 1, 
                "fields": {
                    "value": k, 
                    "created_at": "2020-10-01T19:36:00Z"
                }
            })

with open(OUTPUT_FILE, "w") as fp:
    json.dump(OUTPUT_DATA, fp, indent=4, ensure_ascii=False)
