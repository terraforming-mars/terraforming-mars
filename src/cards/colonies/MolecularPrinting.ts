import {IProjectCard} from '../IProjectCard';
import {Tags} from '../../common/cards/Tags';
import {CardType} from '../../common/cards/CardType';
import {Player} from '../../Player';
import {CardName} from '../../common/cards/CardName';
import {CardRenderer} from '../render/CardRenderer';
import {Card} from '../Card';
import {Size} from '../render/Size';
import {Resources} from '../../common/Resources';
import {all} from '../Options';

export class MolecularPrinting extends Card implements IProjectCard {
  constructor() {
    super({
      cost: 11,
      tags: [Tags.SCIENCE],
      name: CardName.MOLECULAR_PRINTING,
      cardType: CardType.AUTOMATED,
      victoryPoints: 1,

      metadata: {
        cardNumber: 'C27',
        renderData: CardRenderer.builder((b) => {
          b.megacredits(1).slash().city({size: Size.SMALL, all}).br;
          b.megacredits(1).slash().colonies(1, {size: Size.SMALL, all});
        }),
        description: 'Gain 1 M€ for each city tile in play. Gain 1 M€ for each colony in play.',
      },
    });
  }

  public play(player: Player) {
    let coloniesCount: number = 0;
    player.game.colonies.forEach((colony) => {
      coloniesCount += colony.colonies.length;
    });
    player.addResource(Resources.MEGACREDITS, player.game.getCitiesCount() + coloniesCount, {log: true});
    return undefined;
  }
}
