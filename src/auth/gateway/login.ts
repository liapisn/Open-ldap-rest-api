import { ldapClient } from "../../common/ldapClient";
import { LoginError } from "../domain/errors/LoginError";

export const login = async (username, password): Promise<void> => {
  await new Promise<void>((resolve, reject) => {
    ldapClient.bind(username, password, (err) => {
      if (err) {
        return reject(new LoginError("Wrong credentials"));
      }
      resolve();
    });
  });
};
