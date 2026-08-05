import { TranslationStatus } from './translation-status.enum.js';
import { VariableType } from './variable-type.enum.js';

describe('localization enums', () => {
    it.each([
        [TranslationStatus.MISSING, 'missing'],
        [TranslationStatus.DRAFT, 'draft'],
        [TranslationStatus.NEEDS_REVIEW, 'needs-review'],
        [TranslationStatus.APPROVED, 'approved'],
    ])('pins the wire value of %s', (member, value) => {
        // Stored on translation rows and filtered on by the panel's URL-backed query. Changing
        // one silently reclassifies every row already written with the old value.
        expect(member).toBe(value);
    });

    it.each([
        [VariableType.STRING, 'string'],
        [VariableType.NUMBER, 'number'],
        [VariableType.DATE, 'date'],
        [VariableType.PLURAL, 'plural'],
        [VariableType.SELECT, 'select'],
    ])('pins the wire value of %s', (member, value) => {
        // Persisted inside each message's declared variable list, which the write-time
        // placeholder check reads back. A renamed value makes stored declarations unreadable.
        expect(member).toBe(value);
    });

    it('keeps every variable type usable as an ICU argument type', () => {
        // `{name}` has no type word, so STRING is the one member with no ICU spelling. Every
        // other member is written into the message as `{arg, <type>, ...}` verbatim, so a value
        // ICU does not recognise produces a parse error at render time rather than at write time.
        const icuArgumentTypes = Object.values(VariableType).filter((type) => type !== VariableType.STRING);

        expect(icuArgumentTypes).toEqual(['number', 'date', 'plural', 'select']);
    });
});
