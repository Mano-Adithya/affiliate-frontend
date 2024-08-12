import { DatePicker, Input, Pagination, Table, Tabs, Tag } from "antd";
import React, { useEffect, useState } from "react";
import useApi from "../../../hooks/useApi";
import { capitalizeWords, formatDate, formatFilterDate } from "../../../utils/helpers";
import { portalCodes } from "../../../Constants";
import Export from "../../../common/Export";

export default function Users() {
  const { data, loading, error, get } = useApi();
  const {RangePicker} = DatePicker;
  const {
    data: registeredUsers,
    loading: registeredUsersLoading,
    error: registeredUsersError,
    get: getRegisteredUsers,
  } = useApi();
  const {
    data: searchResult,
    loading: searchLoading,
    error: searchError,
    get: getUsers,
  } = useApi();
  const [userSearch, setUserSearch] = useState(null);
  const [selected, setSelected] = useState("plans");
  const [dateFilter, setDateFilter] = useState([])
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  

  useEffect(() => {
    if (selected === "plans") {
      const userTimeout = setTimeout(() => {
        getUsers("/referral", {
          like: userSearch,
          page,
          limit,
        });
      }, [200]);
      return () => clearTimeout(userTimeout);
    }
  }, [userSearch, page, limit, selected]);

  useEffect(() => {
    if (selected === "register") {
      const userTimeout = setTimeout(() => {
        getRegisteredUsers("/referral/create-reg", {
          like: userSearch,
          page,
          limit,
        });
      }, [200]);
      return () => clearTimeout(userTimeout);
    }
  }, [userSearch, page, limit,selected]);


  useEffect(() => {
    get("/referral", {
      page,
      limit,
      created_at: dateFilter,
    });
  }, [page, limit, dateFilter]);

  console.log(dateFilter , "dateFilter123")

  const dataSource = (
    searchResult?.data != null ? searchResult?.data : data?.data
  )?.map((user) => ({
    key: user.id,
    name: user.name,
    email: user.email,
    mobile_no: user.mobile_no,
    portal: user.portal,
    created_at: user.created_at,
    plan_amount: user.plan_amount,
  }));

  const columns = [
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
      title: "Plan Amount",
      dataIndex: "plan_amount",
      key: "plan_amount",
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
      title: "Commission Earned",
      render: (data) => (
        <span>{(data?.plan_amount * (5 / 100)).toFixed(2)}</span>
      ),
    },
    {
      title: "Created At",
      dataIndex: "created_at",
      key: "created_at",
      render: (created_at) => <span>{formatDate(new Date(created_at))}</span>,
    },
  ];

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
    <section className="users-list-page">
      <div className="user-hero-area"></div>
      <div className="user-list-filters">
        <Export
          title="Export User Data In Excel"
          columnHeader={`name, mobile_no, email, portal, plan_amount, created_at\n`}
          exportData={dataSource
            ?.map((user) => {
              return `${user.name},${user.mobile_no},${user.email},${
                user.portal
              },${user.plan_amount}${formatDate(new Date(user.created_at))}`;
            })
            .join("\n")}
          fileName={"user-data"}
        />
        <Input
          placeholder="Search User"
          className="user-search-input"
          onChange={(e) => setUserSearch(e.target.value)}
          value={userSearch}
        />
        <RangePicker
          onChange={(value) => {
            if(value == null) {
              setDateFilter(undefined)
              return;
            }
            setDateFilter(
              `${formatFilterDate(new Date(value[0]))},${formatFilterDate(
                new Date(value[1])
              )}`
            );
          }}
        />
      </div>
      <div className="user-table-pagination">
        <Tabs
          items={[
            {
              key: "plan",
              label: "Purchased Plan",
              children: (
                <>
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
                    loading={searchLoading || registeredUsersLoading}
                    pagination={false}
                  />
                  <Pagination
                    size="small"
                    total={registeredUsers?.count || searchResult?.count}
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
    </section>
  );
}
