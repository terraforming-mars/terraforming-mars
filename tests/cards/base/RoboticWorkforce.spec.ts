import {expect} from 'chai';
import {CardName} from '../../../src/CardName';
import {ALL_CARD_MANIFESTS} from '../../../src/cards/AllCards';
import {CapitalAres} from '../../../src/cards/ares/CapitalAres';
import {SolarFarm} from '../../../src/cards/ares/SolarFarm';
import {BiomassCombustors} from '../../../src/cards/base/BiomassCombustors';
import {Capital} from '../../../src/cards/base/Capital';
import {FoodFactory} from '../../../src/cards/base/FoodFactory';
import {NoctisFarming} from '../../../src/cards/base/NoctisFarming';
import {RoboticWorkforce} from '../../../src/cards/base/RoboticWorkforce';
import {ResearchCoordination} from '../../../src/cards/prelude/ResearchCoordination';
import {UtopiaInvest} from '../../../src/cards/turmoil/UtopiaInvest';
import {Tags} from '../../../src/cards/Tags';
import {Game} from '../../../src/Game';
import {SelectSpace} from '../../../src/inputs/SelectSpace';
import {Resources} from '../../../src/Resources';
import {SpaceBonus} from '../../../src/SpaceBonus';
import {ARES_OPTIONS_NO_HAZARDS} from '../../ares/AresTestHelper';
import {TestingUtils} from '../../TestingUtils';
import {TestPlayers} from '../../TestPlayers';
import {TileType} from '../../../src/TileType';
import {ICard} from '../../../src/cards/ICard';
import {TestPlayer} from '../../TestPlayer';
import {Units} from '../../../src/Units';
import {fail} from 'assert';
import {SolarWindPower} from '../../../src/cards/base/SolarWindPower';
import {MarsUniversity} from '../../../src/cards/base/MarsUniversity';
import {Gyropolis} from '../../../src/cards/venusNext/Gyropolis';
import {VenusGovernor} from '../../../src/cards/venusNext/VenusGovernor';

describe('RoboticWorkforce', () => {
  let card : RoboticWorkforce; let player : TestPlayer; let game : Game;
  let redPlayer: TestPlayer;

  beforeEach(() => {
    card = new RoboticWorkforce();
    player = TestPlayers.BLUE.newPlayer();
    redPlayer = TestPlayers.RED.newPlayer();
    game = Game.newInstance('foobar', [player, redPlayer], player, TestingUtils.setCustomGameOptions({moonExpansion: true}));
  });

  it('Cannot play if no building cards to copy', () => {
    expect(card.canPlay(player)).is.not.true;
  });

  it('Cannot play when production must go down', () => {
    // Food factory needs one unit of plant production
    player.playedCards.push(new FoodFactory());
    expect(card.canPlay(player)).is.not.true;

    player.setProductionForTest({plants: 1});
    expect(card.canPlay(player)).is.true;
  });

  it('Cannot play when any production must go down', () => {
    // Biomass Combustors needs any player to have plant production
    player.playedCards.push(new BiomassCombustors());
    expect(card.canPlay(player)).is.not.true;

    redPlayer.setProductionForTest({plants: 1});
    expect(card.canPlay(player)).is.true;
  });

  it('Should play', () => {
    const noctisFarming = new NoctisFarming();
    player.playedCards.push(noctisFarming);

    const action = card.play(player);
    expect(action).is.not.undefined;
    action!.cb([noctisFarming]);
    expect(player.getProduction(Resources.MEGACREDITS)).to.eq(1);
  });

  it('Should work with gyropolis', () => {
    const gyropolis = new Gyropolis();
    const venusgov = new VenusGovernor();
    player.playedCards.push(gyropolis, venusgov);

    const action = card.play(player);
    expect(action).is.undefined; // Not enough energy production for gyropolis, no other building card to copy

    player.addProduction(Resources.ENERGY, 2);
    const selectCard = card.play(player);
    expect(selectCard).is.not.undefined;
    selectCard!.cb([gyropolis]);
    expect(player.getProduction(Resources.ENERGY)).to.eq(0);
    expect(player.getProduction(Resources.MEGACREDITS)).to.eq(2);
  });

  it('Should work with capital', () => {
    const capital = new Capital();
    player.playedCards.push(capital);

    const action = card.play(player);
    expect(action).is.undefined; // Not enough energy production

    player.addProduction(Resources.ENERGY, 2);
    const selectCard = card.play(player);
    expect(selectCard).is.not.undefined;
    selectCard!.cb([capital]);
    expect(player.getProduction(Resources.ENERGY)).to.eq(0);
    expect(player.getProduction(Resources.MEGACREDITS)).to.eq(5);
  });

  it('Should work with Capital (Ares expansion)', () => {
    game = Game.newInstance('foobar', [player, redPlayer], player, ARES_OPTIONS_NO_HAZARDS);
    const capitalAres = new CapitalAres();
    player.playedCards.push(capitalAres);

    const action = card.play(player);
    expect(action).is.undefined; // Not enough energy production

    player.addProduction(Resources.ENERGY, 2);
    const selectCard = card.play(player);
    expect(selectCard).is.not.undefined;
    selectCard!.cb([capitalAres]);
    expect(player.getProduction(Resources.ENERGY)).to.eq(0);
    expect(player.getProduction(Resources.MEGACREDITS)).to.eq(5);
  });

  it('Should work with Solar Farm (Ares expansion)', () => {
    game = Game.newInstance('foobar', [player, redPlayer], player, ARES_OPTIONS_NO_HAZARDS);
    const solarFarm = new SolarFarm();

    // This space should have 2 plants bonus on default map
    const solarFarmSpace = game.board.getAvailableSpacesOnLand(player)[18];
    expect(solarFarmSpace.bonus).has.lengthOf(2);
    expect(solarFarmSpace.bonus.every((b) => b === SpaceBonus.PLANT)).is.true;

    expect(player.getProduction(Resources.ENERGY)).to.eq(0);
    const action = solarFarm.play(player);
    expect(action).is.not.undefined;
    action!.cb(solarFarmSpace);
    expect(player.getProduction(Resources.ENERGY)).to.eq(2);

    player.playedCards.push(solarFarm);

    const selectCard = card.play(player);
    expect(selectCard).is.not.undefined;
    selectCard!.cb([solarFarm]);
    expect(player.getProduction(Resources.ENERGY)).to.eq(4);
  });

  it('Should play with corporation cards', () => {
    const corporationCard = new UtopiaInvest();
    player.corporationCard = corporationCard;

    const action = card.play(player);
    expect(action).is.not.undefined;

    expect(player.getProduction(Resources.STEEL)).to.eq(0);
    expect(player.getProduction(Resources.TITANIUM)).to.eq(0);
    action!.cb([corporationCard as any]);
    expect(player.getProduction(Resources.STEEL)).to.eq(1);
    expect(player.getProduction(Resources.TITANIUM)).to.eq(1);
  });

  it('Should not work with Solar Wind Power (no building tag, but has production)', () => {
    player.playedCards.push(new SolarWindPower());

    const action = card.play(player);
    expect(action).is.undefined;
  });

  it('Should not work with Mars University (building tag, no production)', () => {
    player.playedCards.push(new MarsUniversity());

    const action = card.play(player);
    expect(action).is.undefined;
  });

  describe('test all cards', () => {
    ALL_CARD_MANIFESTS.forEach((manifest) => {
      manifest.projectCards.factories.forEach((c) => {
        it(c.cardName, () => {
          testCard(new c.Factory());
        });
      });
      manifest.preludeCards.factories.forEach((c) => {
        it(c.cardName, () => {
          testCard(new c.Factory());
        });
      });
      manifest.corporationCards.factories.forEach((c) => {
        it(c.cardName, () => {
          testCard(new c.Factory());
        });
      });
    });

    const testCard = function(card: ICard) {
      const researchCoordination = new ResearchCoordination();
      const gameOptions = TestingUtils.setCustomGameOptions({aresExtension: true, aresHazards: false, moonExpansion: true});

      let include = false;
      if ((card.tags.includes(Tags.BUILDING) || card.tags.includes(Tags.WILDCARD)) && card.play !== undefined) {
        // Solar Farm is a pain to test so let's just say it's fine
        if (card.name === CardName.SOLAR_FARM) {
          return;
        }

        // Create new players, set all productions to 2
        player = TestPlayers.BLUE.newPlayer();
        redPlayer = TestPlayers.RED.newPlayer();
        game = Game.newInstance('foobar', [player, redPlayer], player, gameOptions);
        player.setProductionForTest({megacredits: 2, steel: 2, titanium: 2, plants: 2, energy: 2, heat: 2});
        redPlayer.setProductionForTest({megacredits: 2, steel: 2, titanium: 2, plants: 2, energy: 2, heat: 2});

        // Set Moon rates.
        game.moonData!.miningRate = 3;
        game.moonData!.colonyRate = 3;
        game.moonData!.logisticRate = 3;

        // place some tiles
        TestingUtils.resetBoard(game);
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

        const action = card.play(player);
        if (action !== undefined) {
          if (action instanceof SelectSpace) {
            action.cb(action.availableSpaces[0]);
          }
        }

        while (game.deferredActions.length) {
          const defAction = game.deferredActions.pop()!.execute();
          if (defAction !== undefined) {
            if (defAction instanceof SelectSpace) {
              defAction.cb(defAction.availableSpaces[0]);
            }
          }
        }

        // Now if any of the production changed, that means the card has a production change
        const productions = [Resources.MEGACREDITS, Resources.STEEL, Resources.TITANIUM, Resources.PLANTS, Resources.ENERGY, Resources.HEAT];
        include = productions.filter((prod) => player.getProduction(prod) !== 2).length > 0;
      }

      const isEmpty = function(u: Units): boolean {
        return u.megacredits === 0 && u.steel === 0 && u.titanium === 0 && u.plants === 0 && u.energy === 0 && u.heat === 0;
      };

      console.log(`        ${card.name}: ${include}`);
      // The card must have a productionBox or produce method.
      if (include) {
        if (card.produce === undefined) {
          if (card.productionBox === undefined || isEmpty(card.productionBox)) {
            fail(card.name + ' should be registered for Robotic Workforce');
          }
        };
      }
    };
  });
});
