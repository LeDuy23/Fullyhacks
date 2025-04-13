
import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import * as path from 'path';
import * as os from 'os';
import * as fs from 'fs';
import * as fetch from 'node-fetch';
import * as Canvas from 'canvas';

// Process and blur images that are uploaded to Firebase Storage
export const blurImage = async (object: functions.storage.ObjectMetadata) => {
  // File details
  const filePath = object.name;
  const contentType = object.contentType;
  
  // Exit if this is not an image
  if (!filePath || !contentType || !contentType.startsWith('image/')) {
    console.log('Not an image, exiting function');
    return null;
  }
  
  // Exit if this is already a blurred image
  if (filePath.includes('blurred_')) {
    console.log('Already a blurred image, exiting function');
    return null;
  }
  
  // Get the file name and directory
  const fileName = path.basename(filePath);
  const dirName = path.dirname(filePath);
  
  try {
    // Create temp directory
    const tempDir = os.tmpdir();
    const tempFilePath = path.join(tempDir, fileName);
    const blurredFilePath = path.join(tempDir, `blurred_${fileName}`);
    
    // Download the file
    const bucket = admin.storage().bucket(object.bucket);
    await bucket.file(filePath).download({destination: tempFilePath});
    
    // Create blurred version
    const image = await Canvas.loadImage(tempFilePath);
    const canvas = Canvas.createCanvas(image.width, image.height);
    const ctx = canvas.getContext('2d');
    
    // Draw original image
    ctx.drawImage(image, 0, 0, image.width, image.height);
    
    // Apply blur filter
    ctx.filter = 'blur(10px)';
    ctx.drawImage(image, 0, 0, image.width, image.height);
    
    // Save blurred image
    const blurredBuffer = canvas.toBuffer();
    fs.writeFileSync(blurredFilePath, blurredBuffer);
    
    // Upload blurred image
    const blurredFileName = `blurred_${fileName}`;
    const blurredFileDest = path.join(dirName, blurredFileName);
    
    await bucket.upload(blurredFilePath, {
      destination: blurredFileDest,
      metadata: {
        contentType: contentType,
        metadata: {
          originalFile: filePath,
          blurred: 'true'
        }
      }
    });
    
    // Clean up temp files
    fs.unlinkSync(tempFilePath);
    fs.unlinkSync(blurredFilePath);
    
    console.log(`Successfully blurred image: ${filePath}`);
    return null;
  } catch (error) {
    console.error('Error processing image:', error);
    return null;
  }
};
