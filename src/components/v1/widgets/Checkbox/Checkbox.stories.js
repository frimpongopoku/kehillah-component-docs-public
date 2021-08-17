import React from "react";
import Checkbox from "./Checkbox";

export default {
  title: "Widgets/Checkbox/Checkbox",
  component: Checkbox,
  argTypes: {
    label: { control: { type: "text" } },
    value: { control: { type: "text" } },
    containerClassName: { control: { type: "" } },
    className: { control: { type: "" } },
  },
};
const Template = (args) => <Checkbox {...args} />;
export const Default = Template.bind({});
