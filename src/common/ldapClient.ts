import ldap from "ldapjs";

export const ldapClient = ldap.createClient({
  url: process.env.LDAP_SERVER,
  protocol: "ldap",
  reconnect: true,
  idleTimeout: 3000,
});

export const ldapChange = (operation: string, field: object) => {
  const type = Object.keys(field)[0];
  const values = Array.isArray(field[type]) ? field[type] : [field[type]];

  return new ldap.Change({
    operation: operation,
    modification: {
      type: type,
      values: values,
    },
  });
};

export const ldapCopy = (operation: string, dn: string) => {
  return new ldap.Change({
    operation: operation,
    modification: {
      type: "uniqueMember",
      values: [dn],
    },
  });
};
