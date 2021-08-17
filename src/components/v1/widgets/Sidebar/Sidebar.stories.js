import React from "react";
import Sidebar from "./Sidebar";
export default {
  title: "Widgets/Sidebar",
  component: Sidebar,
};

const Template = (args) => <Sidebar {...args} />;

export const Default = Template.bind({});

Default.args = {
  defaultActive: Sidebar.MENU[0]?.children[5],
  shrink: false,
  dark: true,
};
