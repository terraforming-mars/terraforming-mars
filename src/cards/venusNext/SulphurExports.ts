import { IProjectCard } from "../IProjectCard";
import { Tags } from "../Tags";
import { CardType } from "../CardType";
import { Player } from "../../Player";
import { Resources } from "../../Resources";
import { Game } from '../../Game';
import { CardName } from '../../CardName';
import { MAX_VENUS_SCALE, REDS_RULING_POLICY_COST } from "../../constants";
import { PartyHooks } from "../../turmoil/parties/PartyHooks";
import { PartyName } from "../../turmoil/parties/PartyName";

export class SulphurExports implements IProjectCard {
    public cost: number = 21;
    public tags: Array<Tags> = [Tags.VENUS, Tags.SPACE];
    public name: CardName = CardName.SULPHUR_EXPORTS;
    public cardType: CardType = CardType.AUTOMATED;
    public hasRequirements = false;

    public canPlay(player: Player, game: Game) {
        const venusMaxed = game.getVenusScaleLevel() === MAX_VENUS_SCALE;
        if (PartyHooks.shouldApplyPolicy(game, PartyName.REDS) && !venusMaxed) {
          return player.canAfford(this.cost + REDS_RULING_POLICY_COST, game, false, true);
        }
  
        return true;
    }

    public play(player: Player, game: Game) {
        player.setProduction(Resources.MEGACREDITS,player.getTagCount(Tags.VENUS) + 1 );
        game.increaseVenusScaleLevel(player,1);
        return undefined;
    }
}