import { constructHandler as DeleteCommandHandler } from "../delete";
import { DeleteCommand } from "../delete";

const username = "uid=admin,ou=system";
const correctPassword = "secret";
const credentials = { username, password: correctPassword };

const cn = "Liap1s";

const entryDataToUpdate = {
  sn: "SN",
  displayName: "New display name",
};

const ous = ["users", "its"];

const mockDeleteEntry = jest.fn((username, password, cn, ou) => {});

jest.mock("../../gateway/delete", () => ({
  deleteEntity: (username, password, cn, ou) =>
    mockDeleteEntry(username, password, cn, ou),
}));

describe("Update entry", function () {
  it("Should update entry to ldap server", async () => {
    const command = new DeleteCommand({
      credentials,
      ous,
      cn,
    });

    await DeleteCommandHandler.handle(command);

    expect(mockDeleteEntry).toHaveBeenCalledWith(
      username,
      correctPassword,
      cn,
      command.organizationalUnits
    );
  });
});
