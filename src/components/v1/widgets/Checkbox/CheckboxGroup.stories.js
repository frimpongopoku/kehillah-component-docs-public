import React from "react";
import CheckboxGroup from "./CheckboxGroup";
export default {
  title: "Widgets/Checkbox/CheckboxGroup",
  component: CheckboxGroup,
  argTypes: {
    groupClassName: { control: { type: "" } },
    containerClassName: { control: { type: "" } },
    className: { control: { type: "" } },
  },
};
const Template = (args) => <CheckboxGroup {...args} />;
export const Default = Template.bind({});
// Default.args = {
//   defaultValue: ["Bananas", "Mangoes"],
// };
Default.args = {
  data: [
    { name: "Agyingo", age: 43, school: "Agbod)n" },
    { name: "Akwesi", age: 23, school: "Ghana" },
    { name: "Miseda", age: 13, school: "Kenya" },
    { name: "Rita", age: 33, school: "TZ" },
  ],
  valueExtractor: (item) => item.school,
  labelExtractor: (item) => item.name,
};
