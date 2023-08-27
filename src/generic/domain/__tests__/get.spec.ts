import { constructHandler as GetByFilterCommandHandler } from "../get";
import { GetByFilterCommand } from "../get";

const username = "uid=admin,ou=system";
const correctPassword = "secret";

const credentials = { username, password: correctPassword };

const mockGetEntries = jest.fn((username, password, options, ou) => [
  mockEntry,
]);
const mockEntry = {
  dn: "cn=Liap1s,ou=its,ou=users,ou=system",
  sn: "SN",
  cn: "Liap1s",
  objectClass: "top",
  uid: "21950",
  displayName: "Nikos",
};

const filter = "&(cn=*)";
const options = {
  filter: filter,
  scope: "sub",
  attributes: ["*"],
};

const ous = ["users", "its"];

jest.mock("../../gateway/get", () => ({
  getEntriesByFilter: (username, password, options, ou) =>
    mockGetEntries(username, password, options, ou),
}));

describe("Get entries by filter", function () {
  it("Should provide entries with entity data", async () => {
    const command = new GetByFilterCommand({
      credentials,
      filter,
      ous: ous,
    });

    const entries = await GetByFilterCommandHandler.handle(command);

    expect(mockGetEntries).toHaveBeenCalledWith(
      username,
      correctPassword,
      options,
      command.organizationalUnits
    );

    expect(entries.length).toBe(1);
    expect(entries[0]).toBe(mockEntry);
  });
});
