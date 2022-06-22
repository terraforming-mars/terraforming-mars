import {Card} from '../Card';
import {ICorporationCard} from './ICorporationCard';
import {Tags} from '../../common/cards/Tags';
import {Player} from '../../Player';
import {CardName} from '../../common/cards/CardName';
import {CardType} from '../../common/cards/CardType';
import {CardRenderer} from '../render/CardRenderer';

export class Inventrix extends Card implements ICorporationCard {
  constructor() {
    super({
      cardType: CardType.CORPORATION,
      name: CardName.INVENTRIX,
      tags: [Tags.SCIENCE],
      initialActionText: 'Draw 3 cards',
      startingMegaCredits: 45,

      metadata: {
        cardNumber: 'R43',
        description: 'As your first action in the game, draw 3 cards. Start with 45 M€.',
        renderData: CardRenderer.builder((b) => {
          b.br;
          b.megacredits(45).nbsp.cards(3);
          b.corpBox('effect', (ce) => {
            ce.effect('Your temperature, oxygen, ocean, and Venus requirements are +2 or -2 steps, your choice in each case.', (eb) => {
              eb.plate('Global requirements').startEffect.text('+/- 2');
            });
          });
        }),
      },
    });
  }
  public initialAction(player: Player) {
    player.drawCard(3);
    return undefined;
  }
  public getRequirementBonus(): number {
    return 2;
  }
  public play() {
    return undefined;
  }
}

