import { Channel } from './Channel';
import { ReviewItem } from './ReviewItem';

/**
 * Represents a user in the teams model.
 */
export class User {
    /**
     * The channel associated to this user.
     */
    public userChannel: Channel | undefined;

    /**
     * The user id.
     */
    public id: string | undefined;

    /*
     *  The name of the user.
     */
    public name: string | undefined;

    /**
     * The user current rank in the channel.
     */
    public rank: number | undefined;

    /**
     * The reviews associated to the specified user.
     */
    public reviews: ReviewItem[] | undefined;
}
