import { IProjectCard } from "./IProjectCard";
import { CardType } from "./CardType";
import { Player } from "../Player";
import { Game } from "../Game";
import { SpaceType } from "../SpaceType";
import { Tags } from "./Tags";
import { SelectSpace } from "../inputs/SelectSpace";
import { ISpace } from "../ISpace";
import { Resources } from '../Resources';
import { CardName } from '../CardName';
import { MAX_OXYGEN_LEVEL, REDS_RULING_POLICY_COST } from "../constants";
import { PartyHooks } from "../turmoil/parties/PartyHooks";
import { PartyName } from "../turmoil/parties/PartyName";

export class ProtectedValley implements IProjectCard {
    public cost: number = 23;
    public cardType: CardType = CardType.AUTOMATED;
    public tags: Array<Tags> = [Tags.PLANT, Tags.STEEL];
    public name: CardName = CardName.PROTECTED_VALLEY;
    public hasRequirements = false;

    public canPlay(player: Player, game: Game): boolean {
        const oxygenMaxed = game.getOxygenLevel() === MAX_OXYGEN_LEVEL;
    
        if (PartyHooks.shouldApplyPolicy(game, PartyName.REDS) && !oxygenMaxed) {
          return player.canAfford(this.cost + REDS_RULING_POLICY_COST, game, true);
        }
    
        return true;
    }

    public play(player: Player, game: Game) {
        return new SelectSpace(
            "Select space reserved for ocean to place greenery tile", 
            game.board.getAvailableSpacesForOcean(player), 
            (space: ISpace) => {
                player.setProduction(Resources.MEGACREDITS,2);
                return game.addGreenery(player, space.id, SpaceType.OCEAN);
            }
        );
    }
}
