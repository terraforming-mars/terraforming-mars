import {Tags} from '../Tags';
import {Player} from '../../Player';
import {CorporationCard} from './../corporation/CorporationCard';
import {IProjectCard} from '../IProjectCard';
import {Game} from '../../Game';
import {SelectCard} from '../../inputs/SelectCard';
import {Card} from '../Card';
import {CardName} from '../../CardName';
import {CardType} from '../CardType';
import {CardRenderer} from '../render/CardRenderer';

export class ValleyTrust extends Card implements CorporationCard {
  constructor() {
    super({
      cardType: CardType.CORPORATION,
      name: CardName.VALLEY_TRUST,
      tags: [Tags.EARTH],
      startingMegaCredits: 37,
      initialActionText: 'Draw 3 Prelude cards, and play one of them',

      metadata: {
        cardNumber: 'R34',
        description: 'You start with 37 MC. As your first action, draw 3 Prelude cards, and play one of them. Discard the other two.',
        renderData: CardRenderer.builder((b) => {
          b.br.br;
          b.megacredits(37).nbsp.prelude().asterix();
          b.corpBox('effect', (ce) => {
            ce.effect('When you play a Science tag, you pay 2MC less for it.', (eb) => {
              eb.science(1).played.startEffect.megacredits(-2);
            });
          });
        }),
      },
    });
  }

  public getCardDiscount(_player: Player, _game: Game, card: IProjectCard) {
    return card.tags.filter((tag) => tag === Tags.SCIENCE).length * 2;
  }

  public initialAction(player: Player, game: Game) {
    if (game.gameOptions.preludeExtension) {
      const cardsDrawn: Array<IProjectCard> = [
        game.dealer.dealPreludeCard(),
        game.dealer.dealPreludeCard(),
        game.dealer.dealPreludeCard(),
      ];

      return new SelectCard('Choose prelude card to play', 'Play', cardsDrawn, (foundCards: Array<IProjectCard>) => {
        if (foundCards[0].canPlay === undefined || foundCards[0].canPlay(player, game)) {
          return player.playCard(foundCards[0]);
        } else {
          throw new Error('You cannot pay for this card');
        }
      }, 1, 1);
    } else {
      console.warn('Prelude extension isn\'t selected.');
      return undefined;
    }
  }

  public play() {
    return undefined;
  }
}
