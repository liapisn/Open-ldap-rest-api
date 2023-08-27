import { Credentials } from "../../common/types/auth";
import { getEntryByCn } from "../gateway/getByCn";
import { constructOrganizationalUnits } from "./common";
import { Entity } from "./types";

class GetByCnCommandHandler {
  handle = async (command: GetByCnCommand): Promise<Entity> => {
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
    this.organizationalUnits = constructOrganizationalUnits(ous);
  }
}

export const constructHandler = new GetByCnCommandHandler();
