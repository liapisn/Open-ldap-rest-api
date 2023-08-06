import "express";

declare global {
  namespace Express {
    interface Request {
      credentials: Credentials;
    }
  }
}

export type Credentials = {
  username: string;
  password: string;
};

export {};
