import { LoginCommand } from "../domain/login";
import { HttpStatusCode } from "../../common/types/http.model";
import { LoginCommandHandler } from "../domain";

export const login = async (req, res) => {
  const { username, password } = req.body;

  const command = new LoginCommand({ username, password });
  await LoginCommandHandler.handle(command);

  //TODO ENCRYPT CREDENTIALS
  res.cookie("credentials", JSON.stringify(command), {
    maxAge: 600000,
    httpOnly: true,
    sameSite: "lax",
  });

  res.sendStatus(HttpStatusCode.OK);
};
