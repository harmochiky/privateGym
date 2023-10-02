import React, { useEffect, useState } from "react";
import Screen from "../components/Screen";
import { StyleSheet, TextInput, View } from "react-native";
import Text from "../components/Text";
import colors from "../components/colors";
import Button from "../components/Button";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { setUserNull } from "../store/authSlice";
import asyncStorage from "../lib/asyncStorage";

export default function Profile() {
  const dispatch = useDispatch();
  const [data, setData] = useState({
    id: 0,
    user_FirstName: "",
    user_LastName: "",
    user_Contact: "",
    user_Email: "",
    user_Password: "",
    user_Type: "",
    loading: "",
  });
  const user = useSelector((state) => state.auth.user);

  useEffect(() => {
    setData({
      ...data,
      ...user,
    });
    getUser();
  }, []);

  const getUser = () => {
    axios
      .get(`/Users/GetUser/${user.id}`)
      .then((_data) => {
        console.log(_data.data);
        setData({
          ...data,
          ..._data.data,
        });
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const logOut = () => {
    dispatch(setUserNull());
    asyncStorage.removeUserObj();
  };

  // console.log({ data });

  return (
    <Screen scroll>
      <View
        style={{
          paddingVertical: 15,
        }}
      >
        <View
          style={{
            paddingHorizontal: 15,
          }}
        >
          <Text
            style={{
              fontSize: 30,
              fontWeight: "700",
              color: colors.primary,
            }}
          >
            My Profile
          </Text>
          <Text
            style={{
              fontSize: 16,
              marginTop: 5,
            }}
          >
            Update your profile information from here
          </Text>
        </View>
        {/* <View style={styles.line} /> */}
        <View
          style={{
            paddingHorizontal: 15,
            marginTop: 30,
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
          <TextInput value={data.user_FirstName} style={styles.input} />
        </View>
        <View
          style={{
            paddingHorizontal: 15,
          }}
        >
          <Text
            style={{
              fontSize: 18,
              marginBottom: 10,
            }}
          >
            Last Name
          </Text>
          <TextInput value={data.user_LastName} style={styles.input} />
        </View>
        <View
          style={{
            paddingHorizontal: 15,
          }}
        >
          <Text
            style={{
              fontSize: 18,
              marginBottom: 10,
            }}
          >
            Contact
          </Text>
          <TextInput value={data.user_Contact} style={styles.input} />
        </View>
        <View
          style={{
            paddingHorizontal: 15,
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
          <TextInput value={data.user_Email} style={styles.input} />
        </View>
        <View
          style={{
            paddingHorizontal: 15,
          }}
        >
          <Text
            style={{
              fontSize: 18,
              marginBottom: 10,
            }}
          >
            Whats your role
          </Text>
          <TextInput value={data.user_Type} style={styles.input} />
          <Button onPress={logOut} type={2} title="Log out" />
        </View>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  line: {
    height: 5,
    backgroundColor: colors.light_gray,
    width: "150%",
    marginVertical: 20,
  },
  input: {
    borderWidth: 2,
    borderRadius: 5,
    borderColor: colors.primary,
    fontSize: 20,
    marginBottom: 20,
    paddingHorizontal: 15,
    height: 45,
  },
});
