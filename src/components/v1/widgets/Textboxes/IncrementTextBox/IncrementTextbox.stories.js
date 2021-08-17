import React from "react";
import IncrementTextbox from "./IncrementTextbox";

export default {
  title: "Widgets/Textbox/IncrementTextboxx",
  component: IncrementTextbox,
  argTypes: {
    width: {
      control: { type: "range", min: 150, max: 200, step: 1 },
    },
    height: {
      control: { type: "range", min: 45, max: 100, step: 1 },
    },
  },
};

const Template = (args) => <IncrementTextbox {...args} />;
export const Default = Template.bind({});
