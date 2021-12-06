import {Card} from '../Card';
import {CorporationCard} from '../corporation/CorporationCard';
import {Tags} from '../Tags';
import {Player} from '../../Player';
import {Resources} from '../../Resources';
import {CardName} from '../../CardName';
import {CardType} from '../CardType';
import {CardRenderer} from '../render/CardRenderer';
import {all, played} from '../Options';
import {IProjectCard} from '../IProjectCard';
import {ICard} from '../ICard';

export class Ringcom extends Card implements CorporationCard {
  constructor() {
    super({
      cardType: CardType.CORPORATION,
      name: CardName.RINGCOM,
      tags: [Tags.JOVIAN],
      startingMegaCredits: 39,

      initialActionText: 'Draw 2 cards with a jovian tag',

      metadata: {
        cardNumber: 'PfC4',
        description: 'You start with 39 M€ and 3 M€ production. As your first action, draw 2 cards with a jovian tag.',
        renderData: CardRenderer.builder((b) => {
          b.br;
          b.megacredits(39).production((pb) => pb.megacredits(3));
          b.cards(2, {secondaryTag: Tags.JOVIAN});
          b.corpBox('effect', (ce) => {
            ce.effect('When any player plays a card with a jovian tag (including this) gain 1 titanium.', (eb) => {
              eb.jovian({all, played}).startEffect.titanium(1);
            });
          });
        }),
      },
    });
  }

  public play(player: Player) {
    player.addProduction(Resources.MEGACREDITS, 3);
    return undefined;
  }

  public initialAction(player: Player) {
    player.drawCard(2, {tag: Tags.JOVIAN});
    this.onCardPlayed(player, this);
    return undefined;
  }

  public onCorpCardPlayed(player: Player, card: CorporationCard) {
    return this.onCardPlayed(player, card as ICard as IProjectCard);
  }

  public onCardPlayed(player: Player, card: IProjectCard): void {
    if (card.tags.includes(Tags.JOVIAN)) {
      player.game.getPlayers().forEach((p) => {
        if (p.corporationCard?.name === this.name) {
          p.addResource(Resources.TITANIUM, 1, {log: true});
        }
      });
    }
  }
}
