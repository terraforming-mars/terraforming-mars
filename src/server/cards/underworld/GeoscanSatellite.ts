import {CardType} from '@/common/cards/CardType';
import {IProjectCard} from '@/server/cards/IProjectCard';
import {CardName} from '@/common/cards/CardName';
import {CardRenderer} from '@/server/cards/render/CardRenderer';
import {Card} from '@/server/cards/Card';
import {Tag} from '@/common/cards/Tag';
import {IPlayer} from '@/server/IPlayer';
import {UnderworldExpansion} from '@/server/underworld/UnderworldExpansion';
import {IdentifySpacesDeferred} from '@/server/underworld/IdentifySpacesDeferred';
import {ClaimSpaceDeferred} from '@/server/underworld/ClaimSpaceDeferred';

export class GeoscanSatellite extends Card implements IProjectCard {
  constructor() {
    super({
      type: CardType.AUTOMATED,
      name: CardName.GEOSCAN_SATELLITE,
      cost: 8,
      tags: [Tag.SCIENCE, Tag.SPACE],

      metadata: {
        cardNumber: 'U002',
        renderData: CardRenderer.builder((b) => {
          b.geoscan().claim(1);
        }),
        description: 'Pick a space on the board. ' +
          'Identify the underground resource in that space and in all adjacent spaces. ' +
          'Claim one of them.',
      },
    });
  }

  public override bespokeCanPlay(player: IPlayer) {
    return UnderworldExpansion.identifiableSpaces(player).length > 0;
  }

  public override bespokePlay(player: IPlayer) {
    player.game.defer(
      new IdentifySpacesDeferred(player, 1).andThen(([space]) => {
        if (typeof space === 'string') {
          throw new Error(`Expected space, got ${space}`);
        }
        const claimableSpaces = [space];
        for (const adjacentSpace of player.game.board.getAdjacentSpaces(space)) {
          const identified = UnderworldExpansion.identify(player.game, adjacentSpace, player);
          if (identified) {
            claimableSpaces.push(adjacentSpace);
          }
        }
        player.game.defer(new ClaimSpaceDeferred(player, claimableSpaces));
      }),
    );
    return undefined;
  }
}
