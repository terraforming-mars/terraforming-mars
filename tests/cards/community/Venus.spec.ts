import {expect} from 'chai';
import {DeuteriumExport} from '../../../src/server/cards/venusNext/DeuteriumExport';
import {IGame} from '../../../src/server/IGame';
import {Venus} from '../../../src/server/cards/community/Venus';
import {TestPlayer} from '../../TestPlayer';
import {cast, runAllActions, setRulingParty} from '../../TestingUtils';
import {testGame} from '../../TestGame';
import {CardName} from '../../../src/common/cards/CardName';
import {newProjectCard} from '../../../src/server/createCard';
import {AerialMappers} from '../../../src/server/cards/venusNext/AerialMappers';
import {PartyName} from '../../../src/common/turmoil/PartyName';

describe('Venus', () => {
  let venus: Venus;
  let aerialMappers: AerialMappers;
  let player: TestPlayer;
  let player2: TestPlayer;
  let game: IGame;

  beforeEach(() => {
    venus = new Venus();
    aerialMappers = new AerialMappers();
    [game, player, player2] = testGame(2, {coloniesExtension: true, venusNextExtension: true});
    game.colonies.push(venus);
  });

  const activateRuns = [
    {card: undefined, expected: false},
    {card: CardName.TARDIGRADES, expected: false},
    {card: CardName.ATALANTA_PLANITIA_LAB, expected: false},
    {card: CardName.AERIAL_MAPPERS, expected: true},
  ] as const;
  for (const run of activateRuns) {
    it('Should activate ' + JSON.stringify(run), () => {
      if (run.card !== undefined) {
        player.playCard(newProjectCard(run.card)!);
      }
      expect(venus.isActive).eq(run.expected);
    });
  }

  it('Should build', () => {
    expect(game.getVenusScaleLevel()).eq(0);

    player.playCard(aerialMappers);
    venus.isActive = true;

    expect(player.colonies.getPlayableColonies()).includes(venus);

    venus.addColony(player);

    runAllActions(game);
    cast(player.popWaitingFor(), undefined);
    expect(game.getVenusScaleLevel()).eq(2);
  });

  it('Should build, reds', () => {
    [game, player, player2] = testGame(2, {coloniesExtension: true, venusNextExtension: true, turmoilExtension: true});
    game.colonies.push(venus);
    venus.isActive = true;

    expect(player.colonies.getPlayableColonies()).includes(venus);

    setRulingParty(game, PartyName.REDS);

    expect(player.colonies.getPlayableColonies()).does.not.include(venus);

    player.megaCredits = 3;

    expect(player.colonies.getPlayableColonies()).includes(venus);

    venus.addColony(player);

    runAllActions(game);
    cast(player.popWaitingFor(), undefined);

    expect(game.getVenusScaleLevel()).eq(2);
    expect(player.megaCredits).eq(0);
  });

  const tradeRuns = [
    {position: 0, expected: 0},
    {position: 1, expected: 0},
    {position: 2, expected: 0},
    {position: 3, expected: 1},
    {position: 4, expected: 2},
    {position: 5, expected: 3},
    {position: 6, expected: 4},
  ];
  for (const run of tradeRuns) {
    it('Should trade ' + JSON.stringify(run), () => {
      player.playedCards.push(aerialMappers);
      venus.isActive = true;
      venus.trackPosition = run.position;
      venus.trade(player);

      runAllActions(game);
      cast(player.popWaitingFor(), undefined);

      expect(aerialMappers.resourceCount).to.eq(run.expected);
    });
  }

  it('Should give trade bonus', () => {
    const deuteriumExport = new DeuteriumExport();
    player.playedCards.push(aerialMappers);
    player2.playedCards.push(deuteriumExport);
    venus.colonies.push(player.id);
    venus.trackPosition = 4;

    venus.trade(player2);
    runAllActions(game);
    cast(player.popWaitingFor(), undefined);
    cast(player2.popWaitingFor(), undefined);

    expect(aerialMappers.resourceCount).to.eq(1);
    expect(deuteriumExport.resourceCount).to.eq(2);
  });
});
