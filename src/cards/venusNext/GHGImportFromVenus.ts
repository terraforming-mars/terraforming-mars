import { IProjectCard } from "../IProjectCard";
import { Tags } from "../Tags";
import { CardType } from "../CardType";
import { Player } from "../../Player";
import { Game } from '../../Game';
import { Resources } from '../../Resources';
import { CardName } from '../../CardName';
import { MAX_VENUS_SCALE, REDS_RULING_POLICY_COST } from "../../constants";
import { PartyHooks } from "../../turmoil/parties/PartyHooks";
import { PartyName } from "../../turmoil/parties/PartyName";

export class GHGImportFromVenus implements IProjectCard {
    public cost: number = 23;
    public tags: Array<Tags> = [Tags.SPACE, Tags.VENUS];
    public name: CardName = CardName.GHG_IMPORT_FROM_VENUS;
    public cardType: CardType = CardType.EVENT;
    public hasRequirements = false;

    public canPlay(player: Player, game: Game) {
        const venusMaxed = game.getVenusScaleLevel() === MAX_VENUS_SCALE;
        if (PartyHooks.shouldApplyPolicy(game, PartyName.REDS) && !venusMaxed) {
          return player.canAfford(this.cost + REDS_RULING_POLICY_COST, game, false, true);
        }
  
        return true;
    }

    public play(player: Player, game: Game) {
        player.setProduction(Resources.HEAT,3);
        game.increaseVenusScaleLevel(player,1);
        return undefined;
    }
}