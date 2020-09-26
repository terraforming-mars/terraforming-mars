import { LogMessageData } from "./LogMessageData";
import { Game } from "./Game";
import { LogMessageDataType } from "./LogMessageDataType";
import { LogMessageType } from "./LogMessageType";
import { Player } from "./Player";
import { CardName } from "./CardName";
import { ICard } from "./cards/ICard";
import { IAward } from "./awards/IAward";
import { IMilestone } from "./milestones/IMilestone";
import { IColony } from "./colonies/Colony";
import { IParty } from "./turmoil/parties/IParty";

export class ChainLog {
    private message: string;
    private parameters: Array<LogMessageData>;
    private type: LogMessageType;

    constructor(message: string) {
        this.message = message;
        this.parameters = new Array();
        this.type = LogMessageType.DEFAULT;
    }

    public forNewGeneration(): ChainLog {
        this.type = LogMessageType.NEW_GENERATION;
        return this;
    }

    public stringParam(value: string): ChainLog {
        this.parameters.push(new LogMessageData(LogMessageDataType.STRING, value));
        return this;
    }

    public numberParam(value: number): ChainLog {
        this.parameters.push(new LogMessageData(LogMessageDataType.STRING, value.toString()));
        return this;
    }

    public playerParam(value: Player): ChainLog {
        return this.playerIdParam(value.id);
    }

    public playerIdParam(value: string): ChainLog {
        this.parameters.push(new LogMessageData(LogMessageDataType.PLAYER, value));
        return this;
    }

    public cardParam(value: ICard): ChainLog {
        return this.cardNameParam(value.name);
    }

    public cardNameParam(value: CardName): ChainLog {
        this.parameters.push(new LogMessageData(LogMessageDataType.CARD, value));
        return this;
    }
  
    public awardParam(value: IAward): ChainLog {
        this.parameters.push(new LogMessageData(LogMessageDataType.AWARD, value.name));
        return this;
    }

    public milestoneParam(value: IMilestone): ChainLog {
        this.parameters.push(new LogMessageData(LogMessageDataType.MILESTONE, value.name));
        return this;
    }

    public colonyParam(value: IColony): ChainLog {
        this.parameters.push(new LogMessageData(LogMessageDataType.MILESTONE, value.name));
        return this;
    }

    public standardProjectParam(value: string): ChainLog {
        this.parameters.push(new LogMessageData(LogMessageDataType.STANDARD_PROJECT, value));
        return this;
    }

    public partyParam(value: IParty): ChainLog {
        this.parameters.push(new LogMessageData(LogMessageDataType.PARTY, value.name));
        return this;
    }

    public log(game: Game) {
        game.log(this.type, this.message, ...this.parameters);
    }
}