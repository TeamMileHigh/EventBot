import HandlerContext from "./HandlerContext";
type Handler = (message: HandlerContext) => Promise<void>;
export default function run(handler: Handler): Promise<void>;
export {};
//# sourceMappingURL=Runner.d.ts.map