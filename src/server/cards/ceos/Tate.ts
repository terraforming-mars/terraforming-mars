import {CardName} from '../../../common/cards/CardName';
import {Player} from '../../Player';
import {PlayerInput} from '../../PlayerInput';
import {CardRenderer} from '../render/CardRenderer';
import {CeoCard} from './CeoCard';

import {Tag} from '../../../common/cards/Tag';
import {SelectOption} from '../../inputs/SelectOption';
import {OrOptions} from '../../inputs/OrOptions';
import {Size} from '../../../common/cards/render/Size';

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

  public action(player: Player): PlayerInput | undefined {
    const game = player.game;
    // TODO(dl): Is there a 'validTagsInThisGame()', should we add one? This code seems to repeat a few times
    //   maybe with an option for validTagsThisGame(options{'planetary'})
    const excludedTags = [
      Tag.WILD,
      Tag.EVENT,
      Tag.CLONE,
      !game.gameOptions.venusNextExtension ? Tag.VENUS : null,
      !game.gameOptions.moonExpansion ? Tag.MOON : null,
      !game.gameOptions.aresExtension ? Tag.MARS : null,
    ].filter(Boolean);

    // Blame OpenAI for this allTags:
    const allTags: Array<Tag> = Object.values(Tag) as Array<Tag>;
    const validTags = allTags.filter((tag) => !excludedTags.includes(tag));

    const options = validTags.map((tag) => {
      return new SelectOption('Search for ' + tag + ' tags', 'Search', () => {
        game.log('${0} searched for ${1} tags', (b) => b.player(player).string(tag));
        return player.drawCardKeepSome(5, {keepMax: 2, tag: tag, paying: true, logDrawnCard: true});
      });
    });

    this.isDisabled = true;
    return new OrOptions(...options);
  }
}
