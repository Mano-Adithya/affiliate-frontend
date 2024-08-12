import React, { useEffect, useState } from "react";
import useApi from "../../../hooks/useApi";
import { usePost } from "../../../hooks/usePost";
import { Button, Form, Input, InputNumber, message, Modal, Popconfirm, Table } from "antd";
import { capitalizeWords, formatDate } from "../../../utils/helpers";
import { nameRegex } from "../../../Constants";
import { usePut } from "../../../hooks/usePut";
import { useDelete } from "../../../hooks/useDelete";

const UserType = () => {
  const { data, loading, error, get } = useApi();
  const { postData, isLoading, error: postApiError, response } = usePost();
  const { putData, updateResponse, updateLoading, updateError } = usePut();
  const { deleteData, deleteResponse, deleteLoading, deleteError } =
    useDelete();
  const [showAddNewUserTypeModal, setShowAddNewUserTypeModal] = useState(false);
  const [showUserTypeEditModal, setShowUserTypeEditModal] = useState(false);
  const [selectedUserType, setSelectedUserType] = useState({})
  const [userTypeForm, setUserTypeForm] = useState({
    user_type: "",
    portal: [
      {
        portal: "wall360",
        percentage: 5,
      },
      {
        portal: "fobes",
        percentage: 5,
      },
      {
        portal: "auction",
        percentage: 5,
      },
    ],
  });

  useEffect(() => {
    get("/user_type");
  }, []);

  useEffect(() => {
    if(response?.status){
      message.open({
        type : "success",
        content : response.message
      })
      setShowAddNewUserTypeModal(false)
    }
  }, [response])

  useEffect(() => {
    if(updateResponse?.status){
      message.open({
        type : "success",
        content : updateResponse.message
      })
      setShowUserTypeEditModal(false)
    }
  }, [updateResponse])
  
  
  function handlePortalValues(portal , percentage , setData){
    setData(prevState => ({
      ...prevState,
      portal: prevState.portal.map((singlePortal, index) => {
        if(singlePortal.portal === portal){
          return {...singlePortal, percentage}
        }
        return singlePortal
      })
    }))
  }

  async function handleAddUserType() {
    await postData("/user_type", userTypeForm);
    await get("/user_type");
  }

  async function handleDeleteUserType(id){
    await deleteData(`/user_type/${id}`);
    await get("/user_type");
  }

  async function handleEditUserType(){
      await putData(`/user_type/${selectedUserType.id}`, selectedUserType);
      await get("/user_type");
  }

  const columns = [
    {
        title: "User Type ID",
        dataIndex: "id",
        key: "id",
      },
    {
      title: "User Type",
      dataIndex: "user_type",
      key: "user_type",
    },
    {
      title: "Portal",
      dataIndex: "portal",
      key: "portal",
      render: (portal) => {
        function handleChangePercentage(index , value){
            console.log(portal , index , portal[index] , "215asd")
            portal[index].percentage = value
        }
        return portal?.map((singlePortal, index) => (
          <div
            key={`${singlePortal}_index_${index}`}
            className="portal-edit-row"
          >
            <p>{capitalizeWords(singlePortal.portal)}</p>
            <div className="percentage-edit-input">
              <Input
                readOnly
                value={singlePortal.percentage}
              />
            </div>
          </div>
        ));
      },
    },
    {
      title: "Created At",
      dataIndex: "created_at",
      key: "created_at",
    },
    {
        title : "Actions",
        render : (data) => (
          <div className="user-type-actions">
            <Button onClick={() => {
              setShowUserTypeEditModal(true)
              setSelectedUserType(data)
            }
            }>
              Edit User Type    
            </Button>
            <Popconfirm
                icon={<i class="fi fi-rs-trash" style={{color : "#DC3545" , display : "flex"}}></i>}
                title="Are you sure you want to delete this user type?"
                onConfirm={() => handleDeleteUserType(data.id)}
                okText="Yes"
                cancelText="No"
                okType="danger"
            >
                <Button
                    className="delete-user-type-btn"
                >
                    Delete User Type
                </Button>
            </Popconfirm>
            <Popconfirm></Popconfirm>
          </div>
        )
    }
  ];

  const dataSource = data?.data.map((ut) => ({
    id : ut.id,
    user_type: ut.user_type,
    portal: ut.portal,
    created_at: formatDate(new Date(ut.created_at.toLocaleString("en-IN"))),
  }));

  return (
    <section className="user-type-page">
      <h2>User Types List</h2>
      <div>
        <Button className="addNewUserType" onClick={() => setShowAddNewUserTypeModal(true)}>
            <i class="fi fi-rs-user-add"></i>
            <span>Add New User Type</span>
        </Button>
      </div>
      <div className="user-type-list-table">
        <Table
          columns={columns}
          dataSource={dataSource}
          loading={loading}
          rowKey="id"
          pagination={{ pageSize: 10 }}
        />
      </div>
      {
        showAddNewUserTypeModal && <Modal
          open={showAddNewUserTypeModal}
          onCancel={() => setShowAddNewUserTypeModal(false)}
          footer={null}
        >
          <section className="add-new-user-modal">
            <center>Add New User Type</center>
            <Form
              layout="vertical"
              onFinish={handleAddUserType}
            >
              <Form.Item 
                label="User Type Name"
                rules={[{
                  validator : (_ , value) => {
                    if(!/^[A-Za-z]{3,25}$/.test(value)){
                      return new Promise.reject(
                        new Error('Enter Valid User Type Name')
                      )
                    }
                    return Promise.resolve();
                  },
                  required : true,
                  message : 'Please Enter User Type Name'
                }]}
                name={"user_type"}
              >
                <Input
                  value={userTypeForm.user_type}
                  onChange={(e) => setUserTypeForm({...userTypeForm, user_type : e.target.value})}
                />
              </Form.Item>
              {
                userTypeForm.portal.map(obj => <div className="portal-percentage-row" key={obj.portal}>
                  <p>{capitalizeWords(obj.portal)} Discount Percentage</p>
                  <Input
                    value={obj.percentage}
                    maxLength={3}
                    max={100}
                    type="number"
                    onChange={(e) => {
                      if(e.target.value > 100) return;
                      else handlePortalValues(obj.portal , parseInt(e.target.value) > 100 ? 100 : e.target.value , setUserTypeForm)
                    }}
                  />
                </div>)
              }
              <Form.Item>
                <Button
                  className="add-user-type-btn"
                  htmlType="submit"
                  loading={isLoading}
                >
                  Add User Type
                </Button>
              </Form.Item>
            </Form>
          </section>
        </Modal>
      }
      {
        showUserTypeEditModal && <Modal
          open={showUserTypeEditModal}
          onCancel={() => setShowUserTypeEditModal(false)}
          footer={null}
        >
          <section className="add-new-user-modal">
            <center>Edit User Type</center>
            <Form
              layout="vertical"
              onFinish={handleEditUserType}
              initialValues={selectedUserType}
            >
              <Form.Item 
                label="User Type Name"
                rules={[{
                  validator : (_ , value) => {
                    if(!/^[A-Za-z]{3,25}$/.test(value)){
                      return new Promise.reject(
                        new Error('Enter Valid User Type Name')
                      )
                    }
                    return Promise.resolve();
                  },
                  required : true,
                  message : 'Please Enter User Type Name'
                }]}
                name={"user_type"}
              >
                <Input
                  value={selectedUserType.user_type}
                  onChange={(e) => setSelectedUserType({...selectedUserType, user_type : e.target.value})}
                />
              </Form.Item>
              {
                selectedUserType.portal.map(obj => <div className="portal-percentage-row" key={obj.portal}>
                  <p>{capitalizeWords(obj.portal)} Discount Percentage</p>
                  <Input
                    value={obj.percentage}
                    maxLength={3}
                    max={100}
                    type="number"
                    onChange={(e) => {
                      if(e.target.value > 100) return;
                      else handlePortalValues(obj.portal , parseInt(e.target.value) > 100 ? 100 : e.target.value , setSelectedUserType)
                    }}
                  />
                </div>)
              }
              <Form.Item>
                <Button
                  className="add-user-type-btn"
                  htmlType="submit"
                  loading={isLoading}
                >
                  Update User Type
                </Button>
              </Form.Item>
            </Form>
          </section>
        </Modal>
      }
    </section>
  );
};

export default UserType;
