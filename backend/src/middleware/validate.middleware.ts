import { Request, Response, NextFunction } from "express";
import { ZodType } from "zod";

export const validate =
  (schema: ZodType<unknown, unknown>) =>
  (req: Request, res: Response, next: NextFunction) => {
    try {
      const parsed = schema.parse({
        body: req.body,
        query: req.query,
        params: req.params,
      });

      if (parsed && typeof parsed === "object") {
        const data = parsed as {
          body?: Request["body"];
          query?: Request["query"];
          params?: Request["params"];
        };

        if (data.body !== undefined) req.body = data.body;
        if (data.query !== undefined) req.query = data.query;
        if (data.params !== undefined) req.params = data.params;
      }
      next();
    } catch (error) {
      next(error);
    }
  };
