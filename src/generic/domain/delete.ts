import { Credentials } from "../../common/types/auth";
import { LoginError } from "../../common/errors/LoginError";
import { APIError } from "../../common/errors/RestApiError";
import { HttpStatusCode } from "../../common/types/http.model";
import { NotFound } from "./errors/NotFound";
import deleteEntry from "../gateway/delete";

class DeleteCommandHandler {
  handle = async (command: DeleteCommand): Promise<void> => {
    try {
      await deleteEntry(
        command.credentials.username,
        command.credentials.password,
        command.cn,
        command.organizationalUnits
      );
    } catch (e) {
      if (e instanceof LoginError)
        throw new APIError(HttpStatusCode.UNAUTHORIZED, e.message);
      if (e instanceof NotFound)
        throw new APIError(HttpStatusCode.NOT_FOUND, e.message);

      throw e;
    }

    return;
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
    this.organizationalUnits = `ou=${ous.reverse().join(",ou=")}`;
  }
}

export const constructHandler = new DeleteCommandHandler();
