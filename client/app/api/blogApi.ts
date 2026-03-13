import axiosInstance from "./axiosInstance";

export const getBlogs = async (topic?: string) => {
  const url = topic ? `blogs/?topic=${topic}` : "blogs/";
  const response = await axiosInstance.get(url);
  return response.data;
};

export const createBlog = async (blogData: { title: string; content: string; topic: string }) => {
  const response = await axiosInstance.post("blogs/", blogData);
  return response.data;
};

export const deleteBlog = async (id: number) => {
  const response = await axiosInstance.delete(`blogs/${id}/`);
  return response.data;
};
