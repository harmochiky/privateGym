import React from "react";
import {
  StyleSheet,
  View,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  FlatList,
  StyleSheetProperties,
  StyleProp,
  ViewStyle,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

/**
 * @description Wrapper for screens (pages) containing screen insets out of the box on a View by default and the capabilty to wrap around a Flatlist. No need to wrap ScrollView, just use the scroll prop
 * @param behavior IOS : works with the keyboard avoiding view, default "position".
 * @param removeInsets remove safe area insets. Default "false"
 * @param scroll add the ability for page to be scrollable by wrapping with a scrollview out of the box
 * @param children wrapped content for example a page or screen
 * @param style adds style to wrapper
 *
 */

function Screen({
  children,
  style,
  scroll,
  avoidkeyboard,
  behavior = "position",
  removeInsets = true,
  useVirtualizedScrollView,
}) {
  const insets = useSafeAreaInsets();

  return (
    <View
      style={[
        styles.screen,
        style,
        {
          marginTop: insets.top,
          marginBottom: !removeInsets ? insets.bottom : 0,
        },
      ]}
    >
      {scroll ? (
        <>
          {avoidkeyboard && Platform.OS === "ios" ? (
            <KeyboardAvoidingView
              enabled={avoidkeyboard}
              behavior={behavior}
              // behavior=""
            >
              {useVirtualizedScrollView ? (
                <VirtualizedScrollView
                  showsVerticalScrollIndicator={false}
                  contentContainerStyle={{ flexGrow: 1 }}
                >
                  <View style={[style, styles.view]}>{children}</View>
                </VirtualizedScrollView>
              ) : (
                <ScrollView
                  showsVerticalScrollIndicator={false}
                  //new props (revise)
                  nestedScrollEnabled={true}
                  keyboardShouldPersistTaps="handled"
                  contentContainerStyle={{ flexGrow: 1 }}
                >
                  <View style={[style, styles.view]}>{children}</View>
                </ScrollView>
              )}
            </KeyboardAvoidingView>
          ) : (
            <>
              {useVirtualizedScrollView ? (
                <VirtualizedScrollView>{children}</VirtualizedScrollView>
              ) : (
                <ScrollView showsVerticalScrollIndicator={false}>
                  {children}
                </ScrollView>
              )}
            </>
          )}
        </>
      ) : (
        <View style={[style, styles.view]}>
          {avoidkeyboard && Platform.OS === "ios" ? (
            <KeyboardAvoidingView enabled={avoidkeyboard} behavior={behavior}>
              {children}
            </KeyboardAvoidingView>
          ) : (
            <>{children}</>
          )}
        </View>
      )}
    </View>
  );
}

const VirtualizedScrollView = (props) => {
  return (
    <FlatList
      {...props}
      data={[]}
      // keyExtractor={(e, i) => "dom" + i.toString()}
      ListEmptyComponent={null}
      renderItem={null}
      ListHeaderComponent={() => <>{props.children}</>}
    />
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  view: {
    flex: 1,
  },
});

export default Screen;
