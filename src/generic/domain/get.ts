import { Credentials } from "../../common/types/auth";
import { LoginError } from "../../common/errors/LoginError";
import { APIError } from "../../common/errors/RestApiError";
import { HttpStatusCode } from "../../common/types/http.model";
import { NotFound } from "./errors/NotFound";
import { get } from "../gateway/get";
import { InvalidOrganizationalUnit } from "./errors/InvalidOrganizationalUnit";

class GetCommandHandler {
  handle = async (command: GetCommand): Promise<any> => {
    const opts = {
      filter: command.filter,
      scope: "sub",
      attributes: ["uid", "sn", "cn"],
    };

    let user;
    try {
      user = await get(
        command.credentials.username,
        command.credentials.password,
        opts,
        command.organizationalUnits,
        command.multiple
      );
    } catch (e) {
      if (e instanceof LoginError)
        throw new APIError(HttpStatusCode.UNAUTHORIZED, e.message);
      if (e instanceof NotFound || e instanceof InvalidOrganizationalUnit)
        throw new APIError(HttpStatusCode.NOT_FOUND, e.message);

      throw e;
    }

    return user;
  };
}

export class GetCommand {
  credentials: Credentials;
  filter: string;
  organizationalUnits: string;
  multiple: boolean;

  constructor({
    credentials,
    filter,
    ous,
    multiple,
  }: {
    credentials: Credentials;
    filter: string;
    ous: string[];
    multiple: boolean;
  }) {
    this.credentials = credentials;
    this.filter = filter;
    this.organizationalUnits = `ou=${ous.reverse().join(",ou=")}`;
    this.multiple = multiple;
  }
}

export const constructHandler = new GetCommandHandler();
