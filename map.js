const axios = require('axios');
const cheerio = require('cheerio');

const mapFunction = async () => {
  const shortUrl = 'https://maps.app.goo.gl/YuKcknKALgvHAeir8'; // Your short Google Maps URL
  
  try {
    // Send GET request to resolve the short URL
    const response = await axios.get(shortUrl, { maxRedirects: 0, validateStatus: null });
    
    // Get the resolved URL from the headers
    const resolvedUrl = response.headers.location;

    if (!resolvedUrl) {
      console.log('Unable to resolve the short URL');
      return;
    }

    console.log('Resolved URL:', resolvedUrl); // This should give you the full Google Maps URL
    
    // Now extract the embed link (we are assuming that the resolved URL contains the /maps/place/ or /maps/embed URL)
    const embedUrl = resolvedUrl.replace('/maps/place/', '/maps/embed?pb=').replace(/@.*$/, "");

    console.log('Embed URL:', embedUrl);

    // Extract the pb parameter from the embed URL
    const pbParam = embedUrl.split('?pb=')[1];
    console.log('PB Parameter:', pbParam); // This will give you the pb parameters

  } catch (error) {
    console.error('Error:', error);
  }
};

mapFunction();
