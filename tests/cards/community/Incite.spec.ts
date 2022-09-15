import {expect} from 'chai';
import {Incite} from '../../../src/server/cards/community/Incite';
import {EventAnalysts} from '../../../src/server/cards/turmoil/EventAnalysts';
import {Game} from '../../../src/server/Game';
import {SelectPartyToSendDelegate} from '../../../src/server/inputs/SelectPartyToSendDelegate';
import {PartyName} from '../../../src/common/turmoil/PartyName';
import {cast, testGameOptions} from '../../TestingUtils';
import {TestPlayer} from '../../TestPlayer';

describe('Incite', function() {
  let card: Incite;
  let player: TestPlayer;
  let game: Game;

  beforeEach(function() {
    card = new Incite();
    player = TestPlayer.BLUE.newPlayer();

    game = Game.newInstance('gameid', [player], player, testGameOptions({turmoilExtension: true}));

    card.play(player);
    player.setCorporationForTest(card);
  });

  it('Starts with +1 influence', function() {
    expect(game.turmoil!.getPlayerInfluence(player)).to.eq(1);
  });

  it('Works with Event Analysts', function() {
    const eventAnalysts = new EventAnalysts();
    eventAnalysts.play(player);
    expect(game.turmoil!.getPlayerInfluence(player)).to.eq(2);
  });

  it('Can perform initial action', function() {
    card.initialAction(player);
    expect(game.deferredActions).has.lengthOf(1);

    const sendDelegate = cast(game.deferredActions.peek()!.execute(), SelectPartyToSendDelegate);
    sendDelegate.cb(PartyName.MARS);

    const marsFirst = game.turmoil!.getPartyByName(PartyName.MARS);
    expect(marsFirst!.delegates.filter((d) => d === player.id)).has.lengthOf(2);
  });
});
