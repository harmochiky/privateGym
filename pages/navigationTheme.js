import { DefaultTheme } from "@react-navigation/native";
import colorObj from "../components/colors";

const Theme = {
  ...DefaultTheme,
  dark: false,
  colors: {
    ...DefaultTheme.colors,
    background: colorObj.white,
    primary: colorObj.primary,
    text: colorObj.primary_shades[900],
    border: colorObj.primary,
  },
};

export default Theme;
