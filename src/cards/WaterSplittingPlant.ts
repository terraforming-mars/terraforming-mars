import { CardType } from "./CardType";
import { Tags } from "./Tags";
import { IProjectCard } from "./IProjectCard";
import { Player } from "../Player";
import { Game } from "../Game";
import { CardName } from '../CardName';
import { MAX_OXYGEN_LEVEL, REDS_RULING_POLICY_COST } from "../constants";
import { PartyHooks } from "../turmoil/parties/PartyHooks";
import { PartyName } from "../turmoil/parties/PartyName";

export class WaterSplittingPlant implements IProjectCard {
    public cost: number = 12;
    public tags: Array<Tags> = [Tags.STEEL];
    public name: CardName = CardName.WATER_SPLITTING_PLANT;
    public cardType: CardType = CardType.ACTIVE;
    public canPlay(player: Player, game: Game): boolean {
        return game.board.getOceansOnBoard() >= 2 - player.getRequirementsBonus(game);
    }
    public play() {
        return undefined;
    }
    public canAct(player: Player, game: Game): boolean {
        const hasEnoughEnergy = player.energy >= 3;
        const oxygenMaxed = game.getOxygenLevel() === MAX_OXYGEN_LEVEL;
    
        if (PartyHooks.shouldApplyPolicy(game, PartyName.REDS) && !oxygenMaxed) {
          return player.canAfford(REDS_RULING_POLICY_COST) && hasEnoughEnergy;
        }

        return hasEnoughEnergy;
    }
    public action(player: Player, game: Game) {
        player.energy -= 3;
        return game.increaseOxygenLevel(player, 1);
    }
}
