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
        this.states.name = new State('World', (val) => {
            let target;
            this.states.name.value = val;
            // for every dependent element, update respective attribute or content
            if ((target = document.getElementById('Parent.div1.div2.font1'))) {
                target.textContent = `Hello, ${this.states.name.value}!`;
            }
            if ((target = document.getElementById('Parent.div1.div2.Child1.font1'))) {
                target.textContent = `Child test: ${this.states.name.value}`;
            }
            if ((target = document.getElementById('Parent.div1.div2.Child1.font2'))) {
                target.textContent = `Child test: ${this.states.name.value}`;
            }
            if ((target = document.getElementById('Parent.div1.div2.Child1.font3'))) {
                target.textContent = `Child test: ${this.states.name.value}`;
            }
        });

        // section 3: content init: uses states defined above
        const root = document.createElement('div');
        {
            root.innerHTML = `
                <div attr1="value1" attr2="value2">
                  <div attr3="value3" attr4="value4">
                    <font id="Parent.div1.div2.font1" attr5="value5" attr6="value6">Hello, ${this.states.name.value}!</font><br/>
                    ${(() => {
                        const child = new Child({
                            name: this.states.name,
                            child: new State(
                                `
                                <font id="Parent.div1.div2.Child1.font1" attr7="value7" attr8="value8">Child test: ${this.states.name.value}</font><br/>
                                <font id="Parent.div1.div2.Child1.font2" attr9="value9" attr10="value10">Child test: ${this.states.name.value}</font><br/>
                                <font id="Parent.div1.div2.Child1.font3" attr11="value11" attr12="value12">Child test: ${this.states.name.value}</font>`,
                                () => {}
                            ),
                        });
                        this.addChild(child);
                        return child.getHTML();
                    })()}
                  </div>
                </div>
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
     */
    addChild(child) {
        this.children.add(child);
    }

    onMount() {
        {
            // no other code present
        }
        // mount all children
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
