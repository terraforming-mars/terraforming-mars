import {expect} from 'chai';
import {CeresTechMarket} from '@/server/cards/prelude2/CeresTechMarket';
import {Research} from '@/server/cards/base/Research';
import {Tardigrades} from '@/server/cards/base/Tardigrades';
import {Callisto} from '@/server/colonies/Callisto';
import {Ceres} from '@/server/colonies/Ceres';
import {Miranda} from '@/server/colonies/Miranda';
import {ICard} from '@/server/cards/ICard';
import {IGame} from '@/server/IGame';
import {SelectCard} from '@/server/inputs/SelectCard';
import {TestPlayer} from '../../TestPlayer';
import {testGame} from '../../TestGame';
import {cast} from '@/common/utils/utils';

describe('CeresTechMarket', () => {
  let card: CeresTechMarket;
  let player: TestPlayer;
  let game: IGame;

  beforeEach(() => {
    card = new CeresTechMarket();
    [game, player] = testGame(2, {coloniesExtension: true});
    game.colonies = [new Callisto(), new Ceres(), new Miranda()];
  });

  for (const run of [
    {colonies: 0, expected: 0},
    {colonies: 1, expected: 2},
    {colonies: 2, expected: 4},
    {colonies: 3, expected: 6},
  ] as const) {
    it('play ' + JSON.stringify(run), () => {
      game.colonies[0].colonies = Array(run.colonies).fill(player.id);
      card.play(player);
      expect(player.megaCredits).to.eq(run.expected);
    });
  }

  it('canAct', () => {
    expect(card.canAct(player)).is.false;

    player.cardsInHand.push(new Research());
    expect(card.canAct(player)).is.true;
  });

  it('action allows discarding 0 cards', () => {
    const research = new Research();
    player.cardsInHand.push(research);

    const selectCard = cast(card.action(player), SelectCard<ICard>);
    selectCard.cb([]);

    expect(player.megaCredits).to.eq(0);
    expect(player.cardsInHand).deep.eq([research]);
  });

  it('action discards N cards for 2 M€ each', () => {
    const research = new Research();
    const tardigrades = new Tardigrades();
    player.cardsInHand.push(research, tardigrades);

    const selectCard = cast(card.action(player), SelectCard<ICard>);
    selectCard.cb([research, tardigrades]);

    expect(player.megaCredits).to.eq(4);
    expect(player.cardsInHand).has.lengthOf(0);
    expect(game.projectDeck.discardPile).deep.eq([research, tardigrades]);
  });
});
