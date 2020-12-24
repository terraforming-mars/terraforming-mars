import {CorporationCard} from '../corporation/CorporationCard';
import {LogHelper} from '../../components/LogHelper';
import {Player} from '../../Player';
import {Tags} from '../Tags';
import {Game} from '../../Game';
import {CardName} from '../../CardName';
import {CardType} from '../CardType';
import {CardMetadata} from '../CardMetadata';
import {CardRenderer} from '../render/CardRenderer';

export class MorningStarInc implements CorporationCard {
    public name = CardName.MORNING_STAR_INC;
    public tags = [Tags.VENUS];
    public startingMegaCredits: number = 50;
    public cardType = CardType.CORPORATION;

    public initialActionText: string = 'Draw 3 Venus-tag cards';
    public initialAction(player: Player, game: Game) {
      const cards = game.drawCardsByTag(Tags.VENUS, 3);
      player.cardsInHand.push(...cards);
      LogHelper.logDrawnCards(game, player, cards);
      return undefined;
    }

    public getRequirementBonus(_player: Player, _game: Game, venusOnly?: boolean): number {
      if (venusOnly !== undefined && venusOnly) return 2;
      return 0;
    }

    public play() {
      return undefined;
    }

    public metadata: CardMetadata = {
      cardNumber: 'R06',
      description: 'You start with 50 MC. As your first action, reveal cards from the deck until you have revealed 3 Venus-tag cards. Take those into hand and discard the rest.',
      renderData: CardRenderer.builder((b) => {
        b.megacredits(50).nbsp.cards(3).secondaryTag(Tags.VENUS);
        b.corpBox('effect', (ce) => {
          ce.effectBox((eb) => {
            eb.venus(1).startEffect.text('+/- 2');
            eb.description('Effect: Your Venus requirements are +/- 2 steps, your choice in each case.');
          });
        });
      }),
    }
}
