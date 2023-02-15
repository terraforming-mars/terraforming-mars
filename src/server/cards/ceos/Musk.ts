import {CardName} from '../../../common/cards/CardName';
import {Player} from '../../Player';
import {PlayerInput} from '../../PlayerInput';
import {CardRenderer} from '../render/CardRenderer';
import {CeoCard} from './CeoCard';

import {DrawCards} from '../../deferredActions/DrawCards';

import {Tag} from '../../../common/cards/Tag';
import {Resources} from '../../../common/Resources';
import {SelectCard} from '../../inputs/SelectCard';


export class Musk extends CeoCard {
  constructor() {
    super({
      name: CardName.MUSK,
      metadata: {
        cardNumber: 'L28',
        renderData: CardRenderer.builder((b) => {
          b.opgArrow().minus().cards(1, {secondaryTag: Tag.EARTH}).colon().cards(1, {secondaryTag: Tag.SPACE}).titanium(1).asterix();
          b.br;
          b.titanium(6);
          b.br.br;
        }),
        description: 'Once per game, discard any number of Earth cards to draw that many space cards, and gain that many units of titanium, plus 6.',
      },
    });
  }

  public action(player: Player): PlayerInput | undefined {
    const game = player.game;
    const eligibleCards = player.cardsInHand.filter((card) => card.tags.includes(Tag.EARTH));
    this.isDisabled = true;

    if (eligibleCards.length === 0) {
      game.log('${0} has no Earth cards', (b) => b.player(player), {reservedFor: player});
      player.addResource(Resources.TITANIUM, 6, {log: true});
      return undefined;
    }

    return new SelectCard(
      'Select Earth card(s) to discard',
      'Discard',
      eligibleCards,
      (cards) => {
        for (const card of cards) {
          player.cardsInHand.splice(player.cardsInHand.indexOf(card), 1);
          game.projectDeck.discard(card);
        }
        player.game.defer(DrawCards.keepAll(player, cards.length, {tag: Tag.SPACE}));
        player.addResource(Resources.TITANIUM, cards.length + 6, {log: true});
        return undefined;
      },
      {min: 0, max: eligibleCards.length});
  }
}
