import IComponent from './modules/IComponent.js';
import State from './modules/State.js';

/**
 * @implements {IComponent}
 */
export default class Child {
    /**
     * @type {{[key: string]: State}}
     */
    props = {};

    /**
     * @type {{[key: string]: State}}
     */
    states = {};

    /**
     * Contains the top level elements of the component.
     * @type {Array<Element>}
     */
    elements = new Array();

    /**
     * Contains child components that are mounted to the DOM.
     * @type {Set<IComponent>}
     */
    children = new Set();

    /**
     * @param {{[key: string]: State}} props
     */
    constructor(props) {
        // sectio 1: member init
        this.props = props;

        // section 2: states init: done here to avoid undefined states during content init
        this.states.name = this.props.name.clone((val) => {
            let target;
            this.states.name.value = val;
            // for every dependent element, update respective attribute or content
            if ((target = document.getElementById('Child.div1.font1'))) {
                target.textContent = `Hello, ${this.states.name.value}!`;
            }
        });

        this.states.age = new State(0, (val) => {
            let target;
            this.states.age.value = val;
            // for every dependent element, update respective attribute or content
            if ((target = document.getElementById('Child.div1.font2'))) {
                target.textContent = `Age: ${this.states.age.value}`;
            }
        });

        // section 3: elements init: done here to avoid undefined elements during content init
        const root = document.createElement('div');
        {
            // convert refs into element IDs
            const b1 = 'Child.b1';
            const b2 = 'Child.b2';
            const b3 = 'Child.b3';

            root.innerHTML = `
                <style>
                   font.Child {
                       color: red;
                   }
                </style>
                <font class="Child" id="Child.div1.font1" attr1="value1" attr2="value2">Hello, ${this.states.name.value}!</font><br/>
                <font class="Child" id="Child.div1.font2" attr5="value5" attr6="value6">Age: ${this.states.age.value}</font><br/>
                ${this.props.child.value}<br/>
                <button id=${b1}>Change Name</button>
                <button id=${b2}>Change Age</button>
                <button id=${b3}>Change Both</button>
            `;
        }

        // section 4: elements added to the elements array
        for (const node of root.children) {
            this.elements.push(node);
        }
    }

    getHTML() {
        let html = '';
        for (const element of this.elements) {
            html += element.outerHTML;
        }
        return html;
    }

    /**
     * Add the child to the children set. Used during onMount and onUnmount.
     * @param {IComponent} child
     * @returns {IComponent}
     */
    addChild(child) {
        this.children.add(child);
        return child;
    }

    onMount() {
        // section 1: state and ref init
        const name = this.states.name;
        const age = this.states.age;

        const b1 = document.getElementById('Child.b1') || IComponent.dummyElement;
        const b2 = document.getElementById('Child.b2') || IComponent.dummyElement;
        const b3 = document.getElementById('Child.b3') || IComponent.dummyElement;

        // section 2: all of user defined code
        function changeName() {
            // get value from state into temporary variable
            name.value = 'Alice';
            name.change(name.value);
        }

        function changeAge() {
            // get value from state into temporary variable
            age.value += 1;
            age.change(age.value);
        }

        function changeBoth() {
            // get value from state into temporary variable
            name.value = 'Alice';
            name.change(name.value);

            // get value from state into temporary variable
            age.value += 1;
            age.change(age.value);
        }

        b1.addEventListener('click', changeName);
        b2.addEventListener('click', changeAge);
        b3.addEventListener('click', changeBoth);

        // section 3: call onMount for all children
        for (const child of this.children) {
            child.onMount();
        }
    }

    onUnmount() {
        // remove event listeners by cloning the node
        for (let i = 0; i < this.elements.length; i++) {
            const node = this.elements[i].cloneNode(true);
            this.elements[i].replaceWith(node);
        }
        // call onUnmount for all children
        for (const child of this.children) {
            child.onUnmount();
        }
    }
}
