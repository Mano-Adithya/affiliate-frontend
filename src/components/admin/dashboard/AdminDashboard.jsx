import React, { useEffect, useState } from "react";
import useApi from "../../../hooks/useApi";
import { portalCodes, portalFavLogo } from "../../../Constants";
import { DatePicker, Input, Skeleton, Table, Tooltip } from "antd";
import { formatDate, formatFilterDate } from "../../../utils/helpers";
import { SkeletonWrapper } from "../../../common/Common";

const AdminDashboard = () => {
  const {RangePicker} = DatePicker
  const { data, get, loading, error } = useApi();
  const [dateFilter, setDateFilter] = useState([])
  const {
    data: userData,
    get: getUsers,
    loading: getUsersLoading,
    error: getUsersError,
  } = useApi();
  const [searchTerm, setSearchTerm] = useState(undefined);

  useEffect(() => {
    get(`/dashboard` , {
      date_filter : dateFilter
    });
  }, [dateFilter]);

  useEffect(() => {
    getUsers("/user/list", {
      like: searchTerm,
    });
  }, [searchTerm]);

  const { wall360, fobes, auction } = data?.data?.portal || {};

  const columns = [
    {
      title: "First Name",
      dataIndex: "first_name",
      key: "first_name",
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
    },
    {
      title: "Referral Code",
      dataIndex: "referral_code",
      key: "referral_code",
    },
  ];

  const dataSource =
    userData &&
    userData?.data?.map((user) => ({
      key: user.id,
      first_name: user.first_name,
      email: user.email,
      mobile_no: user.mobile_no,
      user_type: user.user_type,
      referral_code: user.referral_code,
      created_at: user.created_at,
    }));

  return (
    <section className="admin-dashboard-container">
      <div className="date-range-picker">
        <span>Search By Date</span>
        <RangePicker
        onChange={(value) => {
          setDateFilter(
            `${formatFilterDate(new Date(value[0]))},${formatFilterDate(
              new Date(value[1])
            )}`
          );
        }}
      />
      </div>
      <div className="ad-first-row">
        <div className="count-breakdown">
          <div className="count-breakdown-row">
            <div className="count-breakdown-card">
              <SkeletonWrapper loading={loading}>
                <h2>Total DSA's</h2>
                <p>{(data?.data?.total_dsa ?? 0).toLocaleString("en-IN")}</p>
                <span>Total DSA's Registered In Affliate Program</span>
              </SkeletonWrapper>
            </div>
            <div className="count-breakdown-card">
              <SkeletonWrapper loading={loading}>
                <h2>Total Influencer's</h2>
                <p>
                  {(data?.data?.total_influencer ?? 0).toLocaleString("en-IN")}
                </p>
                <span>Total Influencer's Registered In Affliate Program</span>
              </SkeletonWrapper>
            </div>
            <div className="count-breakdown-card">
              <SkeletonWrapper loading={loading}>
                <h2>Total Users</h2>
                <p>{(data?.data?.total_users ?? 0).toLocaleString("en-IN")}</p>
                <span>Total Number of Users In Affliate Program</span>
              </SkeletonWrapper>
            </div>
            <div className="count-breakdown-card">
              <SkeletonWrapper loading={loading}>
                <h2>Total Registered Users</h2>
                <p>
                  {(data?.data?.total_reg_users ?? 0).toLocaleString("en-IN")}
                </p>
                <span>Total Users Registered In Portal's Using Referral Code</span>
              </SkeletonWrapper>
            </div>
          </div>
          <div className="portal-users-earnings">
            <h3>
              Portal-Specific Earnings and Referral Statistics
              <Tooltip title="This section gives you a detailed list of earnings and number of users who used the referral code of the affliates by portal">
                <span>
                  <i class="fi fi-rs-interrogation"></i>
                </span>
              </Tooltip>
            </h3>
            <div className="portal__cards">
              <div
                className="portal__card"
                style={{
                  background: portalCodes["wall360"] + "20",
                  border: `1px solid ${portalCodes["wall360"]}`,
                }}
              >
                <SkeletonWrapper loading={loading}>
                  <h4>Wall360</h4>
                  <p className="user-count">
                    {wall360?.users?.toLocaleString("en-IN")} Users
                  </p>
                  <p className="user-count">
                    {wall360?.reg_users?.toLocaleString("en-IN")} Reg Users
                  </p>
                  <p className="total-earning">
                    &#x20B9; {wall360?.earnings?.toLocaleString("en-IN")}
                  </p>
                  <img src={portalFavLogo["wall360"]} height={45} width={45} />
                </SkeletonWrapper>
              </div>
              <div
                className="portal__card"
                style={{
                  background: portalCodes["fobes"] + "20",
                  border: `1px solid ${portalCodes["fobes"]}`,
                }}
              >
                <SkeletonWrapper loading={loading}>
                  <h4>Fobes</h4>
                  <p className="user-count">
                    {fobes?.users?.toLocaleString("en-IN")} Users
                  </p>
                  <p className="user-count">
                    {fobes?.reg_users?.toLocaleString("en-IN")} Reg Users
                  </p>
                  <p className="total-earning">
                    &#x20B9; {fobes?.earnings?.toLocaleString("en-IN")}
                  </p>
                  <img src={portalFavLogo["fobes"]} height={45} width={45} />
                </SkeletonWrapper>
              </div>
              <div
                className="portal__card"
                style={{
                  background: portalCodes["auction"] + "20",
                  border: `1px solid ${portalCodes["auction"]}`,
                }}
              >
                <SkeletonWrapper loading={loading}>
                  <h4>Auctions</h4>
                  <p className="user-count">
                    {auction?.users?.toLocaleString("en-IN")} Users
                  </p>
                  <p className="user-count">
                    {auction?.reg_users?.toLocaleString("en-IN")} Reg Users
                  </p>
                  <p className="total-earning">
                    &#x20B9; {auction?.earnings?.toLocaleString("en-IN")}
                  </p>
                  <img src={portalFavLogo["auction"]} height={45} width={45} />
                </SkeletonWrapper>
              </div>
            </div>
          </div>
        </div>
        <div className="total-earnings-comparision">
          <div style={{ background: "#B7950B20", border: "1px solid #B7950B" }}>
            <SkeletonWrapper loading={loading}>
              <h3>Total Earnings This Month</h3>
              <p style={{ fontSize: "22px" }}>
                &#x20B9; {data?.data?.total_earnings.toLocaleString("en-IN")}
              </p>
            </SkeletonWrapper>
          </div>
          <div style={{ background: "#1A527620", border: "1px solid #1A5276" }}>
            <SkeletonWrapper loading={loading}>
              <h3>Total Income</h3>
              <p>
                &#x20B9;{" "}
                {data?.data?.total_earnings_month?.toLocaleString("en-IN") ??
                  "1,000"}
              </p>
            </SkeletonWrapper>
          </div>
        </div>
      </div>
      <div className="ad-second-row">
        <div className="latest-users-table">
          <div className="latest-user-hero">
            <h2>New Users</h2>
            <Input
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search User"
              className="quick-search-input"
              prefix={<i class="fi fi-tr-discover"></i>}
            />
          </div>
          <Table
            dataSource={dataSource}
            columns={columns}
            loading={getUsersLoading}
            pagination={false}
          />
        </div>
      </div>
    </section>
  );
};

export default AdminDashboard;
