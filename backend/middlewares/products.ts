import type { Request, Response, NextFunction } from "express";

export const apiKeyCheck = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const apiKey = req.headers["x-api-key"];
  // console.log("incoming apiKey: ", apiKey);
  // console.log("backend apikey: ", process.env.API_KEY);
  if (apiKey !== process.env.API_KEY) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  next();
};
