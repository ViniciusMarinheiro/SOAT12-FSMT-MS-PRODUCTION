import { MessageHandler } from "../types/message.interface";
import { ReceiveWorkOrderStrategy } from "./receiveWorkOrderStrategy.service";
export declare class HandleMessageStrategyFactory {
    private receiveWorkOrderStrategy;
    private strategies;
    private strategyMap;
    constructor(receiveWorkOrderStrategy: ReceiveWorkOrderStrategy);
    getStrategy(queue: string, routingKey: string): MessageHandler;
}
