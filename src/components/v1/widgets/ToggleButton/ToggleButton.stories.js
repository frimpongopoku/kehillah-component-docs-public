import React from "react";
import ToggleButton from "./ToggleButton";

export default {
  title: "Widgets/ToggleButton",
  component: ToggleButton,
  argTypes: {
    width: {
      control: { type: "range", min: 0, max: 200, step: 1 },
    },
    height: {
      control: { type: "range", min: 0, max: 200, step: 1 },
    },
  },
};

const Template = (args) => <ToggleButton {...args} />;
export const Default = Template.bind({});
Default.args = {};
