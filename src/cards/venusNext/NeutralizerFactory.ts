import { IProjectCard } from "../IProjectCard";
import { Tags } from "../Tags";
import { CardType } from "../CardType";
import { Player } from "../../Player";
import { Game } from '../../Game';
import { CardName } from '../../CardName';
import { PartyHooks } from "../../turmoil/parties/PartyHooks";
import { PartyName } from "../../turmoil/parties/PartyName";
import { REDS_RULING_POLICY_COST } from "../../constants";

export class NeutralizerFactory  implements IProjectCard {
    public cost: number = 7;
    public tags: Array<Tags> = [Tags.VENUS];
    public name: CardName = CardName.NEUTRALIZER_FACTORY;
    public cardType: CardType = CardType.AUTOMATED;

    public canPlay(player: Player, game: Game) {
        const venusRequirementMet = game.getVenusScaleLevel() >= 10 - (2 * player.getRequirementsBonus(game, true));
        if (PartyHooks.shouldApplyPolicy(game, PartyName.REDS)) {
          return player.canAfford(this.cost + REDS_RULING_POLICY_COST) && venusRequirementMet;
        }
  
        return venusRequirementMet;
    }

    public play(player: Player, game: Game) {
        game.increaseVenusScaleLevel(player,1);
        return undefined;
    }
}