import {getGlobalParameterMaximums} from '@/common/boards/GlobalParameterMaximums';
import {BoardName} from '@/common/boards/BoardName';
import {SpaceBonus} from '../../common/boards/SpaceBonus';
import {BoardBuilder} from './BoardBuilder';
import {Random} from '../../common/utils/Random';
import {GameOptions} from '../game/GameOptions';
import {MarsBoard} from './MarsBoard';
import {Space} from './Space';

const TILES_PER_ROW = [6, 7, 8, 9, 10, 11, 10, 9, 8, 7, 6];

// Coordinate labels for the eleven-row map. Rows run A to L, skipping I.
const AMAZONIS_PLANITIA_A9 = {
  '03': 'A1',
  '04': 'A2',
  '05': 'A3',
  '06': 'A4',
  '07': 'A5',
  '08': 'A6',
  '09': 'B1',
  '10': 'B2',
  '11': 'B3',
  '12': 'B4',
  '13': 'B5',
  '14': 'B6',
  '15': 'B7',
  '16': 'C1',
  '17': 'C2',
  '18': 'C3',
  '19': 'C4',
  '20': 'C5',
  '21': 'C6',
  '22': 'C7',
  '23': 'C8',
  '24': 'D1',
  '25': 'D2',
  '26': 'D3',
  '27': 'D4',
  '28': 'D5',
  '29': 'D6',
  '30': 'D7',
  '31': 'D8',
  '32': 'D9',
  '33': 'E1',
  '34': 'E2',
  '35': 'E3',
  '36': 'E4',
  '37': 'E5',
  '38': 'E6',
  '39': 'E7',
  '40': 'E8',
  '41': 'E9',
  '42': 'E10',
  '43': 'F1',
  '44': 'F2',
  '45': 'F3',
  '46': 'F4',
  '47': 'F5',
  '48': 'F6',
  '49': 'F7',
  '50': 'F8',
  '51': 'F9',
  '52': 'F10',
  '53': 'F11',
  '54': 'G1',
  '55': 'G2',
  '56': 'G3',
  '57': 'G4',
  '58': 'G5',
  '59': 'G6',
  '60': 'G7',
  '61': 'G8',
  '62': 'G9',
  '63': 'G10',
  '64': 'H1',
  '65': 'H2',
  '66': 'H3',
  '67': 'H4',
  '68': 'H5',
  '69': 'H6',
  '70': 'H7',
  '71': 'H8',
  '72': 'H9',
  '73': 'J1',
  '74': 'J2',
  '75': 'J3',
  '76': 'J4',
  '77': 'J5',
  '78': 'J6',
  '79': 'J7',
  '80': 'J8',
  '81': 'K1',
  '82': 'K2',
  '83': 'K3',
  '84': 'K4',
  '85': 'K5',
  '86': 'K6',
  '87': 'K7',
  '88': 'L1',
  '89': 'L2',
  '90': 'L3',
  '91': 'L4',
  '92': 'L5',
  '93': 'L6',
} as const;

export class AmazonisPlanitiaBoard extends MarsBoard {
  public override readonly A9 = AMAZONIS_PLANITIA_A9;
  public static newInstance(gameOptions: GameOptions, rng: Random): AmazonisPlanitiaBoard {
    const builder = new BoardBuilder(gameOptions, rng, TILES_PER_ROW);

    const PLANT = SpaceBonus.PLANT;
    const STEEL = SpaceBonus.STEEL;
    const DRAW_CARD = SpaceBonus.DRAW_CARD;
    const TITANIUM = SpaceBonus.TITANIUM;
    const ENERGY = SpaceBonus.ENERGY;
    const DELEGATE = SpaceBonus.DELEGATE;
    const STANDARD_RESOURCE = SpaceBonus.STANDARD_RESOURCE;

    // y=0: Row A
    builder.row((r) => r.land(STEEL).land(STEEL, STEEL).land(STEEL).land(DRAW_CARD).land(TITANIUM, TITANIUM).land());
    // y=1: Row B
    builder.row((r) => r.ocean().land(DELEGATE).land(STEEL).land().land(PLANT).ocean(PLANT, PLANT).ocean(TITANIUM, TITANIUM));
    // y=2: Row C
    builder.row((r) => r.ocean(STEEL, STEEL).land().land(DRAW_CARD, DRAW_CARD).land().land(PLANT).ocean().land().land());
    // y=3: Row D
    builder.row((r) => r.land(TITANIUM).ocean().land().land().land(PLANT).land(PLANT).land(PLANT, PLANT).land(PLANT).land(PLANT, DRAW_CARD));
    // y=4: Row E (E1 = Hecates Tholus, volcanic)
    builder.row((r) => r.volcanic(STEEL, STEEL).land(PLANT).land(STANDARD_RESOURCE).land(PLANT).ocean(DRAW_CARD).land(PLANT).land(PLANT, PLANT).land(PLANT).land(STANDARD_RESOURCE).ocean(PLANT, PLANT));
    // y=5: Row F
    builder.row((r) => r.land(PLANT).land(PLANT).land(PLANT, PLANT).land(PLANT, PLANT).ocean(PLANT, PLANT).ocean(PLANT, PLANT).land(STEEL, PLANT, PLANT).land(PLANT).land().land(PLANT).ocean(DRAW_CARD));
    // y=6: Row G
    builder.row((r) => r.land(PLANT).land(PLANT, PLANT).ocean(PLANT, PLANT).land(ENERGY, ENERGY).land(ENERGY).land(ENERGY, ENERGY).land().land(PLANT).land(PLANT).land());
    // y=7: Row H (H7 = Olympus Mons, H9 = Ascraeus Mons; both volcanic)
    builder.row((r) => r.land(PLANT).ocean(DRAW_CARD, DRAW_CARD).land(PLANT).land(ENERGY).land(ENERGY, ENERGY).land(PLANT).volcanic(DELEGATE, DELEGATE).land(STEEL).volcanic(DELEGATE));
    // y=8: Row J (J8 = Pavonis Mons, volcanic)
    builder.row((r) => r.ocean(STEEL, TITANIUM).land().land(TITANIUM).land().land().land(PLANT, PLANT).land().volcanic(TITANIUM));
    // y=9: Row K (K7 = Arsia Mons, volcanic)
    builder.row((r) => r.ocean().land().land(STANDARD_RESOURCE).land().land(PLANT, PLANT, PLANT).land(PLANT, PLANT).volcanic(STEEL, STEEL));
    // y=10: Row L
    builder.row((r) => r.land().land(STEEL, TITANIUM).land(STEEL, STEEL).land().land(PLANT).land(DRAW_CARD));

    const spaces = builder.build();
    return new AmazonisPlanitiaBoard(spaces);
  }

  public constructor(spaces: ReadonlyArray<Space>) {
    super(spaces, undefined, getGlobalParameterMaximums(BoardName.AMAZONIS_PLANITIA));
  }
}
