import { Credentials } from "../../common/types/auth";
import { LoginError } from "../../common/errors/LoginError";
import { UserNotFound } from "./errors/UserNotFound";
import { APIError } from "../../common/errors/RestApiError";
import { HttpStatusCode } from "../../common/types/http.model";
import { getUser } from "../gateway/getUser";
import { User } from "./types/user";

class GetUserCommandHandler {
  handle = async (command: GetUserCommand): Promise<User> => {
    const opts = {
      filter: command.filter,
      scope: "sub",
      attributes: ["uid", "sn", "cn"],
    };

    let user;
    try {
      user = await getUser(
        command.credentials.username,
        command.credentials.password,
        opts
      );
    } catch (e) {
      if (e instanceof LoginError)
        throw new APIError(HttpStatusCode.UNAUTHORIZED, e.message);
      if (e instanceof UserNotFound)
        throw new APIError(HttpStatusCode.NOT_FOUND, e.message);
      throw e;
    }

    return user;
  };
}

export class GetUserCommand {
  credentials: Credentials;
  filter: string;

  constructor({
    credentials,
    filter,
  }: {
    credentials: Credentials;
    filter: string;
  }) {
    this.credentials = credentials;
    this.filter = filter;
  }
}

export const constructHandler = new GetUserCommandHandler();
