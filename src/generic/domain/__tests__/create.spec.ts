import { CreateCommand } from "../create";
import { constructHandler as CreateCommandHandler } from "../create";

const username = "uid=admin,ou=system";
const correctPassword = "secret";
const credentials = { username, password: correctPassword };

const entryDataToCreate = {
  uid: "21950",
  cn: "Liap1s",
  sn: "SN",
};
const options = {
  ...entryDataToCreate,
  objectClass: "inetOrgPerson",
};
const ous = ["users", "its"];

const mockCreateEntry = jest.fn((username, password, options, ou) => {});

jest.mock("../../gateway/create", () => ({
  create: (username, password, options, ou) =>
    mockCreateEntry(username, password, options, ou),
}));

describe("Create entry", function () {
  it("Should add entry to ldap server", async () => {
    const command = new CreateCommand({
      credentials,
      data: entryDataToCreate,
      ous,
    });

    await CreateCommandHandler.handle(command);

    expect(mockCreateEntry).toHaveBeenCalledWith(
      username,
      correctPassword,
      options,
      command.organizationalUnits
    );
  });
});
