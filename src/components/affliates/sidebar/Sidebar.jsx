import React from "react";
import { albionDarKThemeLogo } from "../../../assets";
import { Menu } from "antd";
import { Link, useNavigate } from "react-router-dom";

export default function Sidebar({ collapsed, menuOptions, setSelectedMenu , selectedMenu }) {  
  
  return (
    <aside className="albion-sidebar-admin">
      <div>
        <img src={albionDarKThemeLogo} />
        <div className="sidebar-menus">
          <Menu
            mode="inline"
            theme="dark"
            inlineCollapsed={collapsed}
            className="admin-sidebar"
            selectedKeys={[selectedMenu]}
          >
            {menuOptions.map((option) => (
              <Menu.Item key={option.key} icon={option.icon}>
                <Link to={option.url}>{option.label}</Link>
              </Menu.Item>
            ))}
          </Menu>
        </div>
      </div>
    </aside>
  );
}
