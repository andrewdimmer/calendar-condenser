import ky from "ky";
import { UserDatabase } from "../@Types";

export function getUserInfo(
  userId: string
): Promise<UserDatabase.Document | null> {
  return ky
    .post(
      "https://us-central1-calendar-condenser-gcp.cloudfunctions.net/get_user",
      { body: userId }
    )
    .then(response => {
      return response
        .text()
        .then(text => {
          console.log(text);
          return JSON.parse(text);
        })
        .catch(err => {
          console.log(err);
          return null;
        });
    })
    .catch(err => {
      console.log(err);
      return null;
    });
}
