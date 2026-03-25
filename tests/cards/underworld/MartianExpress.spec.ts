import {expect} from 'chai';
import {MartianExpress} from '../../../src/server/cards/underworld/MartianExpress';
import {testGame} from '../../TestGame';
import {addCity, cast, runAllActions} from '../../TestingUtils';
import {AddResourcesToCard} from '../../../src/server/deferredActions/AddResourcesToCard';
import {CardResource} from '../../../src/common/CardResource';
import {JupiterFloatingStation} from '../../../src/server/cards/colonies/JupiterFloatingStation';
import {SelectCard} from '../../../src/server/inputs/SelectCard';
import {ColonyName} from '../../../src/common/colonies/ColonyName';
import {ColoniesHandler} from '../../../src/server/colonies/ColoniesHandler';

describe('MartianExpress', () => {
  it('canPlay', () => {
    const card = new MartianExpress();
    const [/* game */, player, player2] = testGame(2);

    expect(card.canPlay(player)).is.false;

    addCity(player2);

    expect(card.canPlay(player)).is.true;
  });

  it('Should play', () => {
    const card = new MartianExpress();
    const [/* game */, player] = testGame(2);

    cast(card.play(player), undefined);
  });

  it('can accept any resource', () => {
    const card = new MartianExpress();
    const [game, player] = testGame(2);

    player.playedCards.push(card);

    game.defer(new AddResourcesToCard(player, CardResource.FLOATER));
    runAllActions(game);
    cast(player.popWaitingFor(), undefined);
    expect(card.resourceCount).eq(1);
  });

  it('can accept any resource, selected card', () => {
    const card = new MartianExpress();
    const [game, player] = testGame(2);
    const jupiterFloatingStation = new JupiterFloatingStation();

    player.playedCards.push(card, jupiterFloatingStation);

    game.defer(new AddResourcesToCard(player, CardResource.FLOATER));
    runAllActions(game);
    const selectCard = cast(player.popWaitingFor(), SelectCard);
    expect(selectCard.cards).to.have.members([card, jupiterFloatingStation]);
    selectCard.cb([card]);

    expect(card.resourceCount).eq(1);
    expect(jupiterFloatingStation.resourceCount).eq(0);
  });

  it('canAct', () => {
    const card = new MartianExpress();

    expect(card.canAct()).is.false;
    card.resourceCount = 1;
    expect(card.canAct()).is.true;
  });

  it('action', () => {
    const card = new MartianExpress();
    const [/* game */, player] = testGame(2);

    card.resourceCount = 7;
    cast(card.action(player), undefined);

    expect(player.megaCredits).eq(7);
    expect(card.resourceCount).eq(0);
  });

  it('activates colonies', () => {
    const card = new MartianExpress();
    const [game, player] = testGame(2, {
      coloniesExtension: true,
      customColoniesList: [
        ColonyName.TRITON,
        ColonyName.CERES,
        ColonyName.LEAVITT,
        ColonyName.EUROPA,
        ColonyName.TITAN, // Titan has floaters
      ],
    });

    const colony = ColoniesHandler.getColony(game, ColonyName.TITAN);

    expect(colony.metadata.cardResource).eq(CardResource.FLOATER);
    expect(colony.isActive).is.false;

    player.playCard(card);

    expect(colony.isActive).is.true;
    colony.trackPosition = 4;

    colony.trade(player);
    runAllActions(game);

    expect(card.resourceCount).eq(3);
    expect(colony.trackPosition).eq(0);
  });
});
