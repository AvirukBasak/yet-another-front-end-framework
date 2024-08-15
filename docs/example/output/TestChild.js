import IComponent from './modules/IComponent.js';
import State from './modules/State.js';

/**
 * @implements {IComponent}
 */
export default class Child {
    /**
     * @type {{[key: string]: State}}
     */
    props;

    /**
     * @type {Map<string, State>}
     */
    states;

    /**
     * @type {Array<Element>}
     */
    elements;

    /**
     * Contains child components that are mounted to the DOM.
     * @type {Set<IComponent>}
     */
    children;

    /**
     * @param {{[key: string]: State}} props
     */
    constructor(props) {
        const _context_ = this;

        // sectio 1: member init
        _context_.props = props;
        _context_.states = new Map();
        _context_.elements = new Array();
        _context_.children = new Set();

        // section 2: states init: done here to avoid undefined states during content init
        _context_.states.set(
            'name',
            _context_.props.name.clone(function (val) {
                const state = _context_.states.get('name');
                if (!state) return;
                // update state
                state.value = val;
                // for every dependent element, update respective attribute or content
                const target1 = document.getElementById('Child.div1.font1');
                if (target1) {
                    target1.textContent = `Hello, ${state.value}!`;
                }
                // const target2 = document.getElementById("Child.div1.font2");
            })
        );

        _context_.states.set(
            'age',
            new State(0, function (val) {
                const state = _context_.states.get('age');
                if (!state) return;
                // update state
                state.value = val;
                // for every dependent element, update respective attribute or content
                const target1 = document.getElementById('Child.div1.font2');
                if (target1) {
                    target1.textContent = `Age: ${state.value}`;
                }
                // const target2 = document.getElementById("Child.div1.font2");
            })
        );

        // section 3: elements init: done here to avoid undefined elements during content init
        const root = document.createElement('div');
        {
            // get state values to be used in the content
            const name = _context_.states.get('name')?.value;
            const age = _context_.states.get('age')?.value;

            // convert refs into element IDs
            const b1 = 'Child.b1';
            const b2 = 'Child.b2';
            const b3 = 'Child.b3';

            root.innerHTML = `
                <font id="Child.div1.font1" attr1="value1" attr2="value2">Hello, ${name}!</font><br/>
                <font id="Child.div1.font2" attr5="value5" attr6="value6">Age: ${age}</font><br/>
                <button id=${b1}>Change Name</button>
                <button id=${b2}>Change Age</button>
                <button id=${b3}>Change Both</button>
            `;
        }

        // section 4: elements added to the elements array
        for (const node of root.children) {
            _context_.elements.push(node);
        }
    }

    getHTML() {
        const _context_ = this;

        let html = '';
        for (const element of _context_.elements) {
            html += element.outerHTML;
        }
        return html;
    }

    /**
     * Add the child to the children set. Used during onMount and onUnmount.
     * @param {IComponent} child
     */
    addChild(child) {
        const _context_ = this;

        _context_.children.add(child);
    }

    onMount() {
        const _context_ = this;

        // section 1: refs init
        const b1 = document.getElementById('Child.b1');
        const b2 = document.getElementById('Child.b2');
        const b3 = document.getElementById('Child.b3');

        // section 2: all of user defined code
        {
            function changeName() {
                {
                    // get value from state into temporary variable
                    let val = _context_.states.get('name')?.value;
                    if (val) {
                        // update temporary variable according to user defined logic
                        val = 'Alice';
                        // update state from temporary variable
                        _context_.states.get('name')?.change(val);
                    }
                }
            }

            function changeAge() {
                {
                    let val = _context_.states.get('age')?.value;
                    if (val !== undefined) {
                        val += 1;
                        _context_.states.get('age')?.change(val);
                    }
                }
            }

            function changeBoth() {
                {
                    let val = _context_.states.get('name')?.value;
                    if (val !== undefined) {
                        val = 'Alice';
                        _context_.states.get('name')?.change(val);
                    }
                }
                {
                    let val = _context_.states.get('age')?.value;
                    if (val !== undefined) {
                        val += 1;
                        _context_.states.get('age')?.change(val);
                    }
                }
            }

            b1?.addEventListener('click', changeName);
            b2?.addEventListener('click', changeAge);
            b3?.addEventListener('click', changeBoth);
        }

        // section 3: call onMount for all children
        for (const child of _context_.children) {
            child.onMount();
        }
    }

    onUnmount() {
        const _context_ = this;

        // remove event listeners by cloning the node
        for (let i = 0; i < _context_.elements.length; i++) {
            const node = _context_.elements[i].cloneNode(true);
            _context_.elements[i].replaceWith(node);
        }

        for (const child of _context_.children) {
            child.onUnmount();
        }
    }

    // user defined functions
}
