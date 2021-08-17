import React from "react";
import RadioGroup from "./RadioGroup";
export default {
  title: "Widgets/RadioGroup",
  component: RadioGroup,
  argTypes: {
    groupClassName: { control: { type: "" } },
    className: { control: { type: "" } },
    value: { control: { type: "" } },
    defaultValue: { control: { type: "" } },
  },
};
const Template = (args) => <RadioGroup {...args} />;
export const Default = Template.bind({});
Default.args = {
  data: [
    { name: "Agyingo", age: 43, school: "Agbod)n" },
    { name: "Akwesi", age: 23, school: "Ghana" },
    { name: "Miseda", age: 13, school: "Kenya" },
    { name: "Rita", age: 33, school: "TZ" },
  ],
  valueExtractor: (item) => item.school,
  labelExtractor: (item) => item.name,
  value:"Ghana"
};
