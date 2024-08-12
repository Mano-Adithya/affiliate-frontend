import React, { useEffect, useRef, useState } from "react";
import useApi from "../../../hooks/useApi";
import {
  Button,
  DatePicker,
  Input,
  Pagination,
  Popconfirm,
  Table,
  Tabs,
  Tag,
  Tooltip,
} from "antd";
import { capitalizeWords, formatDate, formatFilterDate } from "../../../utils/helpers";
import ViewUser from "./modal/ViewUser";
import { Link, useParams } from "react-router-dom";
import { useDelete } from "../../../hooks/useDelete";
import { portalCodes, userTypeColor } from "../../../Constants";
import UserImportModal from "./modal/UserImportModal";

const { RangePicker } = DatePicker;

const UsersList = () => {
  const dateRangeRef = useRef();
  const { data, get, loading, error } = useApi();
  const {
    data: registeredUsers,
    loading: registeredUsersLoading,
    error: registeredUsersError,
    get: getRegisteredUsers,
  } = useApi();
  const [revenueAt, setRevenueAt] = useState(undefined);
  const [showUserImportModal, setShowUserImportModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const { deleteData, deleteResponse, deleteLoading, deleteError } =
    useDelete();
  const [viewData, setViewData] = useState([]);
  const {
    data: searchResult,
    loading: searchLoading,
    error: searchError,
    get: getUsers,
  } = useApi();
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const params = useParams();

  async function handleUserDelete(id) {
    await deleteData(`/auth/delete/${id}`);
    await get("/user/list");
  }

  const columns = [
    {
      title: "First Name",
      dataIndex: "first_name",
      key: "first_name",
    },
    {
      title: "Total Earnings",
      render: (data) => (
        <div className="total-earnings-col">
          <p>{data?.total_earnings}</p>
          <Tooltip title={`This Month Earnings: ${data?.this_month_earnings}`}>
            <guideicon>
              <i class="fi fi-tr-guide-alt"></i>
            </guideicon>
          </Tooltip>
        </div>
      ),
      sorter : (a , b) => a.total_earnings - b.total_earnings,
    },
    {
      title: "Mobile Number",
      dataIndex: "mobile_no",
      key: "mobile_no",
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "User Type",
      dataIndex: "user_type",
      key: "user_type",
      render: (user_type) => (
        <Tag color={userTypeColor[user_type?.toLowerCase()]}>{user_type}</Tag>
      ),
    },
    {
      title: "Referral Code",
      dataIndex: "referral_code",
      key: "referral_code",
    },
    {
      title: "Onboarded On",
      dataIndex: "created_at",
      key: "created_at",
      render: (created_at) => (
        <span>{formatDate(new Date(created_at), "~")}</span>
      ),
    },
    {
      title: "Actions",
      render: (data) => {
        return (
          <div className="action-ctas">
            <Link to={`/admin/user-view/${data.key}`} target="_blank">
              <i class="fi fi-tr-overview" title="View"></i>
            </Link>
            <Link to={`/admin/user-edit/${data.key}`} target="_blank">
              <i class="fi fi-tr-pen-square" title="Edit"></i>
            </Link>
            <Popconfirm
              title="Delete User"
              description="Are you sure you want to delete this user"
              onCancel={"Cancel"}
              okText="YES"
              okType="danger"
              onConfirm={() => handleUserDelete(data.key)}
            >
              <Button className="deleteiconwrapbtn">
                <i class="fi fi-ts-octagon-xmark" title="Delete"></i>
              </Button>
            </Popconfirm>
          </div>
        );
      },
    },
  ];

  const dataSource = (
    searchResult?.data != null ? searchResult?.data : data?.data
  )?.map((user) => ({
    key: user.id,
    first_name: user.first_name,
    total_earnings: user.total_earnings,
    this_month_earnings: user.this_month_earnings,
    email: user.email,
    mobile_no: user.mobile_no,
    user_type: user.user_type,
    referral_code: user.referral_code,
    created_at: user.created_at,
  }));

  useEffect(() => {
      const userTimeout = setTimeout(() => {
        get("/user/list", {
          like: searchTerm,
          page,
          limit,
          revenue_at: revenueAt,
        });
      }, [200]);
      return () => clearTimeout(userTimeout);
  }, [searchTerm, revenueAt]);

  async function triggerCall() {
    get("/user/list");
  }

  return (
    <section className="users-list-in-admin">
      <div className="user-list-hero-section">
        <RangePicker
          ref={dateRangeRef}
          onChange={(value) =>
            setRevenueAt(
              `${formatFilterDate(value[0])},${formatFilterDate(value[1])}`
            )
          }
        />
        <Input
          placeholder="Search User"
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
        />
        <Button
          className="import-user-btn"
          onClick={() => setShowUserImportModal(true)}
        >
          <i class="fi fi-tr-file-import"></i>
          <span>Import Users</span>
        </Button>
      </div>
      <div className="user-list-table">
        <Table
          dataSource={dataSource}
          columns={columns}
          loading={searchLoading || loading}
          pagination={false}
        />
        <Pagination
          size="small"
          total={data?.count || searchResult?.count}
          showSizeChanger
          showQuickJumper
          onChange={(page, pageSize) => {
            setPage(page);
            setLimit(pageSize);
          }}
          pageSizeOptions={[10, 20, 30, 50, 70]}
        />
      </div>
      {showViewModal && (
        <ViewUser
          showViewModal={showViewModal}
          setShowViewModal={setShowViewModal}
          userData={viewData}
        />
      )}
      {showUserImportModal && (
        <UserImportModal
          setShowModal={setShowUserImportModal}
          triggerCall={triggerCall}
        />
      )}
    </section>
  );
};

export default UsersList;
