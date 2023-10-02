import React from "react";
import { Text as AppText, StyleSheet, Platform } from "react-native";
import colors from "./colors";

const allowFontScaling = false;

function Text({ children, style, regular = true, ...props }) {
  let font_styles = {};
  if (Array.isArray(style)) {
    style.forEach((x) => {
      font_styles = { ...font_styles, ...x };
    });
  } else {
    font_styles = style;
  }

  if (
    font_styles?.fontWeight === "700" ||
    (font_styles?.fontWeight === "bold" && !font_styles?.fontFamily)
  ) {
    return (
      <AppText
        allowFontScaling={allowFontScaling}
        {...props}
        style={[styles.text, font_styles]}
      >
        {children}
      </AppText>
    );
  }
  if (
    font_styles?.fontWeight === "650" ||
    (font_styles?.fontWeight === "medium" && !font_styles?.fontFamily)
  ) {
    return (
      <AppText
        allowFontScaling={allowFontScaling}
        {...props}
        style={[styles.text, font_styles]}
      >
        {children}
      </AppText>
    );
  }

  if (font_styles?.fontWeight === "600" && !font_styles?.fontFamily) {
    return (
      <AppText
        allowFontScaling={allowFontScaling}
        {...props}
        style={[styles.text, font_styles]}
      >
        {children}
      </AppText>
    );
  }

  if (font_styles?.fontFamily) {
    return (
      <AppText
        allowFontScaling={allowFontScaling}
        {...props}
        style={[styles.text, font_styles]}
      >
        {children}
      </AppText>
    );
  }

  return (
    <AppText
      allowFontScaling={allowFontScaling}
      {...props}
      style={[styles.text, font_styles]}
    >
      {children}
    </AppText>
  );
}

const styles = StyleSheet.create({
  text: {
    fontSize: 14,
    color: colors.black,
  },
});

export default Text;
