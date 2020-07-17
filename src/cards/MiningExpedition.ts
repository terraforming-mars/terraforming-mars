import { IProjectCard } from "./IProjectCard";
import { CardType } from "./CardType";
import { Tags } from "./Tags";
import { Player } from "../Player";
import { Game } from "../Game";
import { Resources } from '../Resources';
import { CardName } from '../CardName';
import { MAX_OXYGEN_LEVEL, REDS_RULING_POLICY_COST } from "../constants";
import { PartyHooks } from "../turmoil/parties/PartyHooks";
import { PartyName } from "../turmoil/parties/PartyName";

export class MiningExpedition implements IProjectCard {
    public cost: number = 12;
    public tags: Array<Tags> = [];
    public cardType: CardType = CardType.EVENT;
    public name: CardName = CardName.MINING_EXPEDITION;
    public hasRequirements = false;

    public canPlay(player: Player, game: Game): boolean {
        const oxygenMaxed = game.getOxygenLevel() === MAX_OXYGEN_LEVEL;
    
        if (PartyHooks.shouldApplyPolicy(game, PartyName.REDS) && !oxygenMaxed) {
          return player.canAfford(this.cost + REDS_RULING_POLICY_COST);
        }
    
        return true;
    }

    public play(player: Player, game: Game) {
        game.addResourceDecreaseInterrupt(player, Resources.PLANTS, 2);
        player.steel += 2;
        return game.increaseOxygenLevel(player, 1);
    }
}
