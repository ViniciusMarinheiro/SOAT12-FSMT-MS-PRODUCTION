import { SetMetadata } from "@nestjs/common";

export const IS_PUBLIC_KEY = "isPublic";

/** Rotas com este decorator não passam pelo JWT guard (ex.: health check). */
export const Public = () => SetMetadata(IS_PUBLIC_KEY, true);
