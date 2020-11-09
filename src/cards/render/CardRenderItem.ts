import {CardRenderItemType} from './CardRenderItemType';

export class CardRenderItem {
  private _anyPlayer: boolean = false;
  private _showDigit: boolean = false;
  constructor(protected _cardRenderItemType: CardRenderItemType, protected _amount: number = -1) {
    if (Math.abs(this._amount) > 5) {
      this._showDigit = true;
    }
  }

  public get anyPlayer() {
    return this._anyPlayer;
  }

  public get type() {
    return this._cardRenderItemType;
  }

  public get amount() {
    return this._amount;
  }

  public get showDigit() {
    return this._showDigit;
  }

  public any(): CardRenderItem {
    this._anyPlayer = true;
    return this;
  }

  public digit(): CardRenderItem {
    this._showDigit = true;
    return this;
  }
}
