import {IProjectCard} from '../IProjectCard';
import {Tags} from '../Tags';
import {Card} from '../Card';
import {CardType} from '../CardType';
import {Player} from '../../Player';
import {Game} from '../../Game';
import {Resources} from '../../Resources';
import {CardName} from '../../CardName';
import {CardRenderer} from '../render/CardRenderer';

export class ImportedGHG extends Card implements IProjectCard {
  constructor() {
    super({
      cardType: CardType.EVENT,
      name: CardName.IMPORTED_GHG,
      tags: [Tags.EARTH, Tags.SPACE],
      cost: 7,

      metadata: {
        cardNumber: '162',
        renderData: CardRenderer.builder((b) => {
          b.productionBox((pb) => pb.heat(1)).heat(3);
        }),
        description: 'Increase your heat production 1 step and gain 3 heat.',
      },
    });
  }

  public play(player: Player, _game: Game) {
    player.addProduction(Resources.HEAT);
    player.heat += 3;
    return undefined;
  }
}

