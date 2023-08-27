import { Credentials } from "../../common/types/auth";
import { create } from "../gateway/create";
import { constructOrganizationalUnits } from "./common";

class CreateCommandHandler {
  handle = async (command: CreateCommand) => {
    const opts = {
      ...command.data,
      objectClass: "inetOrgPerson",
    };

    return await create(
      command.credentials.username,
      command.credentials.password,
      opts,
      command.organizationalUnits
    );
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
    this.organizationalUnits = constructOrganizationalUnits(ous);
  }
}

export const constructHandler = new CreateCommandHandler();
