import axios from 'axios';
import queryString from 'query-string';
import { BlogPostInterface, BlogPostGetQueryInterface } from 'interfaces/blog-post';
import { GetQueryInterface } from '../../interfaces';

export const getBlogPosts = async (query?: BlogPostGetQueryInterface) => {
  const response = await axios.get(`/api/blog-posts${query ? `?${queryString.stringify(query)}` : ''}`);
  return response.data;
};

export const createBlogPost = async (blogPost: BlogPostInterface) => {
  const response = await axios.post('/api/blog-posts', blogPost);
  return response.data;
};

export const updateBlogPostById = async (id: string, blogPost: BlogPostInterface) => {
  const response = await axios.put(`/api/blog-posts/${id}`, blogPost);
  return response.data;
};

export const getBlogPostById = async (id: string, query?: GetQueryInterface) => {
  const response = await axios.get(`/api/blog-posts/${id}${query ? `?${queryString.stringify(query)}` : ''}`);
  return response.data;
};

export const deleteBlogPostById = async (id: string) => {
  const response = await axios.delete(`/api/blog-posts/${id}`);
  return response.data;
};
