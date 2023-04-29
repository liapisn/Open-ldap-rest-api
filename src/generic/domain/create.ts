import { Credentials } from "../../common/types/auth";
import { LoginError } from "../../common/errors/LoginError";
import { APIError } from "../../common/errors/RestApiError";
import { HttpStatusCode } from "../../common/types/http.model";
import { AlreadyExists } from "./errors/AlreadyExists";
import { create } from "../gateway/create";
import { InvalidOrganizationalUnit } from "./errors/InvalidOrganizationalUnit";

class CreateCommandHandler {
  handle = async (command: CreateCommand) => {
    const opts = {
      ...command.data,
      objectClass: "inetOrgPerson",
    };

    try {
      await create(
        command.credentials.username,
        command.credentials.password,
        opts,
        command.organizationalUnits
      );
    } catch (e) {
      if (e instanceof LoginError)
        throw new APIError(HttpStatusCode.UNAUTHORIZED, e.message);
      if (e instanceof AlreadyExists)
        throw new APIError(HttpStatusCode.CONFLICT, e.message);
      if (e instanceof InvalidOrganizationalUnit)
        throw new APIError(HttpStatusCode.NOT_FOUND, e.message);

      throw e;
    }

    return;
  };
}

export class CreateCommand {
  credentials: Credentials;
  data: {
    uid: string;
    cn: string;
    sn: string;
  };
  organizationalUnits: string;
  constructor({
    credentials,
    data,
    ous,
  }: {
    credentials: Credentials;
    data: {
      uid: string;
      cn: string;
      sn: string;
    };
    ous: string[];
  }) {
    this.credentials = credentials;
    this.data = data;
    this.organizationalUnits = `ou=${ous.reverse().join(",ou=")}`;
  }
}

export const constructHandler = new CreateCommandHandler();
