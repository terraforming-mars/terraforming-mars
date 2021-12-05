import {Game} from '../../../src/Game';
import {Player} from '../../../src/Player';
import {TestingUtils} from '../../TestingUtils';
import {TestPlayers} from '../../TestPlayers';
import {IntragenSanctuaryHeadquarters} from '../../../src/cards/moon/IntragenSanctuaryHeadquarters';
import {expect} from 'chai';
import {MicroMills} from '../../../src/cards/base/MicroMills';
import {MartianZoo} from '../../../src/cards/colonies/MartianZoo';

const MOON_OPTIONS = TestingUtils.setCustomGameOptions({moonExpansion: true});

describe('IntragenSanctuaryHeadquarters', () => {
  let player: Player;
  let player2: Player;
  let card: IntragenSanctuaryHeadquarters;

  beforeEach(() => {
    player = TestPlayers.BLUE.newPlayer();
    player2 = TestPlayers.RED.newPlayer();
    Game.newInstance('id', [player, player2], player, MOON_OPTIONS);
    card = new IntragenSanctuaryHeadquarters();
  });

  it('on play', () => {
    expect(card.resourceCount).eq(0);
    card.play();
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

