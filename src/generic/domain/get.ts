import { Credentials } from "../../common/types/auth";
import { LoginError } from "../../common/errors/LoginError";
import { APIError } from "../../common/errors/RestApiError";
import { HttpStatusCode } from "../../common/types/http.model";
import { NotFound } from "./errors/NotFound";
import { getEntriesByFilter, getEntryByCn } from "../gateway/get";
import { InvalidOrganizationalUnit } from "./errors/InvalidOrganizationalUnit";

class GetByFilterCommandHandler {
  handle = async (command: GetByFilterCommand): Promise<any> => {
    const opts = {
      filter: command.filter,
      scope: "sub",
      attributes: ["*"],
    };

    let user;
    try {
      user = await getEntriesByFilter(
        command.credentials.username,
        command.credentials.password,
        opts,
        command.organizationalUnits
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

export class GetByFilterCommand {
  credentials: Credentials;
  filter: string;
  organizationalUnits: string;

  constructor({
    credentials,
    filter,
    ous,
  }: {
    credentials: Credentials;
    filter: string;
    ous: string[];
  }) {
    this.credentials = credentials;
    this.filter = filter;
    this.organizationalUnits = `ou=${ous.reverse().join(",ou=")}`;
  }
}

class GetByCnCommandHandler {
  handle = async (command: GetByCnCommand): Promise<any> => {
    const opts = {
      filter: `cn=${command.cn}`,
      scope: "sub",
      attributes: ["*"],
    };

    let user;
    try {
      user = await getEntryByCn(
        command.credentials.username,
        command.credentials.password,
        opts,
        command.organizationalUnits
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

export class GetByCnCommand {
  credentials: Credentials;
  cn: string;
  organizationalUnits: string;

  constructor({
    credentials,
    cn,
    ous,
  }: {
    credentials: Credentials;
    cn: string;
    ous: string[];
  }) {
    this.credentials = credentials;
    this.cn = cn;
    this.organizationalUnits = `ou=${ous.reverse().join(",ou=")}`;
  }
}

export const constructHandler = new GetByFilterCommandHandler();
export const constructByCnHandler = new GetByCnCommandHandler();
