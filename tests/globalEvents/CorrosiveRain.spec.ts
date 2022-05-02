import {expect} from 'chai';
import {Game} from '../../src/Game';
import {CorrosiveRain} from '../../src/turmoil/globalEvents/CorrosiveRain';
import {Kelvinists} from '../../src/turmoil/parties/Kelvinists';
import {Turmoil} from '../../src/turmoil/Turmoil';
import {TestPlayers} from '../TestPlayers';
import {TestingUtils} from '../TestingUtils';
import {TestPlayer} from '../TestPlayer';
import {TitanShuttles} from '../../src/cards/colonies/TitanShuttles';
import {TitanAirScrapping} from '../../src/cards/colonies/TitanAirScrapping';
import {Birds} from '../../src/cards/base/Birds';
import {SelectCard} from '../../src/inputs/SelectCard';
import {OrOptions} from '../../src/inputs/OrOptions';
import {SelectOption} from '../../src/inputs/SelectOption';

describe('CorrosiveRain', function() {
  let card: CorrosiveRain;
  let player: TestPlayer;
  let player2: TestPlayer;
  let game: Game;
  let turmoil: Turmoil;

  beforeEach(() => {
    card = new CorrosiveRain();
    player = TestPlayers.BLUE.newPlayer();
    player2 = TestPlayers.RED.newPlayer();
    game = Game.newInstance('foobar', [player, player2], player, TestingUtils.setCustomGameOptions({turmoilExtension: true}));
    turmoil = game.turmoil!;
    player.popWaitingFor(); // To clear out the SelectInitialCards input.
  });

  it('resolve play', function() {
    turmoil.chairman = player2.id;
    turmoil.dominantParty = new Kelvinists();
    turmoil.dominantParty.partyLeader = player2.id;
    turmoil.dominantParty.delegates.push(player2.id);
    turmoil.dominantParty.delegates.push(player2.id);

    player.megaCredits = 15;
    player2.megaCredits = 15;

    card.resolve(game, turmoil);
    expect(game.deferredActions).has.lengthOf(2);
    TestingUtils.runAllActions(game);
    expect(game.deferredActions).has.lengthOf(0);
    expect(player2.cardsInHand).has.lengthOf(3);
    expect(player.cardsInHand).has.lengthOf(0);
    expect(player.megaCredits).to.eq(5);
    expect(player2.megaCredits).to.eq(5);
  });

  it('remove floaters', () => {
    const titanShuttles = new TitanShuttles();
    const titanAirScrapping = new TitanAirScrapping();
    const birds = new Birds();
    player.playedCards = [titanShuttles, titanAirScrapping, birds];

    titanShuttles.resourceCount = 3;
    titanAirScrapping.resourceCount = 1;
    birds.resourceCount = 3;

    player.megaCredits = 3;

    card.resolve(game, turmoil);
    TestingUtils.runAllActions(game);
    const orOptions = TestingUtils.cast(player.popWaitingFor(), OrOptions);
    const reduce10MC = TestingUtils.cast(orOptions.options[0], SelectOption);
    const removeFloaters = TestingUtils.cast(orOptions.options[1], SelectCard);

    expect(player.megaCredits).eq(3);
    reduce10MC.cb();
    expect(player.megaCredits).eq(0);

    expect(titanShuttles.resourceCount).eq(3);
    expect(removeFloaters.cards).has.members([titanShuttles]);
    removeFloaters.cb([titanShuttles]);
    expect(titanShuttles.resourceCount).eq(1);
  });
});
