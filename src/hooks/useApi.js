import { useCallback, useState } from "react";
import { axiosInstance } from "../Constants";
import { notification } from "antd";

function useApi() {
  const [data, setData] = useState(null);
  const [error, setError] = useState([]);
  const [loading, setLoading] = useState(false);

  const get = useCallback(async (endpoint, params = {}) => {
    setLoading(true);
    try {
      const response = await axiosInstance.get(endpoint, {
        params,
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      setData(() => response.data);
    } catch (error) {
      if(error.response.status === 403){
        notification.error({
          message: "Unauthorized. Please log in again.",
        })
      }
      console.log(error);
    } finally {
      setLoading(false);
    }
  }, []);

  const post = useCallback(async (endpoint, payload) => {
    setLoading(true);
    try {
      const response = await axiosInstance.post(endpoint, payload, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      setData(() => (response ? response.data : null));
      notification.success({
        message: response.data.message,
      });
    } catch (error) {
      setError(error)
      throw Error(error.response.data.message);
    } finally {
      setLoading(false);
    }
  }, []);

  const put = useCallback(async (endpoint, payload) => {
    setLoading(true);
    try {
      const response = await axiosInstance.put(endpoint, payload, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      setData(() => response.data);
      notification.success({
        message: response.data.message,
      });
    } catch (error) {
      console.log(error);
      notification.error({
        message: "Something Went Wrong",
        description: "Please Try Again After Some Time",
      });
      setError(error.response.data.message);
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    data,
    loading,
    error,
    get,
    post,
    put,
  };
}

export default useApi;
