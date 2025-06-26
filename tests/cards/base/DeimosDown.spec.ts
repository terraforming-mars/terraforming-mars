import {expect} from 'chai';
import {cast} from '../../TestingUtils';
import {DeimosDown} from '../../../src/server/cards/base/DeimosDown';
import {IGame} from '../../../src/server/IGame';
import {OrOptions} from '../../../src/server/inputs/OrOptions';
import {TestPlayer} from '../../TestPlayer';
import {testGame} from '../../TestGame';

describe('DeimosDown', () => {
  let card: DeimosDown;
  let player: TestPlayer;
  let player2: TestPlayer;
  let game: IGame;

  beforeEach(() => {
    card = new DeimosDown();
    [game, player, player2] = testGame(2);
  });

  it('Should play', () => {
    player2.plants = 8;
    card.play(player);

    expect(game.deferredActions).has.lengthOf(1);
    const orOptions = cast(game.deferredActions.peek()!.execute(), OrOptions);
    orOptions.options[0].cb();

    expect(game.getTemperature()).to.eq(-24);
    expect(player.steel).to.eq(4);
    expect(player2.plants).to.eq(0);
  });

  it('Works fine in solo mode', () => {
    const [game, player] = testGame(1);

    player.plants = 15;
    card.play(player);

    expect(game.getTemperature()).to.eq(-24);
    expect(player.steel).to.eq(4);
    expect(player.plants).to.eq(15); // not removed
  });
});
