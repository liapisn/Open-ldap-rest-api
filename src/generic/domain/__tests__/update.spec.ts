import { UpdateCommand } from "../update";
import { constructHandler as UpdateCommandHandler } from "../update";

const username = "uid=admin,ou=system";
const correctPassword = "secret";
const credentials = { username, password: correctPassword };

const cn = "Liap1s";

const entryDataToUpdate = {
  sn: "SN",
  displayName: "New display name",
};

const ous = ["users", "its"];

const mockUpdateEntry = jest.fn((username, password, cn, ou, newFields) => {});

jest.mock("../../gateway/update", () => ({
  update: (username, password, cn, ou, newFields) =>
    mockUpdateEntry(username, password, cn, ou, newFields),
}));

describe("Update entry", function () {
  it("Should update entry to ldap server", async () => {
    const command = new UpdateCommand({
      credentials,
      ous,
      cn,
      updatedFields: entryDataToUpdate,
    });

    await UpdateCommandHandler.handle(command);

    expect(mockUpdateEntry).toHaveBeenCalledWith(
      username,
      correctPassword,
      cn,
      command.organizationalUnits,
      entryDataToUpdate
    );
  });
});
