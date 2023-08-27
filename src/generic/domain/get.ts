import { Credentials } from "../../common/types/auth";
import { getEntriesByFilter } from "../gateway/get";
import { constructOrganizationalUnits } from "./common";

class GetByFilterCommandHandler {
  handle = async (command: GetByFilterCommand): Promise<any> => {
    const opts = this.constructOptions(command.filter);

    return await getEntriesByFilter(
      command.credentials.username,
      command.credentials.password,
      opts,
      command.organizationalUnits
    );
  };

  private constructOptions = (filter) => ({
    filter: filter,
    scope: "sub",
    attributes: ["*"],
  });
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
    this.organizationalUnits = constructOrganizationalUnits(ous);
  }
}

export const constructHandler = new GetByFilterCommandHandler();
