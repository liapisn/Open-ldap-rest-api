import { Credentials } from "../../common/types/auth";
import { getEntriesByFilter, getEntryByCn } from "../gateway/get";

class GetByFilterCommandHandler {
  handle = async (command: GetByFilterCommand): Promise<any> => {
    const opts = {
      filter: command.filter,
      scope: "sub",
      attributes: ["*"],
    };

    return await getEntriesByFilter(
      command.credentials.username,
      command.credentials.password,
      opts,
      command.organizationalUnits
    );
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

    return await getEntryByCn(
      command.credentials.username,
      command.credentials.password,
      opts,
      command.organizationalUnits
    );
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
