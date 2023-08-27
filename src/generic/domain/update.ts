import { Credentials } from "../../common/types/auth";
import { update } from "../gateway/update";
import { constructOrganizationalUnits } from "./common";

class UpdateEntryCommandHandler {
  handle = async (command: UpdateCommand) => {
    await update(
      command.credentials.username,
      command.credentials.password,
      command.cn,
      command.organizationalUnits,
      command.updatedField
    );
  };
}

export class UpdateCommand {
  credentials: Credentials;
  cn: string;
  organizationalUnits: string;
  updatedField: Object;

  constructor({
    credentials,
    cn,
    ous,
    updatedField,
  }: {
    credentials: Credentials;
    cn: string;
    ous: string[];
    updatedField: object;
  }) {
    this.credentials = credentials;
    this.cn = cn;
    this.organizationalUnits = constructOrganizationalUnits(ous);
    this.updatedField = updatedField;
  }
}

export const constructHandler = new UpdateEntryCommandHandler();
