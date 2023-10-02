import AsyncStorage from "@react-native-async-storage/async-storage";

const user_key = "hahahasillyhuman";

const storeUserObj = async (obj) => {
  try {
    await AsyncStorage.setItem(user_key, obj);
  } catch (error) {
    console.error("Error storing user object", error);
  }
};

const getUserObj = async () => {
  try {
    return await AsyncStorage.getItem(user_key);
  } catch (error) {
    console.error("Error getting user object", error);
    removeUserObj();
  }
};

const removeUserObj = async () => {
  try {
    await AsyncStorage.removeItem(user_key);
  } catch (error) {
    console.error("Error removing auth token", error);
  }
};

export default {
  storeUserObj,
  removeUserObj,
  getUserObj,
};
