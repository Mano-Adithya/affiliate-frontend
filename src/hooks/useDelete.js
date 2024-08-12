import { useState } from "react";
import { axiosInstance } from "../Constants";

export const useDelete = () => {
  const [deleteError, setError] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(null);
  const [deleteResponse, setDeleteResponse] = useState(null);

  const deleteData = async (path, body) => {
    setDeleteLoading(true);
    const response = await axiosInstance.delete(path, {
      data : body,
      headers: {
        Authorization: localStorage.getItem("token")
          ? `Bearer ${localStorage.getItem("token")}`
          : undefined,
      },
    });
    setDeleteResponse(response.data);
    setDeleteLoading(false);
  };

  return { deleteData, deleteResponse, deleteLoading, deleteError };
};
