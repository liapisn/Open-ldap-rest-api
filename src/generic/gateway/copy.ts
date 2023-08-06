import { ldapClient, ldapCopy } from "../../common/ldapClient";
import { LoginError } from "../../common/errors/LoginError";
import { NoSuchAttribute } from "../domain/errors/NoSuchAttribute";

export const copy = async (
  username: string,
  password: string,
  location: string,
  dn: string
): Promise<void> => {
  return await new Promise((resolve, reject) => {
    ldapClient.bind(username, password, async (err) => {
      if (err) {
        return reject(new LoginError("Wrong credentials"));
      }

      const result = new Promise((resolve, reject) => {
        const change = ldapCopy("add", dn);

        ldapClient.modify(location, change, (err) => {
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
        .then(() => resolve());
    });
  });
};
