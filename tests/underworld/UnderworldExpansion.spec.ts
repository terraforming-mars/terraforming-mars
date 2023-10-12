import {expect} from 'chai';
import {TestPlayer} from '../TestPlayer';
import {testGame} from '../TestGame';
import {UnderworldExpansion} from '../../src/server/underworld/UnderworldExpansion';
import {Game} from '../../src/server/Game';
import {UnderworldData} from '../../src/server/underworld/UnderworldData';
import {cast, fakeCard, runAllActions} from '../TestingUtils';
import {Units} from '../../src/common/Units';
import {Cryptocurrency} from '../../src/server/cards/pathfinders/Cryptocurrency';
import {MartianCulture} from '../../src/server/cards/pathfinders/MartianCulture';
import {GHGProducingBacteria} from '../../src/server/cards/base/GHGProducingBacteria';
import {RegolithEaters} from '../../src/server/cards/base/RegolithEaters';
import {SelectCard} from '../../src/server/inputs/SelectCard';
// import {VolcanicEruptions} from '../../src/server/turmoil/globalEvents/VolcanicEruptions';

describe('UnderworldExpansion', function() {
  let player1: TestPlayer;
  let player2: TestPlayer;
  let game: Game;
  let underworldData: UnderworldData;
  let data1: Cryptocurrency;
  let data2: MartianCulture;
  let microbes1: GHGProducingBacteria;
  let microbes2: RegolithEaters;

  beforeEach(() => {
    [game, player1, player2] = testGame(2, {underworldExpansion: true});
    underworldData = game.underworldData;
    data1 = new Cryptocurrency();
    data2 = new MartianCulture();
    microbes1 = new GHGProducingBacteria();
    microbes2 = new RegolithEaters();
    player1.playedCards = [data1, data2, microbes1, microbes2];
  });

  it('sanity', () => {
    expect(underworldData).is.not.undefined;
  });

  it('Game without expansions has no tokens', () => {
    const [game, player] = testGame(1);
    expect(game.underworldData.tokens).is.empty;
    expect(player.underworldData).is.not.undefined;
  });

  it('sanity', () => {
    expect(underworldData.tokens).has.length(89);
  });

  it('identify', () => {
    const space = game.board.getAvailableSpacesOnLand(player1)[0];

    expect(space.undergroundResources).is.undefined;
    expect(underworldData.tokens).has.length(89);

    UnderworldExpansion.identify(game, space, player1);

    expect(space.undergroundResources).is.not.undefined;
    expect(underworldData.tokens).has.length(88);
    expect(space.excavator).is.undefined;
  });

  it('identify calls card callbacks', () => {
    const responses: Array<string> = [];
    const space = game.board.getAvailableSpacesOnLand(player1)[0];
    const fake = fakeCard({
      onIdentification(identifyingPlayer, cardOwner, space) {
        responses.push(`${identifyingPlayer.id} - ${cardOwner.id} - ${space.id}`);
      },
    });
    player1.playedCards.push(fake);
    player2.playedCards.push(fake);

    UnderworldExpansion.identify(game, space, player1);

    expect(responses).deep.eq([
      'p-player1-id - p-player1-id - 03',
      'p-player1-id - p-player2-id - 03',
    ]);
  });

  it('serializing and deserializing board spaces', () => {
    const spaces = game.board.getAvailableSpacesOnLand(player1);
    spaces[0].undergroundResources = 'data3';
    spaces[1].undergroundResources = 'corruption2';
    spaces[2].undergroundResources = 'ocean';
    spaces[0].excavator = player1;
    spaces[1].excavator = player2;

    const spaceIds = spaces.map((s) => s.id);
    const serialized = game.serialize();
    const serializedSpaces = serialized.board.spaces.filter((space) => spaceIds.includes(space.id));

    expect(serializedSpaces[0].undergroundResources).eq('data3');
    expect(serializedSpaces[1].undergroundResources).eq('corruption2');
    expect(serializedSpaces[2].undergroundResources).eq('ocean');
    expect(serializedSpaces[3]).does.not.haveOwnPropertyDescriptor('undergroundResources');
    expect(serializedSpaces[0].excavator).eq('p-player1-id');
    expect(serializedSpaces[1].excavator).eq('p-player2-id');
    expect(serializedSpaces[2]).does.not.haveOwnPropertyDescriptor('excavator');
    expect(serializedSpaces[3]).does.not.haveOwnPropertyDescriptor('excavator');

    const game2 = Game.deserialize(serialized);
    const deserializedSpaces = game2.board.spaces.filter((space) => spaceIds.includes(space.id));
    expect(deserializedSpaces[0].undergroundResources).eq('data3');
    expect(deserializedSpaces[1].undergroundResources).eq('corruption2');
    expect(deserializedSpaces[2].undergroundResources).eq('ocean');
    expect(deserializedSpaces[3]).does.not.haveOwnPropertyDescriptor('undergroundResources');
    expect(deserializedSpaces[0].excavator?.id).eq('p-player1-id');
    expect(deserializedSpaces[1].excavator?.id).eq('p-player2-id');
    expect(deserializedSpaces[2]).does.not.haveOwnPropertyDescriptor('excavator');
    expect(deserializedSpaces[3]).does.not.haveOwnPropertyDescriptor('excavator');
  });

  it('identifiable, identified', () => {
    const space = game.board.getAvailableSpacesOnLand(player1)[0];

    expect(UnderworldExpansion.identifiableSpaces(game)).includes(space);
    expect(UnderworldExpansion.identifiedSpaces(game)).does.not.include(space);

    UnderworldExpansion.identify(game, space, player1);

    expect(UnderworldExpansion.identifiableSpaces(game)).does.not.include(space);
    expect(UnderworldExpansion.identifiedSpaces(game)).includes(space);
  });

  it('gainCorruption', () => {
    expect(player1.underworldData.corruption).eq(0);
    UnderworldExpansion.gainCorruption(player1, 2);
    expect(player1.underworldData.corruption).eq(2);
  });

  it('loseCorruption', () => {
    player1.underworldData.corruption = 3;
    UnderworldExpansion.loseCorruption(player1, 2);
    expect(player1.underworldData.corruption).eq(1);
  });

  it('grant bonus - card1', () => {
    expect(player1.cardsInHand).has.length(0);
    UnderworldExpansion.grant(player1, 'card1');
    expect(player1.cardsInHand).has.length(1);
  });

  it('grant bonus - card2', () => {
    expect(player1.cardsInHand).has.length(0);
    UnderworldExpansion.grant(player1, 'card2');
    expect(player1.cardsInHand).has.length(2);
  });

  it('grant bonus - corruption1', () => {
    expect(player1.underworldData.corruption).eq(0);
    UnderworldExpansion.grant(player1, 'corruption1');
    expect(player1.underworldData.corruption).eq(1);
  });

  it('grant bonus - corruption2', () => {
    expect(player1.underworldData.corruption).eq(0);
    UnderworldExpansion.grant(player1, 'corruption2');
    expect(player1.underworldData.corruption).eq(2);
  });

  it('grant bonus - data1', () => {
    expect(player1.getCardsWithResources()).is.empty;

    UnderworldExpansion.grant(player1, 'data1');
    runAllActions(game);
    const selectCard = cast(player1.popWaitingFor(), SelectCard);
    selectCard.cb([data2]);

    expect(player1.getCardsWithResources()).deep.eq([data2]);
    expect(data2.resourceCount).eq(1);
  });

  it('grant bonus - data2', () => {
    expect(player1.getCardsWithResources()).is.empty;

    UnderworldExpansion.grant(player1, 'data2');
    runAllActions(game);
    const selectCard = cast(player1.popWaitingFor(), SelectCard);
    selectCard.cb([data2]);

    expect(player1.getCardsWithResources()).deep.eq([data2]);
    expect(data2.resourceCount).eq(2);
  });

  it('grant bonus - data3', () => {
    expect(player1.getCardsWithResources()).is.empty;

    UnderworldExpansion.grant(player1, 'data3');
    runAllActions(game);
    const selectCard = cast(player1.popWaitingFor(), SelectCard);
    selectCard.cb([data2]);

    expect(player1.getCardsWithResources()).deep.eq([data2]);
    expect(data2.resourceCount).eq(3);
  });

  it('grant bonus - steel2', () => {
    expect(player1.stock.asUnits()).deep.eq(Units.of({}));
    UnderworldExpansion.grant(player1, 'steel2');
    expect(player1.stock.asUnits()).deep.eq(Units.of({steel: 2}));
  });

  it('grant bonus - steel1production', () => {
    expect(player1.stock.asUnits()).deep.eq(Units.of({}));
    UnderworldExpansion.grant(player1, 'steel1production');
    expect(player1.production.asUnits()).deep.eq(Units.of({steel: 1}));
  });

  it('grant bonus - titanium2', () => {
    expect(player1.stock.asUnits()).deep.eq(Units.of({}));
    UnderworldExpansion.grant(player1, 'titanium2');
    expect(player1.stock.asUnits()).deep.eq(Units.of({titanium: 2}));
  });

  it('grant bonus - titanium1production', () => {
    expect(player1.production.titanium).eq(0);
    UnderworldExpansion.grant(player1, 'titanium1production');
    expect(player1.production.asUnits()).deep.eq(Units.of({titanium: 1}));
  });

  it('grant bonus - plant1', () => {
    expect(player1.stock.asUnits()).deep.eq(Units.of({}));
    UnderworldExpansion.grant(player1, 'plant1');
    expect(player1.stock.asUnits()).deep.eq(Units.of({plants: 1}));
  });

  it('grant bonus - plant2', () => {
    expect(player1.stock.asUnits()).deep.eq(Units.of({}));
    UnderworldExpansion.grant(player1, 'plant2');
    expect(player1.stock.asUnits()).deep.eq(Units.of({plants: 2}));
  });

  it('grant bonus - plant3', () => {
    expect(player1.stock.asUnits()).deep.eq(Units.of({}));
    UnderworldExpansion.grant(player1, 'plant3');
    expect(player1.stock.asUnits()).deep.eq(Units.of({plants: 3}));
  });

  it('grant bonus - plant1production', () => {
    expect(player1.production.plants).eq(0);
    UnderworldExpansion.grant(player1, 'plant1production');
    expect(player1.production.asUnits()).deep.eq(Units.of({plants: 1}));
  });

  it('grant bonus - titaniumandplant', () => {
    expect(player1.stock.asUnits()).deep.eq(Units.of({}));
    UnderworldExpansion.grant(player1, 'titaniumandplant');
    expect(player1.stock.asUnits()).deep.eq(Units.of({titanium: 1, plants: 1}));
  });

  it('grant bonus - energy1production', () => {
    expect(player1.production.energy).eq(0);
    UnderworldExpansion.grant(player1, 'energy1production');
    expect(player1.production.asUnits()).deep.eq(Units.of({energy: 1}));
  });

  it('grant bonus - heat2production', () => {
    expect(player1.production.asUnits()).deep.eq(Units.of({}));
    UnderworldExpansion.grant(player1, 'heat2production');
    expect(player1.production.asUnits()).deep.eq(Units.of({heat: 2}));
  });

  it('grant bonus - microbe1', () => {
    expect(player1.getCardsWithResources()).is.empty;

    UnderworldExpansion.grant(player1, 'microbe1');
    runAllActions(game);
    const selectCard = cast(player1.popWaitingFor(), SelectCard);
    selectCard.cb([microbes1]);

    expect(player1.getCardsWithResources()).deep.eq([microbes1]);
    expect(microbes1.resourceCount).eq(1);
  });

  it('grant bonus - microbe2', () => {
    expect(player1.getCardsWithResources()).is.empty;

    UnderworldExpansion.grant(player1, 'microbe2');
    runAllActions(game);
    const selectCard = cast(player1.popWaitingFor(), SelectCard);
    selectCard.cb([microbes1]);

    expect(player1.getCardsWithResources()).deep.eq([microbes1]);
    expect(microbes1.resourceCount).eq(2);
  });

  it('grant bonus - tr', () => {
    expect(player1.getTerraformRating()).eq(20);
    UnderworldExpansion.grant(player1, 'tr');
    expect(player1.getTerraformRating()).eq(21);
  });

  // it('grant bonus - ocean', () => {
  //   UnderworldExpansion.grant(player1, 'ocean');
  // });

  // it('grant bonus - ocean -- cannot afford', () => {
  //   UnderworldExpansion.grant(player1, 'ocean');
  // });

  // it('grant bonus - ocean -- cannot afford, Reds', () => {
  //   UnderworldExpansion.grant(player1, 'ocean');
  // });

  // it('grant bonus - data1pertemp', () => {
  //   UnderworldExpansion.grant(player1, 'data1pertemp');
  // });

  // it('grant bonus - microbe1pertemp', () => {
  //   UnderworldExpansion.grant(player1, 'microbe1pertemp');
  // });

  // it('grant bonus - plant2pertemp', () => {
  //   UnderworldExpansion.grant(player1, 'plant2pertemp');
  // });

  // it('grant bonus - steel2pertemp', () => {
  //   UnderworldExpansion.grant(player1, 'steel2pertemp');
  // });

  // it('grant bonus - titanium1pertemp', () => {
  //   UnderworldExpansion.grant(player1, 'titanium1pertemp');
  // });

  // it('temperature bonus does not apply to WGT', () => {
  //   UnderworldExpansion.grant(player1, 'titanium1pertemp');
  // });

  // it('temperature bonus does not apply to Turmoil', () => {
  // VolcanicEruptions
  //   UnderworldExpansion.grant(player1, 'titanium1pertemp');
  // });

  // it('temperature bonus does not apply next generation', () => {
  // VolcanicEruptions
  //   UnderworldExpansion.grant(player1, 'titanium1pertemp');
  // });
});
