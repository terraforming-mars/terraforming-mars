import {expect} from 'chai';
import {BannedDelegate} from '../../../src/server/cards/turmoil/BannedDelegate';
import {Game} from '../../../src/server/Game';
import {OrOptions} from '../../../src/server/inputs/OrOptions';
import {SelectDelegate} from '../../../src/server/inputs/SelectDelegate';
import {Player} from '../../../src/server/Player';
import {PartyName} from '../../../src/common/turmoil/PartyName';
import {Turmoil} from '../../../src/server/turmoil/Turmoil';
import {cast, testGameOptions} from '../../TestingUtils';
import {TestPlayer} from '../../TestPlayer';

describe('Banned Delegate', function() {
  let card: BannedDelegate;
  let player: Player;
  let player2: Player;
  let game: Game;
  let turmoil: Turmoil;

  beforeEach(function() {
    card = new BannedDelegate();
    player = TestPlayer.BLUE.newPlayer();
    player2 = TestPlayer.RED.newPlayer();

    game = Game.newInstance('gameid', [player, player2], player, testGameOptions({turmoilExtension: true}));
    turmoil = game.turmoil!;
  });

  it('Cannot play', function() {
    turmoil.chairman = player2.id;
    expect(player.canPlayIgnoringCost(card)).is.not.true;
  });

  it('Should play', function() {
    turmoil.chairman = player.id;
    expect(player.canPlayIgnoringCost(card)).is.true;

    const greens = turmoil.getPartyByName(PartyName.GREENS)!;
    turmoil.sendDelegateToParty(player.id, PartyName.GREENS, game);
    turmoil.sendDelegateToParty(player2.id, PartyName.GREENS, game);
    const initialDelegatesCount = greens.delegates.length;

    const result = card.play(player);

    // TODO(kberg): This returns both because the Global Event deck is always randomized.
    if (result instanceof SelectDelegate) {
      const selectDelegate = cast(result, SelectDelegate);
      selectDelegate.cb(result.players[0]);
    } else {
      const orOptions = cast(result, OrOptions);
      orOptions.options.forEach((option) => option.cb(cast(option, SelectDelegate).players[0]));
    }

    expect(greens.delegates).has.lengthOf(initialDelegatesCount - 1);
  });
});
