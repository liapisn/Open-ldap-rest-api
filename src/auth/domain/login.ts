import { login } from "../gateway/login";

class LoginCommandHandler {
  handle = async (command: LoginCommand) => {
    await login(command.username, command.password);

    //TODO ENCRYPT CREDENTIALS
    return JSON.stringify(command);
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
