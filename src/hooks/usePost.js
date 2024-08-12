import { useState } from "react";
import { axiosInstance } from "../Constants";
import { notification } from "antd";

export const usePost = () => {
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(null);
  const [response, setResponse] = useState(null);

  const postData = async (path, body, headers = undefined) => {
    try {
      setIsLoading(true);
      const response = await axiosInstance.post(path, body, {
        headers: {
          Authorization: localStorage.getItem("token") != null
            ? `Bearer ${localStorage.getItem("token")}`
            : undefined,
          ...headers,
        },
      });
      setResponse(response.data);
    } catch (error) {
      if(error.response.status === 403){
        notification.error({
          message: "You are not authorized to perform this action."
        })
      }
      else{
        notification.error({
          message : error.response.data.message,
        })
      }
      setError(error);
    } finally {
      setIsLoading(false);
    }
  };

  return { postData, response, isLoading, error };
};
