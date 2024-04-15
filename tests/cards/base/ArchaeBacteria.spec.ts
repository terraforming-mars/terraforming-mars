import {expect} from 'chai';
import {ArchaeBacteria} from '../../../src/server/cards/base/ArchaeBacteria';
import {TestPlayer} from '../../TestPlayer';
import {Game} from '../../../src/server/Game';
import {setTemperature} from '../../TestingUtils';
import {testGame} from '../../TestGame';

describe('ArchaeBacteria', function() {
  let card: ArchaeBacteria;
  let player: TestPlayer;
  let game: Game;

  beforeEach(function() {
    card = new ArchaeBacteria();
    [game, player] = testGame(2);
  });

  it('Can not play', function() {
    setTemperature(game, -12);
    expect(card.canPlay(player)).is.not.true;
  });

  it('Should play', function() {
    card.play(player);
    expect(player.production.plants).to.eq(1);
  });
});
