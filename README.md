# YAFF0

YAFF0 stands for Yet Another Frontend Framework 0. It is a frontend framework that takes inspiration from Svelte and uses a compiler to generate vanilla JavaScript code.

The generated code surgicaly updates the DOM, only changing what is necessary. This is done by generating JS code at compile time based on dependency graphs. Using a compiler allows for a more expressive syntax, better optimizations and what I like to call "compilation magic".

## Usage
```
Usage:
  yaff0 [options] <inputDir> <outputDir>
Options:
  -h, --help      Display this message
  -v, --version   Display version
  -q, --quiet     Suppress non-error output
  -c, --config    Specify a config file
```

Config file should be a of the following format (extension doesn't matter):
```
prop.prop.key = value
key = value
...
```

Where all values are strings. All characters are allowed in the keys and values except for `=`.

The config file is optional.

## Features
- **Compiler**: YAFF0 uses a compiler to generate vanilla JavaScript code.
- **Rust based**: YAFF0 is written in Rust and generates vanilla JavaScript code. Allows for a superfast and lightweight compiler.
- **Statically served**: YAFF0 generates HTML, CSS and JS files that can be statically served.
- **Split-up build**: Runtime lazily loads small JS files for each component. This allows for faster initial load times and better caching.
- **Svelte-like syntax**: YAFF0 takes inspiration from Svelte and uses a similar syntax.
- **No virtual DOM**: YAFF0 does not use a virtual DOM. Instead, it generates code that surgically updates the DOM.
- **One component per file**: YAFF0 enforces one component per file. It is impossible to define multiple components in a single file. Also, components are always exported.
- **Localised styles**: YAFF0 allows you to write styles that are local to the component.
- **Localised scripts**: YAFF0 allows you to write scripts that are local to the component.
- **Localised state**: YAFF0 allows you to define state that is local to the component.
- **Props**: YAFF0 allows you to pass props to components.
- **Ref**: YAFF0 allows you to reference HTML elements as variables. Better than using `getElementById`.
- **Hoisting**: YAFF0 hoists the HTML code above all executable code.
- **Directed rendering**: YAFF0 supports directives using the `#` symbol.
- **JS modules**: YAFF0 allows you to import other JS modules. Uses script `type="module"`.
- **Global states**: YAFF0 allows you to define global states.
- **Global styles**: YAFF0 allows you to define global styles.
- **State Initializers**: YAFF0 allows you to set initial values to global states depending on some async operation.
- **SSR**: YAFF0 does not support SSR however, can be modified to run at server side.

## Points of interest
- YAFF0 supports JavaScript but not TypeScript.
- Support for other frameworks is not yet planned.
- JS is a language to interact with the YAFF0 runtime APIs.
- Runtime errors in YAFF0 are either `FATAL` or `RECOVERABLE`.
- It is unnecessary to import `Y0` as it is a marker for the compiler to put in the runtime APIs.
- A `RECOVERABLE` will open a dialog box and also print a stack trace. Dialog box can be hidden or customised.
- A `FATAL` will print a stack trace and stop the execution completely. Will result in an empty page.
- Uncaught runtime exceptions in JS will result in a `RECOVERABLE` errors.

## Examples
### Localised styles
Topics covered:
- `<style>` tag
- localised styles
- usiing refs

```html
<script>
  import Y0 from 'yaff0';
  const div1 = Y0.ref();
</script>


<style>
  h1 {
    color: red;
  }
  ref.div1 {
    color: blue;
  }
</style>


<h1>Hello, world!</h1>
<div ref={div1}>Some text</div>
```

This will apply the styles only to the current component.
Note that localised styles support `ref`s. This is used to reference individual elements.

The statement `import Y0 from 'yaff0';` is completely unnecessary but may be used to avoid linter errors.
The `Y0` identifier is a marker for the compiler to know that the user is using a YAFF0 runtime API.
It acts like a keyword in JS and HTML `<script>` tags. And just like keywords, `Y0` is not a valid variable name.

### Localised scripts
Topics covered:
- addEventListener
- {} syntax

```html
<script>
  const b1 = Y0.ref();

  function handleClick() {
    alert('Hello, world!');
  }

  b1.addEventListener('click', handleClick);
</script>


<button ref={b1}>
  Click me
</button>
```

This will define the `handleClick` function only for the current component.

**Note**:
- Using HTML attributes like `onclick` is not allowed as JS is loaded as modules.
- The `{}` syntax ends up converting the expression to a string. Quite a laid-back approach but it works.

### Localised state
Topics covered:
- states
- ref objects
- html hoisting

```html
<script>
  // a top level variable is always a state
  let count = 0;

  /* Y0.ref doesn't return an object.
     However, since YAFF0 files are compiled, YAFF0 knows this
     and automatically rewrites the correct code which sets each ref
     object to their corresponding element
     This is what I meant by "compilation magic" */
  const {b1, b2} = Y0.ref();

  function increment() {
    count += 1;
  }
  function decrement() {
    count -= 1;
  }

  b1.addEventListener('click', increment);
  b2.addEventListener('click', decrement);
</script>


<span>{count}</span>
<button ref={b1}>Increment</button>
<button ref={b2}>Decrement</button>
```

This will define the `count`, `increment` and `decrement` only for the current component.

Note that a ref object is needed to reference the button elements. During compilation, the ref usage in HTML is replaced with an ID and `ref` usage in JS is replaced by `getElementById` calls.

Also note that HTML code is hoisted above the script. This is because the script can reference the HTML elements. So you might as well define the HTML elements first.

### Props
Topics covered:
- props object
- prop drilling
- rendering directives

**Parent.html**:
```html
<script>
  let hide = false;

  function toggle() {
    hide = !hide;
  }
</script>


<button onclick={toggle}>Toggle</button>
<Child {hide} {toggle} />
```

**Child.html**:
```html
<script>
  const {hide, toggle} = Y0.props();
</script>

#if (hide)
  <div>Hidden</div>
  <button onclick={toggle}>Show</button>
#else
  <div>Visible</div>
  <button onclick={toggle}>Hide</button>
#end
```

**Note**:
- The `hide` and `toggle` are passed as props to the child component. Passed props are loaded from `Y0.props()`.
- YAFF0 can automatically detect if the parent has actually passed the prop being loaded.
- Directives use the `#` symbol. Such statements are converted directly into JS code during compilation.

### Passing component as a child
Topics covered:
- passing component as a child
- importing components

**Parent.html**:
```html
<script>
  import Child from 'path/to/Child';
</script>


<Child>
  <h1>Hello, world!</h1>
</Child>
```

**Child.html**:
```html
<script>
  const child = Y0.props();
</script>

<div>
  {child}
</div>
```

Types of files that can be imported:
- Components (`.html`)
- JS modules (`.js`)

### Looping
Topics covered:
- for loop directive
- while loop directive
- js directive

**For.html**:
```html
<script>
  let arr = [1, 2, 3, 4, 5];
</script>


#for (let i of arr)
  <div>{i}</div>
#end
```

**While.html**:
```html
<script>
  let i = 0;
</script>

<!--
You can also use the #js directive to create a variable i
#js let i = 0;
-->

#while (i < 5)
  <div>{i}</div>
  #js i += 1;
#end
```

**Note**:
- Note that `i` is not a state. If you make `i` a state, every time the loop runs, all dependent elements will be updated.
- The `js` directive is used to write JavaScript code directly with the HTML and can cause silly bugs.
- The `for` and `while` directives are used to loop over arrays and numbers respectively.

### Global states
Topics covered:
- global states aka Contexts
- using `await` in script directly
- exporting global states
- importing global states

**states.js**:
```js
const User = {
  name: 'Loading...',
  age: NaN,
};

export { User };
```

**Child.html**:
```html
<script>
  import States from 'path/to/states.js';
  import ApiFunctions from 'path/to/apifn.js';
  import Validations from 'path/to/validations.js';

  let User = States.User;
  console.log(User);

  const user = await ApiFunctions.apiCall();

  if (Validations.isValid(user)) {
    User = { ...User, ...user };
  }
</script>


<div>
  <span>{User.name}</span>
  <span>{User.age}</span>
</div>
```

**Note**:
- Global states are defined in a separate file and imported where needed.
- The `await` keyword can be used directly in the script tag.

### State Initializers
Topics covered:
- state initializers
- await in state initializers

**states.js**:
```js
import ApiFunctions from 'path/to/apifn.js';
import Validations from 'path/to/validations.js';

const User = {
  name: 'Loading...',
  age: NaN,
};

const user = await ApiFunctions.apiCall();

if (Validations.isValid(user)) {
  User = { ...User, ...user };
}

export { User };
```

**Note**:
- State initializers are defined with global states.
- The `await` keyword can be used directly in the state initializer.
- Till the state is initialized, the value will remain the default value.

### Global styles
Topics covered:
- global styles aka themes

**styles.css**:
```css
@style S1 {
  h1 {
    color: red;
  }
  .container {
    display: flex;
  }
}

@style S2 {
  h1 {
    color: blue;
  }
}
```

**Child.html**:
```html
<script>
  import Styles from 'path/to/styles.css';
</script>


<Styles.S1>
  <h1>Hello, world!</h1>
  <div class="container">
      <span>Some text</span>
  </div>
</Styles.S1>
```

**Note**:
- Global styles are defined in a separate file and imported where needed.
- Styles support additional scoping i.e. `<StyleName>` tag applies styles only to the children of the tag.
- Classe, IDs and all CSS selectors are supported. More accurately, YAFF0 doesn't care about semantics of the CSS.
- Global styles do not support `ref` like localised styles.

### Routing aka Pages
Topics covered:
- routing

**routes.js**:
```js
import Home from 'path/to/Home';
import About from 'path/to/About';
import Contact from 'path/to/Contact';
import NotFound from 'path/to/NotFound';
import Redirecting from 'path/to/Redirecting';

const PageMap = {
  HOME: '/',
  ABOUT: '/about',
  CONTACT: '/contact',
};

Y0.pages.add(pages.HOME, Home);
Y0.pages.add(pages.ABOUT, About);
Y0.pages.add(pages.CONTACT, Contact);

Y0.pages.addOnStatus(404, NotFound);
Y0.pages.addOnStatus(302, Redirecting);

export default PageMap;
```

Routing is done by defining a map of pages and their respective paths in `routes.js`. The routes file should be imported in `App.html`. The `PageMap` object is used to map pages to their respective paths. The `Y0.pages.add` method is used to add a page to the routing system. The `Y0.pages.addOnStatus` method is used to add a page to the routing system for specific status codes.

**App.html**:
```html
<script>
  let state = 0;

  function setState(s) {
    state = s;
  }

  state = 404;
</script>

#if (state === 0)
  <Y0.Pages.GoTo {Y0.Pages.HOME} />
#else if (state === 302)
  <Y0.Pages.GoTo {302} />
#else
  <Y0.Pages.GoTo {404} />
#end
```

If a page does not exist, JavaScript error will be thrown.

## List of Config Options
- `quiet`: Suppress non-error output
  - Possible values: `true`, `false`
  - Default value: `false`
