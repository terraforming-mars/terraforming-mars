import {IProjectCard} from '../IProjectCard';
import {Tags} from '../Tags';
import {CardType} from '../CardType';
import {Player} from '../../Player';
import {CardName} from '../../CardName';
import {CardRenderer} from '../render/CardRenderer';
import {Card} from '../Card';
import {CardRenderItemSize} from '../render/CardRenderItemSize';

export class MolecularPrinting extends Card implements IProjectCard {
  constructor() {
    super({
      cost: 11,
      tags: [Tags.SCIENCE],
      name: CardName.MOLECULAR_PRINTING,
      cardType: CardType.AUTOMATED,

      metadata: {
        cardNumber: 'C27',
        renderData: CardRenderer.builder((b) => {
          b.megacredits(1).slash().city(CardRenderItemSize.SMALL).any.br;
          b.megacredits(1).slash().colonies(1, CardRenderItemSize.SMALL).any;
        }),
        description: 'Gain 1 MC for each city tile in play. Gain 1 MC for each colony in play.',
        victoryPoints: 1,
      },
    });
  }

  public play(player: Player) {
    let coloniesCount: number = 0;
    player.game.colonies.forEach((colony) => {
      coloniesCount += colony.colonies.length;
    });
    player.megaCredits += player.game.getCitiesInPlay() +coloniesCount;
    return undefined;
  }

  public getVictoryPoints() {
    return 1;
  }
}
