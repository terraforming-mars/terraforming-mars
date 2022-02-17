import {expect} from 'chai';
import {CulturalMetropolis} from '../../../src/cards/turmoil/CulturalMetropolis';
import {PLAYER_DELEGATES_COUNT} from '../../../src/common/constants';
import {SendDelegateToArea} from '../../../src/deferredActions/SendDelegateToArea';
import {Game} from '../../../src/Game';
import {Player} from '../../../src/Player';
import {Resources} from '../../../src/common/Resources';
import {PartyName} from '../../../src/common/turmoil/PartyName';
import {Turmoil} from '../../../src/turmoil/Turmoil';
import {TestingUtils} from '../../TestingUtils';
import {TestPlayers} from '../../TestPlayers';

describe('Cultural Metropolis', function() {
  let card : CulturalMetropolis; let player : Player; let player2 : Player; let game : Game; let turmoil: Turmoil;

  beforeEach(function() {
    card = new CulturalMetropolis();
    player = TestPlayers.BLUE.newPlayer();
    player2 = TestPlayers.RED.newPlayer();

    const gameOptions = TestingUtils.setCustomGameOptions();
    game = Game.newInstance('foobar', [player, player2], player, gameOptions);
    turmoil = game.turmoil!;
  });

  it('Can\'t play without energy production', function() {
    turmoil.sendDelegateToParty(player.id, PartyName.UNITY, game, 'lobby');
    turmoil.sendDelegateToParty(player.id, PartyName.UNITY, game, 'reserve');
    expect(player.canPlayIgnoringCost(card)).is.not.true;
  });


  it('Can\'t play without two delegate in unity or unity ruling', function() {
    player.addProduction(Resources.ENERGY, 1);
    expect(player.canPlayIgnoringCost(card)).is.not.true;
  });

  it('Can\'t play without 2 delegates available', function() {
    player.addProduction(Resources.ENERGY, 1);
    turmoil.sendDelegateToParty(player.id, PartyName.UNITY, game, 'lobby');
    turmoil.sendDelegateToParty(player.id, PartyName.UNITY, game, 'reserve');
    for (let i = 0; i < PLAYER_DELEGATES_COUNT - 4; i++) {
      turmoil.sendDelegateToParty(player.id, PartyName.REDS, game, 'reserve');
    }
    expect(turmoil.getAvailableDelegateCount(player.id, 'reserve')).to.equal(2);
    expect(player.canPlayIgnoringCost(card)).is.true;
    turmoil.sendDelegateToParty(player.id, PartyName.REDS, game, 'reserve');
    expect(player.canPlayIgnoringCost(card)).is.not.true;
  });

  it('Should play', function() {
    const unity = turmoil.getPartyByName(PartyName.UNITY)!;
    const startingUnityDelegateCount = unity.delegates.length;

    player.addProduction(Resources.ENERGY, 1);
    turmoil.sendDelegateToParty(player.id, PartyName.UNITY, game, 'lobby');
    turmoil.sendDelegateToParty(player.id, PartyName.UNITY, game, 'reserve');

    expect(unity.delegates).has.lengthOf(startingUnityDelegateCount + 2);
    expect(turmoil.getAvailableDelegateCount(player.id, 'reserve')).to.equal(5);
    expect(player.canPlayIgnoringCost(card)).is.true;

    card.play(player);
    expect(game.deferredActions).has.lengthOf(2);
    player.game.deferredActions.pop(); // Pop out the city placement deferred action
    const action = player.game.deferredActions.pop() as SendDelegateToArea;
    const options = action.execute();
    options!.cb(PartyName.UNITY);

    expect(player.getProduction(Resources.ENERGY)).to.eq(0);
    expect(player.getProduction(Resources.MEGACREDITS)).to.eq(3);
    expect(unity.delegates).has.lengthOf(startingUnityDelegateCount + 4);
  });
});
