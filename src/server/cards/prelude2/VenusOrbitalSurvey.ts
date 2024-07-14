import {Tag} from '../../../common/cards/Tag';
import {CardName} from '../../../common/cards/CardName';
import {CardRenderer} from '../render/CardRenderer';
import {IPlayer} from '../../IPlayer';
import {Card} from '../Card';
import {CardType} from '../../../common/cards/CardType';
import {IActionCard} from '../ICard';
import {DrawCards} from '../../deferredActions/DrawCards';
import {IProjectCard} from '../IProjectCard';
import {LogType, keep} from '../../deferredActions/ChooseCards';
import {ChooseCards} from '../../deferredActions/ChooseCards';
import {Size} from '../../../common/cards/render/Size';
import {oneWayDifference} from '../../../common/utils/utils';

export class VenusOrbitalSurvey extends Card implements IActionCard {
  constructor() {
    super({
      name: CardName.VENUS_ORBITAL_SURVEY,
      type: CardType.ACTIVE,
      tags: [Tag.VENUS, Tag.SPACE],
      cost: 18,

      metadata: {
        cardNumber: 'P88',
        renderData: CardRenderer.builder((b) => {
          b.action(undefined, (ab) =>
            ab.empty().startAction.empty()).text('Action: Reveal the top 2 cards, take any venus cards to hand for free. Any other card you either buy or discard', Size.TINY, true);
        }),
      },
    });
  }

  public canAct(player: IPlayer): boolean {
    if (!player.game.projectDeck.canDraw(2)) {
      this.warnings.add('deckTooSmall');
    }
    return true;
  }

  public action(player: IPlayer) {
    const isVenus = (card: IProjectCard) => player.tags.cardHasTag(card, Tag.VENUS);

    player.game.defer(new DrawCards(player, 2).andThen((cards) => {
      let message = '${0} revealed ';
      if (cards.length === 0) {
        message += 'no cards';
      } else {
        message += '${1}';
        if (cards.length === 2) {
          message += ' and ${2}';
        }
      }
      player.game.log(message, (b) => {
        b.player(player);
        for (const card of cards) {
          b.card(card);
        }
      }, {});

      const venus = cards.filter(isVenus);
      if (venus.length > 0) {
        keep(player, venus, [], LogType.DREW_VERBOSE);
      }

      // The cards bought are private here
      const rest = oneWayDifference(cards, venus);
      if (rest.length > 0) {
        player.game.defer(new ChooseCards(player, rest, {
          paying: true,
        }));
      }
    }));

    return undefined;
  }
}
