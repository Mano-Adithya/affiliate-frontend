import { Button, Modal, Progress, message } from "antd";
import Dragger from "antd/es/upload/Dragger";
import React, { useEffect, useState } from "react";
import { usePost } from "../../../../hooks/usePost";
import { userImportTemplate } from "../../../../others";

const UserImportModal = ({ setShowModal, triggerCall }) => {
  const { postData, isLoading, response } = usePost();
  const formData = new FormData();
  const [fileList, setFileList] = useState(undefined);
  const [uploadPercent, setUploadPercent] = useState(20);


  useEffect(() => {
    if (response) {
      message.open({
        type: "success",
        content: response.message,
      });
      setShowModal(false);
      triggerCall();
    }
  }, [response]);

  const handleImport = async () => {
    formData.append("file", fileList[0].originFileObj);
    await postData("/referral/import", formData, {
      "Content-Type": "multipart/form-data",
    });
  };

  const handleChangeUpload = ({ fileList: newFileList }) => {
    setUploadPercent(30);
    setFileList(
      newFileList.map((file) => ({
        ...file,
        status: "uploading",
      }))
    );
    setTimeout(() => {
      setUploadPercent(40);
    }, 300);
    setTimeout(() => {
      setUploadPercent(60);
    }, 500);
    setTimeout(() => {
      setUploadPercent(80);
    }, 1000);
    setTimeout(() => {
      setFileList(
        newFileList.map((file) => ({
          ...file,
          status: "done",
        }))
      );
      setUploadPercent(100);
    }, 1500);
  };

  function handleRemoveFileList() {
    setFileList([]);
  }

  return (
    <Modal open={true} onCancel={() => setShowModal(false)} footer={null}>
      Add New Users
      <div className="user-import-modal">
        <span>
          Before Uploading{" "}
          <a href={userImportTemplate} download>
            Download sample file
          </a>
        </span>
        <Dragger
          onChange={handleChangeUpload}
          customRequest={() => {}}
          fileList={fileList}
          showUploadList={false}
          accept=".csv,.xlsx"
          multiple={false}
        >
          <p className="ant-upload-drag-icon">
            <i class="fi fi-tr-folder-directory"></i>
          </p>
          <p className="ant-upload-text">
            Drag & Drop or Choose file to upload
          </p>
          <p className="ant-upload-hint">Supported Formats: CSV, XLSX</p>
        </Dragger>
        {fileList?.length > 0 && (
          <div className="excel-uploading-section">
            <div>
              <p className="csvIcon">
                <i class="fi fi-ts-file-csv"></i>
              </p>
              {fileList[0].name}
            </div>
            <Progress percent={uploadPercent} strokeColor={"#8c193f"} />
            <p className="removeIcon" onClick={handleRemoveFileList}>
              <i class="fi fi-rr-trash"></i>
            </p>
          </div>
        )}
        <Button
          className="startImportBtn"
          onClick={handleImport}
          disabled={fileList && fileList[0]?.status === "uploading"}
        >
          {isLoading ? "Importing..." : "Import"}
        </Button>
      </div>
    </Modal>
  );
};

export default UserImportModal;
