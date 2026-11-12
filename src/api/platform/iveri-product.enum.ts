/**
 * The products Iveri sells to companies, each licensed on its own. A company can hold several, and a product refuses
 * a company that holds no live licence for it once enforcement is switched on.
 */
export enum IveriProduct {
    HR = 'hr',
    CLINIC = 'clinic',
    COMMERCE = 'commerce',
    RESTAURANT = 'restaurant',
    GYM = 'gym',
    TAXI = 'taxi',
    DELIVERY = 'delivery',
    UNIBOX = 'unibox',
    CONDUIT = 'conduit',
    CHAT = 'chat',
}
