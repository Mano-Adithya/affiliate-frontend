import { Input, Pagination, Table, Tabs, Tag } from "antd";
import React, { useEffect, useState } from "react";
import useApi from "../../../../hooks/useApi";
import { capitalizeWords, formatDate } from "../../../../utils/helpers";
import { portalCodes } from "../../../../Constants";

const UserReferralList = ({ id }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const { data, loading, error, get } = useApi();
  const {
    data: registeredUsers,
    loading: registeredUsersLoading,
    error: registeredUsersError,
    get: getRegisteredUsers,
  } = useApi();
  const {
    data: referredUsersList,
    loading: usersListLoading,
    error: userListError,
    get: getReferralList,
  } = useApi();
  const [selected, setSelected] = useState("plans");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);

  useEffect(() => {
    if (searchTerm != "") {
      get(`/referral`, {
        user_id: id,
        like: searchTerm,
        page,
        limit,
      });
    }
  }, [searchTerm, selected]);

  const dataSource = referredUsersList?.data?.map((user) => ({
    userId: user.id,
    name: user.name,
    email: user.email,
    mobile_no: user.mobile_no,
    plan_amount: user.plan_amount,
    referral_amount: user.referral_amount,
    referral_percent: user.referral_percent,
    portal: user.portal,
    created_at: user.created_at,
  }));

  const userCols = [
    {
      key: "userId",
      dataIndex: "userId",
      title: "User ID",
    },
    {
      key: "name",
      dataIndex: "name",
      title: "User Name",
    },
    {
      key: "email",
      dataIndex: "email",
      title: "Email",
    },
    {
      key: "mobile_no",
      dataIndex: "mobile_no",
      title: "Mobile Number",
    },
    {
      key: "portal",
      dataIndex: "portal",
      title: "Portal",
      render: (portal) => (
        <Tag color={portalCodes[portal]}>{capitalizeWords(portal)}</Tag>
      ),
    },
    {
      key: "plan_amount",
      dataIndex: "plan_amount",
      title: "Plan Amount",
    },
    {
      key: "referral_amount",
      dataIndex: "referral_amount",
      title: "Referral Amount",
    },
    {
      key: "referral_percent",
      dataIndex: "referral_percent",
      title: "Referral Percentage",
    },
    {
      key: "created_at",
      dataIndex: "created_at",
      title: "Onboarded On",
      render: (created_at) => <span>{formatDate(new Date(created_at))}</span>,
    },
  ];

  useEffect(() => {
    if (selected === "plans") {
      const userTimeout = setTimeout(() => {
        getReferralList(`/referral`, {
          user_id: id,
          like: searchTerm,
          page,
          limit,
        });
      }, [200]);
      return () => clearTimeout(userTimeout);
    }
  }, [searchTerm, page, limit, selected]);

  useEffect(() => {
    console.log(searchTerm, "searchTerm");
    if (selected === "register") {
      const userTimeout = setTimeout(() => {
        getRegisteredUsers("/referral/create-reg", {
          user_id: id,
          like: searchTerm,
          page,
          limit,
        });
      }, [200]);
      return () => clearTimeout(userTimeout);
    }
  }, [searchTerm, page, limit, selected]);

  const filteredDataSource = data?.data?.map((user) => ({
    userId: user.id,
    name: user.name,
    email: user.email,
    mobile_no: user.mobile_no,
    plan_amount: user.plan_amount,
    referral_amount: user.referral_amount,
    referral_percent: user.referral_percent,
    portal: user.portal,
    created_at: user.created_at,
  }));

  const registeredUsersColumns = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
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
      title: "Portal",
      dataIndex: "portal",
      key: "portal",
      render: (portal) => (
        <Tag
          style={{
            background: `${portalCodes[portal]}10`,
            color: portalCodes[portal],
            border: `1px solid ${portalCodes[portal]}`,
          }}
        >
          {capitalizeWords(portal)}
        </Tag>
      ),
    },
    {
      title: "Created At",
      dataIndex: "created_at",
      key: "created_at",
      render: (created_at) => <span>{formatDate(new Date(created_at))}</span>,
    },
  ];

  const registeredDataSource = registeredUsers?.data?.map((regUser) => ({
    key: regUser.id,
    name: regUser.name,
    email: regUser.email,
    mobile_no: regUser.mobile_no,
    portal: regUser.portal,
    created_at: regUser.created_at,
  }));

  return (
    <div className="user-referral-list">
      <div className="hero-sec">
        <Input
          className="user-referral-search-input"
          placeholder="Search"
          prefix={<i class="fi fi-tr-member-search"></i>}
          onChange={(e) => setSearchTerm(e.target.value)}
          value={searchTerm}
        />
      </div>
      <Tabs
        items={[
          {
            key: "plans",
            label: "Purchased Plan",
            children: (
              <>
                <Table
                  dataSource={dataSource}
                  columns={userCols}
                  loading={loading}
                  pagination={false}
                />
                <Pagination
                  size="small"
                  total={data?.count}
                  showSizeChanger
                  showQuickJumper
                  onChange={(page, pageSize) => {
                    setPage(page);
                    setLimit(pageSize);
                  }}
                  pageSizeOptions={[10, 20, 30, 50, 70]}
                />
              </>
            ),
          },
          {
            key: "register",
            label: "Registered Users",
            children: (
              <>
                <Table
                  dataSource={registeredDataSource}
                  columns={registeredUsersColumns}
                  loading={registeredUsersLoading}
                  pagination={false}
                />
                <Pagination
                  size="small"
                  total={registeredUsers?.count}
                  showSizeChanger
                  showQuickJumper
                  onChange={(page, pageSize) => {
                    setPage(page);
                    setLimit(pageSize);
                  }}
                  pageSizeOptions={[10, 20, 30, 50, 70]}
                />
              </>
            ),
          },
        ]}
        onChange={(value) => setSelected(value)}
      />
    </div>
  );
};

export default UserReferralList;
