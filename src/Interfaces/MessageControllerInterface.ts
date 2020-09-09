import { User } from '../Models/User';
import { Activity } from 'botbuilder';
import { EnumShirtSize } from '../Enums/EnumShirtSize';
import { EnumOofStatus } from '../Enums/EnumOofStatus';
import { EnumRandomOperations } from '../Enums/EnumRandomOperations';

export interface MessageControllerInterface {
    getNext(activity: Activity, size: EnumShirtSize): Promise<User | null>;
    addUser(activity: Activity): void;
    getNextRandomUser(activity: Activity, shirtSize: EnumShirtSize, excludedUsers: User[]): Promise<void>;
    getNextinLineUsers(activity: Activity): Promise<void>;
    assign(activity: Activity, size: EnumShirtSize): Promise<User[] | null>;
    removeUserWithName(activity: Activity): void;
    removeUser(activity: Activity): void;
    scoreBoard(activity: Activity): void
    setOofStatus(activity: Activity, oofStatus: EnumOofStatus): Promise<void>;
    setRandomStatus(activity: Activity, randomStatus: EnumRandomOperations): Promise<void>;
    setRandomness(activity: Activity, randomOperation: EnumRandomOperations): Promise<void>;
}