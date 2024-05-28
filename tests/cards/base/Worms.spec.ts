import {expect} from 'chai';
import {Worms} from '../../../src/server/cards/base/Worms';
import {IGame} from '../../../src/server/IGame';
import {TestPlayer} from '../../TestPlayer';
import {Tardigrades} from '../../../src/server/cards/base/Tardigrades';
import {setOxygenLevel} from '../../TestingUtils';
import {testGame} from '../../TestGame';

describe('Worms', function() {
  let card: Worms;
  let player: TestPlayer;
  let game: IGame;

  beforeEach(function() {
    card = new Worms();
    [game, player] = testGame(2);
  });

  it('Can not play', function() {
    setOxygenLevel(game, 3);
    expect(card.canPlay(player)).is.not.true;
  });

  it('Should play', function() {
    setOxygenLevel(game, 4);
    expect(card.canPlay(player)).is.true;
    const tardigrades = new Tardigrades();
    player.playedCards.push(tardigrades);

    card.play(player);
    expect(player.production.plants).to.eq(1);
  });
});
