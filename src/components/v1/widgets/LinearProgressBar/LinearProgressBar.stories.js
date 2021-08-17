import React from "react";
import LinearProgressBar from "./LinearProgressBar.js";
export default {
  title: "Widgets/LinearProgressBar",
  component: LinearProgressBar,
  argTypes: {
    progressPercentage: {
      control: { type: "range", min: 0, max: 100, step: 1 },
    },
    progressThickness: {
      control: { type: "range", min: 0, max: 10, step: 1 },
    },
  },
};

const Template = (args) => <LinearProgressBar {...args} />;
export const Default = Template.bind({});
Default.args = {
  progressPercentage: 50,
  progressThickness: 3,
  containerColor: "lightblue",
  progressColor: "darkslateblue",
};
