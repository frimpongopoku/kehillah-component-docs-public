import React from "react";
import { StoryBook } from "../../shared/storybook-related/Constants";
import FileUploader from "./FileUploader";
export default {
  title: "Widgets/FileUploader",
  component: FileUploader,
  argTypes: {
    defaultValue: StoryBook.NO_CONTROL,
    value: StoryBook.NO_CONTROL,
    accepts: StoryBook.NO_CONTROL,
  },
};

const Template = (args) => <FileUploader {...args} />;

export const Default = Template.bind({});
export const Multiple = Template.bind({});
Multiple.args = {
  allowCrop: true,
  multiple: true,
  compress: true,
  onFileSelected: (data, reset, errors, status) =>
    console.log("I am the content bro", data, errors, status),
};

Default.args = {
  allowCrop: true,
  compress: true,
  onFileSelected: (data, reset, errors, status) =>
    console.log("I am the content bro", data, errors, status),
  maxSize: 0.5,
};
