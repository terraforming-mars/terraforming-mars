import {Game} from '../../../src/server/Game';
import {runAllActions, testGameOptions} from '../../TestingUtils';
import {TestPlayer} from '../../TestPlayer';
import {LunarPlanningOffice} from '../../../src/server/cards/moon/LunarPlanningOffice';
import {expect} from 'chai';
import {MareNectarisMine} from '../../../src/server/cards/moon/MareNectarisMine';
import {MareImbriumMine} from '../../../src/server/cards/moon/MareImbriumMine';
import {MicroMills} from '../../../src/server/cards/base/MicroMills';
import {RoboticWorkforce} from '../../../src/server/cards/base/RoboticWorkforce';
import {CardName} from '../../../src/common/cards/CardName';

describe('LunarPlanningOffice', () => {
  let game: Game;
  let player: TestPlayer;
  let card: LunarPlanningOffice;

  beforeEach(() => {
    player = TestPlayer.BLUE.newPlayer();
    game = Game.newInstance('gameid', [player], player, testGameOptions({moonExpansion: true}));
    card = new LunarPlanningOffice();
    player.popWaitingFor(); // Removing SelectInitialCards.
  });

  it('play', () => {
    player.steel = 0;
    player.cardsInHand = [];

    // Prime the deck for a determinstic outcome.
    // Mare Imbrium is expected out first.
    game.dealer.deck.push(new RoboticWorkforce());
    game.dealer.deck.push(new MareNectarisMine());
    game.dealer.deck.push(new MicroMills());
    game.dealer.deck.push(new MareImbriumMine());
    game.dealer.discarded = [];

    expect(card.play(player)).is.undefined;
    runAllActions(game);

    expect(player.steel).eq(6);

    expect(player.popWaitingFor()).is.undefined;
    expect(player.cardsInHand.map((c) => c.name)).has.members([CardName.MARE_NECTARIS_MINE, CardName.MARE_IMBRIUM_MINE]);
    expect(game.dealer.discarded.map((c) => c.name)).has.members([CardName.MICRO_MILLS]);

    // Robotic Workforce is at the top of the deck.
    expect(game.dealer.dealCard(game).name).eq(CardName.ROBOTIC_WORKFORCE);
  });
});

