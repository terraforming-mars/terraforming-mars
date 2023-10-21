import {expect} from 'chai';
import {BannedDelegate} from '../../../src/server/cards/turmoil/BannedDelegate';
import {Game} from '../../../src/server/Game';
import {OrOptions} from '../../../src/server/inputs/OrOptions';
import {SelectDelegate} from '../../../src/server/inputs/SelectDelegate';
import {PartyName} from '../../../src/common/turmoil/PartyName';
import {Turmoil} from '../../../src/server/turmoil/Turmoil';
import {cast} from '../../TestingUtils';
import {TestPlayer} from '../../TestPlayer';

describe('Banned Delegate', function() {
  let card: BannedDelegate;
  let player: TestPlayer;
  let player2: TestPlayer;
  let game: Game;
  let turmoil: Turmoil;

  beforeEach(function() {
    card = new BannedDelegate();
    player = TestPlayer.BLUE.newPlayer();
    player2 = TestPlayer.RED.newPlayer();

    game = Game.newInstance('gameid', [player, player2], player, {turmoilExtension: true});
    turmoil = game.turmoil!;
  });

  it('Cannot play', function() {
    turmoil.chairman = player2.id;
    expect(player.simpleCanPlay(card)).is.not.true;
  });

  it('Should play', function() {
    turmoil.chairman = player.id;
    expect(player.simpleCanPlay(card)).is.true;

    const greens = turmoil.getPartyByName(PartyName.GREENS);
    turmoil.sendDelegateToParty(player.id, PartyName.GREENS, game);
    turmoil.sendDelegateToParty(player2.id, PartyName.GREENS, game);

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
    turmoil.chairman = player.id;
    expect(player.simpleCanPlay(card)).is.true;

    turmoil.sendDelegateToParty(player.id, PartyName.GREENS, game);
    turmoil.sendDelegateToParty(player.id, PartyName.GREENS, game);
    turmoil.sendDelegateToParty(player2.id, PartyName.GREENS, game);
    turmoil.sendDelegateToParty(player2.id, PartyName.GREENS, game);
    turmoil.sendDelegateToParty('NEUTRAL', PartyName.GREENS, game);
    turmoil.sendDelegateToParty('NEUTRAL', PartyName.GREENS, game);

    turmoil.sendDelegateToParty('NEUTRAL', PartyName.REDS, game);
    turmoil.sendDelegateToParty('NEUTRAL', PartyName.REDS, game);

    const orOptions = cast(card.play(player), OrOptions);
    const selectDelegate = cast(orOptions.options[0], SelectDelegate);
    expect(selectDelegate.players).has.members([player, player2, 'NEUTRAL']);
  });
});
