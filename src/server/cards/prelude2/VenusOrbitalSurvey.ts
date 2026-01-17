import {Tag} from '@/common/cards/Tag';
import {CardName} from '@/common/cards/CardName';
import {CardRenderer} from '@/server/cards/render/CardRenderer';
import {IPlayer} from '@/server/IPlayer';
import {Card} from '@/server/cards/Card';
import {CardType} from '@/common/cards/CardType';
import {IActionCard} from '@/server/cards/ICard';
import {DrawCards} from '@/server/deferredActions/DrawCards';
import {IProjectCard} from '@/server/cards/IProjectCard';
import {LogType, keep} from '@/server/deferredActions/ChooseCards';
import {ChooseCards} from '@/server/deferredActions/ChooseCards';
import {Size} from '@/common/cards/render/Size';
import {oneWayDifference} from '@/common/utils/utils';

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
            ab.empty().startAction.empty()).br.text('Action: Reveal the top 2 cards, take any venus cards to hand for free. Any other card you either buy or discard', Size.SMALL, true);
        }),
      },
    });
  }

  public canAct(player: IPlayer): boolean {
    return player.game.projectDeck.canDraw(2);
  }

  public action(player: IPlayer) {
    const isVenus = (card: IProjectCard) => player.tags.cardHasTag(card, Tag.VENUS);

    player.game.defer(new DrawCards(player, 2).andThen((cards) => {
      player.game.log('${0} revealed ${1} and ${2}', (b) => {
        b.player(player)
          .card(cards[0], {tags: true})
          .card(cards[1], {tags: true});
      });

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
