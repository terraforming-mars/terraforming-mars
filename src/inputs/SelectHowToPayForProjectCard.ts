import {PlayerInput} from '../PlayerInput';
import {PlayerInputTypes} from '../common/input/PlayerInputTypes';
import {HowToPay} from '../common/inputs/HowToPay';
import {IProjectCard} from '../cards/IProjectCard';
import {Units} from '../common/Units';
import {MoonExpansion} from '../moon/MoonExpansion';
import {Player} from '../Player';
import {InputResponse} from '../common/inputs/InputResponse';

export class SelectHowToPayForProjectCard implements PlayerInput {
  public inputType: PlayerInputTypes = PlayerInputTypes.SELECT_HOW_TO_PAY_FOR_PROJECT_CARD;
  public title = 'Play project card';
  public buttonLabel: string = 'Play card';
  public microbes: number;
  public floaters: number;
  public canUseHeat: boolean;
  public scienceResources: number;
  public seedResources: number;
  public dataResources: number;
  public reserveUnits: Array<Units>;

  constructor(
    player: Player,
    public cards: Array<IProjectCard>,
    public cb: (cardToPlay: IProjectCard, howToPay: HowToPay) => PlayerInput | undefined) {
    this.microbes = player.getMicrobesCanSpend();
    this.floaters = player.getFloatersCanSpend();
    this.canUseHeat = player.canUseHeatAsMegaCredits;
    this.scienceResources = player.getSpendableScienceResources();
    this.seedResources = player.getSpendableSeedResources();
    this.dataResources = player.getSpendableData();
    this.reserveUnits = this.cards.map((card) => {
      return card.reserveUnits ? MoonExpansion.adjustedReserveCosts(player, card) : Units.EMPTY;
    });
  }

  public process(input: InputResponse, player: Player) {
    player.checkInputLength(input, 1, 2);
    const cardName = input[0][0];
    const cardData = PlayerInput.getCard(this.cards, cardName);
    const foundCard: IProjectCard = cardData.card;
    const howToPay: HowToPay = player.parseHowToPayJSON(input[0][1]);
    const reserveUnits = this.reserveUnits[cardData.idx];
    if (reserveUnits.steel + howToPay.steel > player.steel) {
      throw new Error(`${reserveUnits.steel} units of steel must be reserved for ${cardName}`);
    }
    if (reserveUnits.titanium + howToPay.titanium > player.titanium) {
      throw new Error(`${reserveUnits.titanium} units of titanium must be reserved for ${cardName}`);
    }
    return this.cb(foundCard, howToPay);
  }
}
