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

export class OrbitalReflectors  implements IProjectCard {
    public cost: number = 26;
    public tags: Array<Tags> = [Tags.VENUS, Tags.SPACE];
    public name: CardName = CardName.ORBITAL_REFLECTORS;
    public cardType: CardType = CardType.AUTOMATED;
    public hasRequirements = false;

    public canPlay(player: Player, game: Game) {
        const remainingVenusSteps = (MAX_VENUS_SCALE - game.getVenusScaleLevel()) / 2;
        const stepsRaised = Math.min(remainingVenusSteps, 2);
        
        if (PartyHooks.shouldApplyPolicy(game, PartyName.REDS)) {
          return player.canAfford(this.cost + REDS_RULING_POLICY_COST * stepsRaised, game, false, true);
        }
  
        return true;
    }

    public play(player: Player, game: Game) {
        game.increaseVenusScaleLevel(player,2);
        player.setProduction(Resources.HEAT, 2);
        return undefined;
    }
}