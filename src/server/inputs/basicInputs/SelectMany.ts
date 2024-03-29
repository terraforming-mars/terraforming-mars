import {BasePlayerInput} from '../../PlayerInput';
import {InputResponse, SelectManyResponse} from '../../../common/inputs/InputResponse';
import {IPlayer} from '../../IPlayer';
import { SelectManyModel } from '../../../common/models/PlayerInputModel';
import { PlayerInputType } from '../../../common/input/PlayerInputType';
import { SelectionHandler } from '../selectables/SelectionHandler';

export class SelectMany<T> extends BasePlayerInput<T[]> {
    
    constructor (
        public SelectionHandler: SelectionHandler<T>,
        public readonly min: number,
        public readonly max: number
    ) {
        super(PlayerInputType.SELECT_MANY, SelectionHandler.title);
        this.buttonLabel = SelectionHandler.buttonLabel;
        if (max < min || max <= 0 || min > SelectionHandler.options.length)
            throw new Error('Invalid Input')
    }

    public override toModel(player: IPlayer): SelectManyModel {
        return {
            ...this.SelectionHandler.toModel(player), 
            type: PlayerInputType.SELECT_MANY, 
            min: this.min, 
            max: this.max, 
        }
    }

    public override process(response: InputResponse) {
        let typedResponse = this.ResponseAsType<SelectManyResponse>(response);
        let selectedOptions: Array<T> = typedResponse.options.map((option) => this.SelectionHandler.GetOptionfromName(option));
        if (selectedOptions.length > this.max)
            throw new Error('Too many options selected')
        if (selectedOptions.length < this.min)
            throw new Error('Not enough options selected')
        return this.cb(selectedOptions);
    }
}
