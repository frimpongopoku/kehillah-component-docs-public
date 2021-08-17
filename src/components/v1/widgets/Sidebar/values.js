import {
  faDatabase,
  faHandsHelping,
  faPiggyBank,
  faUsers,
  faComment,
  faMoneyCheck,
  faCog,
  faSignOutAlt,
} from "@fortawesome/free-solid-svg-icons";

export const DEFAULT_FIRST_LAYER_NAME = "first_layer";
export const SPLIT_KEY = ":-:";
/**
 * Menu Item Structure
 * { id,name, onClick, url, icon}
 */
export const DUMMY_MENU = [
  {
    groupName: "Manage",
    children: [
      {
        id: "dashboard",
        name: "Dashboard",
        icon: faDatabase,
        onClick: () => console.log("You were saying?..."),
      },
      {
        id: "teams",
        name: "Teams",
        icon: faUsers,
        children: [
          { name: "All Teams" },
          { name: "All Teams And biibi" },
          {
            name: "Add New Teams",
            children: [
              { name: "Male Teams" },
              { name: "Female  Teams" },
              { name: "LGBTQ Teams" },
            ],
          },
        ],
      },
      {
        id: "comments",
        name: "Messages",
        icon: faComment,
        link: "www.facebook.com",
      },
      {
        id: "assets&investments",
        name: "Assets & Investments",
        icon: faPiggyBank,
        children: [
          { name: "All Investments" },
          { name: "All Assets" },
          { name: "Add New Assets" },
        ],
      },
      {
        id: "payment",
        name: "Payment",
        icon: faMoneyCheck,
        children: [{ name: "All Payments" }, { name: "Pay User" }],
      },
      { name: "Trading", icon: faHandsHelping, id: "trading" },
    ],
  },
];

export const USER_DETAILS = {
  userName: "Frimpong Opoku",
  role: "Company Admin",
  companyName: "Kehillah Global",
  companyLogo: "https://via.placeholder.com/300",
};

export const BOTTOM_MENU = [
  {
    id: "settings",
    name: "Settings",
    icon: faCog,
    onClick: () => console.log("I am going to the settings page"),
  },
  {
    id: "signout",
    name: "Sign Out",
    icon: faSignOutAlt,
    onClick: () => console.log("I am SIGNING OUT"),
  },
];
