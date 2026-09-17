import {expect} from 'chai';
import {Polaris} from '../../../src/server/cards/pathfinders/Polaris';
import {IGame} from '../../../src/server/IGame';
import {addOcean, runAllActions} from '../../TestingUtils';
import {TestPlayer} from '../../TestPlayer';
import {testGame} from '../../TestGame';
import {SelectSpace} from '../../../src/server/inputs/SelectSpace';
import {TileType} from '../../../src/common/TileType';
import {cast} from '../../../src/common/utils/utils';
import {NeptunianPowerConsultants} from '../../../src/server/cards/promo/NeptunianPowerConsultants';
import {OrOptions} from '../../../src/server/inputs/OrOptions';
import {Payment} from '../../../src/common/inputs/Payment';

describe('Polaris', () => {
  let card: Polaris;
  let player: TestPlayer;
  let player2: TestPlayer;
  let game: IGame;

  beforeEach(() => {
    card = new Polaris();
    [game, player, player2] = testGame(2);
    player.playedCards.push(card);
  });

  it('initial action', () => {
    player.defer(card.initialAction(player));
    runAllActions(game);
    const selectSpace = cast(player.getWaitingFor(), SelectSpace);
    const space = game.board.getSpaceOrThrow('06');

    expect(selectSpace.spaces).includes(space);

    selectSpace.cb(space);
    runAllActions(game);

    expect(space.tile?.tileType === TileType.OCEAN);

    expect(player.production.megacredits).to.eq(1);
    expect(player.megaCredits).to.eq(4);
    expect(player2.production.megacredits).to.eq(0);
    expect(player2.megaCredits).to.eq(0);
  });

  it('When anyone plays ocean tile', () => {
    addOcean(player2, '06');
    runAllActions(game);

    expect(player.production.megacredits).to.eq(1);
    expect(player.megaCredits).to.eq(0);
    expect(player2.production.megacredits).to.eq(0);
    expect(player2.megaCredits).to.eq(0);
  });

  it('When you play ocean tile', () => {
    addOcean(player, '06');
    runAllActions(game);

    expect(player.production.megacredits).to.eq(1);
    expect(player.megaCredits).to.eq(4);
    expect(player2.production.megacredits).to.eq(0);
    expect(player2.megaCredits).to.eq(0);
  });

  it('Gains M€ before ocean-triggered effects ask you to spend', () => {
    const neptunianPowerConsultants = new NeptunianPowerConsultants();
    player.playedCards.push(neptunianPowerConsultants);
    player.megaCredits = 1;

    addOcean(player, '06');
    runAllActions(game);

    // The 4M€ from Polaris brings the player to 5M€, enough to use the other effect.
    expect(player.megaCredits).to.eq(5);

    const orOptions = cast(player.popWaitingFor(), OrOptions);
    orOptions.options[0].cb(Payment.of({megacredits: 5}));

    expect(neptunianPowerConsultants.resourceCount).to.eq(1);
    expect(player.production.energy).to.eq(1);
    expect(player.megaCredits).to.eq(0);
  });
});

