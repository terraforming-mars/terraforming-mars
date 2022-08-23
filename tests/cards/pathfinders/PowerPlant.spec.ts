import {expect} from 'chai';
import {PowerPlant} from '../../../src/server/cards/pathfinders/PowerPlant';
import {Game} from '../../../src/server/Game';
import {TestPlayer} from '../../TestPlayer';
import {Units} from '../../../src/common/Units';

describe('PowerPlant', function() {
  let card: PowerPlant;
  let player: TestPlayer;

  beforeEach(function() {
    card = new PowerPlant();
    player = TestPlayer.BLUE.newPlayer();
    Game.newInstance('gameid', [player], player);
    player.playedCards.push(card);
  });

  it('play', function() {
    const action = card.play(player);
    expect(action).is.undefined;
    expect(player.production.asUnits()).deep.eq(Units.of({heat: 2, energy: 1}));
  });
});
