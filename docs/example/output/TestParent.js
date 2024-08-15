import IComponent from './modules/IComponent.js';
import State from './modules/State.js';
import Child from './TestChild.js';

/**
 * @implements {IComponent}
 */
export default class Parent {
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
            new State('World', function (val) {
                const state = _context_.states.get('name');
                if (!state) return;
                // update state
                state.value = val;
                // for every dependent element, update respective attribute or content
                const target1 = document.getElementById(
                    'Parent.div1.div2.font1'
                );
                if (target1) {
                    target1.textContent = `Hello, ${state.value}!`;
                }
                // const target2 = document.getElementById("Parent.div1.div2.font2");
                // ...
            })
        );

        // section 3: content init: uses states defined above
        const root = document.createElement('div');
        {
            const name = _context_.states.get('name')?.value;
            root.innerHTML = `
                <div attr1="value1" attr2="value2">
                  <div attr3="value3" attr4="value4">
                    <font id="Parent.div1.div2.font1" attr5="value5" attr6="value6">Hello, ${name}!</font><br/>
                    ${(function () {
                        const child1 = new Child({
                            name: _context_.states.get('name') || State.default(),
                        });
                        _context_.addChild(child1);
                        return child1.getHTML();
                    })()}
                  </div>
                </div>
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

        {
            // no other code present
        }

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
}
