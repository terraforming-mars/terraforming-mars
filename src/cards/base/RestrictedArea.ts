import {IActionCard} from '../ICard';
import {IProjectCard} from '../IProjectCard';
import {Tags} from '../Tags';
import {CardType} from '../CardType';
import {Player} from '../../Player';
import {Game} from '../../Game';
import {TileType} from '../../TileType';
import {SelectSpace} from '../../inputs/SelectSpace';
import {ISpace} from '../../ISpace';
import {CardName} from '../../CardName';
import {SelectHowToPayDeferred} from '../../deferredActions/SelectHowToPayDeferred';
import {IAdjacencyBonus} from '../../ares/IAdjacencyBonus';
import {CardMetadata} from '../CardMetadata';
import {CardRenderer} from '../render/CardRenderer';

export class RestrictedArea implements IActionCard, IProjectCard {
    public cost = 11;
    public tags = [Tags.SCIENCE];
    public cardType = CardType.ACTIVE;
    public name = CardName.RESTRICTED_AREA;
    public hasRequirements = false;
    public adjacencyBonus?: IAdjacencyBonus = undefined;

    public canPlay(player: Player, game: Game): boolean {
      return game.board.getAvailableSpacesOnLand(player).length > 0;
    }
    public play(player: Player, game: Game) {
      return new SelectSpace('Select space for tile', game.board.getAvailableSpacesOnLand(player), (foundSpace: ISpace) => {
        game.addTile(player, foundSpace.spaceType, foundSpace, {tileType: TileType.RESTRICTED_AREA});
        foundSpace.adjacency = this.adjacencyBonus;
        return undefined;
      });
    }
    public canAct(player: Player): boolean {
      return player.canAfford(2);
    }
    public action(player: Player, game: Game) {
      game.defer(new SelectHowToPayDeferred(player, 2, false, false, 'Select how to pay for action'));
      player.cardsInHand.push(game.dealer.dealCard());
      return undefined;
    }
    public metadata: CardMetadata = {
      cardNumber: '199',
      renderData: CardRenderer.builder((b) => {
        b.effectBox((eb) => {
          eb.megacredits(2).startAction.cards(1);
          eb.description('Action: Spend 2 MC to draw a card.');
        }).br;
        b.tile(TileType.RESTRICTED_AREA, true);
      }),
      description: 'Place this tile.',
    }
}
