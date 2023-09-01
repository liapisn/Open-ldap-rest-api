import CryptoJS from "crypto-js";
import { login } from "../gateway/login";

const ENCRYPTION_KEY =
  process.env.ENCRYPTION_KEY || "e0IcJnxB5kbEA2qYI4U3Gfd+zdRmoabc";

class LoginCommandHandler {
  handle = async (command: LoginCommand) => {
    await login(command.username, command.password);

    return this.encryptCredentials(command);
  };

  private encryptCredentials = (command: LoginCommand): string => {
    return CryptoJS.AES.encrypt(
      JSON.stringify(command),
      ENCRYPTION_KEY
    ).toString();
  };
}

export class LoginCommand {
  username: string;
  password: string;

  constructor({ username, password }: { username: string; password: string }) {
    this.username = username;
    this.password = password;
  }
}

export const constructHandler = new LoginCommandHandler();
