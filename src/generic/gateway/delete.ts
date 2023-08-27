import { ldapClient } from "../../common/ldapClient";
import { LoginError } from "../../common/errors/LoginError";
import { NotFound } from "../domain/errors/NotFound";

export const deleteEntity = async (username, password, cn, ou) => {
  return await new Promise<void>((resolve, reject) => {
    ldapClient.bind(username, password, async (err) => {
      if (err) {
        return reject(new LoginError("Wrong credentials"));
      }

      try {
        await deleteEntry(ldapClient, cn, ou);
        return resolve();
      } catch (e) {
        return reject(e);
      }
    });
  });
};

const deleteEntry = async (ldapClient, cn, ou): Promise<void> => {
  return await new Promise((resolve, reject) => {
    ldapClient.del(`cn=${cn},${ou},ou=system`, async (err) => {
      if (err) {
        switch (err.code) {
          case 32:
            return reject(new NotFound(err.message));
          default:
            return reject(new Error(err));
        }
      }
      return resolve();
    });
  });
};
