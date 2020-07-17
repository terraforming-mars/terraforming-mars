import { IProjectCard } from "./IProjectCard";
import { Tags } from "./Tags";
import { CardType } from "./CardType";
import { Player } from "../Player";
import { Game } from "../Game";
import { CardName } from '../CardName';
import { LogMessageType } from "../LogMessageType";
import { LogMessageData } from "../LogMessageData";
import { LogMessageDataType } from "../LogMessageDataType";
import { PartyHooks } from "../turmoil/parties/PartyHooks";
import { PartyName } from "../turmoil/parties/PartyName";
import { REDS_RULING_POLICY_COST } from "../constants";

export class TerraformingGanymede implements IProjectCard {
    public cost: number = 33;
    public tags: Array<Tags> = [Tags.JOVIAN, Tags.SPACE];
    public name: CardName = CardName.TERRAFORMING_GANYMEDE;
    public cardType: CardType = CardType.AUTOMATED;
    public hasRequirements = false;

    public canPlay(player: Player, game: Game) {
        const steps = 1 + player.getTagCount(Tags.JOVIAN);

        if (PartyHooks.shouldApplyPolicy(game, PartyName.REDS)) {
            return player.canAfford(this.cost + REDS_RULING_POLICY_COST * steps, game, false, true);
        }
    
        return true;
    }

    public play(player: Player, game: Game) {
        const steps = 1 + player.getTagCount(Tags.JOVIAN);
        player.increaseTerraformRatingSteps(steps, game);
        game.log(
            LogMessageType.DEFAULT,
            "${0} gained ${1} TR",
            new LogMessageData(LogMessageDataType.PLAYER, player.id),
            new LogMessageData(LogMessageDataType.STRING, steps.toString())
        );
        return undefined;
    }
    public getVictoryPoints() {
        return 2;
    }
}
