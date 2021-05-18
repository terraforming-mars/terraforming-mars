import {ICard} from '../ICard';
import {IProjectCard} from '../IProjectCard';
import {Tags} from '../Tags';
import {Card} from '../Card';
import {CardType} from '../CardType';
import {Player} from '../../Player';
import {SelectCard} from '../../inputs/SelectCard';
import {Resources} from '../../Resources';
import {CardName} from '../../CardName';
import {ResourceType} from '../../ResourceType';
import {CardRequirements} from '../CardRequirements';
import {CardRenderer} from '../render/CardRenderer';
import {Units} from '../../Units';

export class EosChasmaNationalPark extends Card implements IProjectCard {
  constructor() {
    super({
      cardType: CardType.AUTOMATED,
      name: CardName.EOS_CHASMA_NATIONAL_PARK,
      tags: [Tags.PLANT, Tags.BUILDING],
      cost: 16,
      productionBox: Units.of({energy: 2}),

      requirements: CardRequirements.builder((b) => b.temperature(-12)),
      metadata: {
        cardNumber: '026',
        description: 'Requires -12 C or warmer. Add 1 Animal TO ANY ANIMAL CARD. Gain 3 Plants. Increase your M€ production 2 steps.',
        renderData: CardRenderer.builder((b) => {
          b.animals(1).asterix().plants(3).br;
          b.production((pb) => pb.megacredits(2));
        }),
        victoryPoints: 1,
      },
    });
  }

  public play(player: Player) {
    const cards = player.getResourceCards(ResourceType.ANIMAL);
    player.plants += 3;
    player.addProduction(Resources.MEGACREDITS, 2);

    if ( cards.length < 1 ) return undefined;

    if (cards.length === 1) {
      player.addResourceTo(cards[0], {qty: 1, log: true});
      return undefined;
    }

    return new SelectCard('Add 1 animal to a card', 'Add animal', cards, (foundCards: Array<ICard>) => {
      player.addResourceTo(foundCards[0], {log: true});
      return undefined;
    });
  }

  public getVictoryPoints() {
    return 1;
  }
}
