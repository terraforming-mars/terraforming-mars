import { CardName } from '../../../common/cards/CardName';
import { CardType } from '../../../common/cards/CardType';
import { Player } from '../../Player';
import { PlayerInput } from '../../PlayerInput';
import { Card } from '../Card';
import { CardRenderer } from '../render/CardRenderer';
import { LeaderCard } from './LeaderCard';

import {Tag} from '../../../common/cards/Tag';
import {SimpleDeferredAction} from '../../deferredActions/DeferredAction';
import {SelectOption} from '../../inputs/SelectOption';
import {OrOptions} from '../../inputs/OrOptions';
import {Size} from '../../../common/cards/render/Size';

export class Tate extends Card implements LeaderCard {
  constructor() {
    super({
      name: CardName.TATE,
      cardType: CardType.LEADER,
      metadata: {
        cardNumber: 'L20',
        renderData: CardRenderer.builder((b) => {
          b.opgArrow().text('5', Size.LARGE).cards(1, {secondaryTag: Tag.WILD}).asterix();
          b.br.br;
        }),
        description: 'Once per game, name a tag. Reveal cards from the deck until you find 5 cards with that tag. BUY up to 2 cards and discard the rest.',
      },
    });
  }

  public isDisabled = false;

  public override play() {
    return undefined;
  }

  public canAct(): boolean {
    return this.isDisabled === false;
  }

  public action(player: Player): PlayerInput | undefined {
    const game = player.game;

    // There's only one card with a Wild tag in the game right now... we shouldn't use that
    const tags = game.getAllValidTags().filter(tag => tag !== Tag.WILD);
    const options = tags.map((tag) => {
      return new SelectOption('Search for ' + tag + ' tags', 'Search', () => {
        game.log('${0} searched for ${1} tags', (b) => b.player(player).string(tag));
        // return player.drawCardKeepSome(5, {keepMax: 2, tag: tag, paying: true, logDrawnCard: true, logDiscardedCards: true});
        return player.drawCardKeepSome(5, {keepMax: 2, tag: tag, paying: true, logDrawnCard: true});
      });
    });

    // game.defer(new DeferredAction(player, () => new OrOptions(...options)));
    game.defer(new SimpleDeferredAction(player, () => new OrOptions(...options)));

    this.isDisabled = true;
    return undefined;
  }
}
