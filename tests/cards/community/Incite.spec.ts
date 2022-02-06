import {expect} from 'chai';
import {Incite} from '../../../src/cards/community/Incite';
import {EventAnalysts} from '../../../src/cards/turmoil/EventAnalysts';
import {Game} from '../../../src/Game';
import {SelectPartyToSendDelegate} from '../../../src/inputs/SelectPartyToSendDelegate';
import {Player} from '../../../src/Player';
import {PartyName} from '../../../src/common/turmoil/PartyName';
import {TestingUtils} from '../../TestingUtils';
import {TestPlayers} from '../../TestPlayers';

describe('Incite', function() {
  let card : Incite; let player : Player; let game : Game;

  beforeEach(function() {
    card = new Incite();
    player = TestPlayers.BLUE.newPlayer();

    const gameOptions = TestingUtils.setCustomGameOptions();
    game = Game.newInstance('foobar', [player], player, gameOptions);

    card.play(player);
    player.corporationCard = card;
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

    const sendDelegate = game.deferredActions.peek()!.execute() as SelectPartyToSendDelegate;
    sendDelegate.cb(PartyName.MARS);

    const marsFirst = game.turmoil!.getPartyByName(PartyName.MARS);
    expect(marsFirst!.delegates.filter((d) => d === player.id)).has.lengthOf(2);
  });
});
