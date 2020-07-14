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

export class OreProcessor implements IActionCard, IProjectCard {
    public cost: number = 13;
    public tags: Array<Tags> = [Tags.STEEL];
    public name: CardName = CardName.ORE_PROCESSOR;
    public cardType: CardType = CardType.ACTIVE;

    public play(_player: Player, _game: Game) {
        return undefined;
    }
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
        player.titanium++;
        return game.increaseOxygenLevel(player, 1);
    }
}
