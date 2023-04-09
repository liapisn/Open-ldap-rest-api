import { ldapClient } from "../../common/ldapClient";
import { LoginError } from "../../common/errors/LoginError";
import { UserNotFound } from "../domain/errors/UserNotFound";
import { User } from "../domain/types/user";

export const getUser = async (username, password, options) => {
  return await new Promise<User>((resolve, reject) => {
    ldapClient.bind(username, password, async (err) => {
      if (err) {
        return reject(new LoginError("Wrong credentials"));
      }

      const user = await new Promise<User | null>((resolve, reject) => {
        ldapClient.search("ou=users,ou=system", options, async (err, res) => {
          if (err) return reject(new UserNotFound("User not found"));

          res.on("searchEntry", (entry) => {
            if (entry.pojo.attributes.length) {
              return resolve({
                dn: entry.pojo.objectName,
                uid: entry.pojo.attributes[2].values[0],
                sn: entry.pojo.attributes[0].values[0],
                cn: entry.pojo.attributes[1].values[0],
              });
            }
          });
          res.on("end", () => {
            return resolve(null);
          });
        });
      });
      if (!user) return reject(new UserNotFound("User not found"));
      return resolve(user);
    });
  });
};
