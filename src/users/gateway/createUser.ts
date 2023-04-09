import { ldapClient } from "../../common/ldapClient";
import { LoginError } from "../../common/errors/LoginError";
import { UserAlreadyExists } from "../domain/errors/UserAlreadyExists";

export const createUser = async (username, password, options) => {
  return await new Promise((resolve, reject) => {
    ldapClient.bind(username, password, async (err) => {
      if (err) {
        return reject(new LoginError("Wrong credentials"));
      }

      const result = new Promise((resolve, reject) => {
        ldapClient.add(
          `cn=${options.cn},ou=users,ou=system`,
          options,
          async (err) => {
            if (err) {
              if (err.code == 68)
                return reject(
                  new UserAlreadyExists(
                    `User with cn: ${options.cn} already exists`
                  )
                );
              return reject(new Error(err));
            }
            return resolve(true);
          }
        );
      });

      result
        .catch((err) => {
          return reject(err);
        })
        .then(() => resolve(true));
    });
  });
};
