import { ldapClient } from "../../common/ldapClient";
import { LoginError } from "../../common/errors/LoginError";
import { NotFound } from "../domain/errors/NotFound";
import { InvalidOrganizationalUnit } from "../domain/errors/InvalidOrganizationalUnit";

export const getEntryByCn = async (username, password, options, ou) => {
  return await new Promise<any>((resolve, reject) => {
    ldapClient.bind(username, password, async (err) => {
      if (err) {
        return reject(new LoginError("Wrong credentials"));
      }

      const entry = await new Promise<any | null>((resolve, reject) => {
        ldapClient.search(`${ou},ou=system`, options, async (err, res) => {
          if (err) return reject(new NotFound("Entry not found"));

          res.on("searchEntry", (entry) => {
            if (entry.pojo.attributes.length) {
              const result = entry.pojo.attributes.reduce(
                (acc, attribute) => {
                  acc[attribute.type] = attribute.values[0];
                  return acc;
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
            return resolve(null);
          });
        });
      });

      if (!entry) return reject(new NotFound("Entry not found"));
      return resolve(entry);
    });
  });
};
