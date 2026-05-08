import {Card} from '../Card';
import {CardType} from '../../../common/cards/CardType';
import {CardName} from '../../../common/cards/CardName';
import {CardRenderer} from '../render/CardRenderer';
import {IProjectCard} from '../IProjectCard';
import {IPlayer} from '../../IPlayer';
import {Resource} from '../../../common/Resource';
import {Size} from '../../../common/cards/render/Size';

export class SeabedExtraction extends Card implements IProjectCard {
  constructor() {
    super({
      type: CardType.AUTOMATED,
      name: CardName.SEABED_EXTRACTION,
      cost: 8,
      metadata: {
        cardNumber: 'B11',
        description: 'Get 1 Steel resource for each Ocean in play.',
        renderData: CardRenderer.builder((b) => {
          b.steel(1).slash().oceans(1, {size: Size.SMALL});
        }),
      },
    });
  }

  public override play(player: IPlayer) {
    const oceanCount = player.game.board.getOceanSpaces({upgradedOceans: true}).length;
    if (oceanCount > 0) player.stock.add(Resource.STEEL, oceanCount, {log: true});
    return undefined;
  }
}
