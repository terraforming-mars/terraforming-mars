import { Landlord } from "./Landlord";
import { Banker } from "./Banker";
import { Scientist } from "./Scientist";
import { Thermalist } from "./Thermalist";
import { Miner } from "./Miner";
import { Venuphile } from "./Venuphile"
import { IAward } from "./IAward";
import { Industrialist } from './Industrialist';

export const ORIGINAL_AWARDS: Array<IAward> = [
    new Landlord(),
    new Banker(),
    new Scientist(),
    new Thermalist(),
    new Miner()
]

export const VENUS_AWARDS: Array<IAward> = [
    new Venuphile()
]

export const ELYSIUM_AWARDS: Array<IAward> = [
    new Industrialist()
]  

