import { Request, Response, NextFunction, RequestHandler } from "express";

type AsyncRequestHandler<
  P = any,
  ResBody = any,
  ReqBody = any,
  ReqQuery = any,
> = (
  req: Request<P, ResBody, ReqBody, ReqQuery>,
  res: Response<ResBody>,
  next: NextFunction,
) => void | Promise<void>;

export function asyncHandler<
  P = any,
  ResBody = any,
  ReqBody = any,
  ReqQuery = any,
>(fn: AsyncRequestHandler<P, ResBody, ReqBody, ReqQuery>): RequestHandler {
  return (req, res, next) => {
    void Promise.resolve(fn(req as any, res as any, next)).catch(next);
  };
}
