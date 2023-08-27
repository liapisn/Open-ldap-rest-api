import { ldapClient, ldapCopy } from "../../common/ldapClient";
import { LoginError } from "../../common/errors/LoginError";
import { NoSuchAttribute } from "../domain/errors/NoSuchAttribute";
import { NotFound } from "../domain/errors/NotFound";
import { AlreadyExists } from "../domain/errors/AlreadyExists";

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

      try {
        await copyEntry(ldapClient, location, dn);
        return resolve();
      } catch (e) {
        return reject(e);
      }
    });
  });
};

export const copyEntry = async (ldapClient, location, dn): Promise<void> => {
  return await new Promise((resolve, reject) => {
    const change = ldapCopy("add", dn);

    ldapClient.modify(location, change, (err) => {
      if (err) {
        switch (err.code) {
          case 16:
          case 32:
            return reject(new NoSuchAttribute(err.message));
          case 20:
            return reject(new AlreadyExists(err.message));
          default:
            return reject(new Error(err));
        }
      }
      return resolve();
    });
  });
};
