import { Landlord } from "./Landlord";
import { Banker } from "./Banker";
import { Scientist } from "./Scientist";
import { Thermalist } from "./Thermalist";
import { Miner } from "./Miner";
import { Venuphile } from "./Venuphile"
import { IAward } from "./IAward";
import { Industrialist } from './Industrialist';
import { Celebrity } from './Celebrity';
import { DesertSettler } from './DesertSettler';
import { EstateDealer } from './EstateDealer';
import { Benefactor } from './Benefactor';
import { Cultivator } from './Cultivator';
import { Magnate } from './Magnate';
import { SpaceBaron } from './SpaceBaron';
import { Excentric } from './Excentric';
import { Contractor } from './Contractor';

export const ORIGINAL_AWARDS: Array<IAward> = [
    new Landlord(),
    new Scientist(),
    new Banker(),
    new Thermalist(),
    new Miner()
]

export const VENUS_AWARDS: Array<IAward> = [
    new Venuphile()
]

export const ELYSIUM_AWARDS: Array<IAward> = [
    new Celebrity(),
    new Industrialist(),
    new DesertSettler(),
    new EstateDealer(),
    new Benefactor()
]  

export const HELLAS_AWARDS: Array<IAward> = [
    new Cultivator(),
    new Magnate(),
    new SpaceBaron(),
    new Excentric(),
    new Contractor()
] 

