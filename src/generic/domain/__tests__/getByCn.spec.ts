import { constructHandler as GetByCnCommandHandler } from "../getByCn";
import { GetByCnCommand } from "../getByCn";

const username = "uid=admin,ou=system";
const password = "secret";

const credentials = { username, password: password };

const cn = "Liap1s";

const mockGetEntryByCn = jest.fn(
  (username, password, options, ou) => mockEntry
);
const mockEntry = {
  dn: "cn=Liap1s,ou=its,ou=users,ou=system",
  sn: "SN",
  cn: cn,
  objectClass: "top",
  uid: "21950",
  displayName: "Nikos",
};

const options = {
  filter: `cn=${cn}`,
  scope: "sub",
  attributes: ["*"],
};

const ous = ["users", "its"];

jest.mock("../../gateway/getByCn", () => ({
  getEntryByCn: (username, password, options, ou) =>
    mockGetEntryByCn(username, password, options, ou),
}));

describe("Get entries by filter", function () {
  it("Should provide entries with entity data", async () => {
    const command = new GetByCnCommand({
      credentials,
      cn,
      ous,
    });

    const entry = await GetByCnCommandHandler.handle(command);

    expect(mockGetEntryByCn).toHaveBeenCalledWith(
      username,
      password,
      options,
      command.organizationalUnits
    );

    expect(entry).toBe(mockEntry);
  });
});
