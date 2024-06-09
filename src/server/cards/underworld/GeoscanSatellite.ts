import {CardType} from '../../../common/cards/CardType';
import {IProjectCard} from '../IProjectCard';
import {CardName} from '../../../common/cards/CardName';
import {CardRenderer} from '../render/CardRenderer';
import {Card} from '../Card';
import {Tag} from '../../../common/cards/Tag';
import {CardResource} from '../../../common/CardResource';
import {IPlayer} from '../../IPlayer';
import {UnderworldExpansion} from '../../underworld/UnderworldExpansion';
import {IdentifySpacesDeferred} from '../../underworld/IdentifySpacesDeferred';

export class GeoscanSatellite extends Card implements IProjectCard {
  constructor() {
    super({
      type: CardType.AUTOMATED,
      name: CardName.GEOSCAN_SATELLITE,
      cost: 6,
      tags: [Tag.SCIENCE, Tag.SPACE],

      behavior: {
        addResourcesToAnyCard: {count: 2, type: CardResource.DATA},
      },

      metadata: {
        cardNumber: 'U02',
        renderData: CardRenderer.builder((b) => {
          b.resource(CardResource.DATA, 2).geoscan();
        }),
        description: 'Place 2 data on any card. Pick a space on the board. Identify the underground resource in that space and in all adjacent spaces.',
      },
    });
  }

  public override bespokeCanPlay(player: IPlayer) {
    return UnderworldExpansion.identifiableSpaces(player).length > 0;
  }

  public override bespokePlay(player: IPlayer) {
    player.game.defer(
      new IdentifySpacesDeferred(player, 1).andThen(([space]) => {
        for (const adjacentSpace of player.game.board.getAdjacentSpaces(space)) {
          UnderworldExpansion.identify(player.game, adjacentSpace, player);
        }
      }),
    );
    return undefined;
  }
}
