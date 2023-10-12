import {CardName} from '../../../common/cards/CardName';
import {IPlayer} from '../../IPlayer';
import {PlayerInput} from '../../PlayerInput';
import {CardRenderer} from '../render/CardRenderer';
import {CeoCard} from './CeoCard';

import {Tag} from '../../../common/cards/Tag';
import {SelectOption} from '../../inputs/SelectOption';
import {OrOptions} from '../../inputs/OrOptions';
import {Size} from '../../../common/cards/render/Size';
import {inplaceRemove} from '../../../common/utils/utils';

export class Tate extends CeoCard {
  constructor() {
    super({
      name: CardName.TATE,
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

  public action(player: IPlayer): PlayerInput | undefined {
    this.isDisabled = true;
    const game = player.game;
    const tags = [...game.tags];
    inplaceRemove(tags, Tag.WILD);
    inplaceRemove(tags, Tag.EVENT);
    inplaceRemove(tags, Tag.CLONE);

    const options = tags.map((tag) => {
      return new SelectOption('Search for ' + tag + ' tags', 'Search').andThen(() => {
        game.log('${0} searched for ${1} tags', (b) => b.player(player).string(tag));
        player.drawCardKeepSome(5, {keepMax: 2, tag: tag, paying: true, logDrawnCard: true});
        return undefined;
      });
    });

    return new OrOptions(...options);
  }
}
