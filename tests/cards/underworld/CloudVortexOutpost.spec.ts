import {expect} from 'chai';
import {CloudVortexOutpost} from '../../../src/server/cards/underworld/CloudVortexOutpost';
import {testGame} from '../../TestGame';
import {cast} from '../../TestingUtils';
import {JovianLanterns} from '../../../src/server/cards/colonies/JovianLanterns';
import {AtmoCollectors} from '../../../src/server/cards/colonies/AtmoCollectors';
import {MicroMills} from '../../../src/server/cards/base/MicroMills';
import {SearchForLife} from '../../../src/server/cards/base/SearchForLife';

describe('CloudVortexOutpost', () => {
  it('Should play', () => {
    const card = new CloudVortexOutpost();
    const [game, player] = testGame(1, {venusNextExtension: true});

    expect(player.getTerraformRating()).eq(14);
    expect(game.getVenusScaleLevel()).eq(0);

    cast(card.play(player), undefined);

    expect(game.getVenusScaleLevel()).eq(4);
    expect(player.getTerraformRating()).eq(16);
  });

  it('Should play', () => {
    const card = new CloudVortexOutpost();
    const [/* game */, player] = testGame(1, {venusNextExtension: true});

    player.playedCards.push(card);


    const cardWithoutResources = new MicroMills();
    const cardWithOtherResourceType = new SearchForLife();
    const floaterCard = new JovianLanterns();
    const secondFloaterCrd = new AtmoCollectors();

    // Card that does not hold resources
    card.onCardPlayed(player, cardWithoutResources);

    expect(card.isDisabled).is.false;

    // Card that holds non-floaters
    card.onCardPlayed(player, cardWithOtherResourceType);

    expect(card.isDisabled).is.false;
    expect(cardWithOtherResourceType.resourceCount).eq(0);

    // Card that holds floaters.
    card.onCardPlayed(player, floaterCard);

    expect(card.isDisabled).is.true;
    expect(floaterCard.resourceCount).eq(3);

    // Another card that holds floaters.
    card.onCardPlayed(player, secondFloaterCrd);

    expect(card.isDisabled).is.true;
    expect(floaterCard.resourceCount).eq(3);
    expect(secondFloaterCrd.resourceCount).eq(0);
  });
});
