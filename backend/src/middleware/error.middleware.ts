import { Request, Response, NextFunction } from "express";
import { ZodError } from "zod";
import { Prisma } from "@prisma/client";
import { AppError } from "../lib/appError";

function logError(err: unknown, dev: boolean): void {
  if (err instanceof ZodError) {
    console.error("Validation error:", err.flatten());
    return;
  }

  if (err instanceof AppError) {
    console.error("AppError:", { code: err.code, message: err.message });
    return;
  }

  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    console.error("Prisma error:", { code: err.code, message: err.message });
    return;
  }

  if (err instanceof Error) {
    console.error("Error:", {
      message: err.message,
      ...(dev && err.stack ? { stack: err.stack } : {}),
    });
    return;
  }

  console.error("Unknown error:", err);
}

export function errorHandler(
  err: unknown,
  req: Request,
  res: Response,
  next: NextFunction,
): void {
  if (res.headersSent) {
    next(err);
    return;
  }

  const dev = process.env.NODE_ENV === "development";
  logError(err, dev);

  if (err instanceof ZodError) {
    res.status(400).json({
      error: {
        code: "VALIDATION_ERROR",
        message: "Validation failed",
        details: err.flatten(),
      },
    });
    return;
  }

  if (err instanceof AppError) {
    res.status(err.statusCode).json({
      error: {
        code: err.code,
        message: err.message,
      },
    });
    return;
  }

  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    if (err.code === "P2025") {
      res.status(404).json({
        error: {
          code: "NOT_FOUND",
          message: "Resource not found",
        },
      });
      return;
    }
    if (err.code === "P2003") {
      res.status(400).json({
        error: {
          code: "INVALID_REFERENCE",
          message: "Related record does not exist or violates a constraint",
        },
      });
      return;
    }
  }

  const message =
    dev && err instanceof Error ? err.message : "Internal Server Error";

  res.status(500).json({
    error: {
      code: "INTERNAL_ERROR",
      message,
    },
  });
}
