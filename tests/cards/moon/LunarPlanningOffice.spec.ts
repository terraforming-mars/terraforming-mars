import {Game} from '../../../src/Game';
import {Player} from '../../../src/Player';
import {TestingUtils} from '../../TestingUtils';
import {TestPlayers} from '../../TestPlayers';
import {LunarPlanningOffice} from '../../../src/cards/moon/LunarPlanningOffice';
import {expect} from 'chai';
import {MareNectarisMine} from '../../../src/cards/moon/MareNectarisMine';
import {MareImbriumMine} from '../../../src/cards/moon/MareImbriumMine';
import {MicroMills} from '../../../src/cards/base/MicroMills';
import {RoboticWorkforce} from '../../../src/cards/base/RoboticWorkforce';
import {CardName} from '../../../src/CardName';

const MOON_OPTIONS = TestingUtils.setCustomGameOptions({moonExpansion: true});

describe('LunarPlanningOffice', () => {
  let game: Game;
  let player: Player;
  let card: LunarPlanningOffice;

  beforeEach(() => {
    player = TestPlayers.BLUE.newPlayer();
    game = Game.newInstance('id', [player], player, MOON_OPTIONS);
    card = new LunarPlanningOffice();
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

    card.play(player);
    game.deferredActions.peek()!.execute();
    player.steel = 6;

    expect(player.cardsInHand.map((c) => c.name)).has.members([CardName.MARE_NECTARIS_MINE, CardName.MARE_IMBRIUM_MINE]);
    expect(game.dealer.discarded.map((c) => c.name)).has.members([CardName.MICRO_MILLS]);

    // Robotic Workforce is at the top of the deck.
    expect(game.dealer.dealCard(game).name).eq(CardName.ROBOTIC_WORKFORCE);
  });
});

