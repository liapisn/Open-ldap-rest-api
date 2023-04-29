import { ldapClient } from "../../common/ldapClient";
import { LoginError } from "../../common/errors/LoginError";
import { NotFound } from "../domain/errors/NotFound";
import { InvalidOrganizationalUnit } from "../domain/errors/InvalidOrganizationalUnit";

export const get = async (username, password, options, ou, multiple) => {
  return await new Promise<any>((resolve, reject) => {
    ldapClient.bind(username, password, async (err) => {
      if (err) {
        return reject(new LoginError("Wrong credentials"));
      }

      const search = new Promise<any | null>((resolve, reject) => {
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
              if (multiple) {
                entries.push({
                  dn: entry.pojo.objectName,
                  uid: entry.pojo.attributes[2].values[0],
                  sn: entry.pojo.attributes[0].values[0],
                  cn: entry.pojo.attributes[1].values[0],
                });
              } else
                resolve({
                  dn: entry.pojo.objectName,
                  uid: entry.pojo.attributes[2].values[0],
                  sn: entry.pojo.attributes[0].values[0],
                  cn: entry.pojo.attributes[1].values[0],
                });
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

      return search
        .then((result) => {
          if (!result?.length) return reject(new NotFound("Entry not found"));
          return resolve(result);
        })
        .catch((err) => reject(err));
    });
  });
};
