import {expect} from 'chai';
import {AirRaid} from '../../../src/server/cards/colonies/AirRaid';
import {Dirigibles} from '../../../src/server/cards/venusNext/Dirigibles';
import {StormCraftIncorporated} from '../../../src/server/cards/colonies/StormCraftIncorporated';
import {SelectCard} from '../../../src/server/inputs/SelectCard';
import {ICard} from '../../../src/server/cards/ICard';
import {OrOptions} from '../../../src/server/inputs/OrOptions';
import {TestPlayer} from '../../TestPlayer';
import {cast} from '../../TestingUtils';
import {testGame} from '../../TestGame';

describe('AirRaid', () => {
  let card: AirRaid;
  let player: TestPlayer;
  let player2: TestPlayer;
  let stormcraftIncorporated: StormCraftIncorporated;

  beforeEach(() => {
    card = new AirRaid();
    [/* game */, player, player2] = testGame(3);

    stormcraftIncorporated = new StormCraftIncorporated();
    player.corporations.push(stormcraftIncorporated);
  });

  it('Can not play', () => {
    expect(card.canPlay(player)).is.not.true;
  });

  it('Should play - multiple targets', () => {
    player.addResourceTo(stormcraftIncorporated);
    expect(card.canPlay(player)).is.true;

    const otherCardWithFloater = new Dirigibles();
    player.playedCards.push(otherCardWithFloater);
    player.addResourceTo(otherCardWithFloater);
    player2.megaCredits = 4;

    card.play(player);
    const option1 = cast(player.game.deferredActions.pop()!.execute(), OrOptions);
    const option2 = cast(player.game.deferredActions.pop()!.execute(), SelectCard<ICard>);

    option1.options[0].cb();
    expect(player2.megaCredits).to.eq(0);
    expect(player.megaCredits).to.eq(4);

    option2.cb([stormcraftIncorporated]);
    expect(stormcraftIncorporated.resourceCount).to.eq(0);
  });

  it('Should play - single target for floater removal and MC removal', () => {
    player.addResourceTo(stormcraftIncorporated);
    expect(card.canPlay(player)).is.true;

    player2.megaCredits = 4;
    card.play(player);

    const option = cast(player.game.deferredActions.pop()!.execute(), OrOptions); // Steal money
    expect(option.options).has.lengthOf(2);
    option.options[0].cb();
    player.game.deferredActions.pop()!.execute(); // Remove floater

    expect(stormcraftIncorporated.resourceCount).to.eq(0);
    expect(player2.megaCredits).to.eq(0);
    expect(player.megaCredits).to.eq(4);
  });
});
