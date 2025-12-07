import { Injectable } from "@nestjs/common";
import { FinalData, ModifiedData } from "lib/common";
import { BroadcasterMainGateway } from "./broadcaster-main.gateway";

@Injectable()
export class BroadcasterMainService {


    constructor(private broadcasterMainGateway: BroadcasterMainGateway) { }
    calculateFinalData(data: ModifiedData) {

        if (data.should_execute) {

            if (data.deviation_type) {
                if (data.priority === 'high_sell') {
                    return 'sell_now';
                } else {
                    return 'sell_soon';
                }
            } else {
                if (data.priority === 'high_buy') {
                    return 'buy_now';
                } else {
                    return 'buy_soon';
                }
            }
        } else {
            return 'hold';
        }

    }
    finalizedData(data: ModifiedData):FinalData {

        const finalData: FinalData = {
            ...data,
            signal: this.calculateFinalData(data)
        }
        return finalData;

    }

    broadcastMarkedData(data: ModifiedData) {
        this.broadcasterMainGateway.broadcastModifiedData('finalData', this.finalizedData(data));
    }
}