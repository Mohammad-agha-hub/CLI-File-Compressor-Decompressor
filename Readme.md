#  Node.js File Compression CLI Tool

A simple and efficient **command-line file compressor and decompressor** built using **Node.js streams** and the native **zlib** module.  
This tool allows you to compress files into `.gz` format and decompress them back while showing real-time progress, file size statistics, and execution time.

---

## ✨ Features

- Compress files using **Gzip**
- Decompress `.gz` files back to original format
- Real-time progress display (percentage)
- Displays:
  - Original file size
  - Compressed / decompressed file size
  - Compression savings or size difference
  - Time taken
- Uses Node.js **streams** (memory efficient)
- No external dependencies

---

## 🛠️ Requirements

- **Node.js v14 or higher**
- Works on Windows, macOS, and Linux

---

## 📂 Project Files

```text
script.js
README.md
```
## How to Use the Project
### For Compressing
node script.js compress <inputFile> [outputFile]
#### Example: node script.js compress example.txt
This creates: example.txt.gz
### For Decompressing
node script.js decompress <inputFile> [outputFile]
#### Example: node script.js decompress example.txt.gz
This restores example.txt
### Custom output:
node script.js decompress example.txt.gz restored.txt
### Example Output:
```
Compressing
Progress: 100.00%
Compression completed!
Original size: 12.30 MB
Compressed Size: 4.10 MB
Saved: 66.67%
Time: 1.03s
```