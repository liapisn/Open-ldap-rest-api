import { ldapClient } from "../../common/ldapClient";
import { LoginError } from "../../common/errors/LoginError";
import { NotFound } from "../domain/errors/NotFound";
import { InvalidOrganizationalUnit } from "../domain/errors/InvalidOrganizationalUnit";
import { Entity } from "../domain/types";
import { constructOrganizationalUnits } from "./common";

export const getEntryByCn = async (
  username,
  password,
  options,
  ous: string[]
): Promise<Entity> => {
  return await new Promise<Entity>((resolve, reject) => {
    ldapClient.bind(username, password, async (err) => {
      if (err) {
        return reject(new LoginError("Wrong credentials"));
      }

      try {
        const entry = await getEntry(
          ldapClient,
          options,
          constructOrganizationalUnits(ous)
        );

        return resolve(entry);
      } catch (e) {
        reject(e);
      }
    });
  });
};

const getEntry = async (ldapClient, options, ou): Promise<Entity> => {
  return await new Promise<Entity>((resolve, reject) => {
    ldapClient.search(`${ou},ou=system`, options, async (err, res) => {
      if (err) return reject(new NotFound("Entry not found"));

      res.on("searchEntry", (entry) => {
        if (entry.pojo.attributes.length) {
          const result = entry.pojo.attributes.reduce(
            (entry, attribute) => {
              entry[attribute.type] = attribute.values[0];
              return entry;
            },
            { dn: entry.pojo.objectName }
          );

          return resolve(result);
        }
      });

      res.on("error", (err) => {
        switch (err.code) {
          case 32:
            return reject(new InvalidOrganizationalUnit(err.message));
        }

        return reject(err);
      });

      res.on("end", () => {
        return reject(new NotFound("Entry not found"));
      });
    });
  });
};
