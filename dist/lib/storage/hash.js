import { createHash } from "node:crypto";
export function computeSha256(value) {
    return createHash("sha256").update(value).digest("hex");
}
//# sourceMappingURL=hash.js.map