import {expect} from 'chai';

import {SolarStorm} from '../../../src/server/cards/pathfinders/SolarStorm';
import {Units} from '../../../src/common/Units';
import {TestPlayer} from '../../TestPlayer';
import {cast, runAllActions} from '../../TestingUtils';
import {testGame} from '../../TestGame';
import {Cryptocurrency} from '../../../src/server/cards/pathfinders/Cryptocurrency';
import {CommunicationCenter} from '../../../src/server/cards/pathfinders/CommunicationCenter';
import {OrOptions} from '../../../src/server/inputs/OrOptions';
import {SelectCard} from '../../../src/server/inputs/SelectCard';
import {BotanicalExperience} from '../../../src/server/cards/pathfinders/BotanicalExperience';

describe('SolarStorm', () => {
  let card: SolarStorm;
  let player: TestPlayer;
  let player2: TestPlayer;
  let player3: TestPlayer;
  let cryptocurrency: Cryptocurrency;
  let communicationCenter: CommunicationCenter;

  beforeEach(() => {
    card = new SolarStorm();
    [/* game */, player, player2, player3] = testGame(3);
    cryptocurrency = new Cryptocurrency();
    communicationCenter = new CommunicationCenter();
  });

  it('play', () => {
    expect(player.getTerraformRating()).eq(20);
    expect(player.game.getTemperature()).eq(-30);

    player.plants = 5;
    player2.plants = 15;
    player3.plants = 400;

    card.play(player);

    expect(player.getTerraformRating()).eq(21);
    expect(player.game.getTemperature()).eq(-28);
    expect(player.plants).eq(3);
    expect(player2.plants).eq(13);
    expect(player3.plants).eq(398);
    expect(player.production.asUnits()).deep.eq(Units.of({heat: 1}));
  });

  it('remove data, nobody has data', () => {
    player.playedCards = [cryptocurrency];
    player2.playedCards = [communicationCenter];
    card.play(player);

    runAllActions(player.game);
    cast(player.getWaitingFor(), undefined);
  });

  it('remove data, only you have data', () => {
    player.playedCards = [cryptocurrency];
    player2.playedCards = [communicationCenter];

    cryptocurrency.resourceCount = 2;

    card.play(player);

    runAllActions(player.game);

    const orOptions = cast(player.popWaitingFor(), OrOptions);
    const selectCard = cast(orOptions.options[0], SelectCard);
    expect(selectCard.cards).has.members([cryptocurrency]);
    selectCard.cb([cryptocurrency]);
    expect(cryptocurrency.resourceCount).eq(0);
  });

  it('remove data, two players with data', () => {
    player.playedCards = [cryptocurrency];
    player2.playedCards = [communicationCenter];

    cryptocurrency.resourceCount = 2;
    communicationCenter.resourceCount = 6;

    card.play(player);

    runAllActions(player.game);

    const orOptions = cast(player.popWaitingFor(), OrOptions);
    const selectCard = cast(orOptions.options[0], SelectCard);
    expect(selectCard.cards).has.members([cryptocurrency, communicationCenter]);
    selectCard.cb([communicationCenter]);
    expect(communicationCenter.resourceCount).eq(3);
  });

  it('Compatible with Botanical Experience', () => {
    player.plants = 5;
    player2.plants = 15;
    player2.playedCards.push(new BotanicalExperience());
    player3.plants = 400;

    card.play(player);

    expect(player.plants).eq(3);
    expect(player2.plants).eq(14);
    expect(player3.plants).eq(398);
  });
});
