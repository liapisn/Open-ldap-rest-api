import ldap from "ldapjs";

export const ldapClient = ldap.createClient({
  url: process.env.LDAP_SERVER,
  protocol: "ldap",
  reconnect: true,
  idleTimeout: 3000,
});
