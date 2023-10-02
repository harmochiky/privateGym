import {
  SafeAreaProvider,
  initialWindowMetrics,
} from "react-native-safe-area-context";
import Container from "./Container";
import { Text } from "react-native";
import store from "./store";
import { Provider } from "react-redux";

export default function App() {
  return (
    <SafeAreaProvider initialMetrics={initialWindowMetrics}>
      <Provider store={store}>
        <Container />
      </Provider>
    </SafeAreaProvider>
  );
}
