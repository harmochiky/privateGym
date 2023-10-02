export default function formatTime(timeString) {
  const [hours, minutes] = timeString.split(":").map(Number);

  let period = "am";
  let formattedHours = hours;

  if (hours >= 12) {
    period = "pm";
    if (hours > 12) {
      formattedHours = hours - 12;
    }
  }

  if (formattedHours === 0) {
    formattedHours = 12; // 0:00 should be formatted as 12:00am
  }

  const formattedTime = `${formattedHours}:${minutes
    .toString()
    .padStart(2, "0")}${period}`;
  return formattedTime;
}
