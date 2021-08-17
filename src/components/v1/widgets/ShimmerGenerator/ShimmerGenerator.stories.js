import React from "react";
import ShimmerGenerator from "./ShimmerGenerator.js";
export default {
  title: "Widgets/ShimmerGenerator",
  component: ShimmerGenerator,
  argTypes: {
    width: {
      control: { type: "range", min: 0, max: 100, step: 1 },
    },
    height: {
      control: { type: "range", min: 0, max: 100, step: 1 },
    },
    radius: {
      control: { type: "range", min: 0, max: 100, step: 1 },
    },
    animation: {
      options: [ShimmerGenerator.FADE_IN_OUT, ShimmerGenerator.GLIDE_OVER],
      control: { type: "radio" },
    },
  },
};

const Template = (args) => <ShimmerGenerator {...args} />;
export const Default = Template.bind({});
