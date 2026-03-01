import {PreludeCard} from '../prelude/PreludeCard';
import {CardName} from '../../../common/cards/CardName';
import {CardRenderer} from '../render/CardRenderer';
import {Tag} from '../../../common/cards/Tag';
import {IPlayer} from '../../IPlayer';
import {ICard} from '../ICard';
import {Resource} from '../../../common/Resource';

export class AlbedoPlants extends PreludeCard {
  constructor() {
    super({
      name: CardName.ALBEDO_PLANTS,
      tags: [Tag.PLANT],

      behavior: {
        production: {plants: 1},
        stock: {plants: 1},
      },

      metadata: {
        cardNumber: 'X78',
        renderData: CardRenderer.builder((b) => {
          b.effect('When you play a plant tag, including this, gain 3 heat.',
            (b) => b.tag(Tag.PLANT).startEffect.heat(3));
          b.br;
          b.production((pb) => pb.plants(1)).plants(1);
        }),
        description: 'Increase plant production 1 step. Gain 1 plant.',
      },
    });
  }

  public onCardPlayed(player: IPlayer, card: ICard): void {
    const qty = player.tags.cardTagCount(card, Tag.PLANT);
    player.stock.add(Resource.HEAT, qty * 3, {log: true});
  }

  public onNonCardTagAdded(player: IPlayer, tag: Tag) {
    if (tag === Tag.PLANT) {
      player.stock.add(Resource.HEAT, 3, {log: true});
    }
  }
}
