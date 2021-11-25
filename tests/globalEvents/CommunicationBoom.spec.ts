import {expect} from 'chai';
import {TestingUtils} from '../TestingUtils';
import {Game} from '../../src/Game';
import {CommunicationBoom} from '../../src/turmoil/globalEvents/CommunicationBoom';
import {Kelvinists} from '../../src/turmoil/parties/Kelvinists';
import {Turmoil} from '../../src/turmoil/Turmoil';
import {TestPlayers} from '../TestPlayers';
import {CardName} from '../../src/CardName';
import {ResourceType} from '../../src/ResourceType';
import {AndOptions} from '../../src/inputs/AndOptions';

describe('CommunicationBoom', function() {
  it('resolve play', function() {
    const card = new CommunicationBoom();
    const player = TestPlayers.BLUE.newPlayer();
    const player2 = TestPlayers.RED.newPlayer();
    const game = Game.newInstance('foobar', [player, player2], player);
    const turmoil = Turmoil.newInstance(game);

    const a = TestingUtils.fakeCard({name: 'A' as CardName, resourceType: ResourceType.MICROBE});
    const b = TestingUtils.fakeCard({name: 'B' as CardName, resourceType: ResourceType.DATA});
    const c = TestingUtils.fakeCard({name: 'C' as CardName, resourceType: ResourceType.MICROBE});
    const d = TestingUtils.fakeCard({name: 'D' as CardName, resourceType: ResourceType.DATA});
    player.playedCards = [a, b, c, d];

    const e = TestingUtils.fakeCard({name: 'E' as CardName, resourceType: ResourceType.DATA});
    const f = TestingUtils.fakeCard({name: 'F' as CardName, resourceType: ResourceType.DATA});
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

    (player as any).waitingFor = undefined;
    (player as any).waitingForCb = undefined;

    (player2 as any).waitingFor = undefined;
    (player2 as any).waitingForCb = undefined;

    TestingUtils.runAllActions(game);

    // This doesn't test that the deferred action limits counts. Does it need it? Possibly. _possibly._
    // Or replace AndOptions with some subclass.
    //
    // In the meantime, it also works because the AndOptions in AddResourcesToCards will reject
    // the wrong amount.
    expect(player.getWaitingFor()).instanceOf(AndOptions);
    const playerOptions = player.getWaitingFor() as AndOptions;
    expect(playerOptions.options).has.length(2);
    expect(playerOptions.options[0].title).contains(b.name);
    playerOptions.options[0].cb(1);
    playerOptions.cb();
    expect(b.resourceCount).eq(3);

    TestingUtils.runAllActions(game);

    expect(player.getWaitingFor()).instanceOf(AndOptions);
    const playerOptions2 = player2.getWaitingFor() as AndOptions;
    expect(playerOptions2.options).has.length(2);
    expect(playerOptions2.options[0].title).contains(e.name);
    playerOptions2.options[0].cb(3);
    playerOptions2.cb();
    expect(e.resourceCount).eq(5);
  });
});
