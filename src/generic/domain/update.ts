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
      command.updatedFields
    );
  };
}

export class UpdateCommand {
  credentials: Credentials;
  cn: string;
  organizationalUnits: string;
  updatedFields: Object;

  constructor({
    credentials,
    cn,
    ous,
    updatedFields,
  }: {
    credentials: Credentials;
    cn: string;
    ous: string[];
    updatedFields: object;
  }) {
    this.credentials = credentials;
    this.cn = cn;
    this.organizationalUnits = constructOrganizationalUnits(ous);
    this.updatedFields = updatedFields;
  }
}

export const constructHandler = new UpdateEntryCommandHandler();
