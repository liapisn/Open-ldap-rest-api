import { copy } from "../gateway/copy";
import { Credentials } from "../../common/types/auth";

class CopyCommandHandler {
  handle = async (command: CopyCommand) => {
    await copy(
      command.credentials.username,
      command.credentials.password,
      command.location,
      command.dn
    );
  };
}

export class CopyCommand {
  credentials: Credentials;
  location: string;
  dn: string;

  constructor({
    credentials,
    location,
    dn,
  }: {
    credentials: Credentials;
    location: string;
    dn: string;
  }) {
    this.credentials = credentials;
    this.location = location;
    this.dn = dn;
  }
}

export const constructHandler = new CopyCommandHandler();
