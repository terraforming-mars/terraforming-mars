import {Tag} from '../../../common/cards/Tag';
import {CardName} from '../../../common/cards/CardName';
import {CardRenderer} from '../render/CardRenderer';
import {Card} from '../Card';
import {CardType} from '../../../common/cards/CardType';
import {IPlayer} from '../../IPlayer';

export class MartianLumberCorp extends Card {
  constructor() {
    super({
      name: CardName.MARTIAN_LUMBER_CORP,
      type: CardType.ACTIVE,
      tags: [Tag.BUILDING, Tag.PLANT],
      cost: 6,

      behavior: {
        production: {plants: 1},
      },

      requirements: {greeneries: 2},

      metadata: {
        cardNumber: '',
        renderData: CardRenderer.builder((b) => {
          b.effect('When playing a building tag, plants may be used as 3 M€ each.',
            (eb) => eb.tag(Tag.BUILDING).startEffect.plants(1).equals().megacredits(3)).br;
          b.production((pb) => pb.plants(1)).br;
          b.plainText('(Requires that you have 2 greenery tiles. Increase plant production 1 step.)').br;
        }),
      },
    });
  }

  public override bespokePlay(player: IPlayer) {
    player.canUsePlantsAsMegacredits = true;
    return undefined;
  }

  public override onDiscard(player: IPlayer) {
    player.canUsePlantsAsMegacredits = false;
    return undefined;
  }
}
