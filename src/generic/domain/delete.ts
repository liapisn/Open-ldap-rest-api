import { Credentials } from "../../common/types/auth";
import deleteEntry from "../gateway/delete";
import { constructOrganizationalUnits } from "./common";

class DeleteCommandHandler {
  handle = async (command: DeleteCommand): Promise<void> => {
    await deleteEntry(
      command.credentials.username,
      command.credentials.password,
      command.cn,
      command.organizationalUnits
    );
  };
}

export class DeleteCommand {
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

export const constructHandler = new DeleteCommandHandler();
