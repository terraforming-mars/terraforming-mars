import {expect} from 'chai';
import {setOxygenLevel} from '../../TestingUtils';
import {Insects} from '../../../src/server/cards/base/Insects';
import {Trees} from '../../../src/server/cards/base/Trees';
import {IGame} from '../../../src/server/IGame';
import {TestPlayer} from '../../TestPlayer';
import {testGame} from '../../TestGame';

describe('Insects', () => {
  let card: Insects;
  let player: TestPlayer;
  let game: IGame;

  beforeEach(() => {
    card = new Insects();
    [game, player] = testGame(2);
  });

  it('Can not play', () => {
    expect(card.canPlay(player)).is.not.true;
  });

  it('Should play', () => {
    setOxygenLevel(game, 6);
    expect(card.canPlay(player)).is.true;

    card.play(player);
    expect(player.production.plants).to.eq(0);

    player.playedCards.push(new Trees());
    card.play(player);
    expect(player.production.plants).to.eq(1);
  });
});
