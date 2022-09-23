import {expect} from 'chai';
import {cast, fakeCard, runAllActions} from '../TestingUtils';
import {Game} from '../../src/server/Game';
import {CommunicationBoom} from '../../src/server/turmoil/globalEvents/CommunicationBoom';
import {Kelvinists} from '../../src/server/turmoil/parties/Kelvinists';
import {Turmoil} from '../../src/server/turmoil/Turmoil';
import {TestPlayer} from '../TestPlayer';
import {CardName} from '../../src/common/cards/CardName';
import {CardResource} from '../../src/common/CardResource';
import {AndOptions} from '../../src/server/inputs/AndOptions';

describe('CommunicationBoom', function() {
  it('resolve play', function() {
    const card = new CommunicationBoom();
    const player = TestPlayer.BLUE.newPlayer();
    const player2 = TestPlayer.RED.newPlayer();
    const game = Game.newInstance('gameid', [player, player2], player);
    const turmoil = Turmoil.newInstance(game);

    const a = fakeCard({name: 'A' as CardName, resourceType: CardResource.MICROBE});
    const b = fakeCard({name: 'B' as CardName, resourceType: CardResource.DATA});
    const c = fakeCard({name: 'C' as CardName, resourceType: CardResource.MICROBE});
    const d = fakeCard({name: 'D' as CardName, resourceType: CardResource.DATA});
    player.playedCards = [a, b, c, d];

    const e = fakeCard({name: 'E' as CardName, resourceType: CardResource.DATA});
    const f = fakeCard({name: 'F' as CardName, resourceType: CardResource.DATA});
    player2.playedCards = [e, f];

    player.megaCredits = 8;
    player2.megaCredits = 12;

    turmoil.initGlobalEvent(game);
    turmoil.chairman = player2.id;
    turmoil.dominantParty = new Kelvinists();
    turmoil.dominantParty.partyLeader = player2.id;
    turmoil.dominantParty.delegates.push(player.id);
    turmoil.dominantParty.delegates.push(player2.id);
    turmoil.dominantParty.delegates.push(player2.id);

    card.resolve(game, turmoil);

    expect(player.megaCredits).eq(0);
    expect(a.resourceCount).eq(0);
    expect(b.resourceCount).eq(2);
    expect(c.resourceCount).eq(0);
    expect(d.resourceCount).eq(2);

    expect(player2.megaCredits).eq(2);
    expect(e.resourceCount).eq(2);
    expect(f.resourceCount).eq(2);

    player.popWaitingFor();
    player2.popWaitingFor();

    runAllActions(game);

    // This doesn't test that the deferred action limits counts. Does it need it? Possibly. _possibly._
    // Or replace AndOptions with some subclass.
    //
    // In the meantime, it also works because the AndOptions in AddResourcesToCards will reject
    // the wrong amount.
    const playerOptions = cast(player.getWaitingFor(), AndOptions);
    expect(playerOptions.options).has.length(2);
    expect(playerOptions.options[0].title).contains(b.name);
    playerOptions.options[0].cb(1);
    playerOptions.cb();
    expect(b.resourceCount).eq(3);

    runAllActions(game);

    const playerOptions2 = cast(player2.getWaitingFor(), AndOptions);
    expect(playerOptions2.options).has.length(2);
    expect(playerOptions2.options[0].title).contains(e.name);
    playerOptions2.options[0].cb(3);
    playerOptions2.cb();
    expect(e.resourceCount).eq(5);
  });
});
