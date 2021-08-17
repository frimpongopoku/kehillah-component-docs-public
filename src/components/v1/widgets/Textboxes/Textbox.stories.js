import React from "react";
import Textbox from "./Textbox";
export default {
  title: "Widgets/Textbox/Input",
  component: Textbox,
  argTypes: {
    containerClassName: { control: { type: "" } },
    className: { control: { type: "" } },
    __HTML_DEFAULTS: { control: { type: "" } },
  },
};

const Template = (args) => <Textbox {...args} />;

export const Input = Template.bind({});
Input.args = {
  onChange: (e, text) => console.log("I am the text", text),
};
export const Textarea = Template.bind({});
Textarea.args = {
  textarea: true,
  value: "Here we go again",
};

export const RichTextEditor = Template.bind({});
RichTextEditor.args = {
  rich: true,
};
