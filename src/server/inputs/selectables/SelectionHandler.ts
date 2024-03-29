import { Message } from "@/common/logs/Message";
import { SelectionType } from "../../../common/input/SelectionType";
import { IPlayer } from "../../IPlayer";
import { SelectionInputModel } from "@/common/models/PlayerInputModel";

/** This class exists so any of the three selection types (one, many, or oneWithInput) can be used with any selectable item */
export abstract class SelectionHandler<T> {
    constructor(
        public readonly options: Array<T>,
        public readonly SelectionType: SelectionType,
        public title: string | Message,
        public buttonLabel: string = 'Confirm',
    ){}

    /** Gets the name of an option. Used to index options in a record of models */
    public abstract GetOptionName(option: T): string;
 
    /** Models the option for the client */ 
    public abstract OptionAsModel(option: T, player: IPlayer): any;

    /** Returns options in the form of key-value pairs */
    public GetOptionsRecord(player: IPlayer): Record<string, T> {
        let record: Record<string, T> = {}
        this.options.forEach((option) => {
            record[this.GetOptionName(option)] = this.OptionAsModel(option, player);
        });
        return record;
    }

    /** When the client returns the name of an option, this funtion determines which option they're referencing */
    public GetOptionfromName(name: string): T {
        let retVal;
        this.options.forEach((option) => {
            if (this.GetOptionName(option) === name) {
                retVal = option;
            }
        })
        if (retVal === undefined) {
            throw new Error("Option with that name does not exist");
        }
        return retVal;
    }

    /** Returns a partially completed SelectionInputModel for the PlayerInput object to complete */
    public toModel(player: IPlayer): Omit<SelectionInputModel, 'type'> {
        return {
            title: this.title,
            buttonLabel: this.buttonLabel,
            options: this.GetOptionsRecord(player),
            selectionType: this.SelectionType,
        };
    }
}