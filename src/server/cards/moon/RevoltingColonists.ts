import {CardName} from '../../../common/cards/CardName';
import {IPlayer} from '../../IPlayer';
import {CardType} from '../../../common/cards/CardType';
import {IProjectCard} from '../IProjectCard';
import {Tag} from '../../../common/cards/Tag';
import {MoonExpansion} from '../../moon/MoonExpansion';
import {TileType} from '../../../common/TileType';
import {CardRenderer} from '../render/CardRenderer';
import {Card} from '../Card';
import {Size} from '../../../common/cards/render/Size';
import {all} from '../Options';
import {SelectPaymentDeferred} from '../../deferredActions/SelectPaymentDeferred';
import {message} from '../../logs/MessageBuilder';

export class RevoltingColonists extends Card implements IProjectCard {
  constructor() {
    super({
      name: CardName.REVOLTING_COLONISTS,
      type: CardType.EVENT,
      tags: [Tag.MOON],
      cost: 3,
      requirements: {habitatRate: 4},

      metadata: {
        description: 'Requires 4 habitat rate. All players pay 3M€ for each habitat tile they own.',
        cardNumber: 'M51',
        renderData: CardRenderer.builder((b) => {
          b.minus().megacredits(3, {all}).slash().moonHabitat({size: Size.SMALL, all});
        }),
      },
    });
  }

  public override bespokePlay(player: IPlayer) {
    const game = player.game;
    const colonies = MoonExpansion.spaces(game, TileType.MOON_HABITAT);
    game.getPlayers().forEach((habitatTileOwner) => {
      const owned = colonies.filter((colony) => colony.player?.id === habitatTileOwner.id).length;
      if (owned > 0) {
        const bill = owned * 3;
        const owes = Math.min(bill, habitatTileOwner.spendableMegacredits());

        game.defer(new SelectPaymentDeferred(habitatTileOwner, owes, {
          title: message('You must spend ${0} M€ for ${1} habitat tiles', (b) => b.number(owes).number(owned))}))
          .andThen(() =>
            game.log(
              '${0} spends ${1} M€ for the ${2} habitat tiles they own.',
              (b) => b.player(habitatTileOwner).number(owes).number(owned)));
      }
    });
    return undefined;
  }
}
