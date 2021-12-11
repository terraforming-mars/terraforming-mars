import {expect} from 'chai';
import {EcologicalZone} from '../../../src/cards/base/EcologicalZone';
import {EcologyExperts} from '../../../src/cards/prelude/EcologyExperts';
import {Game} from '../../../src/Game';
import {SelectSpace} from '../../../src/inputs/SelectSpace';
import {Phase} from '../../../src/Phase';
import {Player} from '../../../src/Player';
import {TileType} from '../../../src/TileType';
import {TestPlayers} from '../../TestPlayers';

describe('EcologicalZone', function() {
  let card : EcologicalZone; let player : Player; let game : Game;

  beforeEach(function() {
    card = new EcologicalZone();
    player = TestPlayers.BLUE.newPlayer();
    const redPlayer = TestPlayers.RED.newPlayer();
    game = Game.newInstance('foobar', [player, redPlayer], player);
  });

  it('Cannot play', function() {
    expect(card.canPlay(player)).is.not.true;
  });

  it('Should play', function() {
    const landSpace = game.board.getAvailableSpacesOnLand(player)[0];
    game.addGreenery(player, landSpace.id);
    expect(card.canPlay(player)).is.true;

    const action = card.play(player);
    expect(action).instanceOf(SelectSpace);

    const adjacentSpace = action.availableSpaces[0];
    action.cb(adjacentSpace);
    expect(adjacentSpace.tile && adjacentSpace.tile.tileType).to.eq(TileType.ECOLOGICAL_ZONE);

    card.onCardPlayed(player, card);
    expect(card.resourceCount).to.eq(2);
    expect(card.getVictoryPoints()).to.eq(1);
    expect(adjacentSpace.adjacency?.bonus).eq(undefined);
  });

  it('Should get triggered by EcoExperts if played together', function() {
    game.phase = Phase.PRELUDES;

    const landSpace = game.board.getAvailableSpacesOnLand(player)[0];
    game.addGreenery(player, landSpace.id);

    const ecoExpertCard = new EcologyExperts();
    player.playCard(ecoExpertCard);
    expect(card.canPlay(player)).is.true;

    player.playCard(card);
    expect(card.resourceCount).to.eq(3);
  });
});

