import React from "react";
import Tooltip from "./Tooltip";

export default {
  title: "Widgets/Tooltip",
  component: Tooltip,
  argTypes: {
    position: {
      options: [Tooltip.TOP, Tooltip.RIGHT, Tooltip.BOTTOM, Tooltip.LEFT],
      control: { type: "radio" },
    },
    tooltipWidth: {
      control: { type: "range", min: 50, max: 200, step: 1 },
    },
  },
};

// const Template = (args) => <Tooltip {...args} />;
const Template = (args) => (
  <div
    style={{
      width: "100vw",
      height: "100vh",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
    }}
  >
    <Tooltip {...args}>
      <div
        style={{
          width: "50px",
          height: "50px",
          // backgroundColor: "grey",
          lineHeight: "50px",
          textAlign: "center",
          backgroundColor: "purple",
          color: "white",
        }}
      >
        hover
      </div>
    </Tooltip>
  </div>
);
export const Default = Template.bind({});
Default.args = {
  text: "hello! i am a tooltip",
  position: Tooltip.TOP,
  tooltipBackground: "purple",
  textColor: "white",
  tooltipWidth: 160,
};
