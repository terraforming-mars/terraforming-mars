import {IProjectCard} from './IProjectCard';
import {Tags} from './Tags';
import {CardType} from './CardType';
import {Player} from '../Player';
import {Game} from '../Game';
import {Resources} from '../Resources';
import {CardName} from '../CardName';
import {MAX_TEMPERATURE, REDS_RULING_POLICY_COST} from '../constants';
import {PartyHooks} from '../turmoil/parties/PartyHooks';
import {PartyName} from '../turmoil/parties/PartyName';

export class NitrogenRichAsteroid implements IProjectCard {
    public cost = 31;
    public tags = [Tags.SPACE];
    public name = CardName.NITROGEN_RICH_ASTEROID;
    public cardType = CardType.EVENT;
    public hasRequirements = false;

    public canPlay(player: Player, game: Game): boolean {
      let steps = 2;
      if (game.getTemperature() < MAX_TEMPERATURE) steps++;

      if (PartyHooks.shouldApplyPolicy(game, PartyName.REDS)) {
        return player.canAfford(player.getCardCost(game, this) + REDS_RULING_POLICY_COST * steps, game, false, true);
      }

      return true;
    }

    public play(player: Player, game: Game) {
      player.increaseTerraformRatingSteps(2, game);
      if (player.getTagCount(Tags.PLANT) < 3) {
        player.addProduction(Resources.PLANTS);
      } else {
        player.addProduction(Resources.PLANTS, 4);
      }
      return game.increaseTemperature(player, 1);
    }
}
