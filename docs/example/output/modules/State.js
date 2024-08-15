/**
 * @template T
 */
export default class State {
    /**
     * @type {T}
     * @public
     */
    value;

    /**
     * @type {(val: T) => void}
     * @public
     */
    change;

    /**
     * @param {T} value
     * @param {(val: T) => void} change
     */
    constructor(value, change) {
        this.value = value;
        this.change = change;
    }

    /**
     * Returns a new state with the default value and no change function.
     * @returns {State}
     */
    static default() {
        return new State(undefined, () => {});
    }

    /**
     * Clones the state and takes an additional change function.
     * If the state is changed, the original change function is called first,
     * then the additional change function is called.
     *
     * However, if replace is true, the original change function is replaced by the new one.
     *
     * @param {(val: T) => void} change
     * @param {boolean?} replace
     * @returns {State}
     */
    clone(change, replace = false) {
        const _context_ = this;
        if (replace) {
            return new State(this.value, change);
        }
        const newChange = function (/** @type {T} */ val) {
            _context_.change(val);
            change(val);
        };
        return new State(this.value, newChange);
    }
}
