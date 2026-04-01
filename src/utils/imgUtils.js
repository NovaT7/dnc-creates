/**
 * Optimizes image URLs for performance by adding dimension and quality parameters.
 * Currently supports Unsplash and standard parameters.
 * 
 * @param {string} url - The original image URL
 * @param {object} options - Optimization options
 * @returns {string} - The optimized URL
 */
export const optimizeImage = (url, { width = 800, quality = 80, format = 'webp' } = {}) => {
  if (!url) return url;

  // Handle Unsplash URLs
  if (url.includes('images.unsplash.com')) {
    // Remove existing width/quality if present to avoid conflicts
    const baseUrl = url.split('?')[0];
    const params = new URLSearchParams(url.split('?')[1] || '');
    
    params.set('w', width);
    params.set('q', quality);
    params.set('fm', format);
    params.set('fit', 'crop'); // Consistent cropping
    params.set('auto', 'format'); // Intelligent format selection backoff
    
    return `${baseUrl}?${params.toString()}`;
  }

  // Handle Cloudinary (if applicable)
  if (url.includes('res.cloudinary.com')) {
    return url.replace('/upload/', `/upload/w_${width},q_${quality},f_auto/`);
  }

  return url;
};
