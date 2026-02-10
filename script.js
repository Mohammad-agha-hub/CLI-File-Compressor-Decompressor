const fs = require("fs");
const path = require("path");
const zlib = require("zlib");
const { pipeline } = require("stream/promises");

// CLI tool
// Format Bytes Function
function formatBytes(bytes, decimals = 2) {
  if (bytes === 0) return "0 Bytes";

  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ["Bytes", "KB", "MB", "GB", "TB"];

  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
}
// For Compression
async function CompressFile(inputFile, outputFile) {
  const gzip = zlib.createGzip();
  console.log("Compressing");
  const startTime = Date.now();
  let totalSize = fs.statSync(inputFile).size;
  let bytesRead = 0;
  const readStream = fs.createReadStream(inputFile);
  readStream.on("data", (chunk) => {
    bytesRead = bytesRead + chunk.length;
    const progress = ((bytesRead / totalSize) * 100).toFixed(2);
    process.stdout.write(`Progress: ${progress}%\r`);
  });
  try {
    await pipeline(readStream, gzip, fs.createWriteStream(outputFile));
    const endTime = Date.now();
    const duration = ((endTime - startTime) / 1000).toFixed(2);
    const originalSize = totalSize;
    const CompressSize = fs.statSync(outputFile).size;
    const ratio = (
      ((originalSize - CompressSize) / originalSize) *
      100
    ).toFixed(2);
    console.log("Compression completed!");
    console.log(`Original size: ${formatBytes(originalSize)}`);
    console.log(`Compressed Size: ${formatBytes(CompressSize)}`);
    console.log(`Saved: ${ratio}%`);
    console.log(`Time: ${duration}s`);
  } catch (error) {
    console.log("Compression failed", error);
  }
}
// For decompression
async function deCompressFile(inputFile, outputFile) {
  console.log("Decompressing");
  const startTime = Date.now();
  let totalSize = fs.statSync(inputFile).size;
  let bytesRead = 0;
  const readStream = fs.createReadStream(inputFile);
  readStream.on("data", (chunk) => {
    bytesRead += chunk.length;
    const progress = ((bytesRead / totalSize) * 100).toFixed(2);
    process.stdout.write(`Progress:${progress}%\r`);
  });
  try {
    await pipeline(
      readStream,
      zlib.createGunzip(),
      fs.createWriteStream(outputFile),
    );
    const endTime = Date.now();
    const duration = ((endTime - startTime) / 1000).toFixed(2);
    const decompressedFileSize = fs.statSync(outputFile).size;
    const ratio = (
      ((decompressedFileSize - totalSize) / decompressedFileSize) *
      100
    ).toFixed(2);
    console.log(`Time taken:${duration}s`);
    console.log(`Compressed Size:${formatBytes(totalSize)}`);
    console.log(`Decompressed Size:${formatBytes(decompressedFileSize)}`);
    console.log(`Difference:${ratio}%`);
  } catch (error) {
    console.log("Decompression error");
    console.log(error);
  }
}

//CLI Interface
const command = process.argv[2];
const inputFile = process.argv[3];
const outputFile = process.argv[4];
if (command === "compress") {
  CompressFile(inputFile, outputFile || `${inputFile}.gz`);
} else if (command === "decompress") {
  deCompressFile(inputFile, outputFile || inputFile.replace(".gz", ""));
} else {
  console.log("Usage:");
  console.log("node script compress <input>[output]");
  console.log("node script decompress <input>[output]");
}
