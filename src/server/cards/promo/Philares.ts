import {CorporationCard} from '@/server/cards/corporation/CorporationCard';
import {IPlayer} from '@/server/IPlayer';
import {Tag} from '@/common/cards/Tag';
import {Space} from '@/server/boards/Space';
import {CardName} from '@/common/cards/CardName';
import {Priority} from '@/server/deferredActions/Priority';
import {CardRenderer} from '@/server/cards/render/CardRenderer';
import {Size} from '@/common/cards/render/Size';
import {BoardType} from '@/server/boards/BoardType';
import {all} from '@/server/cards/Options';
import {SelectResources} from '@/server/inputs/SelectResources';
import {message} from '@/server/logs/MessageBuilder';
import {ICorporationCard} from '@/server/cards/corporation/ICorporationCard';

export class Philares extends CorporationCard implements ICorporationCard {
  constructor() {
    super({
      name: CardName.PHILARES,
      tags: [Tag.BUILDING],
      startingMegaCredits: 47,

      firstAction: {
        text: 'Place a greenery tile and raise the oxygen 1 step',
        greenery: {},
      },

      metadata: {
        cardNumber: 'R25',
        hasExternalHelp: true,
        description: 'You start with 47 M€. As your first action, place a greenery tile and raise the oxygen 1 step.',
        renderData: CardRenderer.builder((b) => {
          b.megacredits(47).nbsp.greenery();
          b.corpBox('effect', (ce) => {
            ce.effect('Each new adjacency between your tile and an opponent\'s tile gives you a standard resource of your choice [regardless of who just placed a tile].', (eb) => {
              eb.emptyTile('normal', {size: Size.SMALL, all}).nbsp;
              eb.emptyTile('normal', {size: Size.SMALL}).startEffect.wild(1);
            });
          });
        }),
      },
    });
  }

  public onTilePlaced(cardOwner: IPlayer, activePlayer: IPlayer, space: Space, boardType: BoardType) {
    // Nerfing on The Moon.
    if (boardType !== BoardType.MARS) {
      return;
    }

    if (space.player === undefined) {
      return;
    }
    const adjacentSpaces = cardOwner.game.board.getAdjacentSpaces(space);
    const adjacentSpacesWithPlayerTiles = adjacentSpaces.filter((space) => space.tile !== undefined && space.player !== undefined);

    const eligibleTiles = (cardOwner.id === activePlayer.id) ?
      adjacentSpacesWithPlayerTiles.filter((space) => space.player?.id !== cardOwner.id) :
      adjacentSpacesWithPlayerTiles.filter((space) => space.player?.id === cardOwner.id);

    const count = eligibleTiles.length;
    if (count > 0) {
      cardOwner.defer(() => {
        cardOwner.game.log('${0} must select ${1} bonus resource(s) from ${2}\' ability', (b) => b.player(cardOwner).number(count).card(this));
        return new SelectResources(message('Gain ${0} standard resources', (b) => b.number(count)), count)
          .andThen((units) => {
            cardOwner.stock.adjust(units, {log: true});
            return undefined;
          });
      },
      cardOwner.id !== activePlayer.id ? Priority.OPPONENT_TRIGGER : Priority.GAIN_RESOURCE_OR_PRODUCTION,
      );
    }
  }
}
