import {IProjectCard} from '../IProjectCard';
import {Tag} from '../../../common/cards/Tag';
import {Card} from '../Card';
import {CardType} from '../../../common/cards/CardType';
import {CardName} from '../../../common/cards/CardName';
import {CardRenderer} from '../render/CardRenderer';
import {digit} from '../Options';
import {IPlayer} from '../../IPlayer';
import {CardResource} from '../../../common/CardResource';
import {SelectCard} from '../../inputs/SelectCard';
import {Resource} from '../../../common/Resource';

export class SoilEnrichment extends Card implements IProjectCard {
  constructor() {
    super({
      type: CardType.EVENT,
      name: CardName.SOIL_ENRICHMENT,
      tags: [Tag.MICROBE, Tag.PLANT],
      cost: 6,

      metadata: {
        description: 'Spend 1 microbe from ANY of your cards to gain 5 plants',
        cardNumber: 'X67',
        renderData: CardRenderer.builder((b) => {
          b.minus().microbes(1).asterix().nbsp.plus().plants(5, {digit});
        }),
      },
    });
  }

  private eligibleCards(player: IPlayer) {
    return player.getCardsWithResources(CardResource.MICROBE);
  }

  public override bespokeCanPlay(player: IPlayer) {
    return this.eligibleCards(player).length > 0;
  }

  public override play(player: IPlayer) {
    return new SelectCard('Select card to remove 1 microbe from', 'Select', this.eligibleCards(player))
      .andThen(([card]) => {
        player.removeResourceFrom(card);
        player.stock.add(Resource.PLANTS, 5);
        player.game.log('${0} removed 1 microbe from ${1} to gain 5 plants', (b) => b.player(player).card(card));
        return undefined;
      });
  }
}
