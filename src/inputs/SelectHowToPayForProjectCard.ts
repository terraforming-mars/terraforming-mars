import {PlayerInput} from '../PlayerInput';
import {PlayerInputTypes} from '../PlayerInputTypes';
import {HowToPay} from './HowToPay';
import {IProjectCard} from '../cards/IProjectCard';
import {CardName} from '../CardName';
import {Units} from '../Units';
import {MoonExpansion} from '../moon/MoonExpansion';
import {Player} from '../Player';

export class SelectHowToPayForProjectCard implements PlayerInput {
  public inputType: PlayerInputTypes = PlayerInputTypes.SELECT_HOW_TO_PAY_FOR_PROJECT_CARD;
  public title = 'Play project card';
  public buttonLabel: string = 'Play card';
  public microbes: number;
  public floaters: number;
  public canUseHeat: boolean;
  public reserveUnitsMap: Map<CardName, Units>;

  constructor(
    player: Player,
    public cards: Array<IProjectCard>,
    public cb: (cardToPlay: IProjectCard, howToPay: HowToPay) => PlayerInput | undefined) {
    this.microbes = player.getMicrobesCanSpend();
    this.floaters = player.getFloatersCanSpend();
    this.canUseHeat = player.canUseHeatAsMegaCredits;
    this.reserveUnitsMap = new Map(this.cards.map((card) => {
      if (card.reserveUnits === undefined) {
        return [card.name, Units.EMPTY];
      }
      return [card.name, MoonExpansion.adjustedReserveCosts(player, card)];
    }));
  }

  public runInput(player: Player, input: ReadonlyArray<ReadonlyArray<string>>): void {
    PlayerInput.checkInputLength(input, 1, 2);
    const foundCard: IProjectCard = player.getCard(this.cards, input[0][0]);
    const howToPay: HowToPay = Player.parseHowToPayJSON(input[0][1]);
    player.runInputCb(this.cb(foundCard, howToPay));
  }
}
