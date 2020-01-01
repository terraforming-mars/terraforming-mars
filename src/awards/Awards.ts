import { Landlord } from "./Landlord";
import { Banker } from "./Banker";
import { Scientist } from "./Scientist";
import { Thermalist } from "./Thermalist";
import { Miner } from "./Miner";
import { IAward } from "./IAward";
import { Venuphile } from './Venuphile';

export const ORIGINAL_AWARDS: Array<IAward> = [
    new Landlord(),
    new Banker(),
    new Scientist(),
    new Thermalist(),
    new Miner(),
    new Venuphile()
]