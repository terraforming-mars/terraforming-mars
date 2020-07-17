import { IActionCard } from "./ICard";
import { IProjectCard } from "./IProjectCard";
import { Tags } from "./Tags";
import { CardType } from "./CardType";
import { Player } from "../Player";
import { Game } from "../Game";
import { CardName } from '../CardName';
import { MAX_OXYGEN_LEVEL, REDS_RULING_POLICY_COST } from "../constants";
import { PartyHooks } from "../turmoil/parties/PartyHooks";
import { PartyName } from "../turmoil/parties/PartyName";

export class Steelworks implements IProjectCard, IActionCard {
    public cost: number = 15;
    public tags: Array<Tags> = [Tags.STEEL];
    public name: CardName = CardName.STEELWORKS;
    public cardType: CardType = CardType.ACTIVE;

    public canAct(player: Player, game: Game): boolean {
        const hasEnoughEnergy = player.energy >= 4;
        const oxygenMaxed = game.getOxygenLevel() === MAX_OXYGEN_LEVEL;
    
        if (PartyHooks.shouldApplyPolicy(game, PartyName.REDS) && !oxygenMaxed) {
          return player.canAfford(REDS_RULING_POLICY_COST) && hasEnoughEnergy;
        }

        return hasEnoughEnergy;
    }
    public action(player: Player, game: Game) {
        player.energy -= 4;
        player.steel += 2;
        return game.increaseOxygenLevel(player, 1);
    }
    public play() {
        return undefined;
    }
}
