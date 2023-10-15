import {expect} from 'chai';
import {setTemperature} from '../../TestingUtils';
import {IceCapMelting} from '../../../src/server/cards/base/IceCapMelting';
import {Game} from '../../../src/server/Game';
import {TestPlayer} from '../../TestPlayer';
import {testGame} from '../../TestGame';

describe('IceCapMelting', function() {
  let card: IceCapMelting;
  let player: TestPlayer;
  let game: Game;

  beforeEach(function() {
    card = new IceCapMelting();
    [game, player] = testGame(2);
  });

  it('Can not play', function() {
    expect(player.simpleCanPlay(card)).is.not.true;
  });

  it('Should play', function() {
    setTemperature(game, 2);
    expect(player.simpleCanPlay(card)).is.true;

    card.play(player);
    expect(game.deferredActions).has.lengthOf(1);
  });
});
