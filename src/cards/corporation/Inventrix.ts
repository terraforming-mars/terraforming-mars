import {CorporationCard} from './CorporationCard';
import {Tags} from '../Tags';
import {Player} from '../../Player';
import {Game} from '../../Game';
import {CardName} from '../../CardName';
import {LogHelper} from '../../LogHelper';
import {CardType} from '../CardType';
import {CardRenderer} from '../render/CardRenderer';

export class Inventrix implements CorporationCard {
  public get name() {
    return CardName.INVENTRIX;
  }
  public get tags() {
    return [Tags.SCIENCE];
  }
  public get startingMegaCredits() {
    return 45;
  }
  public get cardType() {
    return CardType.CORPORATION;
  }

  public get initialActionText() {
    return 'Draw 3 cards';
  }
  public initialAction(player: Player, game: Game) {
    player.cardsInHand.push(
      game.dealer.dealCard(),
      game.dealer.dealCard(),
      game.dealer.dealCard(),
    );

    LogHelper.logCardChange(game, player, 'drew', 3);

    return undefined;
  }
  public getRequirementBonus(_player: Player, _game: Game): number {
    return 2;
  }
  public play() {
    return undefined;
  }

  public get metadata() {
    return {
      cardNumber: 'R43',
      description: 'As you first action in the game, draw 3 cards. Start with 45MC.',
      renderData: CardRenderer.builder((b) => {
        b.br;
        b.megacredits(45).nbsp.cards(3);
        b.corpBox('effect', (ce) => {
          ce.effectBox((eb) => {
            eb.plate('Global requirements').startEffect.text('+/- 2');
            eb.description('Effect: Your temperature, oxygen, ocean, and Venus requirements are +2 or -2 steps, your choice in each case.');
          });
        });
      }),
    };
  }
}

