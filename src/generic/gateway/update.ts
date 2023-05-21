import { ldapChange, ldapClient } from "../../common/ldapClient";
import { LoginError } from "../../common/errors/LoginError";
import { NoSuchAttribute } from "../domain/errors/NoSuchAttribute";

export const update = async (
  username: string,
  password: string,
  cn: string,
  ou: string,
  newFields: object
) => {
  return await new Promise((resolve, reject) => {
    ldapClient.bind(username, password, async (err) => {
      if (err) {
        return reject(new LoginError("Wrong credentials"));
      }

      const result = new Promise((resolve, reject) => {
        const change = ldapChange("replace", newFields);
        ldapClient.modify(`cn=${cn},${ou},ou=system`, change, (err) => {
          if (err) {
            switch (err.code) {
              case 16:
              case 32:
                return reject(new NoSuchAttribute(err.message));
              default:
                return reject(new Error(err));
            }
          }
          return resolve(true);
        });
      });

      result
        .catch((err) => {
          return reject(err);
        })
        .then(() => resolve(true));
    });
  });
};
