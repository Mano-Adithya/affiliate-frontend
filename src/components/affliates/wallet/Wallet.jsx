import {
  Button,
  DatePicker,
  Form,
  Input,
  Spin,
  Table,
  notification,
} from "antd";
import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import useApi from "../../../hooks/useApi";
import { formatFilterDate } from "../../../utils/helpers";
import WithdrawModal from "./modal/WithdrawModal";
import { usePost } from "../../../hooks/usePost";
import { useForm } from "antd/es/form/Form";
import { LineChart, Line, XAxis, YAxis, CartesianGrid } from 'recharts';

let accountNumberRegex = /^[0-9]{9,18}$/g;

const dataSample = [
  { name: "Jan", uv: 4000},
  { name: "Feb", uv: 100 },
  { name: "Mar", uv: 200 },
  { name: "April", uv: 280 },
  { name: "May", uv: 190 },
];

export default function Wallet() {
  const { RangePicker } = DatePicker;
  const [form] = useForm();
  const walletDetails = useSelector((state) => state.user.user_data);
  const [totalIncome, setTotalIncome] = useState(undefined);
  const [showWithdrawModal, setShowWithdrawModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [revenueAt, setRevenueAt] = useState(undefined);
  const [createdAt, setCreatedAt] = useState("")
  const { data, loading, error, get } = useApi();
  const {data: monthlyIncome , get : getChart} = useApi();
  const [edit, setEdit] = useState(false)
  const {
    data: payoutData,
    loading: getPayoutLoading,
    error: getPayoutError,
    get: getPayoutDetails,
  } = useApi();
  const {
    data: bankData,
    loading: fetchingBankData,
    error: bankDataError,
    get: getBankData,
  } = useApi();
  const { postData, isLoading, response, error: payOutError } = usePost();
  const { Item } = Form;
  const [bankFormData, setBankFormData] = useState({
    acc_no: "",
    acc_name: "",
    ifsc_code: "",
    aadhar_no: "",
  });

  useEffect(() => {
    get("/user/wallet", {
      revenue_at: revenueAt,
    });
  }, [revenueAt]);

  useEffect(() => {
    getBankData("/payout/bank_details");
  }, []);

  useEffect(() => {
    getChart('/dashboard/revenue')
  }, [])
  

  useEffect(() => {
    getPayoutDetails("/payout", {
      like: searchTerm,
      created_at : createdAt
    });
  }, [searchTerm , createdAt]);

  useEffect(() => {
    form.setFieldsValue(bankData?.data);
    // if (!bankData) {
    //   setEdit(true);
    // }
  }, [form, bankData?.data]);


  useEffect(() => {
    if (response) {
      notification.success({
        message: response.message,
      });
    }
  }, [response]);

  console.log(monthlyIncome ,"monthlyIncome")

  const renderLineChart = (
    <LineChart width={300} height={200} data={monthlyIncome?.data}>
      <Line type="monotone" dataKey="uv" stroke="#8884d8" />
      <CartesianGrid stroke="#ccc" />
      <XAxis dataKey="name" />
      <YAxis />
    </LineChart>
  );

  const handleVerifyBankDetails = async () => {
    try {
      postData("/payout/bank_details", bankFormData);
      setEdit(false)
    } finally {
      setShowWithdrawModal(false);
    }
  };

  function handleBankDetailsChange(name, value) {
    setBankFormData({ ...bankFormData, [name]: value });
  }

  async function triggerCall() {
    get("/user/wallet");
  }

  const columns = [
    {
      title: "Payout Id",
      dataIndex: "payout_id",
      key: "payout_id",
    },
    {
      title: "Amount Withdrawn",
      dataIndex: "amount",
      key: "amount",
    },
    {
      title: "Currency",
      dataIndex: "currency",
      key: "currency",
    },
    {
      title: "Tax",
      dataIndex: "tax",
      key: "tax",
    },
    {
      title: "Mode",
      dataIndex: "mode",
      key: "mode",
    },
  ];

  const dataSource = payoutData?.data?.map((payout) => ({
    payout_id: payout.payoutId,
    amount: payout.amount,
    currency: payout.currency,
    fees: payout.fees,
    tax: payout.tax,
    mode: payout.mode,
  }));

  return (
    <section
      className="wallet-page-container"
      style={{ pointerEvents: loading ? "none" : "" }}
    >
      <div className="wallet-first-row">
        <div className="current-balance-card">
          <p>CURRENT BALANCE</p>
          <h2>
            &#x20B9; {data?.data?.current_balance.toLocaleString("en-IN")}
          </h2>
          <Button
            className="withdraw-btn"
            onClick={() => setShowWithdrawModal(true)}
            disabled={data?.data?.current_balance < 50}
          >
            {data?.data?.current_balance < 50
              ? "Insufficient Balance"
              : "Withdraw"}
          </Button>
          <p>
            <span>Minimum Amount You Can Withdraw - 50</span>
            <span>
              Amount Will Be Credited To Your Account in 2 - 3 Business Days
            </span>
          </p>
        </div>
        <div className="total-income-revenue">
          <div className="total-income-title-desc">
            <div>
              <h2>REVENUE</h2>
              <p>Total Income & Revenue</p>
            </div>
            <RangePicker
              onChange={(value) =>
                setRevenueAt(
                  `${formatFilterDate(value[0])},${formatFilterDate(value[1])}`
                )
              }
            />
          </div>
          {loading ? (
            <Spin />
          ) : (
            <p>
              &#x20B9;{" "}
              {(data?.data?.total_earnings ?? 1000000).toLocaleString("en-IN")}
            </p>
          )}
          <monthearnings>
            This Month Earnings : &#x20B9;
            {data?.data?.this_month_earnings.toLocaleString("en-IN")}
          </monthearnings>
          {renderLineChart}
        </div>
        <div className="bank-details">
          <i class="fi fi-ss-file-edit" onClick={() => setEdit(true)}></i>
          <h3>Bank Details</h3>
          <span>Verify Your Bank Details To Withdraw</span>
          <Form
            form={form}
            layout="vertical"
            onFinish={handleVerifyBankDetails}
            initialValues={bankData?.data}
            disabled={!edit}
          >
            <Item
              label="Bank Account Name"
              name={"acc_name"}
              rules={[
                {
                  required: true,
                },
              ]}
            >
              <Input
                value={bankFormData.acc_name}
                onChange={(e) =>
                  handleBankDetailsChange("acc_name", e.target.value)
                }
              />
            </Item>
            <Item
              label="Bank Account Number"
              name={"acc_no"}
              rules={[
                {
                  validator: (_, value) => {
                    if (!accountNumberRegex.test(value)) {
                      return Promise.reject(
                        new Error("Please Enter Valid Account Number")
                      );
                    } else {
                      return Promise.resolve();
                    }
                  },
                  required: true,
                },
              ]}
            >
              <Input
                value={bankFormData.acc_no?.toUpperCase()}
                maxLength={18}
                onChange={(e) =>
                  handleBankDetailsChange("acc_no", e.target.value)
                }
              />
            </Item>
            <Item
              label="IFSC"
              name={"ifsc_code"}
              rules={[
                {
                  required: true,
                },
              ]}
            >
              <Input
                value={bankFormData.ifsc_code}
                onChange={(e) =>
                  handleBankDetailsChange("ifsc_code", e.target.value)
                }
              />
            </Item>
            <Item
              label="Aadhar Number"
              name={"aadhar_no"}
              rules={[
                {
                  required: true,
                },
              ]}
            >
              <Input
                value={bankFormData.aadhar_no}
                onChange={(e) =>
                  handleBankDetailsChange("aadhar_no", e.target.value)
                }
              />
            </Item>
            <Item>
              <Button
                className="verify-bank-details"
                loading={isLoading}
                htmlType="submit"
              >
                <i class="fi fi-rs-bank"></i> Verify Bank Details
              </Button>
            </Item>
          </Form>
        </div>
      </div>
      <div className="payout-table">
        {/* <Input
          placeholder="Search By Payout ID, Amount, Currency, Tax, Mode"
          className="search-payout"
          onChange={(e) => setSearchTerm(e.target.value)}
        /> */}
        <RangePicker
              onChange={(value) =>
                setCreatedAt(
                  `${formatFilterDate(value[0])},${formatFilterDate(value[1])}`
                )
              }
              className="date-range-picker"
            />
        <Table
          dataSource={dataSource}
          columns={columns}
          loading={getPayoutLoading}
          pagination={payoutData?.length > 10}
        />
      </div>
      {showWithdrawModal && (
        <WithdrawModal
          setShowModal={setShowWithdrawModal}
          currentBalance={data?.data?.current_balance}
          triggerCall={triggerCall}
        />
      )}
    </section>
  );
}
