import axios from 'axios';

/**
 * Search Wikipedia for a topic and get the summary
 * Works for ANY topic - technology, science, history, language, etc.
 * @param {string} topic - The topic to search for
 * @returns {Promise<Object|null>} - Wikipedia content with title, content, and url
 */
export async function getWikipediaContent(topic) {
  try {
    console.log(`📚 Searching Wikipedia for: "${topic}"`);
    
    // First, search for the topic to get the correct page title
    const searchUrl = `https://en.wikipedia.org/w/api.php?action=query&list=search&srsearch=${encodeURIComponent(topic)}&format=json&origin=*&srlimit=3`;
    
    const searchResponse = await axios.get(searchUrl, {
      timeout: 10000, // 10 second timeout
      headers: {
        'User-Agent': 'ConceptClarity/1.0 (Educational chatbot)'
      }
    });
    
    if (!searchResponse.data?.query?.search || searchResponse.data.query.search.length === 0) {
      console.log('⚠️ No Wikipedia results found for:', topic);
      return null;
    }
    
    // Get the first search result's title
    const pageTitle = searchResponse.data.query.search[0].title;
    console.log(`✅ Found Wikipedia page: "${pageTitle}"`);
    
    // Get the page content summary (intro section)
    const contentUrl = `https://en.wikipedia.org/w/api.php?action=query&prop=extracts&exintro=true&explaintext=true&titles=${encodeURIComponent(pageTitle)}&format=json&origin=*`;
    
    const contentResponse = await axios.get(contentUrl, {
      timeout: 10000,
      headers: {
        'User-Agent': 'ConceptClarity/1.0 (Educational chatbot)'
      }
    });
    
    const pages = contentResponse.data?.query?.pages;
    if (!pages) {
      console.log('⚠️ No pages data received from Wikipedia');
      return null;
    }
    
    const pageId = Object.keys(pages)[0];
    const extract = pages[pageId]?.extract;
    
    if (!extract || extract.trim().length === 0) {
      console.log('⚠️ No content found in Wikipedia page');
      return null;
    }
    
    console.log(`✅ Retrieved Wikipedia content (${extract.length} characters)`);
    
    // Limit content to first 3000 characters for better context
    const limitedContent = extract.length > 3000 ? extract.substring(0, 3000) + '...' : extract;
    
    return {
      title: pageTitle,
      content: limitedContent,
      url: `https://en.wikipedia.org/wiki/${encodeURIComponent(pageTitle.replace(/ /g, '_'))}`
    };
  } catch (error) {
    if (error.code === 'ECONNABORTED') {
      console.error('❌ Wikipedia API timeout:', error.message);
    } else if (error.response) {
      console.error('❌ Wikipedia API error:', error.response.status, error.response.statusText);
    } else if (error.request) {
      console.error('❌ Wikipedia API no response:', error.message);
    } else {
      console.error('❌ Wikipedia API error:', error.message);
    }
    return null;
  }
}

/**
 * Get related topics from Wikipedia
 * @param {string} topic - The main topic
 * @returns {Promise<Array>} - Array of related topics
 */
export async function getRelatedTopics(topic) {
  try {
    const searchUrl = `https://en.wikipedia.org/w/api.php?action=query&list=search&srsearch=${encodeURIComponent(topic)}&format=json&origin=*&srlimit=5`;
    const response = await axios.get(searchUrl);
    
    if (!response.data.query.search.length) {
      return [];
    }
    
    return response.data.query.search.map(result => result.title);
  } catch (error) {
    console.error('Error fetching related topics:', error.message);
    return [];
  }
}
