import {expect} from 'chai';
import {cast} from '@/common/utils/utils';
import {CardName} from '../../src/common/cards/CardName';
import {IProjectCard} from '../../src/server/cards/IProjectCard';
import {newProjectCard} from '../../src/server/createCard';
import {ChooseCards} from '../../src/server/deferredActions/ChooseCards';
import {SelectCard} from '../../src/server/inputs/SelectCard';
import {testGame} from '../TestGame';
import {TestPlayer} from '../TestPlayer';

describe('ChooseCards', () => {
  let player: TestPlayer;
  let aquiferPumping: IProjectCard;
  let ioMiningIndustries: IProjectCard;

  beforeEach(() => {
    [/* game */, player] = testGame(1);
    aquiferPumping = newProjectCard(CardName.AQUIFER_PUMPING)!;
    ioMiningIndustries = newProjectCard(CardName.IO_MINING_INDUSTRIES)!;
    player.megaCredits = 100;
  });

  it('shows calculated project costs when paying for cards', () => {
    player.megaCredits = player.cardCost;
    player.playedCards.push(newProjectCard(CardName.EARTH_CATAPULT)!);

    const selectCard = cast(
      new ChooseCards(player, [aquiferPumping, ioMiningIndustries], {paying: true}).execute(),
      SelectCard<IProjectCard>,
    );

    expect(selectCard.config.min).to.eq(0);
    expect(selectCard.config.max).to.eq(1);
    expect(selectCard.config.played).is.false;
    expect(selectCard.cards.map((card) => card.name)).deep.eq([
      CardName.AQUIFER_PUMPING,
      CardName.IO_MINING_INDUSTRIES,
    ]);

    const model = selectCard.toModel(player);

    expect(model.cards.map((card) => ({name: card.name, calculatedCost: card.calculatedCost}))).deep.eq([
      {name: CardName.AQUIFER_PUMPING, calculatedCost: 16},
      {name: CardName.IO_MINING_INDUSTRIES, calculatedCost: 39},
    ]);
  });
});
