import {expect} from 'chai';
import {BannedDelegate} from '../../../src/server/cards/turmoil/BannedDelegate';
import {IGame} from '../../../src/server/IGame';
import {OrOptions} from '../../../src/server/inputs/OrOptions';
import {SelectDelegate} from '../../../src/server/inputs/SelectDelegate';
import {PartyName} from '../../../src/common/turmoil/PartyName';
import {Turmoil} from '../../../src/server/turmoil/Turmoil';
import {cast} from '../../TestingUtils';
import {TestPlayer} from '../../TestPlayer';
import {testGame} from '../../TestingUtils';

describe('Banned Delegate', function() {
  let card: BannedDelegate;
  let player: TestPlayer;
  let player2: TestPlayer;
  let game: IGame;
  let turmoil: Turmoil;

  beforeEach(function() {
    card = new BannedDelegate();
    [game, player, player2] = testGame(2, {turmoilExtension: true});
    turmoil = game.turmoil!;
  });

  it('Cannot play', function() {
    turmoil.chairman = player2;
    expect(card.canPlay(player)).is.not.true;
  });

  it('Should play', function() {
    turmoil.chairman = player;
    expect(card.canPlay(player)).is.true;

    const greens = turmoil.getPartyByName(PartyName.GREENS);
    turmoil.sendDelegateToParty(player, PartyName.GREENS, game);
    turmoil.sendDelegateToParty(player2, PartyName.GREENS, game);

    // This card returns OrOptions, or SelectDelegate. It's
    // By putting 2 delegates in the Reds party, Reds is a second option.
    turmoil.sendDelegateToParty('NEUTRAL', PartyName.REDS, game);
    turmoil.sendDelegateToParty('NEUTRAL', PartyName.REDS, game);

    const initialDelegatesCount = greens.delegates.size;

    const orOptions = cast(card.play(player), OrOptions);
    orOptions.options.forEach((option) => option.cb(cast(option, SelectDelegate).players[0]));

    expect(greens.delegates.size).eq(initialDelegatesCount - 1);
  });

  it('Removes duplicates', function() {
    turmoil.chairman = player;
    expect(card.canPlay(player)).is.true;

    turmoil.sendDelegateToParty(player, PartyName.GREENS, game);
    turmoil.sendDelegateToParty(player, PartyName.GREENS, game);
    turmoil.sendDelegateToParty(player2, PartyName.GREENS, game);
    turmoil.sendDelegateToParty(player2, PartyName.GREENS, game);
    turmoil.sendDelegateToParty('NEUTRAL', PartyName.GREENS, game);
    turmoil.sendDelegateToParty('NEUTRAL', PartyName.GREENS, game);

    turmoil.sendDelegateToParty('NEUTRAL', PartyName.REDS, game);
    turmoil.sendDelegateToParty('NEUTRAL', PartyName.REDS, game);

    const orOptions = cast(card.play(player), OrOptions);
    const selectDelegate = cast(orOptions.options[0], SelectDelegate);
    expect(selectDelegate.players).has.members([player, player2, 'NEUTRAL']);
  });
});
