import React from "react";
import Table from "./Table";
export default {
  title: "Widgets/Table",
  component: Table,
  argTypes: {
    theme: {
      options: [Table.LIGHT, Table.CHECKERED],
      control: { type: "radio" },
    },
    hoverAnimation: {
      control: { type: "boolean" },
    },
  },
};

const Template = (args) => <Table {...args} />;
export const Default = Template.bind({});
