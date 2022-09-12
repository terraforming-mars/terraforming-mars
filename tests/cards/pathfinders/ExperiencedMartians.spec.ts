import {expect} from 'chai';
import {ExperiencedMartians} from '../../../src/server/cards/pathfinders/ExperiencedMartians';
import {TestPlayer} from '../../TestPlayer';
import {getTestPlayer, newTestGame} from '../../TestGame';
import {Units} from '../../../src/common/Units';
import {Turmoil} from '../../../src/server/turmoil/Turmoil';
import {Game} from '../../../src/server/Game';
import {Tag} from '../../../src/common/cards/Tag';
import {PartyName} from '../../../src/common/turmoil/PartyName';
import {SendDelegateToArea} from '../../../src/server/deferredActions/SendDelegateToArea';
import {SelectPartyToSendDelegate} from '../../../src/server/inputs/SelectPartyToSendDelegate';
import {cast, fakeCard} from '../../TestingUtils';
import {CardName} from '../../../src/common/cards/CardName';

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
    const a = fakeCard({name: 'A' as CardName, tags: [Tag.MARS]});
    const b = fakeCard({name: 'B' as CardName, tags: []});
    const c = fakeCard({name: 'C' as CardName, tags: [Tag.MARS]});
    const d = fakeCard({name: 'D' as CardName, tags: [Tag.BUILDING]});
    game.projectDeck.drawPile.push(a, b, c, d);

    card.play(player);

    expect(player.cardsInHand).has.members([a, c]);
    expect(player.production.asUnits()).deep.eq(Units.of({megacredits: 2}));

    expect(turmoil.getAvailableDelegateCount(player.id, 'reserve')).eq(6);

    expect(game.deferredActions.length).eq(1);

    const marsFirst = turmoil.getPartyByName(PartyName.MARS)!;

    expect(turmoil.getAvailableDelegateCount(player.id, 'reserve')).eq(6);
    expect(marsFirst.getDelegates(player.id)).eq(0);

    const action = cast(game.deferredActions.pop(), SendDelegateToArea);
    const options = cast(action.execute(), SelectPartyToSendDelegate);
    options.cb(marsFirst.name);

    expect(turmoil.getAvailableDelegateCount(player.id, 'reserve')).eq(5);
    expect(marsFirst.getDelegates(player.id)).eq(1);
  });
});
