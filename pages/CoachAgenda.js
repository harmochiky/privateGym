import React, { Component } from "react";
import {
  Alert,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import {
  Agenda,
  DateData,
  AgendaEntry,
  AgendaSchedule,
  TimelineList,
} from "react-native-calendars";
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
import numericTodayDate from "../lib/numericTodayDate";
import getUsers, { getUser } from "../lib/getUsers";
import formatTime from "../lib/formatTime";
dayjs.extend(localizedFormat);

const width = Dimensions.get("window").width;

class CoachScreen extends Component {
  state = {
    items: undefined,
    loading: true,
    date: dateToday(),
    users: [],
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
    let users = await getUsers();

    this.setState({
      users,
    });

    axios
      .get(
        `/GymActiveSessions/GetCoachGymActiveSessionBooked/${this.props.user.id}`
      )
      .then((response) => {
        const sessions = response.data;
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
          const startTime = new Date(
            `${formattedDate}T${session.bookedTimeStart}`
          );
          const endTime = new Date(`${formattedDate}T${session.bookedTimeEnd}`);

          // Create an entry for the session
          const entry = {
            name: session.sessionDay, // You may replace this with relevant session information
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
      })
      .catch((err) => {
        console.log(err);
      });
  }

  removeSession = (dateToRemove) => {
    const formattedDateToRemove = `${dateToRemove}`.replace(
      /(\d{4})(\d{2})(\d{2})/,
      "$1-$2-$3"
    ); // Convert to yyyy-mm-dd format
    const { items } = this.state;

    const newItems = { ...items };
    delete newItems[formattedDateToRemove];

    this.setState({
      items: newItems,
    });
  };

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
              ? "Active Sessions"
              : "Booked Sessions"}
          </Text>
          <Text
            style={{
              fontSize: 16,
              color: colors.gray,
            }}
          >
            Hey {this.props?.user?.user_FirstName}{" "}
            {this.props?.user?.user_LastName}
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
          // renderEmptyDate={this.renderEmptyDate}
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

    const reservationObj = {
      ...reservation.session,
      client_Id: this.props.user.id,
      bookedDate: 0,
      clientcancelDate: numericTodayDate(),
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
          Alert.alert(
            reservation.name + ` (${reservation.session.id})`,
            "what would you like to do with this booking ?",
            [
              {
                text: "Cancel booking",
                onPress: () => {
                  console.log({ reservationObj });
                  //   this.removeSession(reservation.session.bookedDate);
                  axios
                    .put(
                      `/GymActiveSessions/CancelGymActiveSessionClient/${reservation.session.bookedDate}`,
                      reservationObj
                    )
                    .then(() => {
                      Alert.alert("Confirmed", "Attendance has been confirmed");
                      //   this.props.navigation.navigate("Sessions");
                    })
                    .catch((error) => {
                      console.log(error);
                      Alert.alert("Failed", "Ouch, that didnt work");
                    });
                },
              },
              {
                text: "Mark attendance",
                onPress: () => {
                  console.log({ reservationObj });
                  this.removeSession(reservation.session.bookedDate);
                  axios
                    .put(
                      `/GymActiveSessions/MarkSessionAttendance/1`,
                      reservation.session
                    )
                    .then(() => {
                      //   this.props.navigation.navigate("Sessions");
                      //   Alert.alert("Confirmed", "Attendance has been confirmed");
                    })
                    .catch((error) => {
                      console.log(error);
                      Alert.alert("Failed", "Ouch, that didnt work");
                    });
                },
              },
              {
                text: "Nothing leave as is",
                style: "cancel",
              },
            ]
          )
        }
      >
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
          }}
        >
          <View>
            <Text
              style={{
                fontSize: fontSize + 2,
                color: colors.primary,
                fontWeight: "700",
                marginBottom: 2,
              }}
            >
              Booking details
            </Text>
            <Text style={{ fontSize, color: colors.gray }}>
              Day : {reservation.session.sessionDay}
            </Text>
            <Text style={{ fontSize, color: colors.gray }}>
              Time : {formatTime(reservation.session.bookedTimeStart)} -{" "}
              {formatTime(reservation.session.bookedTimeEnd)}
            </Text>
            <Text style={{ fontSize, color: colors.gray, marginBottom: 15 }}>
              Status :{" "}
              {reservation.session.session_Attendance === 0
                ? "Not attended"
                : "Completed"}
            </Text>
            {/* <Text
              style={{
                fontSize: fontSize + 5,
                color: colors.primary,
                fontWeight: "700",
              }}
            >
              {reservation.name}
            </Text> */}

            <View
              style={{
                marginTop: 10,
              }}
            >
              <Text
                style={{
                  fontSize: fontSize + 2,
                  color: colors.primary,
                  fontWeight: "700",
                  marginBottom: 2,
                }}
              >
                Client details
              </Text>
              <Text style={{ fontSize, color: colors.gray }}>
                Firstname :{" "}
                {getUser(this.state.users, reservation.session.client_Id)}
              </Text>
              <Text style={{ fontSize, color: colors.gray }}>
                Lastname :{" "}
                {getUser(this.state.users, reservation.session.client_Id, true)}
              </Text>
              <Text style={{ fontSize, color: colors.gray }}>
                Contact :{" "}
                {getUser(
                  this.state.users,
                  reservation.session.client_Id,
                  false,
                  "user_Contact"
                )}
              </Text>
              <Text style={{ fontSize, color: colors.gray }}>
                Email :{" "}
                {getUser(
                  this.state.users,
                  reservation.session.client_Id,
                  false,
                  "user_Email"
                )}
              </Text>
            </View>
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
        <Text>This is empty date!</Text>
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

export default connect(mapStateToProps, mapDispatchToProps)(CoachScreen);

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
    height: 15,
    flex: 1,
    paddingTop: 30,
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
