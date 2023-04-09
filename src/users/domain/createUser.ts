import { Credentials } from "../../common/types/auth";
import { LoginError } from "../../common/errors/LoginError";
import { APIError } from "../../common/errors/RestApiError";
import { HttpStatusCode } from "../../common/types/http.model";
import { createUser } from "../gateway/createUser";
import { UserAlreadyExists } from "./errors/UserAlreadyExists";

class CreateUserCommandHandler {
  handle = async (command: CreateUserCommand) => {
    const opts = {
      ...command.data,
      objectClass: "inetOrgPerson",
    };

    try {
      await createUser(
        command.credentials.username,
        command.credentials.password,
        opts
      );
    } catch (e) {
      if (e instanceof LoginError)
        throw new APIError(HttpStatusCode.UNAUTHORIZED, e.message);
      if (e instanceof UserAlreadyExists)
        throw new APIError(HttpStatusCode.CONFLICT, e.message);
      throw e;
    }

    return;
  };
}

export class CreateUserCommand {
  credentials: Credentials;
  data: {
    uid: string;
    cn: string;
    sn: string;
  };

  constructor({
    credentials,
    data,
  }: {
    credentials: Credentials;
    data: {
      uid: string;
      cn: string;
      sn: string;
    };
  }) {
    this.credentials = credentials;
    this.data = data;
  }
}

export const constructHandler = new CreateUserCommandHandler();
