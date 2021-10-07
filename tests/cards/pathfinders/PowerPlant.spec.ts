import {expect} from 'chai';
import {PowerPlant} from '../../../src/cards/pathfinders/PowerPlant';
import {Game} from '../../../src/Game';
import {TestPlayer} from '../../TestPlayer';
import {TestPlayers} from '../../TestPlayers';
import {Units} from '../../../src/Units';

describe('PowerPlant', function() {
  let card: PowerPlant;
  let player: TestPlayer;

  beforeEach(function() {
    card = new PowerPlant();
    player = TestPlayers.BLUE.newPlayer();
    Game.newInstance('foobar', [player], player);
    player.playedCards.push(card);
  });

  it('play', function() {
    const action = card.play(player);
    expect(action).is.undefined;
    expect(player.getProductionForTest()).deep.eq(Units.of({heat: 2, energy: 1}));
  });
});
