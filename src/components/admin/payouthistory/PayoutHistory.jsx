import React, { useEffect, useState } from "react";
import useApi from "../../../hooks/useApi";
import { formatDate, formatFilterDate } from "../../../utils/helpers";
import { DatePicker, Input, Table } from "antd";

const PayoutHistory = () => {
  const { data, loading, error, get } = useApi();
  const [dateFilter, setDateFilter] = useState();
  const [searchTerm, setSearchTerm] = useState("")
  const { RangePicker } = DatePicker;

  useEffect(() => {
    get(`/payout`, {
      created_at: dateFilter,
    });
  }, [dateFilter, searchTerm]);

  const payoutColumns = [
    {
      title : "User ID",
      key: "user_id",
      dataIndex: "user_id",
    },
    {
      title : "Payout ID",
      key: "payout_id",
      dataIndex: "payout_id",
    },
    {
      title : "Amount",
      key: "amount",
      dataIndex: "amount",
    },
    {
      title : "Currency",
      key: "currency",
      dataIndex: "currency",
    },
    {
      title : "Fees",
      key: "fees",
      dataIndex: "fees",
    },
    {
      title : "Tax",
      key: "tax",
      dataIndex: "tax",
    },
    {
      title : "Merchant ID",
      key: "merchant_id",
      dataIndex: "merchant_id",
    },
    {
      title : "Debited On",
      key: "created_at",
      dataIndex: "created_at",
      render : (created_at) => formatDate(new Date(created_at))
    },
  ];

  const payoutDataSource = data?.data?.map((payout) => ({
    user_id: payout.userId,
    payout_id: payout.payoutId,
    amount: payout.amount,
    currency: payout.currency,
    fees: payout.fees,
    tax: payout.tax,
    merchant_id: payout.merchant_id,
    created_at: payout.created_at,
  }));

  return (
    <section
      className="payout-history-section"
    >
      <div className="payout-filter">
        <Input
          placeholder="Search Payout ID, Amount, Merchant ID"
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <RangePicker
          onChange={(value) => {
            if(value == null){
              setDateFilter(null);
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
      <Table columns={payoutColumns} dataSource={payoutDataSource} pagination={data?.data?.length > 10} loading={loading}/>
    </section>
  );
};

export default PayoutHistory;
