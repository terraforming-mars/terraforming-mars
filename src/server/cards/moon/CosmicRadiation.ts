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
import {newMessage} from '../../logs/MessageBuilder';

export class CosmicRadiation extends Card implements IProjectCard {
  constructor() {
    super({
      name: CardName.COSMIC_RADIATION,
      type: CardType.EVENT,
      tags: [Tag.MOON],
      cost: 3,

      requirements: {miningRate: 4},
      metadata: {
        description: 'Requires 4 mining rate. All players pay 4M€ for each mining tile they own.',
        cardNumber: 'M52',
        renderData: CardRenderer.builder((b) => {
          b.minus().megacredits(4, {all}).slash().moonMine({size: Size.SMALL, all});
        }),
      },
    });
  }

  public override bespokePlay(player: IPlayer) {
    const game = player.game;
    const mines = MoonExpansion.spaces(game, TileType.MOON_MINE);
    game.getPlayersInGenerationOrder().forEach((mineTileOwner) => {
      const owned = mines.filter((mine) => mine.player?.id === mineTileOwner.id).length;
      if (owned > 0) {
        const bill = owned * 4;
        const owes = Math.min(bill, mineTileOwner.spendableMegacredits());

        game.defer(new SelectPaymentDeferred(mineTileOwner, owes, {
          title: newMessage('You must spend ${0} M€ for ${1} mining tiles', (b) => b.number(owes).number(owned))}))
          .andThen(() =>
            game.log(
              '${0} spends ${1} M€ for the ${2} mining tiles they own.',
              (b) => b.player(mineTileOwner).number(owes).number(owned)));
      }
    });
    return undefined;
  }
}
