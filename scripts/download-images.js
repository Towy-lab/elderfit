const https = require('https');
const fs = require('fs');
const path = require('path');

// Create directories if they don't exist
const createDirectories = () => {
  const dirs = [
    'src/assets/images',
    'public/images'
  ];
  
  dirs.forEach(dir => {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
      console.log(`Created directory: ${dir}`);
    }
  });
};

// Download image function with progress tracking
const downloadImage = (url, filepath) => {
  return new Promise((resolve, reject) => {
    console.log(`\nDownloading: ${path.basename(filepath)}`);
    
    const request = https.get(url, (response) => {
      if (response.statusCode === 200) {
        const totalSize = parseInt(response.headers['content-length'], 10);
        let downloadedSize = 0;
        
        const writeStream = fs.createWriteStream(filepath);
        
        response.on('data', (chunk) => {
          downloadedSize += chunk.length;
          const progress = (downloadedSize / totalSize * 100).toFixed(2);
          process.stdout.write(`\rProgress: ${progress}%`);
        });
        
        response.pipe(writeStream);
        
        writeStream.on('finish', () => {
          writeStream.close();
          console.log(`\n✓ Downloaded: ${filepath}`);
          resolve();
        });
        
        writeStream.on('error', (err) => {
          fs.unlink(filepath, () => {}); // Delete the file if there's an error
          reject(`Error writing file: ${err.message}`);
        });
      } else {
        reject(`Failed to download ${url}: ${response.statusCode}`);
      }
    });
    
    request.on('error', (err) => {
      reject(`Request error: ${err.message}`);
    });
    
    // Set a timeout
    request.setTimeout(30000, () => {
      request.destroy();
      reject('Request timed out');
    });
  });
};

// Image URLs and their destinations
const images = [
  {
    name: 'Joint Health',
    url: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=1200&q=80',
    path: 'src/assets/images/joint-health.jpg'
  },
  {
    name: 'Joint Health Hero',
    url: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=1600&q=80',
    path: 'src/assets/images/joint-health-hero.jpg'
  },
  {
    name: 'Senior Nutrition',
    url: 'https://images.unsplash.com/photo-1511688878353-3a2f5be94cd7?w=1200&q=80',
    path: 'src/assets/images/senior-nutrition.jpg'
  },
  {
    name: 'Sleep Recovery',
    url: 'https://images.unsplash.com/photo-1511689660979-10d2b1aada49?w=1200&q=80',
    path: 'src/assets/images/sleep-recovery.jpg'
  },
  {
    name: 'Placeholder',
    url: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&q=60',
    path: 'public/images/placeholder.jpg'
  }
];

// Main function with retry logic
const main = async () => {
  console.log('Starting image download process...');
  createDirectories();
  
  const maxRetries = 3;
  const retryDelay = 2000; // 2 seconds
  let allSuccessful = true;
  
  for (const image of images) {
    let retries = 0;
    let success = false;
    
    while (retries < maxRetries && !success) {
      try {
        await downloadImage(image.url, image.path);
        success = true;
      } catch (error) {
        retries++;
        console.error(`\nError downloading ${image.name}: ${error}`);
        
        if (retries < maxRetries) {
          console.log(`Retrying in ${retryDelay/1000} seconds... (Attempt ${retries + 1}/${maxRetries})`);
          await new Promise(resolve => setTimeout(resolve, retryDelay));
        } else {
          console.error(`Failed to download ${image.name} after ${maxRetries} attempts`);
          allSuccessful = false;
        }
      }
    }
  }
  
  if (allSuccessful) {
    console.log('\n✨ All images downloaded successfully!');
  } else {
    console.error('\n❌ Some images failed to download. Please check the errors above.');
  }
};

// Run the script
main().catch(error => {
  console.error('Fatal error:', error);
  process.exit(1);
}); 