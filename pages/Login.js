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
import asyncStorage from "../lib/asyncStorage";
import { useDispatch } from "react-redux";
import { setUser } from "../store/authSlice";

export default function Login({ navigation }) {
  const dispatch = useDispatch();
  const [data, setData] = useState({
    username: "",
    password: "",
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
    setData({
      ...data,
      error: "",
      loading: true,
    });

    console.log(data);

    axios
      .post("/Users/Login/login", data)
      .then(async (data_) => {
        await asyncStorage.storeUserObj(JSON.stringify(data_.data));
        setData({
          ...data,
          loading: false,
          error: "",
        });
        dispatch(setUser(data_.data));
        console.log(data_.data);
      })
      .catch((err) => {
        console.log(err);
        setData({
          ...data,
          error: "Something happened.. " + err?.response?.data?.title,
          loading: false,
        });
      });
  };

  return (
    <Screen scroll>
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
            Login
          </Text>
          <Text
            style={{
              textAlign: "center",
              marginTop: 10,
              paddingHorizontal: 30,
              fontSize: 16,
            }}
          >
            Login with your email and password
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
            Your Email
          </Text>
          <TextInput
            autoCapitalize={"none"}
            textContentType="emailAddress"
            onChangeText={(e) => onChange("username", e)}
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
            onChangeText={(e) => onChange("password", e)}
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
          <TouchableOpacity onPress={() => navigation.navigate("Register")}>
            <Text
              style={{
                fontSize: 16,
                marginTop: 20,
              }}
            >
              Don't have an account ? Register
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
