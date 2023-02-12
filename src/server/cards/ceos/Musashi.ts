import {CardName} from '../../../common/cards/CardName';
import {Player} from '../../Player';
import {PlayerInput} from '../../PlayerInput';
import {CardRenderer} from '../render/CardRenderer';
import {CeoCard} from './CeoCard';

import {DrawCards} from '../../deferredActions/DrawCards';
import {SelectAmount} from '../../inputs/SelectAmount';

import {Tag} from '../../../common/cards/Tag';
import {SimpleDeferredAction, Priority} from '../../deferredActions/DeferredAction';
import {Resources} from '../../../common/Resources';
import {SelectCard} from '../../inputs/SelectCard';
import {IProjectCard} from '../IProjectCard';


export class Musashi extends CeoCard {
  constructor() {
    super({
      name: CardName.MUSASHI,
      metadata: {
        cardNumber: 'L28',
        renderData: CardRenderer.builder((b) => {
          b.opgArrow().minus().cards(1, {secondaryTag: Tag.EARTH}).colon().cards(1, {secondaryTag: Tag.SPACE}).titanium(1).asterix();
          b.br;
          b.titanium(6);
          b.br.br;
        }),
        description: 'Once per game, discard any number of Earth cards to draw/gain that many Space cards and titanium. Gain 6 titanium.',
      },
    });
  }

  public action(player: Player): PlayerInput | undefined {
    const game = player.game;
    const eligibleCards = player.cardsInHand.filter((card) => card.tags.includes(Tag.EARTH));
    const max = eligibleCards.length;

    return new SelectAmount(
      'Select number of Earth cards to discard',
      'Discard cards',
      (amount: number) => {
        const discardEarthCards = new SimpleDeferredAction(
          player,
          () => {
            if (amount === 0) return undefined;
            return new SelectCard(
              `Select ${amount} Earth card(s) to discard`,
              'Discard',
              eligibleCards,
              (foundCards: Array<IProjectCard>) => {
                for (const card of foundCards) {
                  player.cardsInHand.splice(player.cardsInHand.indexOf(card), 1);
                  game.projectDeck.discard(card);
                }
                return undefined;
              },
              {min: amount, max: amount});
          },
        );
        player.game.defer(discardEarthCards, Priority.DISCARD_AND_DRAW);
        player.game.defer(DrawCards.keepAll(player, amount, {tag: Tag.SPACE}));
        player.addResource(Resources.TITANIUM, 6 + amount);
        this.isDisabled = true;
        return undefined;
      },
      0,
      max,
    );
  }
}
