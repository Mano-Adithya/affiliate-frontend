import { DatePicker, Skeleton, Table, message } from "antd";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import useApi from "../../../hooks/useApi";
import { SkeletonWrapper } from "../../../common/Common";
import { portalFavLogo } from "../../../Constants";
import { formatFilterDate } from "../../../utils/helpers";


let portalUrl = [
  {
    key : "wall360",
    register_url : "https://wall360.in/signup"
  },
  {
    key : "fobes",
    register_url : "https://fobes.in"
  },
  {
    key : "auction",
    register_url : "https://albionbankauctions.com"
  }
]

export default function Dashboard() {
  const user = useSelector((state) => state.user.user_data);
  const {RangePicker} = DatePicker;
  const [dateFilter, setDateFilter] = useState([])
  const { data, loading, error, get } = useApi();
  const {
    data: dashboardData,
    loading: dashboardLoading,
    error: dashboardError,
    get: getDashboard,
  } = useApi();

  useEffect(() => {
    get(`/referral`);
    getDashboard("/dashboard", { date_filter: dateFilter });
  }, [dateFilter]);

  let dashboardDetails = [
    {
      key: "this_month_income",
      label: "This Month Income",
      value: (
        <>
          &#x20B9;{" "}
          <span>{dashboardData?.data?.total_earnings_month?.toLocaleString("en-IN")}</span>
        </>
      ),
      link: "/wallet",
      description: "Earnings generated this month",
    },
    {
      key: "total_income",
      label: "Total Income",
      value: (
        <>
          &#x20B9;{" "}
          <span>
            {dashboardData?.data?.total_earnings?.toLocaleString("en-IN")}
          </span>
        </>
      ),
      link: "/wallet",
      description: "Total Income Generated So Far",
    },
    {
      key: "total_users",
      label: "Total Users",
      value: dashboardData?.data?.total_users,
      link: "/users",
      description: "Users In Plan By Code",
    },
    {
      key: "total_registered_user",
      label: "Total Registered Users",
      value: dashboardData?.data?.total_reg_users,
      link: "/users",
      description: "Users Registered By Code",
    },
  ];

  let portalData = [
    {
      key: "wall360",
      company_name: "Wall 360",
      users_count: dashboardData?.data?.portal["wall360"].users,
      reg_users : dashboardData?.data?.portal["wall360"].reg_users,
      earnings : dashboardData?.data?.portal["wall360"].earnings,
      hexCode: "#8c193f",
    },
    {
      key: "fobes",
      company_name: "Fobes",
      users_count: dashboardData?.data?.portal["fobes"].users,
      reg_users : dashboardData?.data?.portal["fobes"].reg_users,
      earnings : dashboardData?.data?.portal["fobes"].earnings,
      hexCode: "#0033A0",
    },
    {
      key: "auction",
      company_name: "Albion Bank Auctions",
      users_count: dashboardData?.data?.portal["auction"].users,
      reg_users : dashboardData?.data?.portal["auction"].reg_users,
      earnings : dashboardData?.data?.portal["auction"].earnings,
      hexCode: "#8c193f",
    },
  ];

  function handleCopyReferralCode() {
    if(!dashboardLoading){
      navigator?.clipboard?.writeText(user?.referral_code);
      message.open({
        type: "success",
        content: "Referral Code Copied Successfully",
      });
    }
  }

  function handleCopyClick(url){
    navigator?.clipboard?.writeText(url);
    message.open({
      type: "success",
      content: "URL Copied Successfully",
    });
  }

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
  ];

  return (
    <section className="dashboard-container">
      <div className="user-date-range-picker">
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
      <h2>Overview</h2>
      <div className="dashboard-details-container">
        {dashboardDetails.map((detail) => (
          <Link
            className="dashboard-detail-card"
            key={detail.key}
            to={detail.link}
          >
            <SkeletonWrapper loading={dashboardLoading}>
              <p>{detail.label}</p>
              <h3>{detail.value}</h3>
              <span>{detail.description}</span>
            </SkeletonWrapper>
          </Link>
        ))}
      </div>
      <div className="dashboard-second-row">
        <div className="dashboard-product-portal-split-up">
          {dashboardLoading ? (
            <Skeleton.Input active size="small" />
          ) : (
            <p className="users-joined-text">
              Users Joined In Each Portal By Using Your{" "}
              <span>Referral Code</span>
            </p>
          )}
          <div className="portal-split-up">
            {
              console.log(portalData , "portalData")
            }
            {portalData.map((portal) => (
              <div
                className="portal-card"
                key={portal.key}
                style={{
                  background: `${portal.hexCode}10`,
                  border: `1px solid ${portal.hexCode}`,
                }}
              >
                <SkeletonWrapper loading={dashboardLoading}>
                  <h4>{portal.company_name}</h4>
                  <p>Total Users</p>
                  <text>{portal?.users_count?.toLocaleString("en-IN")}</text>
                  <img
                    src={portalFavLogo[portal.key]}
                    height={45}
                    width={45}
                    className="fav-icon-portal"
                    style={{
                      border : `1px solid ${portal.hexCode}`
                    }}
                  />
                  <p>Total Registered Users</p>
                  <text>{portal?.reg_users?.toLocaleString("en-IN")}</text>
                  <p>Total Earnings</p>
                  <text>{portal?.earnings?.toLocaleString("en-IN")}</text>
                </SkeletonWrapper>
              </div>
            ))}
          </div>
        </div>
        <div className="referral-code-card">
          <p>Get Your Referral Code</p>
          {
            portalUrl.map(portal => 
              <div className="register-url">
                <span>{`${portal.register_url}?referral_code=${user?.referral_code}`}</span>
                <i class="fi fi-sr-copy-alt" onClick={() => handleCopyClick(`${portal.register_url}?referral_code=${user?.referral_code}`)}></i>
              </div>
            )
          }
          <div className="referral-code-copy">
            {dashboardLoading ? (
              <Skeleton.Input active size="small" />
            ) : (
              <h2>{user?.referral_code}</h2>
            )}
            <i class="fi fi-tr-copy-alt" onClick={handleCopyReferralCode}></i>
          </div>
          <ul>
            <li>
              <i class="fi fi-tr-clone"></i>
              <span>Copy The Referral Code Given Above</span>
            </li>
            <li>
              <i class="fi fi-tr-referral-alt"></i>
              <span>Promote The Users To Pay Using This Referral Code</span>
            </li>
            <li>
              <i class="fi fi-tr-benefit-porcent"></i>
              <span>Earn 10% Commission In Your Wallet</span>
            </li>
          </ul>
        </div>
      </div>
      <div className="quick-lookup">
        <div className="referral-user-table">
          <div className="referal-activity-header">
            <h2>Recent Referral Activity</h2>
            <Link to={"#"}>View All</Link>
          </div>
          <Table
            columns={columns}
            dataSource={(data?.data ?? [])?.splice(0, 5).map((user) => ({
              name: user.name,
              mobile_no: user.mobile_no,
              email: user.email,
            }))}
            pagination={false}
            loading={loading}
          />
        </div>
      </div>
    </section>
  );
}
