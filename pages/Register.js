import {
  Alert,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useState } from "react";
import Screen from "../components/Screen";
import Text from "../components/Text";
import colors from "../components/colors";
import Button from "../components/Button";
import axios from "axios";

export default function Register({ navigation }) {
  const [data, setData] = useState({
    id: Math.floor(Math.random() * 100) + 1,
    user_FirstName: "",
    user_LastName: "",
    user_Contact: "",
    user_Email: "",
    user_Password: "",
    Confirm_Password: "",
    user_Type: "Coach",
    loading: false,
    error: "",
  });

  const onChange = (name, value) => {
    // console.log({ value });
    setData({
      ...data,
      [name]: value,
    });
  };

  const submit = () => {
    if (data.Confirm_Password !== data.user_Password) {
      return setData({
        ...data,
        error: "Passwords must match",
        loading: false,
      });
    }

    setData({
      ...data,
      error: "",
      loading: true,
    });

    axios
      .post("/Users/Register/register", data)
      .then((data) => {
        Alert.alert(
          "Success",
          "Your account has been created, we will redirect to login so use your email and password"
        );
        setData({
          ...data,
          loading: false,
        });
        navigation.navigate("Login");
      })
      .catch((err) => {
        console.log(err);
        setData({
          ...data,
          error: "Something happened..",
          loading: false,
        });
      });
  };

  console.log(data);

  return (
    <Screen scroll avoidkeyboard>
      <View
        style={{
          flexDirection: "column",
          paddingBottom: 150,
        }}
      >
        <View
          style={{
            paddingVertical: 50,
            alignItems: "center",
          }}
        >
          <Text
            style={{
              fontSize: 30,
              fontWeight: "700",
              color: colors.primary,
            }}
          >
            Register
          </Text>
          <Text
            style={{
              textAlign: "center",
              marginTop: 10,
              paddingHorizontal: 30,
              fontSize: 16,
            }}
          >
            Register with your email and password to gain access into the app
          </Text>
          {data.error ? (
            <Text
              style={{
                backgroundColor: colors.redish,
                paddingVertical: 10,
                color: colors.white,
                width: "100%",
                textAlign: "center",
                marginTop: 10,
                paddingHorizontal: 30,
                fontSize: 16,
              }}
            >
              {data.error}
            </Text>
          ) : null}
        </View>
        <View
          style={{
            paddingHorizontal: 10,
          }}
        >
          <Text
            style={{
              fontSize: 18,
              marginBottom: 10,
            }}
          >
            First Name
          </Text>
          <TextInput
            onChangeText={(e) => onChange("user_FirstName", e)}
            style={styles.input}
          />
          <Text
            style={{
              fontSize: 18,
              marginBottom: 10,
            }}
          >
            Last Name
          </Text>
          <TextInput
            onChangeText={(e) => onChange("user_LastName", e)}
            style={styles.input}
          />
          <Text
            style={{
              fontSize: 18,
              marginBottom: 10,
            }}
          >
            Contact
          </Text>
          <TextInput
            keyboardType="phone-pad"
            onChangeText={(e) => onChange("user_Contact", e)}
            style={styles.input}
          />
          <Text
            style={{
              fontSize: 18,
              marginBottom: 10,
            }}
          >
            Register as
          </Text>
          <TextInput
            onChangeText={(e) => onChange("user_Type", e)}
            placeholder="As a coach or.."
            style={styles.input}
          />
          <Text
            style={{
              fontSize: 18,
              marginBottom: 10,
            }}
          >
            Your Email
          </Text>
          <TextInput
            autoCapitalize={"none"}
            keyboardType="email-address"
            onChangeText={(e) => onChange("user_Email", e)}
            style={styles.input}
          />
          <Text
            style={{
              fontSize: 18,
              marginBottom: 10,
            }}
          >
            Password
          </Text>
          <TextInput
            autoCapitalize={"none"}
            secureTextEntry
            onChangeText={(e) => onChange("user_Password", e)}
            style={styles.input}
          />
          <Text
            style={{
              fontSize: 18,
              marginBottom: 10,
            }}
          >
            Re-enter password
          </Text>
          <TextInput
            autoCapitalize={"none"}
            secureTextEntry
            onChangeText={(e) => onChange("Confirm_Password", e)}
            style={styles.input}
          />
          <Button
            onPress={submit}
            disabled={data.loading}
            textStyle={{ fontSize: 20 }}
            style={{
              marginTop: 20,
            }}
            title={data.loading ? "Wait.." : "Register"}
          />
          <TouchableOpacity onPress={() => navigation.navigate("Login")}>
            <Text
              style={{
                fontSize: 16,
                marginTop: 20,
              }}
            >
              Already have an account ? Sign-in
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  input: {
    borderWidth: 2,
    borderRadius: 5,
    borderColor: colors.primary,
    fontSize: 20,
    marginBottom: 20,
    paddingHorizontal: 10,
    height: 45,
  },
});
