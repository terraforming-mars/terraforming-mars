import {expect} from 'chai';
import {testGame} from '../../TestGame';
import {ArcticAlgae} from '../../../src/server/cards/base/ArcticAlgae';
import {IGame} from '../../../src/server/IGame';
import {addOcean, runNextAction, setTemperature} from '../../TestingUtils';
import {TestPlayer} from '../../TestPlayer';

describe('ArcticAlgae', function() {
  let card: ArcticAlgae;
  let player: TestPlayer;
  let player2: TestPlayer;
  let game: IGame;

  beforeEach(function() {
    card = new ArcticAlgae();
    [game, player, player2] = testGame(2);
  });

  it('Can not play', function() {
    setTemperature(game, -10);
    expect(card.canPlay(player)).is.not.true;
  });

  it('Should play', function() {
    card.play(player);
    expect(player.plants).to.eq(1);
    player.playedCards.push(card);

    addOcean(player2);
    runNextAction(game);
    expect(player.plants).to.eq(3);
  });
});
