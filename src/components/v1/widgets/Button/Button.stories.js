import React from "react";
import Button from "./Button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCoffee,
  faCalendar,
  faCalendarDay,
} from "@fortawesome/free-solid-svg-icons";
export default {
  title: "Widgets/Button",
  component: Button,
  argTypes: {
    variant: {
      options: [Button.SOLID, Button.HOLLOW, Button.DEFAULT],
      control: { type: "radio" },
    },
    size: {
      options: [Button.SMALL, Button.MEDIUM, Button.LARGE],
      control: { type: "radio" },
    },
    theme: {
      options: [Button.THEMED, Button.SUCCESS, Button.DANGER],
      control: { type: "radio" },
    },
    icon: {
      options: ["icon", null],
      mapping: {
        icon: <FontAwesomeIcon icon={faCalendarDay} />,
      },
      control: { type: "radio" },
    },
    iconPos: {
      options: [Button.LEFT, Button.RIGHT],
      control: { type: "radio" },
    },
  },
};

const Template = (args) => <Button {...args} />;
export const Default = Template.bind({});
Default.args = {
  variant: Button.SOLID,
  size: Button.MEDIUM,
  theme: Button.THEMED,
  icon: null,
};
