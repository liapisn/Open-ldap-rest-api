import { LoginCommand } from "../login";
import { constructHandler as LoginCommandHandler } from "../login";
import { LoginError } from "../../../common/errors/LoginError";

const username = "uid=admin,ou=system";
const correctPassword = "secret";

const mockSuccessLogin = jest.fn();

jest.mock("../../gateway/login", () => ({
  login: (username, password) => {
    if (password == correctPassword) mockSuccessLogin(username, password);
    else throw new LoginError("Wrong credentials");
  },
}));

describe("Auth login", function () {
  it("Should provide cookie with correct credentials", async () => {
    const command = new LoginCommand({ username, password: correctPassword });

    const cookie = await LoginCommandHandler.handle(command);

    expect(mockSuccessLogin).toHaveBeenCalledWith(
      command.username,
      command.password
    );

    expect(typeof cookie).toBe("string");
  });

  it("Should provide cookie with in correct credentials", async () => {
    const command = new LoginCommand({ username, password: "WRONG PASSWORD" });

    try {
      await LoginCommandHandler.handle(command);
    } catch (e) {
      expect(e instanceof LoginError).toBe(true);
    }
  });
});
