import ky from "ky";

export function getUserInfo(userInfo: string): Promise<Object> {
  return ky
    .post(
      "https://us-central1-calendar-condenser-gcp.cloudfunctions.net/get_user",
      { body: userInfo }
    )
    .then(response => {
      return response
        .text()
        .then(text => {
          return JSON.parse(text);
        })
        .catch(err => {
          console.log(err);
          return null;
        });
    })
    .catch(err => {
      return new Promise((resolve, reject) => {
        console.log(err);
        resolve(null);
      });
    });
}
