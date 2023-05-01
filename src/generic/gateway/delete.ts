import { ldapClient } from "../../common/ldapClient";
import { LoginError } from "../../common/errors/LoginError";
import { NotFound } from "../domain/errors/NotFound";

export default async (username, password, cn, ou) => {
  return await new Promise((resolve, reject) => {
    ldapClient.bind(username, password, async (err) => {
      if (err) {
        return reject(new LoginError("Wrong credentials"));
      }

      const result = new Promise((resolve, reject) => {
        ldapClient.del(`cn=${cn},${ou},ou=system`, async (err) => {
          if (err) {
            switch (err.code) {
              case 32:
                return reject(new NotFound(err.message));
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
