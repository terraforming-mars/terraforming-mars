import {expect} from 'chai';
import {AirRaid} from '../../../src/server/cards/colonies/AirRaid';
import {Dirigibles} from '../../../src/server/cards/venusNext/Dirigibles';
import {StormCraftIncorporated} from '../../../src/server/cards/colonies/StormCraftIncorporated';
import {Game} from '../../../src/server/Game';
import {SelectCard} from '../../../src/server/inputs/SelectCard';
import {ICard} from '../../../src/server/cards/ICard';
import {OrOptions} from '../../../src/server/inputs/OrOptions';
import {TestPlayer} from '../../TestPlayer';
import {cast} from '../../TestingUtils';

describe('AirRaid', function() {
  let card: AirRaid;
  let player: TestPlayer;
  let player2: TestPlayer;
  let corpo: StormCraftIncorporated;

  beforeEach(function() {
    card = new AirRaid();
    player = TestPlayer.BLUE.newPlayer();
    player2 = TestPlayer.RED.newPlayer();
    Game.newInstance('gameid', [player, player2], player);

    corpo = new StormCraftIncorporated();
    player.setCorporationForTest(corpo);
  });

  it('Can not play', function() {
    expect(card.canPlay(player)).is.not.true;
  });

  it('Should play - multiple targets', function() {
    const player3 = TestPlayer.YELLOW.newPlayer();
    Game.newInstance('gameid', [player, player2, player3], player);
    player.addResourceTo(corpo);
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

    option2.cb([corpo]);
    expect(corpo.resourceCount).to.eq(0);
  });

  it('Should play - single target for floater removal and MC removal', function() {
    player.addResourceTo(corpo);
    expect(card.canPlay(player)).is.true;

    player2.megaCredits = 4;
    card.play(player);

    const option = cast(player.game.deferredActions.pop()!.execute(), OrOptions); // Steal money
    expect(option.options).has.lengthOf(2);
    option.options[0].cb();
    player.game.deferredActions.pop()!.execute(); // Remove floater

    expect(corpo.resourceCount).to.eq(0);
    expect(player2.megaCredits).to.eq(0);
    expect(player.megaCredits).to.eq(4);
  });
});
