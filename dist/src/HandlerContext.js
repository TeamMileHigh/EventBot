export default class HandlerContext {
    constructor(message) {
        this.message = message;
    }
    async reply(content) {
        await this.message.conversation.send(content);
    }
}
//# sourceMappingURL=HandlerContext.js.map