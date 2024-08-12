import { Button, Checkbox, Drawer, Spin } from "antd";
import React, { useEffect, useState } from "react";
import useApi from "../../hooks/useApi";
import { formatDate } from "../../utils/helpers";
import { usePut } from "../../hooks/usePut";
import { useDelete } from "../../hooks/useDelete";

const Notification = ({ setShowNotification }) => {
  const { data, loading, get, error } = useApi();
  const { putData, updateResponse, updateLoading, updateError } = usePut();
  const { deleteData, deleteResponse, deleteLoading, deleteError } =
    useDelete();
  const [selectedNotifications, setSelectedNotifications] = useState([]);
  const [selectAll, setSelectAll] = useState(false);

  useEffect(() => {
    get("/notification");
  }, [updateResponse, deleteResponse]);


  function getIcon(type) {
    switch (type) {
      case "Portal Register User":
        return <i class="fi fi-tr-review"></i>;
      case "Portal Plan Purchase":
        return <i class="fi fi-rr-review"></i>;
      case "Payout Request":
        return <i class="fi fi-tr-deposit"></i>;
      default:
        return <i class="fi fi-tr-default"></i>;
    }
  }

  async function updateNotification() {
    try {
    } catch (error) {}
  }

  async function deleteNotifications() {
    try {
      if (selectAll) {
        deleteData(`/notification/all`);
      } else {
        deleteData(`/notification`, {
          id: selectedNotifications,
        });
      }
      get("/notification");
    } catch (error) {
      console.log(error);
    }
  }

  async function handleMarkAllAsRead() {
    try {
      await putData("/notification");
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <Drawer
      placement="right"
      open={true}
      onClose={() => setShowNotification(false)}
      className="notification-drawer"
    >
      {loading ? (
        <Spin style={{ color: "#fff" }} />
      ) : (
        <>
          {data?.data?.length ? (
            <>
              <div className="notification-header">
                <Checkbox
                  checked={selectAll}
                  onChange={(e) => setSelectAll(e.target.checked)}
                />
                <div className="action-btns">
                  <Button
                    className="mark-all-read-btn"
                    onClick={handleMarkAllAsRead}
                  >
                    <i class="fi fi-rr-check-double"></i>
                    Mark all as read
                  </Button>
                  <Button
                    className="delete-notifications"
                    onClick={deleteNotifications}
                  >
                    <i class="fi fi-ss-trash"></i>
                  </Button>
                </div>
              </div>
              {data?.data?.map((notification, index) => (
                <div
                  key={notification.id}
                  className="notification-card"
                  style={{
                    background: notification.read_at
                      ? "#ffffff10"
                      : "#ffffff30",
                  }}
                >
                  <Checkbox
                    checked={
                      selectedNotifications.includes(notification.id) ||
                      selectAll
                    }
                    onClick={() => {
                      if (selectedNotifications.includes(notification.id)) {
                        setSelectedNotifications((prev) =>
                          prev.filter((id) => id !== notification.id)
                        );
                      } else {
                        setSelectedNotifications((prev) => [
                          ...prev,
                          notification.id,
                        ]);
                      }
                    }}
                  />
                  {getIcon(notification.type)}
                  <div className="notification-content">
                    <p>{notification.content}</p>
                    <span>{formatDate(new Date(notification.created_at))}</span>
                  </div>
                </div>
              ))}
            </>
          ) : (
            <center>No Notifications Found</center>
          )}
        </>
      )}
    </Drawer>
  );
};

export default Notification;
