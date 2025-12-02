import "@testing-library/jest-dom";

import { TransformStream } from "node:stream/web";
globalThis.TransformStream = TransformStream as any;

import { randomUUID } from "node:crypto";
Object.defineProperty(globalThis, "crypto", {
  value: {
    ...globalThis.crypto,
    randomUUID,
  },
});
