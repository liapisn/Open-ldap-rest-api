import { Credentials } from "../../common/types/auth";
import { deleteEntity } from "../gateway/delete";

class DeleteCommandHandler {
  handle = async (command: DeleteCommand): Promise<void> => {
    await deleteEntity(
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
  organizationalUnits: string[];

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
    this.organizationalUnits = ous;
  }
}

export const constructHandler = new DeleteCommandHandler();
