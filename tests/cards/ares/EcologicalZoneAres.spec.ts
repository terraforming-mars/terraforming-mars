import {expect} from 'chai';
import {IGame} from '../../../src/server/IGame';
import {SelectSpace} from '../../../src/server/inputs/SelectSpace';
import {TileType} from '../../../src/common/TileType';
import {SpaceBonus} from '../../../src/common/boards/SpaceBonus';
import {EcologicalZoneAres} from '../../../src/server/cards/ares/EcologicalZoneAres';
import {TestPlayer} from '../../TestPlayer';
import {cast, runAllActions} from '../../TestingUtils';
import {testGame} from '../../TestGame';

describe('EcologicalZoneAres', () => {
  let card: EcologicalZoneAres;
  let player: TestPlayer;
  let game: IGame;

  beforeEach(() => {
    card = new EcologicalZoneAres();
    [game, player] = testGame(2, {aresExtension: true});
  });

  it('Should play', () => {
    expect(card.canPlay(player)).is.false;
    const landSpace = game.board.getAvailableSpacesOnLand(player)[0];
    game.addGreenery(player, landSpace);
    expect(card.canPlay(player)).is.true;

    cast(card.play(player), undefined);
    runAllActions(game);
    const selectSpace = cast(player.popWaitingFor(), SelectSpace);

    const adjacentSpace = selectSpace.spaces[0];
    selectSpace.cb(adjacentSpace);
    expect(adjacentSpace.tile?.tileType).to.eq(TileType.ECOLOGICAL_ZONE);

    card.onCardPlayed(player, card);
    expect(card.resourceCount).to.eq(2);
    expect(card.getVictoryPoints(player)).to.eq(1);
    expect(adjacentSpace.adjacency).to.deep.eq({bonus: [SpaceBonus.ANIMAL]});
  });
});

