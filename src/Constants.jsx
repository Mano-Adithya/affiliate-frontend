import axios from "axios";
import { albionAuctionIcon, fobesFavIcon, wall360Icon } from "./assets";

// export const BACKEND_BASE_URL = "https://affliate.albionpropertyhub.com";
// export const BACKEND_BASE_URL = "http://192.168.29.129:5000/api";
export const BACKEND_BASE_URL = "http://52.66.18.208:5000/api";

export const SIDEBAR_OPTIONS = [
  {
    key: "dashboard",
    label: "Dashboard",
    icon: (
      <div>
        <i class="fi fi-ss-dashboard-monitor"></i>
      </div>
    ),
    url: "/dashboard",
  },
  {
    key: "users",
    label: "Users",
    icon: (
      <div>
        <i class="fi fi-sr-users-alt"></i>
      </div>
    ),
    url: "/users",
  },
  {
    key: "profile",
    label: "Profile",
    icon: (
      <div>
        <i class="fi fi-ss-user"></i>
      </div>
    ),
    url: "/profile",
  },
  {
    key: "wallet",
    label: "Wallet",
    icon: (
      <div>
        <i class="fi fi-sr-wallet-arrow"></i>
      </div>
    ),
    url: "/wallet",
  },
];

export const ADMIN_SIDEBAR_OPTIONS = [
  {
    key: "dashboard",
    label: "Dashboard",
    icon: (
      <div>
        <i class="fi fi-ss-dashboard-monitor"></i>
      </div>
    ),
    url: "/admin/dashboard",
  },
  {
    key: "users",
    label: "Users",
    icon: (
      <div>
        <i class="fi fi-sr-users-alt"></i>
      </div>
    ),
    url: "/admin/users",
  },
  {
    key: "types",
    label: "User Types",
    icon: (
      <div>
        <i class="fi fi-sr-member-list"></i>
      </div>
    ),
    url: "/admin/types",
  },
  {
    key: "payout_history",
    label: "Payout History",
    icon: (
      <div>
        <i class="fi fi-ss-time-past"></i>
      </div>
    ),
    url: "/admin/payout_history",
  },
];

export const UserRoutes = [
  {
    path: "/dashboard",
    component: <></>,
  },
  {
    path: "/users",
    component: <></>,
  },
  {
    path: "/profile",
    component: <></>,
  },
  {
    path: "/wallet",
    component: <></>,
  },
];

export const emailRegex = /^([a-zA-Z0-9._%-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})$/;
export const mobileRegex = /^[0-9]{10}$/;
export const nameRegex = /^[A-Za-z]{1,10}$/;

export const axiosInstance = axios.create({
  baseURL: BACKEND_BASE_URL,
});

export const portalCodes = {
  wall360: "#8c193f",
  auction: "#8c193f",
  fobes: "#0033A0",
};

export const userTypeColor = {
  dsa: "#D4AC0D",
  influencer: "#239B56",
};

export const portalFavLogo = {
  wall360: wall360Icon,
  fobes: fobesFavIcon,
  auction: albionAuctionIcon,
};
