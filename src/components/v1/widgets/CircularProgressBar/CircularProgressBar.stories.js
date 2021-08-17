import React from "react";
import CircularProgressBar from "./CircularProgressBar.js";
export default {
  title: "Widgets/CircularProgressBar",
  component: CircularProgressBar,
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

const Template = (args) => <CircularProgressBar {...args} />;
export const Default = Template.bind({});
Default.args = {
  progressPercentage: 50,
  progressThickness: 3,
  containerColor: "lightblue",
  progressColor: "darkslateblue",
  radius: 70,
};
