import React from "react";
import Dropdown from "./Dropdown";

export default {
  title: "Widgets/Dropdown",
  component: Dropdown,
  argTypes: {
    dropBlanketClassName: { control: { type: "" } },
    defaultValue: { control: { type: "" } },
    value: { control: { type: "" } },
    type: {
      control: { type: "radio", options: [Dropdown.DEFAULT, Dropdown.FULL] },
    },
    multiple: { control: { type: "" } },
    dropItemClassName: { control: { type: "" } },
  },
};

const Template = (args) => <Dropdown {...args} />;

export const Default = Template.bind({});

export const DefaultMultiple = Template.bind({});
DefaultMultiple.args = {
  multiple: true,
  onItemSelected: (data, cur, parent) =>
    console.log("onItemSelected: ", data, cur, parent),
};

export const Full = Template.bind({});
export const FullMultiple = Template.bind({});
Full.args = {
  type: Dropdown.FULL,
  onItemSelected: (data, cur, parent) =>
    console.log("onItemSelected: ", data, cur, parent),
  data: [
    { name: "Agyingo", age: 43, school: "Agbod)n" },
    { name: "Akwesi", age: 23, school: "Ghana" },
    { name: "Miseda", age: 13, school: "Kenya" },
    { name: "Rita", age: 33, school: "TZ" },
  ],
  valueExtractor: (item) => item.school,
  labelExtractor: (item) => item.name,
};
FullMultiple.args = {
  ...Full.args,
  multiple: true,
};
