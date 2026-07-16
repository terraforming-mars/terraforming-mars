import {PlanetaryTrack, TrackBuilder} from './PlanetaryTrack';

export class PlanetaryTracks {
  private constructor(
    public readonly venus: PlanetaryTrack,
    public readonly earth: PlanetaryTrack,
    public readonly mars: PlanetaryTrack,
    public readonly jovian: PlanetaryTrack,
    public readonly moon: PlanetaryTrack) {
  }

  public static initialize() {
    const venus = new TrackBuilder(17)
      .at(3).risingPlayer('heat', 'floater').everyone('heat')
      .at(5).risingPlayer('floater', 'heat_production').everyone('plant')
      .at(8).risingPlayer('venus_scale').everyone('card')
      .at(11).risingPlayer('floater', 'delegate').everyone('floater')
      .at(14).risingPlayer('6mc').everyone('card')
      .at(17).risingPlayer('tr').mostTags('2vp');

    const earth = new TrackBuilder(22)
      .at(3).risingPlayer('plant').everyone('plant')
      .at(6).everyone('3mc')
      .at(9).risingPlayer('any_resource').everyone('any_resource')
      .at(12).risingPlayer('delegate').everyone('card')
      .at(16).risingPlayer('plant_production').everyone('card')
      .at(19).risingPlayer('3mc', 'delegate').everyone('3mc')
      .at(22).risingPlayer('greenery').mostTags('2vp');

    const mars = new TrackBuilder(17)
      .at(2).everyone('steel')
      .at(5).risingPlayer('steel_production').everyone('steel')
      .at(8).risingPlayer('energy_production').everyone('energy')
      .at(11).risingPlayer('delegate').everyone('card')
      .at(14).risingPlayer('tr').everyone('card')
      .at(17).risingPlayer('city').mostTags('2vp');

    const jovian = new TrackBuilder(14)
      .at(2).everyone('titanium')
      .at(5).risingPlayer('floater', 'delegate').everyone('card')
      .at(8).risingPlayer('titanium_production').everyone('titanium')
      .at(11).risingPlayer('ocean').everyone('3mc')
      .at(14).risingPlayer('tr').mostTags('1vp');

    const moon = new TrackBuilder(20)
      .at(2).risingPlayer('steel').everyone('steel')
      .at(5).risingPlayer('resource').everyone('steel')
      .at(8).risingPlayer('steel_production').everyone('steel')
      .at(11).risingPlayer('any_resource').everyone('any_resource')
      .at(14).risingPlayer('delegate', '3mc').everyone('card')
      .at(17).risingPlayer('moon_road').everyone('card')
      .at(20).risingPlayer('moon_mine').mostTags('2vp');

    return new PlanetaryTracks(
      venus.build(), earth.build(), mars.build(), jovian.build(), moon.build());
  }
}
