import { IProjectCard } from "./IProjectCard";
import { Tags } from "./Tags";
import { CardType } from "./CardType";
import { Player } from "../Player";
import { Game } from "../Game";
import { CardName } from '../CardName';
import { MAX_OXYGEN_LEVEL, MAX_OCEAN_TILES, REDS_RULING_POLICY_COST } from "../constants";
import { PartyHooks } from "../turmoil/parties/PartyHooks";
import { PartyName } from "../turmoil/parties/PartyName";

export class TowingAComet implements IProjectCard {
    public cost: number = 23;
    public tags: Array<Tags> = [Tags.SPACE];
    public cardType: CardType = CardType.EVENT;
    public name: CardName = CardName.TOWING_A_COMET;
    public hasRequirements = false;

    public canPlay(player: Player, game: Game) {
        const oxygenStep = game.getOxygenLevel() < MAX_OXYGEN_LEVEL ? 1 : 0;
        const oceanStep = game.board.getOceansOnBoard() < MAX_OCEAN_TILES ? 1 : 0;
        const totalSteps = oxygenStep + oceanStep;
  
        if (PartyHooks.shouldApplyPolicy(game, PartyName.REDS)) {
          return player.canAfford(this.cost + REDS_RULING_POLICY_COST * totalSteps, game, false, true);
        }
  
        return true;
      }

    public play(player: Player, game: Game) {
        game.addOceanInterrupt(player);
        player.plants += 2;
        return game.increaseOxygenLevel(player, 1);
    }
}
