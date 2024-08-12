import { Button, Input, Modal, notification } from "antd";
import React, { useEffect, useState } from "react";
import { usePost } from "../../../../hooks/usePost";

const WithdrawModal = ({ setShowModal, currentBalance, triggerCall }) => {
  const [amount, setAmount] = useState(50);
  const { postData, isLoading, response } = usePost();

  useEffect(() => {
    if (response) {
      setShowModal(false);
      notification.success({
        message: "Withdrawal Successful",
      });
      triggerCall()
    }
  }, [response]);

  async function withdrawAmount() {
    postData("/payout", {
      amount: amount,
    });
  }

  return (
    <Modal
      onCancel={null}
      footer={
        <div className="withdraw-footer">
          <Button
            className="cancel-withdraw-btn"
            onClick={() => setShowModal(false)}
          >
            Cancel
          </Button>
          <Button
            className="withdraw-btn"
            onClick={withdrawAmount}
            loading={isLoading}
          >
            <i class="fi fi-ss-coins"></i>
            Collect
          </Button>
        </div>
      }
      open={true}
      closeIcon={null}
    >
      <div className="withdraw-modal">
        <center>Current Balance</center>
        <h2>&#x20B9; {currentBalance.toLocaleString("en-IN")}</h2>
        <div className="withdraw-amount-area">
          <label>
            Amount <span>(Minimum Amount - 50)</span>
          </label>
          <Input
            placeholder="Enter Amount"
            type="number"
            min={0}
            max={currentBalance}
            value={amount}
            onChange={(e) => {
              if (e.target.value > currentBalance) {
                setAmount(currentBalance);
                return;
              } else {
                setAmount(e.target.value);
              }
            }}
          />
        </div>
      </div>
    </Modal>
  );
};

export default WithdrawModal;
