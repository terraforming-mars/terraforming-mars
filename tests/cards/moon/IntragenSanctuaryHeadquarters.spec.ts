import {Game} from '../../../src/server/Game';
import {Player} from '../../../src/server/Player';
import {runAllActions, testGameOptions} from '../../TestingUtils';
import {TestPlayer} from '../../TestPlayer';
import {IntragenSanctuaryHeadquarters} from '../../../src/server/cards/moon/IntragenSanctuaryHeadquarters';
import {expect} from 'chai';
import {MicroMills} from '../../../src/server/cards/base/MicroMills';
import {MartianZoo} from '../../../src/server/cards/colonies/MartianZoo';

describe('IntragenSanctuaryHeadquarters', () => {
  let player: Player;
  let player2: Player;
  let card: IntragenSanctuaryHeadquarters;

  beforeEach(() => {
    player = TestPlayer.BLUE.newPlayer();
    player2 = TestPlayer.RED.newPlayer();
    Game.newInstance('gameid', [player, player2], player, testGameOptions({moonExpansion: true}));
    card = new IntragenSanctuaryHeadquarters();
  });

  it('on play', () => {
    expect(card.resourceCount).eq(0);
    card.play(player);
    runAllActions(player.game);
    expect(card.resourceCount).eq(1);
  });

  it('onCardPlayed', () => {
    expect(card.resourceCount).eq(0);

    // This can't reasonably be tested without setting up a research phase.
    // Game-play tests would help, as would making sure the initial set-up
    // gave the initial resource.
    card.onCardPlayed(player, new MicroMills());
    expect(card.resourceCount).eq(0);

    card.onCardPlayed(player, new MartianZoo());
    expect(card.resourceCount).eq(1);
  });

  it('victory points', () => {
    card.resourceCount = 0;
    expect(card.getVictoryPoints()).eq(0);

    card.resourceCount = 1;
    expect(card.getVictoryPoints()).eq(0);

    card.resourceCount = 2;
    expect(card.getVictoryPoints()).eq(1);

    card.resourceCount = 3;
    expect(card.getVictoryPoints()).eq(1);

    card.resourceCount = 4;
    expect(card.getVictoryPoints()).eq(2);
  });


  it('onCardPlayed by other player', () => {
    expect(card.resourceCount).eq(0);
    // This can't reasonably be tested without setting up a research phase.
    // Game-play tests would help, as would making sure the initial set-up
    // gave the initial resource.
    card.onCardPlayed(player2, new MicroMills());
    expect(card.resourceCount).eq(0);

    card.onCardPlayed(player2, new MartianZoo());
    expect(card.resourceCount).eq(1);
  });
});

