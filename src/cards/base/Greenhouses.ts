import {IProjectCard} from '../IProjectCard';
import {Tags} from '../Tags';
import {Card} from '../Card';
import {CardType} from '../CardType';
import {Player} from '../../Player';
import {Game} from '../../Game';
import {CardName} from '../../CardName';
import {LogHelper} from '../../LogHelper';
import {Resources} from '../../Resources';
import {CardRenderer} from '../render/CardRenderer';
import {CardRenderItemSize} from '../render/CardRenderItemSize';

export class Greenhouses extends Card implements IProjectCard {
  constructor() {
    super({
      cardType: CardType.AUTOMATED,
      name: CardName.GREENHOUSES,
      tags: [Tags.PLANT, Tags.BUILDING],
      cost: 6,

      metadata: {
        cardNumber: '096',
        renderData: CardRenderer.builder((b) => {
          b.plants(1).slash().city(CardRenderItemSize.SMALL).any;
        }),
        description: 'Gain 1 plant for each city tile in play.',
      },
    });
  }
  public play(player: Player, game: Game) {
    const qty = game.getCitiesInPlay();
    player.plants += qty;
    LogHelper.logGainStandardResource(game, player, Resources.PLANTS, qty);
    return undefined;
  }
}
