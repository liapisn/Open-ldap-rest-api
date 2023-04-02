import { login } from "../gateway/login";
import { LoginError } from "./errors/LoginError";
import { APIError } from "../../common/errors/RestApiError";
import { HttpStatusCode } from "../../common/types/http.model";

class LoginCommandHandler {
  handle = async (command: LoginCommand) => {
    try {
      await login(command.username, command.password);
    } catch (e) {
      if (e instanceof LoginError)
        throw new APIError(HttpStatusCode.UNAUTHORIZED, "Wrong credentials");
      throw e;
    }
  };
}

export class LoginCommand {
  username: string;
  password: string;

  constructor({ username, password }: { username: string; password: string }) {
    this.username = username;
    this.password = password;
  }
}

export const constructHandler = new LoginCommandHandler();
