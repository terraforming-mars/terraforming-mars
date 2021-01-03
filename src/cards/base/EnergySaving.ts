
import {Card} from '../Card';
import {CardType} from '../CardType';
import {Tags} from '../Tags';
import {IProjectCard} from '../IProjectCard';
import {Player} from '../../Player';
import {Game} from '../../Game';
import {Resources} from '../../Resources';
import {CardName} from '../../CardName';
import {CardRenderItemSize} from '../render/CardRenderItemSize';
import {CardRenderer} from '../render/CardRenderer';

export class EnergySaving extends Card implements IProjectCard {
  constructor() {
    super({
      cardType: CardType.AUTOMATED,
      name: CardName.ENERGY_SAVING,
      tags: [Tags.ENERGY],
      cost: 15,

      metadata: {
        cardNumber: '189',
        description: 'Increase your Energy production 1 step for each City tile in play.',
        renderData: CardRenderer.builder((b) => {
          b.productionBox((pb) => pb.energy(1).slash().city(CardRenderItemSize.SMALL).any);
        }),
      },
    });
  }

  public play(player: Player, game: Game) {
    player.addProduction(Resources.ENERGY, game.getCitiesInPlay());
    return undefined;
  }
}
