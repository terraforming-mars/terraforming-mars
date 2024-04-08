import {expect} from 'chai';
import {CulturalMetropolis} from '../../../src/server/cards/turmoil/CulturalMetropolis';
import {SendDelegateToArea} from '../../../src/server/deferredActions/SendDelegateToArea';
import {Game} from '../../../src/server/Game';
import {Resource} from '../../../src/common/Resource';
import {PartyName} from '../../../src/common/turmoil/PartyName';
import {Turmoil} from '../../../src/server/turmoil/Turmoil';
import {cast} from '../../TestingUtils';
import {TestPlayer} from '../../TestPlayer';
import {TileType} from '../../../src/common/TileType';

describe('Cultural Metropolis', function() {
  let card: CulturalMetropolis;
  let player: TestPlayer;
  let player2: TestPlayer;
  let game: Game;
  let turmoil: Turmoil;

  beforeEach(function() {
    card = new CulturalMetropolis();
    player = TestPlayer.BLUE.newPlayer();
    player2 = TestPlayer.RED.newPlayer();

    game = Game.newInstance('gameid', [player, player2], player, {turmoilExtension: true});
    turmoil = game.turmoil!;
  });

  it('Can not play without energy production', function() {
    turmoil.sendDelegateToParty(player, PartyName.UNITY, game);
    turmoil.sendDelegateToParty(player, PartyName.UNITY, game);
    expect(card.canPlay(player)).is.not.true;
  });


  it('Can not play without two delegate in unity or unity ruling', function() {
    player.production.add(Resource.ENERGY, 1);
    expect(card.canPlay(player)).is.not.true;
  });

  it('Can not play without 2 delegates available', function() {
    player.production.add(Resource.ENERGY, 1);
    turmoil.sendDelegateToParty(player, PartyName.UNITY, game);
    turmoil.sendDelegateToParty(player, PartyName.UNITY, game);
    while (turmoil.getAvailableDelegateCount(player) > 2) {
      turmoil.sendDelegateToParty(player, PartyName.REDS, game);
    }
    expect(turmoil.getAvailableDelegateCount(player)).to.equal(2);
    expect(card.canPlay(player)).is.true;
    turmoil.sendDelegateToParty(player, PartyName.REDS, game);
    expect(card.canPlay(player)).is.not.true;
  });

  it('Can not play without an available city space', () => {
    player.production.add(Resource.ENERGY, 1);
    turmoil.sendDelegateToParty(player, PartyName.UNITY, game);
    turmoil.sendDelegateToParty(player, PartyName.UNITY, game);

    const availableCitySpaces = [...game.board.getAvailableSpacesForCity(player)];
    const savedSpace = availableCitySpaces.pop()!;
    for (const space of availableCitySpaces) {
      game.simpleAddTile(player, space, {tileType: TileType.GREENERY});
    }

    expect(card.canPlay(player)).is.true;

    game.simpleAddTile(player, savedSpace, {tileType: TileType.GREENERY});

    expect(card.canPlay(player)).is.false;
  });

  it('Should play', function() {
    const unity = turmoil.getPartyByName(PartyName.UNITY);
    const startingUnityDelegateCount = unity.delegates.size;

    player.production.add(Resource.ENERGY, 1);
    turmoil.sendDelegateToParty(player, PartyName.UNITY, game);
    turmoil.sendDelegateToParty(player, PartyName.UNITY, game);

    expect(unity.delegates.size).eq(startingUnityDelegateCount + 2);
    expect(turmoil.getAvailableDelegateCount(player)).to.equal(5);
    expect(card.canPlay(player)).is.true;

    card.play(player);
    expect(game.deferredActions).has.lengthOf(2);
    player.game.deferredActions.pop(); // Pop out the city placement deferred action
    const action = cast(player.game.deferredActions.pop(), SendDelegateToArea);
    const options = action.execute();
    options!.cb(PartyName.UNITY);

    expect(player.production.energy).to.eq(0);
    expect(player.production.megacredits).to.eq(3);
    expect(unity.delegates.size).eq(startingUnityDelegateCount + 4);
  });
});
