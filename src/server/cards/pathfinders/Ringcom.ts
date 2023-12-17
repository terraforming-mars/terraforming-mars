import {ICorporationCard} from '../corporation/ICorporationCard';
import {CorporationCard} from '../corporation/CorporationCard';
import {Tag} from '../../../common/cards/Tag';
import {IPlayer} from '../../IPlayer';
import {Resource} from '../../../common/Resource';
import {CardName} from '../../../common/cards/CardName';
import {CardRenderer} from '../render/CardRenderer';
import {all, played} from '../Options';
import {ICard} from '../ICard';

export class Ringcom extends CorporationCard {
  constructor() {
    super({
      name: CardName.RINGCOM,
      tags: [Tag.JOVIAN],
      startingMegaCredits: 39,

      behavior: {
        production: {megacredits: 3},
      },

      firstAction: {
        text: 'Draw 2 cards with a Jovian tag',
        drawCard: {count: 2, tag: Tag.JOVIAN},
      },


      metadata: {
        cardNumber: 'PfC4',
        description: 'You start with 39 M€. and 3 M€ production. As your first action, draw 2 cards with a Jovian tag.',
        renderData: CardRenderer.builder((b) => {
          b.br;
          b.megacredits(39).production((pb) => pb.megacredits(3));
          b.cards(2, {secondaryTag: Tag.JOVIAN});
          b.corpBox('effect', (ce) => {
            ce.effect('When any player plays a card with a Jovian tag (including this) gain 1 titanium.', (eb) => {
              eb.jovian({all, played}).startEffect.titanium(1);
            });
          });
        }),
      },
    });
  }

  public override bespokePlay(player: IPlayer) {
    // Typically  onCardPlayed isn't necessary, but onCorpCardPlayed isn't called for your own corp card.
    this.onCardPlayed(player, this);
    return undefined;
  }

  public onCorpCardPlayed(player: IPlayer, card: ICorporationCard) {
    this.onCardPlayed(player, card);
  }

  public onCardPlayed(player: IPlayer, card: ICard): void {
    if (card.tags.includes(Tag.JOVIAN)) {
      player.game.getPlayers().forEach((p) => {
        if (p.isCorporation(this.name)) {
          p.stock.add(Resource.TITANIUM, 1, {log: true});
        }
      });
    }
  }
}
