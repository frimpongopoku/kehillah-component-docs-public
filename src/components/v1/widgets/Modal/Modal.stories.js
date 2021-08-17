import React from "react";
import Modal from "./Modal";
export default {
  title: "Widgets/Modal",
  component: Modal,
  argTypes: {
    showClose: {
      control: { type: "boolean" },
    },
    showOverlay: {
      control: { type: "boolean" },
    },
    size: {
      options: [Modal.SMALL, Modal.MEDIUM, Modal.LARGE],
      control: { type: "select" },
    },
    title: {
      control: { type: "text" },
    },
    content: {
      control: { type: "text" },
    },
  },
};

const Template = (args) => <Modal {...args} />;
export const Default = Template.bind({});
