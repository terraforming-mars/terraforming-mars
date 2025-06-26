import {expect} from 'chai';
import {EcologicalZone} from '../../../src/server/cards/base/EcologicalZone';
import {EcologyExperts} from '../../../src/server/cards/prelude/EcologyExperts';
import {IGame} from '../../../src/server/IGame';
import {SelectSpace} from '../../../src/server/inputs/SelectSpace';
import {Phase} from '../../../src/common/Phase';
import {TileType} from '../../../src/common/TileType';
import {TestPlayer} from '../../TestPlayer';
import {cast, runAllActions} from '../../TestingUtils';
import {testGame} from '../../TestGame';

describe('EcologicalZone', () => {
  let card: EcologicalZone;
  let player: TestPlayer;
  let game: IGame;

  beforeEach(() => {
    card = new EcologicalZone();
    [game, player] = testGame(2);
  });

  it('Cannot play', () => {
    expect(card.canPlay(player)).is.not.true;
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
    expect(adjacentSpace.adjacency?.bonus).eq(undefined);
  });

  it('Should get triggered by EcoExperts if played together', () => {
    game.phase = Phase.PRELUDES;

    const landSpace = game.board.getAvailableSpacesOnLand(player)[0];
    game.addGreenery(player, landSpace);

    const ecoExpertCard = new EcologyExperts();
    player.playCard(ecoExpertCard);
    expect(card.canPlay(player)).is.true;

    player.playCard(card);
    expect(card.resourceCount).to.eq(3);
  });
});

