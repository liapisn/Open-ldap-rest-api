import { Credentials } from "../../common/types/auth";
import { update } from "../gateway/update";

class UpdateEntryCommandHandler {
  handle = async (command: UpdateCommand) => {
    await update(
      command.credentials.username,
      command.credentials.password,
      command.dn,
      command.updatedField
    );
  };
}

export class UpdateCommand {
  credentials: Credentials;
  dn: string;
  updatedField: Object;

  constructor({
    credentials,
    dn,
    updatedField,
  }: {
    credentials: Credentials;
    dn: string;
    updatedField: object;
  }) {
    this.credentials = credentials;
    this.dn = dn;
    this.updatedField = updatedField;
  }
}

export const constructHandler = new UpdateEntryCommandHandler();
