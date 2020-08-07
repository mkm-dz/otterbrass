import { EnumShirtSize } from '../Enums/EnumShirtSize';
import { User } from './User';

/**
 * Represents an item that need to be reviewed.
 */
export class ReviewItem {
    /**
     * The size of the item represented in a T-shirt fashion.
     */
    public shirtSize: EnumShirtSize | undefined;

    /**
     * The user who got the item assigned.
     */
    public assignedTo: User | undefined;
}