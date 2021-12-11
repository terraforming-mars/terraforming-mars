import {IProjectCard} from '../IProjectCard';
import {Player} from '../../Player';
import {Card} from '../Card';
import {CardType} from '../CardType';
import {CardName} from '../../CardName';
import {CardRenderer} from '../render/CardRenderer';
import {ICard} from '../ICard';
import {Resources} from '../../Resources';
import {Tags} from '../Tags';
import {played} from '../Options';

export class SpaceRelay extends Card implements IProjectCard {
  constructor() {
    super({
      cardType: CardType.ACTIVE,
      name: CardName.SPACE_RELAY,
      cost: 13,
      tags: [Tags.SPACE, Tags.JOVIAN],

      metadata: {
        cardNumber: 'Pf33',
        renderData: CardRenderer.builder((b) => {
          b.effect('Whenever you play a card with a Jovian tag, including this, draw a card.', (eb) => {
            eb.jovian({amount: 1, played}).startEffect.cards(1);
          }).br;
          b.production((pb) => pb.megacredits(1));
        }),
        description: 'Increase your M€ production 1 step.',
      },
    });
  }

  public onCardPlayed(player: Player, card: ICard) {
    if (card.tags.includes(Tags.JOVIAN)) {
      player.drawCard();
    }
  }

  public play(player: Player) {
    player.addProduction(Resources.MEGACREDITS, 1);
    return undefined;
  }
}

