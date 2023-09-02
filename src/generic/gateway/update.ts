import { ldapChange, ldapClient } from "../../common/ldapClient";
import { LoginError } from "../../common/errors/LoginError";
import { NoSuchAttribute } from "../domain/errors/NoSuchAttribute";
import { constructOrganizationalUnits } from "./common";

export const update = async (
  username: string,
  password: string,
  cn: string,
  ous: string[],
  newFields: object
) => {
  return await new Promise<void>((resolve, reject) => {
    ldapClient.bind(username, password, async (err): Promise<void> => {
      if (err) {
        return reject(new LoginError("Wrong credentials"));
      }

      try {
        const organizationalUnit = constructOrganizationalUnits(ous);
        for (const newFieldKey in newFields) {
          await updateField(ldapClient, cn, organizationalUnit, {
            [newFieldKey]: newFields[newFieldKey],
          });
        }
      } catch (e) {
        return reject(e);
      }
      return resolve();
    });
  });
};

const updateField = async (
  ldapClient,
  cn,
  ou,
  newField: object
): Promise<void> => {
  return await new Promise<void>((resolve, reject) => {
    const change = ldapChange("replace", newField);
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
      return resolve();
    });
  });
};
