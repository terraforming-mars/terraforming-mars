import {Tag} from '../../../common/cards/Tag';
import {CardType} from '../../../common/cards/CardType';
import {Player} from '../../Player';
import {Resources} from '../../../common/Resources';
import {CardResource} from '../../../common/CardResource';
import {SelectCard} from '../../inputs/SelectCard';
import {CardName} from '../../../common/cards/CardName';
import {CardRenderer} from '../render/CardRenderer';
import {Card} from '../Card';
import {IProjectCard} from '../IProjectCard';

export class VenusSoils extends Card implements IProjectCard {
  constructor() {
    super({
      name: CardName.VENUS_SOILS,
      cardType: CardType.AUTOMATED,
      tags: [Tag.VENUS, Tag.PLANT],
      cost: 20,
      tr: {venus: 1},

      metadata: {
        cardNumber: '257',
        renderData: CardRenderer.builder((b) => {
          b.venus(1).br;
          b.production((pb) => pb.plants(1)).microbes(2).asterix();
        }),
        description: 'Raise Venus 1 step. Increase your Plant production 1 step. Add 2 Microbes to ANOTHER card',
      },
    });
  }

  public play(player: Player) {
    player.addProduction(Resources.PLANTS, 1);
    player.game.increaseVenusScaleLevel(player, 1);

    const microbeCards = player.getResourceCards(CardResource.MICROBE);

    if (microbeCards.length === 0) return undefined;

    if (microbeCards.length === 1) {
      player.addResourceTo(microbeCards[0], {qty: 2, log: true});
      return undefined;
    }

    return new SelectCard(
      'Select card to add 2 microbes',
      'Add microbe(s)',
      microbeCards,
      ([card]) => {
        player.addResourceTo(card, {qty: 2, log: true});
        return undefined;
      },
    );
  }
}
