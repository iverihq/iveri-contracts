/**
 * The kind of value a message placeholder expects.
 *
 * **Declared on the message, not inferred from the text.** A translation is rejected at write
 * time if its placeholders do not match the message's declared set, which is the single check
 * that stops a Russian string shipping with a literal `{orderNumber}` in front of a customer.
 * Inferring the set from whichever locale happened to be written first would make the check
 * circular — the first typo becomes the specification.
 *
 * The type is what tells a renderer how to format the value and what an editor should show as an
 * example. It also tells a translator what they are allowed to do with it: `PLURAL` may be
 * branched on, `STRING` may not.
 */
export enum VariableType {
    /** Substituted verbatim. `{name}` */
    STRING = 'string',

    /** Formatted with `Intl.NumberFormat` for the target locale. `{count, number}` */
    NUMBER = 'number',

    /** Formatted with `Intl.DateTimeFormat` for the target locale. `{dueAt, date, medium}` */
    DATE = 'date',

    /**
     * A count the translation branches on: `{n, plural, one {...} few {...} other {...}}`.
     *
     * Distinct from `NUMBER` because the plural categories a locale needs are not a formatting
     * choice. Russian has `one`/`few`/`many`/`other` and English has `one`/`other`, so a
     * translation written by substituting a number and appending an "s" is wrong in Russian in a
     * way no reviewer of the English can see.
     */
    PLURAL = 'plural',

    /**
     * A closed set the translation branches on: `{gender, select, female {...} other {...}}`.
     *
     * Georgian and Russian inflect around the subject where English does not, so a sentence that
     * needs no branch in the source locale needs one in the target. The declared options are the
     * contract — a translation branching on an option the message never declared is rejected.
     */
    SELECT = 'select',
}
