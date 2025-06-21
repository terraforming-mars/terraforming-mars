import {expect} from 'chai';
import {cast, churn} from '../../TestingUtils';
import {Ants} from '../../../src/server/cards/base/Ants';
import {Fish} from '../../../src/server/cards/base/Fish';
import {ICard} from '../../../src/server/cards/ICard';
import {MoholeLake} from '../../../src/server/cards/promo/MoholeLake';
import {SelectCard} from '../../../src/server/inputs/SelectCard';
import {SelectSpace} from '../../../src/server/inputs/SelectSpace';
import {TestPlayer} from '../../TestPlayer';
import {testGame} from '../../TestGame';

describe('MoholeLake', () => {
  let card: MoholeLake;
  let player: TestPlayer;

  beforeEach(() => {
    card = new MoholeLake();
    [/* game */, player] = testGame(2);
  });

  it('Can play', () => {
    card.play(player);

    expect(player.game.deferredActions).has.lengthOf(1);
    const selectSpace = cast(player.game.deferredActions.peek()!.execute(), SelectSpace);
    selectSpace.cb(selectSpace.spaces[0]);

    expect(player.game.getTemperature()).to.eq(-28);
    expect(player.game.board.getOceanSpaces()).has.length(1);
    expect(player.getTerraformRating()).to.eq(22);
    expect(player.plants).to.eq(3);
  });

  it('Can act - no target', () => {
    expect(card.canAct()).is.true;
    expect(churn(card.action(player), player)).is.undefined;
  });

  it('Can act - single target', () => {
    const fish = new Fish();
    player.playedCards.push(fish);

    card.play(player);
    expect(card.canAct()).is.true;
    card.action(player);
    expect(fish.resourceCount).to.eq(1);
  });

  it('Can act - multiple targets', () => {
    const fish = new Fish();
    const ants = new Ants();
    player.playedCards.push(fish, ants);

    card.play(player);
    expect(card.canAct()).is.true;
    const action = cast(card.action(player), SelectCard<ICard>);

    action.cb([ants]);
    expect(ants.resourceCount).to.eq(1);
  });
});
