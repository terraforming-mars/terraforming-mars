import {expect} from 'chai';
import {CulturalMetropolis} from '../../../src/server/cards/turmoil/CulturalMetropolis';
import {PLAYER_DELEGATES_COUNT} from '../../../src/common/constants';
import {SendDelegateToArea} from '../../../src/server/deferredActions/SendDelegateToArea';
import {Game} from '../../../src/server/Game';
import {Player} from '../../../src/server/Player';
import {Resources} from '../../../src/common/Resources';
import {PartyName} from '../../../src/common/turmoil/PartyName';
import {Turmoil} from '../../../src/server/turmoil/Turmoil';
import {testGameOptions} from '../../TestingUtils';
import {TestPlayer} from '../../TestPlayer';
import {TileType} from '../../../src/common/TileType';

describe('Cultural Metropolis', function() {
  let card: CulturalMetropolis;
  let player: Player;
  let player2: Player;
  let game: Game;
  let turmoil: Turmoil;

  beforeEach(function() {
    card = new CulturalMetropolis();
    player = TestPlayer.BLUE.newPlayer();
    player2 = TestPlayer.RED.newPlayer();

    game = Game.newInstance('gameid', [player, player2], player, testGameOptions({turmoilExtension: true}));
    turmoil = game.turmoil!;
  });

  it('Can not play without energy production', function() {
    turmoil.sendDelegateToParty(player.id, PartyName.UNITY, game, 'lobby');
    turmoil.sendDelegateToParty(player.id, PartyName.UNITY, game, 'reserve');
    expect(card.canPlay(player)).is.not.true;
  });


  it('Can not play without two delegate in unity or unity ruling', function() {
    player.production.add(Resources.ENERGY, 1);
    expect(card.canPlay(player)).is.not.true;
  });

  it('Can not play without 2 delegates available', function() {
    player.production.add(Resources.ENERGY, 1);
    turmoil.sendDelegateToParty(player.id, PartyName.UNITY, game, 'lobby');
    turmoil.sendDelegateToParty(player.id, PartyName.UNITY, game, 'reserve');
    for (let i = 0; i < PLAYER_DELEGATES_COUNT - 4; i++) {
      turmoil.sendDelegateToParty(player.id, PartyName.REDS, game, 'reserve');
    }
    expect(turmoil.getAvailableDelegateCount(player.id, 'reserve')).to.equal(2);
    expect(card.canPlay(player)).is.true;
    turmoil.sendDelegateToParty(player.id, PartyName.REDS, game, 'reserve');
    expect(card.canPlay(player)).is.not.true;
  });

  it('Can not play without an available city space', () => {
    player.production.add(Resources.ENERGY, 1);
    turmoil.sendDelegateToParty(player.id, PartyName.UNITY, game, 'lobby');
    turmoil.sendDelegateToParty(player.id, PartyName.UNITY, game, 'reserve');

    const availableCitySpaces = game.board.getAvailableSpacesForCity(player);
    const savedSpace = availableCitySpaces.pop()!;
    for (const space of availableCitySpaces) {
      game.simpleAddTile(player, space, {tileType: TileType.GREENERY});
    }

    expect(card.canPlay(player)).is.true;

    game.simpleAddTile(player, savedSpace, {tileType: TileType.GREENERY});

    expect(card.canPlay(player)).is.false;
  });

  it('Should play', function() {
    const unity = turmoil.getPartyByName(PartyName.UNITY)!;
    const startingUnityDelegateCount = unity.delegates.length;

    player.production.add(Resources.ENERGY, 1);
    turmoil.sendDelegateToParty(player.id, PartyName.UNITY, game, 'lobby');
    turmoil.sendDelegateToParty(player.id, PartyName.UNITY, game, 'reserve');

    expect(unity.delegates).has.lengthOf(startingUnityDelegateCount + 2);
    expect(turmoil.getAvailableDelegateCount(player.id, 'reserve')).to.equal(5);
    expect(card.canPlay(player)).is.true;

    card.play(player);
    expect(game.deferredActions).has.lengthOf(2);
    player.game.deferredActions.pop(); // Pop out the city placement deferred action
    const action = player.game.deferredActions.pop() as SendDelegateToArea;
    const options = action.execute();
    options!.cb(PartyName.UNITY);

    expect(player.production.energy).to.eq(0);
    expect(player.production.megacredits).to.eq(3);
    expect(unity.delegates).has.lengthOf(startingUnityDelegateCount + 4);
  });
});
