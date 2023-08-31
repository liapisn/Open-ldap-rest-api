import { ldapClient } from "../../common/ldapClient";
import { LoginError } from "../../common/errors/LoginError";
import { AlreadyExists } from "../domain/errors/AlreadyExists";
import { InvalidOrganizationalUnit } from "../domain/errors/InvalidOrganizationalUnit";
import { constructOrganizationalUnits } from "./common";

export const create = async (
  username,
  password,
  options,
  ou
): Promise<void> => {
  return await new Promise((resolve, reject) => {
    ldapClient.bind(username, password, async (err) => {
      if (err) {
        return reject(new LoginError("Wrong credentials"));
      }

      try {
        await addEntry(
          ldapClient,
          constructOrganizationalUnits(ou),
          options.cn,
          options
        );
        return resolve();
      } catch (e) {
        return reject(e);
      }
    });
  });
};

const addEntry = async (ldapClient, ou, cn, options): Promise<void> => {
  return await new Promise(
    (resolve, reject): Promise<void> =>
      ldapClient.add(`cn=${options.cn},${ou},ou=system`, options, (err) => {
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
        return resolve();
      })
  );
};
