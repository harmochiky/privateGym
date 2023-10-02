import React, { Component } from "react";
import {
  Alert,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import { Agenda } from "react-native-calendars";
import testIDs from "./testIDs";
import Screen from "../components/Screen";
import colors from "../components/colors";
import { connect } from "react-redux";
import dateToday from "../lib/dateToday";
import axios from "axios";
import dayjs from "dayjs";
import { format } from "date-fns";
import moment from "moment";
import localizedFormat from "dayjs/plugin/localizedFormat";
dayjs.extend(localizedFormat);

const width = Dimensions.get("window").width;

class ClientBook extends Component {
  state = {
    items: undefined,
    loading: true,
    date: dateToday(),
  };

  componentDidMount() {
    // console.log(this.props);
    this.getClientGymActiveSessions();
  }

  onDayPress = (date) => {
    this.setState({
      date: new Date(date.year, date.month - 1, date.day),
    });
  };

  onDayChange = (date) => {
    this.setState({
      date: new Date(date.year, date.month - 1, date.day),
    });
  };

  async getClientGymActiveSessions() {
    let client = await axios.get(
      `/ClientProfiles/GetClientProfileById/${this.props.user.id}`
    );
    let coach_Id = client.data?.coachId;

    let slots = await axios.get(
      `/GymActiveSessions/GetClientBookingsAvailable/${coach_Id}`
    );

    const sessions = slots.data;
    const items = {};

    // Iterate through the sessions and map them onto the calendar
    sessions.forEach((session) => {
      // console.log({ session });

      // Convert bookedDate from yyyymmdd to a valid date string (e.g., "20231006" to "2023-10-06")
      const bookedDate = session.bookedDate.toString();
      const formattedDate = `${bookedDate.substring(
        0,
        4
      )}-${bookedDate.substring(4, 6)}-${bookedDate.substring(6, 8)}`;

      // Combine the date and time to create a timestamp
      const startTime = new Date(`${formattedDate}T${session.bookedTimeStart}`);
      const endTime = new Date(`${formattedDate}T${session.bookedTimeEnd}`);

      // Create an entry for the session
      const entry = {
        name: session.sessionDay + " Session", // You may replace this with relevant session information
        // height: 60,
        day: formattedDate,
        startTime,
        endTime,
        session,
      };

      // Check if the date already has entries; if not, create an array
      if (!items[formattedDate]) {
        items[formattedDate] = [];
      }

      // Push the session entry to the corresponding date
      items[formattedDate].push(entry);
    });

    this.setState({
      items,
    });
  }

  loadItems = (day) => {
    // Fetch sessions data from your API endpoint
    return null;
  };

  render() {
    const formattedDate = moment(this.state.date).format("YYYY-MM-DD");
    const items = {
      [formattedDate]: [],
      ...this.state.items,
    };

    // console.log(items);
    // console.log({ formattedDate });
    return (
      <Screen>
        <View
          style={{
            paddingVertical: 20,
            paddingHorizontal: 12,
            borderBottomColor: colors.primary_shades[100],
            borderBottomWidth: 1,
          }}
        >
          <Text
            style={{
              fontSize: 24,
            }}
          >
            {this.props?.user?.user_Type === "Client"
              ? "Book Sessions"
              : "Coach"}
          </Text>
          <Text
            style={{
              fontSize: 16,
              color: colors.gray,
            }}
          >
            Select sessions you want to book for
          </Text>
        </View>
        <Agenda
          testID={testIDs.agenda.CONTAINER}
          items={items}
          onDayPress={this.onDayPress}
          onDayChange={this.onDayChange}
          loadItemsForMonth={this.loadItems}
          selected={dateToday()}
          renderItem={this.renderItem}
          renderEmptyDate={this.renderEmptyDate}
          rowHasChanged={this.rowHasChanged}
          showClosingKnob={true}
          displayLoadingIndicator={false}
        />
      </Screen>
    );
  }

  renderDay = (day) => {
    if (day) {
      return <Text style={styles.customDay}>{day.getDay()}</Text>;
    }
    return <View style={styles.dayItem} />;
  };

  renderItem = (reservation, isFirst) => {
    const fontSize = isFirst ? 16 : 14;
    const color = isFirst ? "black" : "#43515c";
    // console.log({ reservation });

    const reservationObj = {
      ...reservation.session,
      client_Id: this.props.user.id,
      bookedDate: 0,
      clientcancelDate: 0,
      coachCancelDate: 0,
      bookedTimeStart: {
        ticks: 0,
      },
      bookedTimeEnd: {
        ticks: 0,
      },
    };

    return (
      <TouchableOpacity
        testID={testIDs.agenda.ITEM}
        style={[styles.item, { height: reservation.height }]}
        onPress={() =>
          Alert.alert(reservation.name, "Book this session", [
            {
              text: "Book session",
              onPress: () => {
                console.log({ reservationObj });
                axios
                  .put(
                    `/GymActiveSessions/UpdateClientNewSession/${this.props.user.id}`,
                    reservationObj
                  )
                  .then(() => {
                    this.props.navigation.navigate("Sessions");
                  })
                  .catch((error) => {
                    console.log(error);
                    Alert.alert("Failed", "Ouch, that didnt work");
                  });
              },
            },
            {
              text: "Cancel",
              style: "cancel",
            },
          ])
        }
      >
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
          }}
        >
          <View>
            <Text style={{ fontSize, color, marginBottom: 15 }}>
              {reservation.session.bookedTimeStart} -{" "}
              {reservation.session.bookedTimeEnd}
            </Text>
            <Text
              style={{ fontSize, color: colors.primary, fontWeight: "700" }}
            >
              {reservation.name}
            </Text>
            <Text style={{ fontSize, color }}>
              Coach ID : {reservation.session.coach_Id}
            </Text>
            <Text style={{ fontSize, color }}>
              {reservation.session.client_Id === 0 ? "Not booked" : "Booked"}
            </Text>
          </View>
          <View>
            <View
              style={{
                width: width / 4,
                height: width / 4,
                borderRadius: 100,
                backgroundColor: colors.primary,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Text
                style={{
                  color: colors.white,
                }}
              >
                Session
              </Text>
              <Text
                style={{
                  fontSize: fontSize + 5,
                  fontWeight: "700",
                  color: colors.white,
                }}
              >
                {reservation.session.id}
              </Text>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  renderEmptyDate = () => {
    return (
      <View style={styles.emptyDate}>
        <Text>No available session on this day</Text>
      </View>
    );
  };

  rowHasChanged = (r1, r2) => {
    return r1.name !== r2.name;
  };
}

const mapStateToProps = (state) => ({
  user: state.auth.user,
});

const mapDispatchToProps = (dispatch) => ({
  dispatchSomeAction: () => dispatch({ type: "SOME_ACTION" }),
});

export default connect(mapStateToProps, mapDispatchToProps)(ClientBook);

const styles = StyleSheet.create({
  item: {
    backgroundColor: "white",
    flex: 1,
    borderRadius: 5,
    padding: 10,
    marginRight: 10,
    marginTop: 17,
  },
  emptyDate: {
    // height: 15,
    flex: 1,
    padding: 30,
  },
  customDay: {
    margin: 10,
    fontSize: 24,
    color: "green",
  },
  dayItem: {
    marginLeft: 34,
  },
});
