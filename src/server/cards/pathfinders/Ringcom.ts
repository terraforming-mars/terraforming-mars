import {Card} from '../Card';
import {ICorporationCard} from '../corporation/ICorporationCard';
import {Tag} from '../../../common/cards/Tag';
import {Player} from '../../Player';
import {Resources} from '../../../common/Resources';
import {CardName} from '../../../common/cards/CardName';
import {CardType} from '../../../common/cards/CardType';
import {CardRenderer} from '../render/CardRenderer';
import {all, played} from '../Options';
import {IProjectCard} from '../IProjectCard';

export class Ringcom extends Card implements ICorporationCard {
  constructor() {
    super({
      cardType: CardType.CORPORATION,
      name: CardName.RINGCOM,
      tags: [Tag.JOVIAN],
      startingMegaCredits: 39,

      initialActionText: 'Draw 2 cards with a jovian tag',

      behavior: {
        production: {megacredits: 3},
      },

      metadata: {
        cardNumber: 'PfC4',
        description: 'You start with 39 M€ and 3 M€ production. As your first action, draw 2 cards with a jovian tag.',
        renderData: CardRenderer.builder((b) => {
          b.br;
          b.megacredits(39).production((pb) => pb.megacredits(3));
          b.cards(2, {secondaryTag: Tag.JOVIAN});
          b.corpBox('effect', (ce) => {
            ce.effect('When any player plays a card with a jovian tag (including this) gain 1 titanium.', (eb) => {
              eb.jovian({all, played}).startEffect.titanium(1);
            });
          });
        }),
      },
    });
  }

  public override bespokePlay(player: Player) {
    // Typically  onCardPlayed isn't necessary, but onCorpCardPlayed isn't called for your own corp card.
    this.onCardPlayed(player, this);
    return undefined;
  }

  public initialAction(player: Player) {
    player.drawCard(2, {tag: Tag.JOVIAN});
    return undefined;
  }

  public onCorpCardPlayed(player: Player, card: ICorporationCard) {
    this.onCardPlayed(player, card);
    return undefined;
  }

  public onCardPlayed(player: Player, card: IProjectCard | ICorporationCard): void {
    if (card.tags.includes(Tag.JOVIAN)) {
      player.game.getPlayers().forEach((p) => {
        if (p.isCorporation(this.name)) {
          p.addResource(Resources.TITANIUM, 1, {log: true});
        }
      });
    }
  }
}
