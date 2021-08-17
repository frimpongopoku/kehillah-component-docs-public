import React from "react";
import ProgressBar from "./ProgressBar";

export default {
  title: "Widgets/ProgressBar",
  component: ProgressBar,
  argTypes: {
    progressPercentage: {
      control: { type: "range", min: 0, max: 100, step: 1 },
    },
    progressThickness: {
      control: { type: "range", min: 0, max: 10, step: 1 },
    },
    radius: {
      control: { type: "number" },
    },
  },
};

const me = "circular";

const Template = (args) => <ProgressBar  {...args} />;
export const Default = Template.bind({});

Default.args = {
  circular:true,
  style: {},
  styleName: "",
  progressPercentage: 50,
  progressThickness: 3,
  progressColor: "darkslateblue",
  containerColor: "lightblue",
  radius: 70,
  containerWidth: 200,
  borderRadius: 15,
};
