import {IProjectCard} from '../IProjectCard';
import {Tags} from '../Tags';
import {CardType} from '../CardType';
import {Player} from '../../Player';
import {CardName} from '../../CardName';
import {CardRenderer} from '../render/CardRenderer';
import {Card} from '../Card';
import {Size} from '../render/Size';
import {Resources} from '../../Resources';

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
          b.megacredits(1).slash().city(Size.SMALL).any.br;
          b.megacredits(1).slash().colonies(1, Size.SMALL).any;
        }),
        description: 'Gain 1 M€ for each city tile in play. Gain 1 M€ for each colony in play.',
        victoryPoints: 1,
      },
    });
  }

  public play(player: Player) {
    let coloniesCount: number = 0;
    player.game.colonies.forEach((colony) => {
      coloniesCount += colony.colonies.length;
    });
    player.addResource(Resources.MEGACREDITS, player.game.getCitiesInPlay() + coloniesCount, {log: true});
    return undefined;
  }

  public getVictoryPoints() {
    return 1;
  }
}
