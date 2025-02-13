import {expect} from 'chai';
import {Comet} from '../../../src/server/cards/base/Comet';
import {IGame} from '../../../src/server/IGame';
import {cast, maxOutOceans} from '../../TestingUtils';
import {SelectSpace} from '../../../src/server/inputs/SelectSpace';
import {OrOptions} from '../../../src/server/inputs/OrOptions';
import {TestPlayer} from '../../TestPlayer';
import {testGame} from '../../TestingUtils';

describe('Comet', () => {
  let card: Comet;
  let player: TestPlayer;
  let player2: TestPlayer;
  let player3: TestPlayer;
  let game: IGame;

  beforeEach(() => {
    card = new Comet();
    [game, player, player2, player3] = testGame(3);
  });

  it('Should play', () => {
    player2.plants = 2;
    player3.plants = 4;

    card.play(player);
    expect(game.getTemperature()).to.eq(-28);
    expect(game.deferredActions).has.lengthOf(2);

    const selectSpace = cast(game.deferredActions.pop()!.execute(), SelectSpace);
    selectSpace.cb(selectSpace.spaces[0]);
    expect(player.getTerraformRating()).to.eq(22);

    const orOptions = cast(game.deferredActions.pop()!.execute(), OrOptions);
    orOptions.options[0].cb();
    expect(player2.plants).to.eq(0);
  });

  it('Provides no options if there is nothing to confirm', () => {
    maxOutOceans(player);
    player.plants = 8;

    card.play(player);
    const input = game.deferredActions.peek()!.execute();
    expect(input).is.undefined;

    expect(player.plants).to.eq(8); // self plants are not removed
    expect(game.getTemperature()).to.eq(-28);
  });

  it('Works fine in solo mode', () => {
    testGame(1);
    player.plants = 8;

    cast(card.play(player), undefined);
    expect(player.plants).to.eq(8);
  });
});
