import { DecodedMessage } from "@xmtp/xmtp-js";
export default class HandlerContext {
    message: DecodedMessage;
    constructor(message: DecodedMessage);
    reply(content: string): Promise<void>;
}
//# sourceMappingURL=HandlerContext.d.ts.map