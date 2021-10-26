import {IProjectCard} from '../IProjectCard';
import {Tags} from '../Tags';
import {Card} from '../Card';
import {CardType} from '../CardType';
import {Player} from '../../Player';
import {Resources} from '../../Resources';
import {CardName} from '../../CardName';
import {CardRenderer} from '../render/CardRenderer';
import {digit, played} from '../Options';

export class NitrogenRichAsteroid extends Card implements IProjectCard {
  constructor() {
    super({
      cardType: CardType.EVENT,
      name: CardName.NITROGEN_RICH_ASTEROID,
      tags: [Tags.SPACE],
      cost: 31,
      tr: {tr: 2, temperature: 1},

      metadata: {
        cardNumber: '037',
        renderData: CardRenderer.builder((b) => {
          b.production((pb) => {
            pb.plants(1).nbsp.or().br;
            pb.plants(3, {played, digit}).colon().nbsp.plants(4, {digit});
          }).br;
          b.tr(2).temperature(1);
        }),
        description: 'Raise your terraforming rating 2 steps and temperature 1 step. Increase your Plant production 1 step, or 4 steps if you have 3 Plant tags.',
      },
    });
  }

  public play(player: Player) {
    player.increaseTerraformRatingSteps(2);
    if (player.getTagCount(Tags.PLANT) < 3) {
      player.addProduction(Resources.PLANTS, 1, {log: true});
    } else {
      player.addProduction(Resources.PLANTS, 4, {log: true});
    }
    return player.game.increaseTemperature(player, 1);
  }
}
