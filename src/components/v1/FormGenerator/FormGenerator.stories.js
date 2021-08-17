import react from "react";
import FormGenerator from "./FormGenerator";
import Fields from "./Fields";
import { StoryBook } from "./../shared/storybook-related/Constants";
export default {
  title: "Forms/Form Generator",
  component: FormGenerator,
  argTypes: {
    formSubmitBtnText: StoryBook.NO_CONTROL,
  },
};

const Template = (args) => <FormGenerator {...args} />;
export const Default = Template.bind({});
export const MultiStepForm = Template.bind({});
Default.args = {
  title: "Tell us more about yourself",
  subtitle: "Fill in all fields with the appropriate information",
  multiStep: false,
  onSubmit: (data, reset) => console.log("I am the data bro", data),
  elevation: 0,
  fields: [
    {
      fieldType: FormGenerator.Fields.TEXTAREA,
      label: "Enter Description",
      placeholder: "Write your description here... ",
      name: "my_post",
      defaultValue: "Default text of an html field provided via props...",
      required: true,
    },
    {
      fieldType: Fields.CHECKBOXGROUP,
      label: "Select which gender you belong to...?",
      data: ["She's a runner ", "She", "Is", "A track star"],
      defaultValue: ["She"],
      name: "runners",
      required: true,
    },
    {
      fieldType: Fields.INPUT,
      label: "Enter your name",
      placeholder: "You wanna enter your name? ",
      // style: { fontSize: 26 },
      name: "name",
      defaultValue: "Opoku agyemang",
      required: true,
    },
    {
      fieldType: Fields.TEXTAREA,
      label: "Enter Description",
      placeholder: "Write your description here... ",
      name: "about",
      defaultValue: "Akwesi  pongpoing",
      required: true,
    },
    {
      fieldType: Fields.RADIOGROUP,
      label: "Which is your favorite anime...?",
      data: ["Naruto", "Death Note", "Black Clover", "Attack On Titans"],
      value: "Naruto",
      name: "favorite_anime",
      required: true,
    },
    {
      fieldType: Fields.INPUT,
      label: "Enter your school  ",
      placeholder: "What is the name of your school? ",
      // style: { fontSize: 26 },
      defaultValue: "ALU",
      name: "school",
      required: true,
    },
    {
      fieldType: Fields.DROPDOWN,
      label: "Favorite Animal",
      placeholder: "What is the name of your favorite animal?",
      type: "full",
      data: ["Dogs", "cats", "Elephant"],
      name: "pet",
      required: true,
    },

    {
      fieldType: Fields.IMAGE,
      label: "Upload an image of your favorite animal",
      allowCrop: true,
      name: "image",
      // defaultValue:
      //   "https://www.thebalancesmb.com/thmb/5G9LJXyFzbTVS-Fj_32sHcgJ8lU=/3000x0/filters:no_upscale():max_bytes(150000):strip_icc():format(webp)/start-online-business-with-no-money-4128823-final-5b87fecd46e0fb00251bb95a.png",
      required: true,
      compress: true,
    },
  ],
};

MultiStepForm.args = { ...Default.args, multiStep: true };
