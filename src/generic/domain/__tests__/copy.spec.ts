import { CopyCommand, constructHandler as CopyCommandHandler } from "../copy";

const username = "uid=admin,ou=system";
const correctPassword = "secret";
const credentials = { username, password: correctPassword };

const dn = "cn=Liap1s,ou=its,ou=users,ou=system";
const location = "cn=Administrators,ou=groups,ou=system";

const mockCopyEntry = jest.fn((username, password, location, dn) => {});

jest.mock("../../gateway/copy", () => ({
  copy: (username, password, location, dn) =>
    mockCopyEntry(username, password, location, dn),
}));

describe("Update entry", function () {
  it("Should update entry to ldap server", async () => {
    const command = new CopyCommand({
      credentials,
      location,
      dn,
    });

    await CopyCommandHandler.handle(command);

    expect(mockCopyEntry).toHaveBeenCalledWith(
      username,
      correctPassword,
      location,
      dn
    );
  });
});
