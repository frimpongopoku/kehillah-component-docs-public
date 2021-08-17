import React from "react";

import { faBuilding, faCaretDown } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { DEFAULT_FIRST_LAYER_NAME, SPLIT_KEY } from "./values";

export const BottomMenuBox = (props) => {
  const { menu } = props;
  return <div className="sb-bottom-menu-box">{generateMenu(menu, props)}</div>;
};

const GhostCurtain = (props) => {
  const { onClick } = props;
  return <div className="ghost" onClick={() => onClick()}></div>;
};

const createProperMenuText = (text, inShrankMode) => {
  if (inShrankMode) return text.length > 12 ? text.substr(0, 12) + "..." : text;
  return text.length > 20 ? text.substr(0, 20) + "..." : text;
};
// @TODO will find a proper way of swapping classes so that we can support more themes instead of 2
export const generateMenu = (children, props, otherParams) => {
  const { dark, shrink, onMenuItemClick, activeMenu } = props;
  const { parentID, parentName } = otherParams || {};
  if (!children) return;
  const jsx = (children || []).map((child, ind) => {
    let { name, icon, link, onClick, className, style } = child;
    name = createProperMenuText(name, shrink);
    const activeMenuKeys = activeMenu?.subs || [];
    const isATopLevelChild = child?.id;
    const id = parentID || child?.id;
    const subMenu = child?.children;
    const menuKey = parentName + SPLIT_KEY + child?.name;
    const isSelected = activeMenuKeys.includes(menuKey);
    return (
      <div key={`${menuKey}`} id="menubox-content-container">
        <a
          href={link}
          className={`sb-menu-item ${
            dark && isATopLevelChild && "sb-menu-item-dark"
          } 
          ${dark && !shrink && "sb-menu-item-dark"}
          
          ${shrink && "shrink-icon-size"} ${
            isSelected && dark && "menu-dark-selected"
          } ${
            isSelected &&
            dark &&
            shrink &&
            !isATopLevelChild &&
            "menu-light-selected"
          } ${isSelected && !dark && "menu-light-selected"} ${className}`}
          style={style || {}}
          onClick={(e) => {
            if (onClick) onClick(e);
            if (children) return onMenuItemClick(id, menuKey, parentName);
          }}
        >
          {icon && <FontAwesomeIcon icon={icon} />}
          {shrink && !isATopLevelChild && (
            <>
              <p style={{ fontSize: "1rem" }}>{name}</p>
              {subMenu && <FontAwesomeIcon icon={faCaretDown} />}
            </>
          )}
          {!shrink && (
            <>
              <p>{name}</p>
              {subMenu && <FontAwesomeIcon icon={faCaretDown} />}
            </>
          )}
        </a>
        {/* ----------SUB CHILD LEVEL MAPPING ------ */}
        {subMenu && activeMenuKeys.includes(menuKey) && (
          <>
            {shrink && (
              <GhostCurtain
                onClick={() => onMenuItemClick(id, menuKey, parentName)}
              />
            )}
            <div
              className={`sub-menu-box ${
                shrink && "shrink-mode-dropdown elevate-float show-from-left"
              }`}
            >
              {generateMenu(subMenu, props, { parentID: id, parentName: name })}
            </div>
          </>
        )}
      </div>
    );
  });
  return jsx;
};

export const MenuBox = (props) => {
  const { dark, menu, animationClass, shrink } = props;
  if (!menu) return <></>;

  return menu.map((options, index) => {
    const { groupName, children } = options;
    const isDuringEnlarginAnimation = animationClass === "enlarge" && shrink;
    // -------------------- GROUP LEVEL MAPPING -------------
    return (
      <div
        className="sidebar-main-menu-box"
        key={"group-" + index.toString()}
        style={{ opacity: isDuringEnlarginAnimation ? 0 : 1 }}
      >
        <p
          className={`group-title ${dark ? "text-for-dark" : "text-for-light"}`}
          style={{
            fontSize: shrink ? ".6rem" : "0.8rem",
          }}
          id="group-name"
        >
          {groupName}
        </p>
        {generateMenu(children, props, {
          parentID: null,
          parentName: DEFAULT_FIRST_LAYER_NAME,
        })}
      </div>
    );
  });
};

export const CompanyName = (props) => {
  const { dark, shrink, companyName } = props;
  if (!companyName) return <></>;
  return (
    <div className={`company ${dark ? "company-dark" : "company-light"}`}>
      {shrink ? (
        <div style={{ marginLeft: 8 }}>
          <FontAwesomeIcon icon={faBuilding} />
        </div>
      ) : (
        <FontAwesomeIcon icon={faBuilding} />
      )}
      {!shrink && <p style={{ margin: 0, marginLeft: 10 }}>Kehillah Global</p>}
    </div>
  );
};

export const SidebarInfoBox = (props) => {
  const { dark, shrink, details } = props;
  const { userName, companyLogo, role } = details || {};
  if (!userName || !companyLogo || !role) return <></>; // yeah, dont show the entire section even if only one value isnt present
  return (
    <div className="sidebar-info-box">
      <div className="sidebar-info-head">
        <img
          className={`sidebar-info-img ${
            dark ? "dark-img-border" : "light-img-border"
          }`}
          src={companyLogo}
          alt="info media"
        />
        {!shrink && (
          <div className="sb-info-details">
            <p className={`sb-info-p ${dark && "sb-info-p-dark"}`}>
              {userName}
            </p>
            <small className={`sb-info-small ${dark && "sb-info-small-dark"}`}>
              {role}
            </small>
          </div>
        )}
      </div>
    </div>
  );
};
