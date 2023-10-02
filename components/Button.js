import React from "react";
import { TouchableOpacity, StyleSheet } from "react-native";
import colors from "./colors";
import Text from "./Text";

function Button({
  style,
  textStyle,
  type,
  title,
  icon,
  disabled = false,
  onPress,
}) {
  const handle_click = () => {
    if (disabled) return;
    onPress && onPress();
  };
  return (
    <TouchableOpacity
      onPress={handle_click}
      style={[
        styles.container,
        style,
        type === 2 && { backgroundColor: colors.red },
        type === 3 && { backgroundColor: colors.light_gray },
        disabled && { opacity: 0.5 },
      ]}
    >
      {icon}
      <Text
        style={[
          styles.text,
          textStyle,
          type === 3 && { color: colors.secondary },
        ]}
      >
        {title}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.primary,
    padding: 12,
    borderRadius: 10,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  text: {
    color: colors.white,
    fontWeight: "600",
    fontSize: 15,
  },
});

export default Button;
