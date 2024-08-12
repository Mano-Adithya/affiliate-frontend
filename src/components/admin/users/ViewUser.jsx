import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import useApi from "../../../hooks/useApi";
import { Button, Collapse, Descriptions, Popconfirm, Table, Tag } from "antd";
import { capitalizeWords, formatDate, formatText } from "../../../utils/helpers";
import { portalCodes } from "../../../Constants";
import UserReferralList from "./sub-components/UserReferralList";
import { usePut } from "../../../hooks/usePut";

const ViewUser = () => {
  const { id } = useParams();
  const { data, loading, error, get } = useApi();
  const { putData, updateResponse, updateLoading, updateError } = usePut();

  useEffect(() => {
    get(`/user/list/${id}`)
  }, [])


  const descriptionItems = Object.entries(data?.data ?? {}).map(
    ([key, value]) => {
      if (key !== "portal") {
        return {
          key: key === "created_at" ? "Onboarded On" : key,
          label: formatText(key),
          children: key === "created_at" ? formatDate(new Date(value)) : value,
        };
      } else {
        return;
      }
    }
  ).filter(item => item != undefined);

  async function handleUserBlock(id){
    await putData(`/auth/block/${id}`);
    await get(`/user/list/${id}`);
  }

  return (
    <section className="view-user-page-container">
      <div className="view-user-page-hero-sec">
        <h2>User ID - {id}</h2>
        <div className="user-edit-action-btns">
            <Popconfirm
              title={data?.data?.status ? "Block User" : "UnBlock User"}
              description={`Are you sure you want to ${data?.data?.status ? "block" : "unblock"} this user`}
              cancelText="Cancel"
              okText={data?.data?.status ? "Block" : "UnBlock"}
              okType={"dashed"}
              onConfirm={() =>handleUserBlock(id)}
            >
              <Button className={`${data?.data?.status ? "block-user-ab" : "unblock-user-ab"}`}>
              {data?.data?.status ? (
                  <i class="fi fi-ts-road-barrier"></i>
                ) : (
                  <i class="fi fi-ss-exclamation"></i>
                )}
                {data?.data?.status ? "Block User" : "Unblock User"}
              </Button>
            </Popconfirm>
            <Popconfirm
              title="Delete User"
              description="Are you sure you want to delete this user"
              cancelText="Cancel"
              okText="YES"
              okType="danger"
            >
              <Button className="delete-user-ab">
                <i class="fi fi-rr-trash"></i>
                Delete User
              </Button>
            </Popconfirm>
          </div>
      </div>
      <Collapse
        defaultActiveKey={["descriptions"]}
        expandIconPosition="right"
        expandIcon={({ isActive }) =>
          isActive ? (
            <>
              <i class="fi fi-br-compress-alt"></i>
            </>
          ) : (
            <>
              <i class="fi fi-ts-expand-arrows"></i>
            </>
          )
        }
        items={[
          {
            key: "descriptions",
            label: "User Description",
            children: (
              <Descriptions
                bordered
                layout="vertical"
                items={descriptionItems || []}
                size="default"
              />
            ),
          },
          {
            key: "referral_list",
            label: "Referral List",
            children: (
              <UserReferralList
                id={id}
              />
            ),
          },
        ]}
      />
    </section>
  );
};

export default ViewUser;
