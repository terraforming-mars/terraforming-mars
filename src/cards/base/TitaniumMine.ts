import {IProjectCard} from '../IProjectCard';
import {Tags} from '../Tags';
import {Card} from '../Card';
import {CardType} from '../CardType';
import {Player} from '../../Player';
import {Game} from '../../Game';
import {Resources} from '../../Resources';
import {CardName} from '../../CardName';
import {CardRenderer} from '../render/CardRenderer';

export class TitaniumMine extends Card implements IProjectCard {
  constructor() {
    super({
      cardType: CardType.AUTOMATED,
      name: CardName.TITANIUM_MINE,
      tags: [Tags.BUILDING],
      cost: 7,

      metadata: {
        cardNumber: '144',
        renderData: CardRenderer.builder((b) => {
          b.productionBox((pb) => pb.titanium(1));
        }),
        description: 'Increase your titanium production 1 step.',
      },
    });
  }
  public play(player: Player, _game: Game) {
    player.addProduction(Resources.TITANIUM);
    return undefined;
  }
}
