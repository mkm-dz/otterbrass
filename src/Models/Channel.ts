
/**
 * Represents a teams channel.
 */
export class Channel {
    /**
     * Gets or sets the id associated with the channel.
     */
    public id: string | undefined;

    /**
     * Gets or sets the name of the channel.
     */
    public name: string | undefined;

    /**
     * The channel randomness level.
     */
    public randomness: number | undefined;
}