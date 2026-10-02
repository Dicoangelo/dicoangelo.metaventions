/** Machine-readable export of the reviewed publication allowlist; contains no environment access. */
import { PUBLIC_KNOWLEDGE_ENTRIES } from "../src/content/knowledge/public-knowledge";
process.stdout.write(JSON.stringify(PUBLIC_KNOWLEDGE_ENTRIES));
