import { ldapClient } from "../../common/ldapClient";
import { LoginError } from "../../common/errors/LoginError";
import { NotFound } from "../domain/errors/NotFound";
import { InvalidOrganizationalUnit } from "../domain/errors/InvalidOrganizationalUnit";

export const getEntriesByFilter = async (username, password, options, ou) => {
  return await new Promise<any>((resolve, reject) => {
    ldapClient.bind(username, password, async (err) => {
      if (err) {
        return reject(new LoginError("Wrong credentials"));
      }

      const entries = new Promise<any | null>((resolve, reject) => {
        ldapClient.search(`${ou},ou=system`, options, async (err, res) => {
          const entries = [] as {
            dn: String;
            uid: String;
            sn: String;
            cn: String;
          }[];

          if (err) return reject(new NotFound("Not found"));

          res.on("searchEntry", (entry) => {
            if (entry.pojo.attributes.length) {
              const result = entry.pojo.attributes.reduce(
                (acc, attribute) => {
                  acc[attribute.type] = attribute.values[0];
                  return acc;
                },
                { dn: entry.pojo.objectName }
              );
              entries.push(result);
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
            ldapClient.unbind();
            return resolve(entries);
          });
        });
      });

      return entries
        .then((result) => {
          if (!result?.length) return reject(new NotFound("Entry not found"));
          return resolve(result);
        })
        .catch((err) => reject(err));
    });
  });
};
