import {IProjectCard} from '../IProjectCard';
import {Tags} from '../Tags';
import {Card} from '../Card';
import {CardType} from '../CardType';
import {Player} from '../../Player';
import {Resources} from '../../Resources';
import {CardName} from '../../CardName';
import {MAX_TEMPERATURE, REDS_RULING_POLICY_COST} from '../../constants';
import {PartyHooks} from '../../turmoil/parties/PartyHooks';
import {PartyName} from '../../turmoil/parties/PartyName';
import {CardRenderer} from '../render/CardRenderer';

export class NitrogenRichAsteroid extends Card implements IProjectCard {
  constructor() {
    super({
      cardType: CardType.EVENT,
      name: CardName.NITROGEN_RICH_ASTEROID,
      tags: [Tags.SPACE],
      cost: 31,

      metadata: {
        cardNumber: '037',
        renderData: CardRenderer.builder((b) => {
          b.production((pb) => {
            pb.plants(1).nbsp.or().br;
            pb.plants(3).played.digit.colon().nbsp.plants(4).digit;
          }).br;
          b.tr(2).temperature(1);
        }),
        description: 'Raise your terraforming rating 2 steps and temperature 1 step. Increase your Plant production 1 step, or 4 steps if you have 3 Plant tags.',
      },
    });
  }

  public canPlay(player: Player): boolean {
    let steps = 2;
    if (player.game.getTemperature() < MAX_TEMPERATURE) steps++;

    if (PartyHooks.shouldApplyPolicy(player.game, PartyName.REDS)) {
      return player.canAfford(player.getCardCost(this) + REDS_RULING_POLICY_COST * steps, {titanium: true});
    }

    return true;
  }

  public play(player: Player) {
    player.increaseTerraformRatingSteps(2);
    if (player.getTagCount(Tags.PLANT) < 3) {
      player.addProduction(Resources.PLANTS, 1);
    } else {
      player.addProduction(Resources.PLANTS, 4);
    }
    return player.game.increaseTemperature(player, 1);
  }
}
