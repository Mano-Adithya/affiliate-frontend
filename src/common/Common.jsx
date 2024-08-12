import { Skeleton, Spin } from "antd";

export const SpinLoader = () => (
  <Spin
    style={{
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      height: "100%",
    }}
  />
);

export const SkeletonWrapper = ({ children, loading }) =>
  loading ? (
    <div style={{ display: "flex", flexDirection: "column", gap: "5px" }}>
      <Skeleton.Input active size="small" />
      <Skeleton.Input active />
    </div>
  ) : (
    children
  );
