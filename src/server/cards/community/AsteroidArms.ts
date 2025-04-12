import {CorporationCard} from '../corporation/CorporationCard';
import {Tag} from '../../../common/cards/Tag';
import {IPlayer} from '../../IPlayer';
import {Resource} from '../../../common/Resource';
import {CardName} from '../../../common/cards/CardName';
import {CardRenderer} from '../render/CardRenderer';
import {ICard} from '../ICard';
import { CardType } from '../../../common/cards/CardType';

export class AsteroidArms extends CorporationCard {
  constructor() {
    super({
      name: CardName.ASTEROID_ARMS,
      tags: [Tag.SPACE],
      startingMegaCredits: 38,
      behavior: {
        stock: {
            titanium: 2
        }
      },
      metadata: {
        cardNumber: 'MI8',
        description: 'You start with 38 M€ and 2 titanium. When you play event card, raise heat production by 1',
        renderData: CardRenderer.builder((b) => {
          b.megacredits(38).titanium(2).br;
          b.effect('When you play a card with a Event tag increase your heat production 1 step.', (eb) => {
            eb.tag(Tag.EVENT).startEffect.production((pb) => pb.heat(1));
          }).br;
        }),
      },
    });
  }

/*   public override bespokePlay(player: IPlayer) {
    this.onCorpCardPlayed(player, this);
    return undefined;
  }

  public onCorpCardPlayed(player: IPlayer, card: ICorporationCard) {
    this.onCardPlayed(player, card);
  } */

  public onCardPlayed(player: IPlayer, card: ICard): void {
    if (player.isCorporation(this.name) && card.type === CardType.EVENT) {
      player.production.add(Resource.HEAT, 1, {log: true});
    }
  }

}
