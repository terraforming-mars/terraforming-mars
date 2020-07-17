import {IProjectCard} from './../IProjectCard';
import {Tags} from './../Tags';
import {CardType} from './../CardType';
import {Player} from '../../Player';
import {Game} from '../../Game';
import { CardName } from '../../CardName';
import { PartyHooks } from '../../turmoil/parties/PartyHooks';
import { PartyName } from '../../turmoil/parties/PartyName';
import { REDS_RULING_POLICY_COST } from '../../constants';

export class JovianEmbassy implements IProjectCard {
    public cost: number = 14;
    public tags: Array<Tags> = [Tags.JOVIAN, Tags.STEEL];
    public name: CardName = CardName.JOVIAN_EMBASSY;
    public cardType: CardType = CardType.AUTOMATED;
    public hasRequirements = false;

    public canPlay(player: Player, game: Game) {
      if (PartyHooks.shouldApplyPolicy(game, PartyName.REDS)) {
        return player.canAfford(this.cost + REDS_RULING_POLICY_COST, game, true);
      }

      return true;
    }

    public play(player: Player, game: Game) {
      player.increaseTerraformRating(game);
      return undefined;
    }
    
    public getVictoryPoints() {
      return 1;
    }
}
