import {expect} from 'chai';
import {BannedDelegate} from '../../../src/cards/turmoil/BannedDelegate';
import {Game} from '../../../src/Game';
import {OrOptions} from '../../../src/inputs/OrOptions';
import {SelectDelegate} from '../../../src/inputs/SelectDelegate';
import {Player} from '../../../src/Player';
import {PartyName} from '../../../src/turmoil/parties/PartyName';
import {Turmoil} from '../../../src/turmoil/Turmoil';
import {TestingUtils} from '../../TestingUtils';
import {TestPlayers} from '../../TestPlayers';

describe('Banned Delegate', function() {
  let card : BannedDelegate; let player : Player; let player2 : Player; let game : Game; let turmoil: Turmoil;

  beforeEach(function() {
    card = new BannedDelegate();
    player = TestPlayers.BLUE.newPlayer();
    player2 = TestPlayers.RED.newPlayer();

    const gameOptions = TestingUtils.setCustomGameOptions();
    game = Game.newInstance('foobar', [player, player2], player, gameOptions);
    turmoil = game.turmoil!;
  });

  it('Can\'t play', function() {
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

    if (result instanceof SelectDelegate) {
      const selectDelegate = result as SelectDelegate;
      selectDelegate.cb(result.players[0]);
    } else {
      const orOptions = result as OrOptions;
      orOptions.options.forEach((option) => option.cb((option as SelectDelegate).players[0]));
    }

    expect(greens.delegates).has.lengthOf(initialDelegatesCount - 1);
  });
});
