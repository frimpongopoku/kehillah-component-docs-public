import React from "react";
import Spinner from "./Spinner";
export default {
  title: "Widgets/Spinner",
  component: Spinner,
  argTypes: {
    thickness: {
      control: { type: "range", min: 0, max: 10, step: 1 },
    },
    radius: {
      control: { type: "range", min: 0, max: 100, step: 1 },
    },
    variation: {
      options: [
        Spinner.ONE_HALF_CIRCLE_TYPE,
        Spinner.TWO_HALF_CIRCLES_TYPE,
        Spinner.TRANSPARENT_CIRCLE_TYPE,
      ],
      control: { type: "select" },
    },
  },
};

const Template = (args) => <Spinner {...args} />;
export const Default = Template.bind({});
Default.args = {
  thickness: 3,
  color: "darkslateblue",
  radius: 70,
  variation: Spinner.ONE_HALF_CIRCLE_TYPE,
};
