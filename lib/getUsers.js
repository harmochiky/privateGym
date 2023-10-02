import axios from "axios";

export default async function () {
  try {
    let users = await axios.get("/Users/GetUsers");
    users = users.data;
    return users;
  } catch (error) {
    console.log(error);
    return [];
  }
}

export function getUser(
  users = [],
  user_id = "",
  onlyLastName = false,
  field = null
) {
  let user = null;
  users.forEach((x) => {
    if (x.id === user_id) {
      user = x;
    }
  });

  if (field) return user[field];

  if (onlyLastName) return user?.user_LastName;

  return user?.user_FirstName;
}
