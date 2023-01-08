
import {SelectCard} from '../../inputs/SelectCard';
import {ISpace} from '../../boards/ISpace';
import {TileType} from '../../../common/TileType';
import {ICard} from '../ICard';

import {CardName} from '../../../common/cards/CardName';
import {CardType} from '../../../common/cards/CardType';
import {Player} from '../../Player';
import {PlayerInput} from '../../PlayerInput';
import {Card} from '../Card';
import {CardRenderer} from '../render/CardRenderer';
import {LeaderCard} from './LeaderCard';


import {SimpleDeferredAction} from '../../deferredActions/DeferredAction';
import {SpaceBonus} from '../../../common/boards/SpaceBonus';

import {CardResource} from '../../../common/CardResource';

import {MultiSet} from 'mnemonist';


export class Gaia extends Card implements LeaderCard {
  constructor() {
    super({
      name: CardName.GAIA,
      cardType: CardType.LEADER,
      metadata: {
        cardNumber: 'L32',
        renderData: CardRenderer.builder((b) => {
          // b.opgArrow().colon().adjacencyBonus({all}).asterix();
          b.opgArrow().colon().text('Adjacency Bonus').asterix();
          b.br;
        }),
        description: 'Once per game, gain the Ares adjacency bonuses of all tiles placed on Mars.',
      },
    });
  }

  public isDisabled = false;

  public override play() {
    return undefined;
  }

  public canAct(): boolean {
    return this.isDisabled === false;
  }

  public action(player: Player): PlayerInput | undefined {
    const board = player.game.board;
    const allPlayers = player.game.getPlayers();

    allPlayers.forEach((p) => {
      board.spaces
        .filter((space) => space.player === p)
        .forEach((space) => {
          board.getAdjacentSpaces(space).forEach((adjacentSpace) => {
            this.grantAdjacencyBonus(adjacentSpace, player);
          });
        });
    });

    this.isDisabled = true;
    return undefined;
  }

  public grantAdjacencyBonus(adjacentSpace: ISpace, player: Player) {
    if (adjacentSpace.adjacency === undefined || adjacentSpace.adjacency.bonus.length === 0) {
      return undefined;
    }

    const addResourceToCard = function(player: Player, resourceType: CardResource, resourceAsText: string) {
      const availableCards = player.getResourceCards(resourceType);
      if (availableCards.length === 0) {
        return;
      } else if (availableCards.length === 1) {
        player.addResourceTo(availableCards[0], {log: true});
      } else if (availableCards.length > 1) {
        player.game.defer(new SimpleDeferredAction(
          player,
          () => new SelectCard(
            'Select a card to add an ' + resourceAsText,
            'Add ' + resourceAsText + 's',
            availableCards,
            (selected: ICard[]) => {
              player.addResourceTo(selected[0], {log: true});
              return undefined;
            },
          ),
        ));
      }
    };

    const bonuses = new MultiSet<SpaceBonus>();

    adjacentSpace.adjacency.bonus.forEach((bonus) => {
      bonuses.add(bonus);
      switch (bonus) {
      case SpaceBonus.ANIMAL:
        addResourceToCard(player, CardResource.ANIMAL, 'animal');
        break;
      case SpaceBonus.MEGACREDITS:
        player.megaCredits++;
        break;
      case SpaceBonus.ENERGY:
        player.energy++;
        break;
      case SpaceBonus.MICROBE:
        addResourceToCard(player, CardResource.MICROBE, 'microbe');
        break;
      default:
        player.game.grantSpaceBonus(player, bonus);
        break;
      }
    });

    const bonusText = Array.from(bonuses.multiplicities())
      .map(([bonus, count]) => `${count} ${SpaceBonus.toString(bonus)}`)
      .join(', ');
    const tileText = adjacentSpace.tile !== undefined ? TileType.toString(adjacentSpace.tile.tileType) : 'no tile';
    player.game.log('${0} gains ${1} for placing next to ${2}', (b) => b.player(player).string(bonusText).string(tileText));

    return undefined;
  }
}
