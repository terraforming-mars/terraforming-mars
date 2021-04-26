import {expect} from 'chai';
import {CulturalMetropolis} from '../../../src/cards/turmoil/CulturalMetropolis';
import {PLAYER_DELEGATES_COUNT} from '../../../src/constants';
import {Game} from '../../../src/Game';
import {Player} from '../../../src/Player';
import {Resources} from '../../../src/Resources';
import {PartyName} from '../../../src/turmoil/parties/PartyName';
import {Turmoil} from '../../../src/turmoil/Turmoil';
import {TestingUtils} from '../../TestingUtils';
import {TestPlayers} from '../../TestPlayers';

describe('Cultural Metropolis', function() {
  let card : CulturalMetropolis; let player : Player; let player2 : Player; let game : Game; let turmoil: Turmoil; ;

  beforeEach(function() {
    card = new CulturalMetropolis();
    player = TestPlayers.BLUE.newPlayer();
    player2 = TestPlayers.RED.newPlayer();

    const gameOptions = TestingUtils.setCustomGameOptions();
    game = Game.newInstance('foobar', [player, player2], player, gameOptions);
    turmoil = game.turmoil!;
  });

  it('Can\'t play without energy production', function() {
    expect(card.canPlay(player)).is.not.true;
  });

  it('Can\'t play without 2 delegates available', function() {
    const reds = turmoil.getPartyByName(PartyName.REDS)!;

    for (let i = 0; i < PLAYER_DELEGATES_COUNT - 1; i++) {
      reds.sendDelegate(player.id, game);
    }

    expect(card.canPlay(player)).is.not.true;
  });

  it('Should play', function() {
    player.addProduction(Resources.ENERGY, 1);
    const unity = turmoil.getPartyByName(PartyName.UNITY)!;
    unity.sendDelegate(player.id, game);
    unity.sendDelegate(player.id, game);
    expect(card.canPlay(player)).is.true;

    card.play(player);
    expect(player.getProduction(Resources.ENERGY)).to.eq(0);
    expect(player.getProduction(Resources.MEGACREDITS)).to.eq(3);
  });
});
