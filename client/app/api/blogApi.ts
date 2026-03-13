import axiosInstance from "./axiosInstance";

export const getBlogs = async (topic?: string) => {
  const url = topic ? `blogs/?topic=${topic}` : "blogs/";
  const response = await axiosInstance.get(url);
  return response.data;
};

export const createBlog = async (blogData: any) => {
  const response = await axiosInstance.post("blogs/", blogData, {
     headers: {
       'Content-Type': blogData instanceof FormData ? 'multipart/form-data' : 'application/json'
     }
  });
  return response.data;
};

export const deleteBlog = async (id: number) => {
  const response = await axiosInstance.delete(`blogs/${id}/`);
  return response.data;
};

export const getProfile = async () => {
  const response = await axiosInstance.get("profile/");
  return response.data;
};

export const updateProfile = async (profileData: any) => {
  const response = await axiosInstance.put("profile/", profileData, {
    headers: {
      'Content-Type': profileData instanceof FormData ? 'multipart/form-data' : 'application/json'
    }
  });
  return response.data;
};
