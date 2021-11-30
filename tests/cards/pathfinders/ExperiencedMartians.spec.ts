import {expect} from 'chai';
import {ExperiencedMartians} from '../../../src/cards/pathfinders/ExperiencedMartians';
import {TestPlayer} from '../../TestPlayer';
import {getTestPlayer, newTestGame} from '../../TestGame';
import {Units} from '../../../src/Units';
import {Turmoil} from '../../../src/turmoil/Turmoil';
import {Game} from '../../../src/Game';
import {Tags} from '../../../src/cards/Tags';
import {PartyName} from '../../../src/turmoil/parties/PartyName';
import {SendDelegateToArea} from '../../../src/deferredActions/SendDelegateToArea';
import {SelectPartyToSendDelegate} from '../../../src/inputs/SelectPartyToSendDelegate';
import {TestingUtils} from '../../TestingUtils';
import {CardName} from '../../../src/CardName';

describe('ExperiencedMartians', function() {
  let card: ExperiencedMartians;
  let game: Game;
  let player: TestPlayer;
  let turmoil: Turmoil;

  beforeEach(function() {
    card = new ExperiencedMartians();
    game = newTestGame(1, {turmoilExtension: true, pathfindersExpansion: true});
    player = getTestPlayer(game, 0);
    turmoil = game.turmoil!;
  });

  it('play', function() {
    const a = TestingUtils.fakeCard({name: 'A' as CardName, tags: [Tags.MARS]});
    const b = TestingUtils.fakeCard({name: 'B' as CardName, tags: []});
    const c = TestingUtils.fakeCard({name: 'C' as CardName, tags: [Tags.MARS]});
    const d = TestingUtils.fakeCard({name: 'D' as CardName, tags: [Tags.BUILDING]});
    game.dealer.deck.push(a, b, c, d);

    card.play(player);

    expect(player.cardsInHand).has.members([a, c]);
    expect(player.getProductionForTest()).deep.eq(Units.of({megacredits: 2}));

    expect(turmoil.getAvailableDelegateCount(player.id, 'reserve')).eq(6);

    expect(game.deferredActions.length).eq(1);

    const marsFirst = turmoil.getPartyByName(PartyName.MARS)!;

    expect(turmoil.getAvailableDelegateCount(player.id, 'reserve')).eq(6);
    expect(marsFirst.getDelegates(player.id)).eq(0);

    const action = game.deferredActions.pop()!;
    expect(action).instanceOf(SendDelegateToArea);
    const options = action.execute()! as SelectPartyToSendDelegate;
    options.cb(marsFirst.name);

    expect(turmoil.getAvailableDelegateCount(player.id, 'reserve')).eq(5);
    expect(marsFirst.getDelegates(player.id)).eq(1);
  });
});
