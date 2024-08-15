import State from './State.js';

/**
 * @interface
 */
export default class IComponent {
    /**
     * @type {{[key: string]: State}}
     */
    props;

    /**
     * @type {Map<string, State>}
     */
    states;

    /**
     * Contains the top level elements of the component.
     * @type {Array<Element>}
     */
    elements;

    /**
     * Contains child components that are mounted to the DOM.
     * @type {Set<IComponent>}
     */
    children;

    /**
     * @param {Object?} props
     */
    constructor(props) {
        this.props = props;
        this.states = new Map();
        this.elements = new Array();
        this.children = new Set();
    }

    /**
     * Returns the current HTML of the component.
     * @returns {string}
     */
    getHTML() {
        return '';
    }

    /**
     * Add the child to the children set. Used during onMount and onUnmount.
     * @param {IComponent} child
     */
    addChild(child) {}

    /**
     * Called when the component is mounted to the DOM.
     */
    onMount() {}

    /**
     * Called when the component is unmounted from the DOM.
     */
    onUnmount() {}
}
