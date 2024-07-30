import {IProjectCard} from '../IProjectCard';
import {Tag} from '../../../common/cards/Tag';
import {PreludeCard} from '../prelude/PreludeCard';
import {CardName} from '../../../common/cards/CardName';
import {IPlayer} from '../../IPlayer';
import {Resource} from '../../../common/Resource';
import {CardRenderer} from '../render/CardRenderer';

export class SoilBacteria extends PreludeCard {
  constructor() {
    super({
      name: CardName.SOIL_BACTERIA,
      tags: [Tag.MICROBE],

      behavior: {
        stock: {plants: 3},
        drawCard: {count: 2, tag: Tag.MICROBE},
      },

      metadata: {
        description: 'Draw 2 microbe cards and gain 3 plants.',
        cardNumber: 'P61',
        renderData: CardRenderer.builder((b) => {
          b.effect('When playing a plant tag or a microbe tag, including this, gain 1 plant.', (eb) => {
            eb.tag(Tag.PLANT).slash().tag(Tag.MICROBE).startEffect.plants(1);
          });
          b.br;
          b.cards(2, {secondaryTag: Tag.MICROBE}).plants(3);
        }),
      },
    });
  }

  public onCardPlayed(player: IPlayer, card: IProjectCard): void {
    const amount = player.tags.cardTagCount(card, [Tag.PLANT, Tag.MICROBE]);
    if (amount > 0) {
      player.defer(() => player.stock.add(Resource.PLANTS, amount, {log: true}));
    }
  }
}
