import { useState } from "react";
import { axiosInstance } from "../Constants";

export const usePut = () => {
  const [updateError, setError] = useState(null);
  const [updateLoading, setIsLoading] = useState(null);
  const [updateResponse, setResponse] = useState(null);

  const putData = async (path, body) => {
    setIsLoading(true);
    const response = await axiosInstance.put(path, body , {
      headers : {
        Authorization : localStorage.getItem("token") ? `Bearer ${localStorage.getItem("token")}` : undefined
      }
    });
    setResponse(response.data);
    setIsLoading(false);
  };

  return { putData, updateResponse, updateLoading, updateError };
};
