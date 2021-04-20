import {IProjectCard} from '../IProjectCard';
import {Tags} from '../Tags';
import {Card, staticCardProperties} from '../Card';
import {CardType} from '../CardType';
import {Player} from '../../Player';
import {SelectCard} from '../../inputs/SelectCard';
import {CardName} from '../../CardName';
import {Resources} from '../../Resources';
import {ICard} from '../ICard';
import {DecreaseAnyProduction} from '../../deferredActions/DecreaseAnyProduction';
import {SpaceBonus} from '../../SpaceBonus';
import {CardRenderer} from '../render/CardRenderer';
import {Size} from '../render/Size';
import {Units} from '../../Units';

class Updater {
  public units: Units;
  constructor(public name: CardName, partialUnits: Partial<Units>) {
    this.units = Units.of(partialUnits);
  }
}

export class RoboticWorkforce extends Card implements IProjectCard {
  constructor() {
    super({
      cardType: CardType.AUTOMATED,
      name: CardName.ROBOTIC_WORKFORCE,
      tags: [Tags.SCIENCE],
      cost: 9,
      metadata: {
        cardNumber: '086',
        renderData: CardRenderer.builder((b) => {
          b.text('Copy A', Size.SMALL, true).nbsp;
          b.production((pb) => pb.building().played);
        }),
        description: 'Duplicate only the production box of one of your building cards.',
      },
    });
  }
  public canPlay(player: Player): boolean {
    return this.getAvailableCards(player).length > 0;
  }
  private miningSteelProduction: number = 0;
  private miningTitaniumProduction: number = 0;
  private solarFarmEnergyProduction: number = 0;

  // Made public for availability in tests
  public static readonly builderCardsNames: ReadonlyArray<CardName> = [
    CardName.AI_CENTRAL,
    CardName.ASTEROID_DEFLECTION_SYSTEM,
    CardName.BIOFERTILIZER_FACILITY,
    CardName.BIOMASS_COMBUSTORS,
    CardName.BUILDING_INDUSTRIES,
    CardName.CAPITAL,
    CardName.CAPITAL_ARES,
    CardName.CARBONATE_PROCESSING,
    CardName.COMMERCIAL_DISTRICT,
    CardName.COMMERCIAL_DISTRICT_ARES,
    CardName.CORPORATE_STRONGHOLD,
    CardName.CULTURAL_METROPOLIS,
    CardName.CUPOLA_CITY,
    CardName.DEEP_WELL_HEATING,
    CardName.DOMED_CRATER,
    CardName.DOME_FARMING,
    CardName.EARLY_SETTLEMENT,
    CardName.ELECTRO_CATAPULT,
    CardName.EOS_CHASMA_NATIONAL_PARK,
    CardName.FIELD_CAPPED_CITY,
    CardName.FOOD_FACTORY,
    CardName.FUELED_GENERATORS,
    CardName.FUEL_FACTORY,
    CardName.FUSION_POWER,
    CardName.GEOTHERMAL_POWER,
    CardName.GHG_FACTORIES,
    CardName.GREAT_DAM,
    CardName.GREAT_DAM_PROMO,
    CardName.GYROPOLIS,
    CardName.HEAT_TRAPPERS,
    CardName.HOUSE_PRINTING,
    CardName.HYPERSENSITIVE_SILICON_CHIP_FACTORY,
    CardName.IMMIGRANT_CITY,
    CardName.INDUSTRIAL_MICROBES,
    CardName.LAVA_TUBE_SETTLEMENT,
    CardName.LUNA_MINING_HUB,
    CardName.LUNAR_INDUSTRY_COMPLEX,
    CardName.LUNAR_MINE_URBANIZATION,
    CardName.LUNA_TRAIN_STATION,
    CardName.MAGNETIC_FIELD_DOME,
    CardName.MAGNETIC_FIELD_GENERATORS,
    CardName.MAGNETIC_FIELD_GENERATORS_PROMO,
    CardName.MARE_IMBRIUM_MINE,
    CardName.MARE_NECTARIS_MINE,
    CardName.MARE_NUBIUM_MINE,
    CardName.MARE_SERENITATIS_MINE,
    CardName.MARTIAN_INDUSTRIES,
    CardName.MARTIAN_MEDIA_CENTER,
    CardName.MEDICAL_LAB,
    CardName.MINE,
    CardName.MINING_AREA,
    CardName.MINING_AREA_ARES,
    CardName.MINING_OPERATIONS,
    CardName.MINING_QUOTA,
    CardName.MINING_RIGHTS,
    CardName.MINING_RIGHTS_ARES,
    CardName.MOHOLE,
    CardName.MOHOLE_AREA,
    CardName.MOHOLE_AREA_ARES,
    CardName.MOHOLE_EXCAVATION,
    CardName.NATURAL_PRESERVE,
    CardName.NATURAL_PRESERVE_ARES,
    CardName.NOCTIS_CITY,
    CardName.NOCTIS_FARMING,
    CardName.NUCLEAR_POWER,
    CardName.OCEAN_CITY,
    CardName.OCEAN_FARM,
    CardName.OPEN_CITY,
    CardName.PARLIAMENT_HALL,
    CardName.PEROXIDE_POWER,
    CardName.POLAR_INDUSTRIES,
    CardName.POWER_PLANT,
    CardName.PROTECTED_VALLEY,
    CardName.RAD_CHEM_FACTORY,
    CardName.RESEARCH_NETWORK,
    CardName.SELF_SUFFICIENT_SETTLEMENT,
    CardName.SOIL_FACTORY,
    CardName.SOLAR_FARM,
    CardName.SOLAR_POWER,
    CardName.SPACE_ELEVATOR,
    CardName.SPACE_PORT,
    CardName.SPINOFF_DEPARTMENT,
    CardName.SPONSORED_MOHOLE,
    CardName.STRIP_MINE,
    CardName.TECTONIC_STRESS_POWER,
    CardName.TITANIUM_MINE,
    CardName.TROPICAL_RESORT,
    CardName.UNDERGROUND_CITY,
    CardName.URBANIZED_AREA,
    CardName.WINDMILLS,
  ];

  // Made public for availability in tests
  public static readonly corporationCardsNames: ReadonlyArray<CardName> = [
    CardName.CHEUNG_SHING_MARS,
    CardName.FACTORUM,
    CardName.MANUTECH,
    CardName.MINING_GUILD,
    CardName.RECYCLON,
    CardName.UTOPIA_INVEST,
    CardName.CURIOSITY_II,
  ];

  private getAvailableCards(player: Player): Array<ICard> {
    const availableCards: Array<ICard> = player.playedCards.filter((card) => {
      if (card.name === CardName.BIOMASS_COMBUSTORS) {
        if (player.game.someoneHasResourceProduction(Resources.PLANTS, 1)) {
          return true;
        }
      } else if (card.name === CardName.MAGNETIC_FIELD_GENERATORS || card.name === CardName.MAGNETIC_FIELD_GENERATORS_PROMO) {
        if (player.getProduction(Resources.ENERGY) >= 4) {
          return true;
        }
      } else if (card.name === CardName.TROPICAL_RESORT) {
        if (player.getProduction(Resources.HEAT) >= 2) {
          return true;
        }
      } else if (card.name === CardName.CAPITAL ||
        card.name === CardName.CAPITAL_ARES ||
        card.name === CardName.GYROPOLIS ||
        card.name === CardName.MAGNETIC_FIELD_DOME ||
        card.name === CardName.STRIP_MINE ||
        card.name === CardName.UNDERGROUND_CITY
      ) {
        if (player.getProduction(Resources.ENERGY) >= 2) {
          return true;
        }
      } else if (card.name === CardName.AI_CENTRAL ||
        card.name === CardName.ASTEROID_DEFLECTION_SYSTEM ||
        card.name === CardName.BUILDING_INDUSTRIES ||
        card.name === CardName.CARBONATE_PROCESSING ||
        card.name === CardName.COMMERCIAL_DISTRICT ||
        card.name === CardName.COMMERCIAL_DISTRICT_ARES ||
        card.name === CardName.CORPORATE_STRONGHOLD ||
        card.name === CardName.CULTURAL_METROPOLIS ||
        card.name === CardName.CUPOLA_CITY ||
        card.name === CardName.DOMED_CRATER ||
        card.name === CardName.ELECTRO_CATAPULT ||
        card.name === CardName.FUEL_FACTORY ||
        card.name === CardName.GHG_FACTORIES ||
        card.name === CardName.IMMIGRANT_CITY ||
        card.name === CardName.LAVA_TUBE_SETTLEMENT ||
        card.name === CardName.NOCTIS_CITY ||
        card.name === CardName.OCEAN_CITY ||
        card.name === CardName.OPEN_CITY ||
        card.name === CardName.RAD_CHEM_FACTORY ||
        card.name === CardName.SOIL_FACTORY ||
        card.name === CardName.SPACE_PORT ||
        card.name === CardName.URBANIZED_AREA
      ) {
        if (player.getProduction(Resources.ENERGY) >= 1) {
          return true;
        }
      } else if (card.name === CardName.HEAT_TRAPPERS) {
        if (player.game.someoneHasResourceProduction(Resources.HEAT, 2)) {
          return true;
        }
      } else if (card.name === CardName.PEROXIDE_POWER || card.name === CardName.FUELED_GENERATORS) {
        if (player.getProduction(Resources.MEGACREDITS) >= -4) {
          return true;
        }
      } else if (card.name === CardName.NUCLEAR_POWER) {
        if (player.getProduction(Resources.MEGACREDITS) >= -3) {
          return true;
        }
      } else if (card.name === CardName.FOOD_FACTORY) {
        if (player.getProduction(Resources.PLANTS) >= 1) {
          return true;
        }
      } else if (RoboticWorkforce.builderCardsNames.includes(card.name)) {
        return true;
      }
      return false;
    });

    if (player.corporationCard !== undefined && RoboticWorkforce.corporationCardsNames.includes(player.corporationCard.name)) {
      availableCards.push(player.corporationCard);
    }

    return availableCards;
  }

  // Public for tests
  public getUpdater(cardName: CardName, player: Player): Updater | undefined {
    // Prefer moving these values to their respective cards as productionBox.
    // Cards still here are those not updated to the static card properties format, preludes, or ones
    // with complicated math. Maybe they can be moved. Maybe productionBox should have been a function
    // instead of a structure. Well, there's room for sophistication.
    const updaters: Array<Updater> = [
      new Updater(CardName.ASTEROID_DEFLECTION_SYSTEM, {energy: -1}),
      new Updater(CardName.CAPITAL, {energy: -2, megacredits: 5}),
      new Updater(CardName.CAPITAL_ARES, {energy: -2, megacredits: 5}),
      new Updater(CardName.CULTURAL_METROPOLIS, {energy: -1, megacredits: 3}),
      new Updater(CardName.DOME_FARMING, {megacredits: 2, plants: 1}),
      new Updater(CardName.EARLY_SETTLEMENT, {plants: 1}),
      new Updater(CardName.FACTORUM, {steel: 1}),
      new Updater(CardName.FIELD_CAPPED_CITY, {energy: 1, megacredits: 2}),
      new Updater(CardName.GREAT_DAM_PROMO, {energy: 2}),
      new Updater(CardName.GYROPOLIS, {energy: -2, megacredits: player.getMultipleTagCount([Tags.VENUS, Tags.EARTH])}),
      new Updater(CardName.MAGNETIC_FIELD_GENERATORS_PROMO, {energy: -4, plants: 2}),
      new Updater(CardName.MANUTECH, {steel: 1}),
      new Updater(CardName.MARTIAN_INDUSTRIES, {energy: 1, steel: 1}),
      new Updater(CardName.MARTIAN_MEDIA_CENTER, {megacredits: 2}),
      new Updater(CardName.MEDICAL_LAB, {megacredits: Math.floor(player.getTagCount(Tags.BUILDING) / 2)}),
      new Updater(CardName.MINING_AREA, {steel: this.miningSteelProduction, titanium: this.miningTitaniumProduction}),
      new Updater(CardName.MINING_AREA_ARES, {steel: this.miningSteelProduction, titanium: this.miningTitaniumProduction}),
      new Updater(CardName.MINING_OPERATIONS, {steel: 2}),
      new Updater(CardName.MINING_QUOTA, {steel: 2}),
      new Updater(CardName.MINING_RIGHTS, {steel: this.miningSteelProduction, titanium: this.miningTitaniumProduction}),
      new Updater(CardName.MINING_RIGHTS_ARES, {steel: this.miningSteelProduction, titanium: this.miningTitaniumProduction}),
      new Updater(CardName.MOHOLE, {heat: 3}),
      new Updater(CardName.MOHOLE_AREA, {heat: 4}),
      new Updater(CardName.MOHOLE_AREA_ARES, {heat: 4}),
      new Updater(CardName.MOHOLE_EXCAVATION, {steel: 1, heat: 2}),
      new Updater(CardName.NATURAL_PRESERVE, {megacredits: 1}),
      new Updater(CardName.NATURAL_PRESERVE_ARES, {megacredits: 1}),
      new Updater(CardName.PARLIAMENT_HALL, {megacredits: Math.floor(player.getTagCount(Tags.BUILDING) / 3)}),
      new Updater(CardName.POLAR_INDUSTRIES, {heat: 2}),
      new Updater(CardName.RECYCLON, {steel: 1}),
      new Updater(CardName.RESEARCH_NETWORK, {megacredits: 1}),
      new Updater(CardName.SELF_SUFFICIENT_SETTLEMENT, {megacredits: 2}),
      new Updater(CardName.SOLAR_FARM, {energy: this.solarFarmEnergyProduction}),
      new Updater(CardName.SPACE_PORT, {energy: -1, megacredits: 4}),
      new Updater(CardName.SPINOFF_DEPARTMENT, {megacredits: 2}),
      new Updater(CardName.SPONSORED_MOHOLE, {heat: 2}),
      new Updater(CardName.UTOPIA_INVEST, {steel: 1, titanium: 1}),
    ];

    const result: Updater | undefined = updaters.find((u) => u.name === cardName);
    return result;
  }

  public play(player: Player) {
    const availableCards = this.getAvailableCards(player);

    if (availableCards.length === 0) {
      return undefined;
    }

    return new SelectCard('Select builder card to copy', 'Copy', availableCards, (selectedCards: Array<ICard>) => {
      const foundCard: ICard = selectedCards[0];

      switch (foundCard.name) {
      // this card require additional user input
      case CardName.BIOMASS_COMBUSTORS:
        player.addProduction(Resources.ENERGY, 2);
        player.game.defer(new DecreaseAnyProduction(player, Resources.PLANTS, 1));
        return undefined;

      // this card require additional user input
      case CardName.HEAT_TRAPPERS:
        player.addProduction(Resources.ENERGY, 1);
        player.game.defer(new DecreaseAnyProduction(player, Resources.HEAT, 2));
        return undefined;

      // Mining resource definition
      case CardName.MINING_AREA:
      case CardName.MINING_AREA_ARES:
      case CardName.MINING_RIGHTS:
      case CardName.MINING_RIGHTS_ARES:
        const bonusResource = (foundCard as IProjectCard).bonusResource;
        if (bonusResource !== undefined && bonusResource === Resources.STEEL) {
          this.miningSteelProduction++;
        }
        if (bonusResource !== undefined && bonusResource === Resources.TITANIUM) {
          this.miningTitaniumProduction++;
        }
        break;

      case CardName.SOLAR_FARM:
        const solarFarmSpace = player.game.board.getSpaceByTileCard(CardName.SOLAR_FARM);
        if (solarFarmSpace !== undefined) {
          this.solarFarmEnergyProduction = solarFarmSpace.bonus.filter((bonus) => bonus === SpaceBonus.PLANT).length;
        }
        break;
      }

      const updater: Updater | undefined = this.getUpdater(foundCard.name, player);
      let units: Units | undefined = updater?.units;

      if (units === undefined) {
        units = staticCardProperties.get(foundCard.name)?.productionBox;
        if (units === undefined) {
          throw new Error('Production not found for selected card ' + foundCard.name);
        }
      }

      if (player.getProduction(Resources.ENERGY) + units.energy < 0) {
        throw new Error('not enough energy production');
      }
      if (player.getProduction(Resources.TITANIUM) + units.titanium < 0) {
        throw new Error('not enough titanium production');
      }
      if (player.getProduction(Resources.PLANTS) + units.plants < 0) {
        throw new Error('not enough plant production');
      }
      if (player.getProduction(Resources.HEAT) + units.heat < 0) {
        throw new Error('not enough heat production');
      }

      player.addProduction(Resources.ENERGY, units.energy);
      player.addProduction(Resources.MEGACREDITS, units.megacredits);
      player.addProduction(Resources.STEEL, units.steel);
      player.addProduction(Resources.TITANIUM, units.titanium);
      player.addProduction(Resources.PLANTS, units.plants);
      player.addProduction(Resources.HEAT, units.heat);

      player.game.log('${0} copied ${1} production with ${2}', (b) =>
        b.player(player).card(foundCard).card(this));

      return undefined;
    });
  }
}
