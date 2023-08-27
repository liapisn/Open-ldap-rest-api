import { ldapClient } from "../../common/ldapClient";
import { LoginError } from "../../common/errors/LoginError";
import { NotFound } from "../domain/errors/NotFound";
import { InvalidOrganizationalUnit } from "../domain/errors/InvalidOrganizationalUnit";
import { Entity } from "../domain/types";

export const getEntriesByFilter = async (
  username,
  password,
  options,
  ou
): Promise<Entity[]> => {
  return await new Promise<Entity[]>((resolve, reject) => {
    ldapClient.bind(username, password, async (err) => {
      if (err) {
        return reject(new LoginError("Wrong credentials"));
      }

      try {
        const entries = await getEntries(ldapClient, ou, options);

        if (!entries.length) return reject(new NotFound("Entry not found"));
        return resolve(entries);
      } catch (e) {
        reject(e);
      }
    });
  });
};

const getEntries = async (ldapClient, ou, options): Promise<Entity[]> => {
  return await new Promise<Entity[]>((resolve, reject) =>
    ldapClient.search(
      `${ou},ou=system`,
      options,
      async (err, res): Promise<Entity[] | void> => {
        const entries = [] as Entity[];

        if (err) return reject(new NotFound("Not found"));

        res.on("searchEntry", (entry) => {
          if (entry.pojo.attributes.length) {
            const result = entry.pojo.attributes.reduce(
              (entity: Entity, attribute) => {
                entity[attribute.type] = attribute.values[0];
                return entity;
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
      }
    )
  );
};
