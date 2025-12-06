import axios from 'axios';

const API_BASE_URL = 'http://https://ptskumba-backend.onrender.com';

// Create axios instance for blog API
const blogApi = axios.create({
  baseURL: `${API_BASE_URL}/api/blog/`,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add interceptor to include auth token
blogApi.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('userToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export const BlogService = {
  // ===== ARTICLES =====
  
  // Get all articles
  getArticles: async (filters = {}) => {
    try {
      console.log('🔍 Fetching articles with filters:', filters);
      const response = await blogApi.get('articles/', { params: filters });
      console.log('✅ Articles fetched successfully:', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ Error fetching articles:', error);
      throw error;
    }
  },

  // Get single article by ID
  getArticle: async (id) => {
    try {
      console.log('🔍 Fetching article with ID:', id);
      const response = await blogApi.get(`articles/${id}/`);
      console.log('✅ Article fetched successfully:', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ Error fetching article:', error);
      throw error;
    }
  },

  // Create new article
  createArticle: async (articleData) => {
    try {
      console.log('🔍 Creating article with data:', articleData);
      const response = await blogApi.post('articles/', articleData);
      console.log('✅ Article created successfully:', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ Error creating article:', error);
      throw error;
    }
  },

  // Update existing article
  updateArticle: async (id, articleData) => {
    try {
      console.log('🔍 Updating article with ID:', id, 'data:', articleData);
      const response = await blogApi.put(`articles/${id}/`, articleData);
      console.log('✅ Article updated successfully:', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ Error updating article:', error);
      throw error;
    }
  },

  // Delete article
  deleteArticle: async (id) => {
    try {
      console.log('🔍 Deleting article with ID:', id);
      const response = await blogApi.delete(`articles/${id}/`);
      console.log('✅ Article deleted successfully');
      return response.data;
    } catch (error) {
      console.error('❌ Error deleting article:', error);
      throw error;
    }
  },

  // ===== CAROUSEL IMAGES =====
  
  // Get all carousel images
  getCarouselImages: async (filters = {}) => {
    try {
      console.log('🔍 Fetching carousel images with filters:', filters);
      const response = await blogApi.get('carousel-images/', { params: filters });
      console.log('✅ Carousel images fetched successfully:', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ Error fetching carousel images:', error);
      throw error;
    }
  },

  // Get single carousel image by ID
  getCarouselImage: async (id) => {
    try {
      console.log('🔍 Fetching carousel image with ID:', id);
      const response = await blogApi.get(`carousel-images/${id}/`);
      console.log('✅ Carousel image fetched successfully:', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ Error fetching carousel image:', error);
      throw error;
    }
  },

  // Create new carousel image
  createCarouselImage: async (imageData) => {
    try {
      console.log('🔍 Creating carousel image with data:', imageData);
      const response = await blogApi.post('carousel-images/', imageData);
      console.log('✅ Carousel image created successfully:', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ Error creating carousel image:', error);
      throw error;
    }
  },

  // Update existing carousel image
  updateCarouselImage: async (id, imageData) => {
    try {
      console.log('🔍 Updating carousel image with ID:', id, 'data:', imageData);
      const response = await blogApi.put(`carousel-images/${id}/`, imageData);
      console.log('✅ Carousel image updated successfully:', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ Error updating carousel image:', error);
      throw error;
    }
  },

  // Delete carousel image
  deleteCarouselImage: async (id) => {
    try {
      console.log('🔍 Deleting carousel image with ID:', id);
      const response = await blogApi.delete(`carousel-images/${id}/`);
      console.log('✅ Carousel image deleted successfully');
      return response.data;
    } catch (error) {
      console.error('❌ Error deleting carousel image:', error);
      throw error;
    }
  },

  // ===== UTILITY METHODS =====
  
  // Get articles count for dashboard
  getArticlesCount: async () => {
    try {
      console.log('🔍 Fetching articles count');
      const response = await blogApi.get('articles/');
      console.log('✅ Articles count fetched successfully:', response.data.length);
      return response.data.length || 0;
    } catch (error) {
      console.error('❌ Error fetching articles count:', error);
      return 0;
    }
  },

  // Get carousel images count for dashboard
  getCarouselImagesCount: async () => {
    try {
      console.log('🔍 Fetching carousel images count');
      const response = await blogApi.get('carousel-images/');
      console.log('✅ Carousel images count fetched successfully:', response.data.length);
      return response.data.length || 0;
    } catch (error) {
      console.error('❌ Error fetching carousel images count:', error);
      return 0;
    }
  },
};

export default BlogService;
