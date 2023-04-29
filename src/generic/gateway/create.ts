import { ldapClient } from "../../common/ldapClient";
import { LoginError } from "../../common/errors/LoginError";
import { AlreadyExists } from "../domain/errors/AlreadyExists";
import { InvalidOrganizationalUnit } from "../domain/errors/InvalidOrganizationalUnit";

export const create = async (username, password, options, ou) => {
  return await new Promise((resolve, reject) => {
    ldapClient.bind(username, password, async (err) => {
      if (err) {
        return reject(new LoginError("Wrong credentials"));
      }

      const result = new Promise((resolve, reject) => {
        ldapClient.add(
          `cn=${options.cn},${ou},ou=system`,
          options,
          async (err) => {
            if (err) {
              switch (err.code) {
                case 68:
                  return reject(
                    new AlreadyExists(
                      `Entry with cn: '${options.cn}' already exists in ou: '${ou}'`
                    )
                  );
                case 32:
                  return reject(new InvalidOrganizationalUnit(err.message));
                default:
                  return reject(new Error(err));
              }
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
