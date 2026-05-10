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

  it('shows calculated project costs when buying cards', () => {
    player.cardCost = 7;
    player.playedCards.push(newProjectCard(CardName.EARTH_CATAPULT)!);

    const selectCard = cast(
      new ChooseCards(player, [aquiferPumping, ioMiningIndustries], {paying: true}).execute(),
      SelectCard,
    );

    const model = selectCard.toModel(player);

    expect(model.cards).has.length(2);
    expect(model.cards[0].calculatedCost).to.eq(player.getCardCost(aquiferPumping));
    expect(model.cards[1].calculatedCost).to.eq(player.getCardCost(ioMiningIndustries));
    expect(model.cards[0].calculatedCost).not.to.eq(player.cardCost);
  });
});
