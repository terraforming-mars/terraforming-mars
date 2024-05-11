import {expect} from 'chai';
import {ExperiencedMartians} from '../../../src/server/cards/pathfinders/ExperiencedMartians';
import {TestPlayer} from '../../TestPlayer';
import {testGame} from '../../TestGame';
import {Units} from '../../../src/common/Units';
import {Turmoil} from '../../../src/server/turmoil/Turmoil';
import {IGame} from '../../../src/server/IGame';
import {Tag} from '../../../src/common/cards/Tag';
import {PartyName} from '../../../src/common/turmoil/PartyName';
import {SendDelegateToArea} from '../../../src/server/deferredActions/SendDelegateToArea';
import {SelectParty} from '../../../src/server/inputs/SelectParty';
import {cast, fakeCard} from '../../TestingUtils';
import {CardName} from '../../../src/common/cards/CardName';

describe('ExperiencedMartians', function() {
  let card: ExperiencedMartians;
  let game: IGame;
  let player: TestPlayer;
  let turmoil: Turmoil;

  beforeEach(function() {
    card = new ExperiencedMartians();
    [game, player] = testGame(1, {turmoilExtension: true, pathfindersExpansion: true});
    turmoil = game.turmoil!;
  });

  it('play', function() {
    const a = fakeCard({name: 'A' as CardName, tags: [Tag.MARS]});
    const b = fakeCard({name: 'B' as CardName, tags: []});
    const c = fakeCard({name: 'C' as CardName, tags: [Tag.MARS]});
    const d = fakeCard({name: 'D' as CardName, tags: [Tag.BUILDING]});
    game.projectDeck.drawPile.push(a, b, c, d);

    card.play(player);

    expect(player.cardsInHand).has.members([a, c]);
    expect(player.production.asUnits()).deep.eq(Units.of({megacredits: 2}));

    expect(turmoil.getAvailableDelegateCount(player)).eq(7);

    expect(game.deferredActions.length).eq(1);

    const marsFirst = turmoil.getPartyByName(PartyName.MARS);

    expect(turmoil.getAvailableDelegateCount(player)).eq(7);
    expect(marsFirst.delegates.get(player)).eq(0);

    const action = cast(game.deferredActions.pop(), SendDelegateToArea);
    const options = cast(action.execute(), SelectParty);
    options.cb(marsFirst.name);

    expect(turmoil.getAvailableDelegateCount(player)).eq(6);
    expect(marsFirst.delegates.get(player)).eq(1);
  });
});
