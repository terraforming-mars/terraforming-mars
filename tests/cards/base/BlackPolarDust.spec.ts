import {expect} from 'chai';
import {BlackPolarDust} from '../../../src/server/cards/base/BlackPolarDust';
import {IGame} from '../../../src/server/IGame';
import {cast, maxOutOceans} from '../../TestingUtils';
import {TestPlayer} from '../../TestPlayer';
import {Resource} from '../../../src/common/Resource';
import {SelectSpace} from '../../../src/server/inputs/SelectSpace';
import {testGame} from '../../TestGame';

describe('BlackPolarDust', () => {
  let card: BlackPolarDust;
  let player: TestPlayer;
  let game: IGame;

  beforeEach(() => {
    card = new BlackPolarDust();
    [game, player] = testGame(2);
  });

  it('Can not play', () => {
    player.production.add(Resource.MEGACREDITS, -4);
    expect(card.canPlay(player)).is.not.true;
  });

  it('Should play', () => {
    card.play(player);
    expect(player.production.megacredits).to.eq(-2);
    expect(player.production.heat).to.eq(3);

    expect(game.deferredActions).has.lengthOf(1);
    const selectSpace = cast(game.deferredActions.peek()!.execute(), SelectSpace);
    selectSpace.cb(selectSpace.spaces[0]);
    expect(player.getTerraformRating()).to.eq(21);
  });

  it('Cannot place ocean if no oceans left', () => {
    maxOutOceans(player);
    card.play(player);
  });
});
