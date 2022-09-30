import {expect} from 'chai';
import {CardName} from '../../../src/common/cards/CardName';
import {ALL_MODULE_MANIFESTS} from '../../../src/server/cards/AllCards';
import {CapitalAres} from '../../../src/server/cards/ares/CapitalAres';
import {SolarFarm} from '../../../src/server/cards/ares/SolarFarm';
import {BiomassCombustors} from '../../../src/server/cards/base/BiomassCombustors';
import {Capital} from '../../../src/server/cards/base/Capital';
import {FoodFactory} from '../../../src/server/cards/base/FoodFactory';
import {NoctisFarming} from '../../../src/server/cards/base/NoctisFarming';
import {RoboticWorkforce} from '../../../src/server/cards/base/RoboticWorkforce';
import {ResearchCoordination} from '../../../src/server/cards/prelude/ResearchCoordination';
import {UtopiaInvest} from '../../../src/server/cards/turmoil/UtopiaInvest';
import {Tag} from '../../../src/common/cards/Tag';
import {Game} from '../../../src/server/Game';
import {SelectSpace} from '../../../src/server/inputs/SelectSpace';
import {Resources} from '../../../src/common/Resources';
import {SpaceBonus} from '../../../src/common/boards/SpaceBonus';
import {ARES_OPTIONS_NO_HAZARDS} from '../../ares/AresTestHelper';
import {resetBoard, setCustomGameOptions, runNextAction, cast, runAllActions} from '../../TestingUtils';
import {TileType} from '../../../src/common/TileType';
import {ICard} from '../../../src/server/cards/ICard';
import {TestPlayer} from '../../TestPlayer';
import {Units} from '../../../src/common/Units';
import {fail} from 'assert';
import {SolarWindPower} from '../../../src/server/cards/base/SolarWindPower';
import {MarsUniversity} from '../../../src/server/cards/base/MarsUniversity';
import {Gyropolis} from '../../../src/server/cards/venusNext/Gyropolis';
import {VenusGovernor} from '../../../src/server/cards/venusNext/VenusGovernor';
import {isICorporationCard} from '../../../src/server/cards/corporation/ICorporationCard';
import {isIProjectCard} from '../../../src/server/cards/IProjectCard';
import {ResearchNetwork} from '../../../src/server/cards/prelude/ResearchNetwork';
import {SelectCard} from '../../../src/server/inputs/SelectCard';
import {CardManifest} from '../../../src/server/cards/ModuleManifest';
import {HeatTrappers} from '../../../src/server/cards/base/HeatTrappers';

describe('RoboticWorkforce', () => {
  let card: RoboticWorkforce;
  let player: TestPlayer;
  let game: Game;
  let redPlayer: TestPlayer;

  beforeEach(() => {
    card = new RoboticWorkforce();
    player = TestPlayer.BLUE.newPlayer();
    redPlayer = TestPlayer.RED.newPlayer();
    game = Game.newInstance('gameid', [player, redPlayer], player, setCustomGameOptions({moonExpansion: true}));
  });

  it('Cannot play if no building cards to copy', () => {
    expect(card.canPlay(player)).is.not.true;
  });

  it('Cannot play when production must go down', () => {
    // Food factory needs one unit of plant production
    player.playedCards.push(new FoodFactory());
    expect(card.canPlay(player)).is.not.true;

    player.production.override({plants: 1});
    expect(card.canPlay(player)).is.true;
  });

  it('Cannot play when any production must go down', () => {
    // Biomass Combustors needs any player to have plant production
    player.playedCards.push(new BiomassCombustors());
    expect(card.canPlay(player)).is.not.true;

    redPlayer.production.override({plants: 1});
    expect(card.canPlay(player)).is.true;
  });

  it('Should play', () => {
    const noctisFarming = new NoctisFarming();
    player.playedCards.push(noctisFarming);

    const action = cast(card.play(player), SelectCard);
    action.cb([noctisFarming]);
    expect(player.production.megacredits).to.eq(1);
  });

  it('Should work with gyropolis', () => {
    const gyropolis = new Gyropolis();
    const venusgov = new VenusGovernor();
    player.playedCards.push(gyropolis, venusgov);

    const action = card.play(player);
    expect(action).is.undefined; // Not enough energy production for gyropolis, no other building card to copy

    player.production.add(Resources.ENERGY, 2);
    const selectCard = cast(card.play(player), SelectCard);
    selectCard.cb([gyropolis]);
    expect(player.production.energy).to.eq(0);
    expect(player.production.megacredits).to.eq(2);
  });

  it('Should work with capital', () => {
    const capital = new Capital();
    player.playedCards.push(capital);

    const action = card.play(player);
    expect(action).is.undefined; // Not enough energy production

    player.production.add(Resources.ENERGY, 2);
    const selectCard = cast(card.play(player), SelectCard);
    selectCard.cb([capital]);
    expect(player.production.energy).to.eq(0);
    expect(player.production.megacredits).to.eq(5);
  });

  it('Should work with Capital (Ares expansion)', () => {
    game = Game.newInstance('gameid', [player, redPlayer], player, ARES_OPTIONS_NO_HAZARDS);
    const capitalAres = new CapitalAres();
    player.playedCards.push(capitalAres);

    const action = card.play(player);
    expect(action).is.undefined; // Not enough energy production

    player.production.add(Resources.ENERGY, 2);
    const selectCard = cast(card.play(player), SelectCard);
    selectCard.cb([capitalAres]);
    expect(player.production.energy).to.eq(0);
    expect(player.production.megacredits).to.eq(5);
  });

  it('Should work with Solar Farm (Ares expansion)', () => {
    game = Game.newInstance('gameid', [player, redPlayer], player, ARES_OPTIONS_NO_HAZARDS);
    const solarFarm = new SolarFarm();

    // This space should have 2 plants bonus on default map
    const solarFarmSpace = game.board.getAvailableSpacesOnLand(player)[18];
    expect(solarFarmSpace.bonus).has.lengthOf(2);
    expect(solarFarmSpace.bonus.every((b) => b === SpaceBonus.PLANT)).is.true;

    expect(player.production.energy).to.eq(0);
    const action = cast(solarFarm.play(player), SelectSpace);
    action.cb(solarFarmSpace);
    expect(player.production.energy).to.eq(2);

    player.playedCards.push(solarFarm);

    const selectCard = cast(card.play(player), SelectCard);
    selectCard.cb([solarFarm]);
    expect(player.production.energy).to.eq(4);
  });

  it('Should play with corporation cards', () => {
    const corporationCard = new UtopiaInvest();
    player.setCorporationForTest(corporationCard);

    const action = cast(card.play(player), SelectCard);

    expect(player.production.steel).to.eq(0);
    expect(player.production.titanium).to.eq(0);
    action.cb([corporationCard as any]);
    expect(player.production.steel).to.eq(1);
    expect(player.production.titanium).to.eq(1);
  });

  it('Should not work with Solar Wind Power (no building tag, but has production)', () => {
    player.playedCards.push(new SolarWindPower());

    expect(card.canPlay(player)).is.false;
    const action = card.play(player);
    expect(action).is.undefined;
  });

  it('Should not work with Mars University (building tag, no production)', () => {
    player.playedCards.push(new MarsUniversity());

    expect(card.canPlay(player)).is.false;
    const action = card.play(player);
    expect(action).is.undefined;
  });

  it('Should work with Research Network', () => {
    const researchNetwork = new ResearchNetwork();
    player.playedCards.push(researchNetwork);
    const action = cast(card.play(player), SelectCard);

    expect(action.cards[0]).eq(researchNetwork);
    expect(player.production.megacredits).to.eq(0);
    action.cb([researchNetwork]);
    expect(player.production.megacredits).to.eq(1);
  });

  it('Should work with Heat Trappers', () => {
    const heatTrappers = new HeatTrappers();
    player.playedCards.push(heatTrappers);
    player.production.override(Units.of({heat: 1}));
    redPlayer.production.override(Units.of({heat: 1}));

    expect(card.canPlay(player)).is.false;

    redPlayer.production.override(Units.of({heat: 2}));

    expect(card.canPlay(player)).is.true;

    const selectCard = cast(card.play(player), SelectCard);

    expect(selectCard.cards).deep.eq([heatTrappers]);

    selectCard.cb([heatTrappers]);
    runAllActions(game);

    expect(player.production.asUnits()).deep.eq(Units.of({heat: 1, energy: 1}));
    expect(redPlayer.production.asUnits()).deep.eq(Units.EMPTY);
  });

  describe('test all cards', () => {
    ALL_MODULE_MANIFESTS.forEach((manifest) => {
      const cards: CardManifest<ICard> = {...manifest.projectCards, ...manifest.preludeCards, ...manifest.corporationCards};
      for (const [cardName, factory] of CardManifest.entries(cards)) {
        it(cardName, () => {
          const card = new factory!.Factory();
          testCard(card);
        });
      }
    });

    const testCard = function(card: ICard) {
      const researchCoordination = new ResearchCoordination();
      const gameOptions = setCustomGameOptions({aresExtension: true, aresHazards: false, moonExpansion: true});

      let include = false;
      if ((card.tags.includes(Tag.BUILDING) || card.tags.includes(Tag.WILD)) && card.play !== undefined) {
        // Solar Farm is a pain to test so let's just say it's fine
        if (card.name === CardName.SOLAR_FARM) {
          return;
        }

        // Create new players, set all productions to 2
        player = TestPlayer.BLUE.newPlayer();
        redPlayer = TestPlayer.RED.newPlayer();
        game = Game.newInstance('gameid', [player, redPlayer], player, gameOptions);
        player.production.override({megacredits: 2, steel: 2, titanium: 2, plants: 2, energy: 2, heat: 2});
        redPlayer.production.override({megacredits: 2, steel: 2, titanium: 2, plants: 2, energy: 2, heat: 2});

        // Set Moon rates.
        game.moonData!.miningRate = 3;
        game.moonData!.colonyRate = 3;
        game.moonData!.logisticRate = 3;

        // place some tiles
        resetBoard(game);
        game.addCityTile(player, '17');
        game.addCityTile(player, '19');
        game.addOceanTile(player, '32');
        game.addOceanTile(player, '33');
        game.addOceanTile(player, '34');

        // Some moon cards need steel and titanium
        player.steel = 2;
        player.titanium = 2;

        expect(game.deferredActions).has.lengthOf(0);

        // Make sure to trigger any tag based production
        player.playedCards.push(...Array(5).fill(researchCoordination));

        if (card.name === CardName.LUNAR_MINE_URBANIZATION) {
          game.moonData!.moon.spaces[4].tile = {tileType: TileType.MOON_MINE};
          game.moonData!.moon.spaces[4].player = player;
        }

        if (isICorporationCard(card)) {
          player.playCorporationCard(card);
        } else if (isIProjectCard(card)) {
          player.playCard(card);
        }

        // SelectSpace will trigger production changes in the right cards (e.g. Mining Rights)
        while (game.deferredActions.length) {
          runNextAction(game);
          const waitingFor = player.popWaitingFor();
          if (waitingFor instanceof SelectSpace) {
            waitingFor.cb(waitingFor.availableSpaces[0]);
          }
        }

        // Now if any of the production changed, that means the card has a production change
        const productions = [Resources.MEGACREDITS, Resources.STEEL, Resources.TITANIUM, Resources.PLANTS, Resources.ENERGY, Resources.HEAT];
        include = productions.filter((prod) => player.production[prod] !== 2).length > 0;
      }

      console.log(`        ${card.name}: ${include}`);
      // The card must have a productionBox or produce method.
      if (include) {
        if (card.produce === undefined) {
          const production = card.behavior?.production;
          if (production === undefined || (Units.isUnits(production) && Units.isEmpty(production))) {
            fail(card.name + ' should be registered for Robotic Workforce');
          }
        }
      }
    };
  });
});
