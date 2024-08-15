# Working

##### Outdated: Syntax changes were made but the main logic still applies.

## Input and Output

- **Source Directory**: The directory containing the input files. This directory may include `.html`, `.js`, and other types of files.
- **Output Directory**: The directory where the transformed files will be saved.

### Compiler Functionality

1. **Recursive Traversal**:
    - The compiler traverses the entire source directory recursively.
    - For each `.html` and `.js` file:
        - `.html` files are treated as components and are parsed and transformed into JavaScript.
        - `.js` files are treated as JavaScript modules and are parsed and transformed.
    - Other file types (e.g., CSS, images) are copied directly to the output directory without modification.

2. **JavaScript Files (`.js`)**:
    - Each `.js` file is processed as a JavaScript module.

3. **HTML Files (`.html`)**:
    - Each `.html` file is treated as a component and parsed to generate the corresponding JavaScript code.

## Compiler Steps

### Ref Parsing

1. **Ignore Delimiters**: 
   - The compiler begins by ignoring any unnecessary delimiters to focus on the main syntax.
   
2. **Pattern Matching**: The compiler searches for the following sequence of patterns in the code:
    - `var`, `let`, or `const` keyword.
    - Opening square bracket `[` after the variable declaration.
    - A comma-separated list of identifiers, representing variable names (e.g., `id1, id2, id3`).
    - Closing square bracket `]`.
    - Assignment operator `=`.
    - `Y0.ref()` function call.
    - An optional semicolon `;` to terminate the statement.

3. **Code Generation**:
    - If all the above patterns are found, the compiler generates code to load `getElementById` values into the `ref` objects. These references are stored in a hash map for easy access during further processing.

#### Alternative Pattern Matching

- The compiler also handles a simplified pattern:
    1. `var`, `let`, or `const` keyword.
    2. Single identifier (variable name).
    3. Assignment operator `=`.
    4. `Y0.ref()` function call.
    5. An optional semicolon `;`.

- This pattern similarly results in generating code for the reference object and storing the ref names in the hash map.

### State Parsing

1. **Ignore Delimiters**: 
   - The compiler begins by ignoring any unnecessary delimiters to focus on the main syntax.

2. **Pattern Matching**:
    - The compiler searches for declarations in the form:
        - `var`, `let`, or `const` keyword followed by an identifier.
        - Assignment operator `=`.
        - `Y0.state(expression)` function call.

3. **Code Transformation**:
    - The state is directly assigned to the expression by removing the `Y0.state(...)` wrapper.
    - The identifier is stored in a hash map dedicated to state management.

## HTML Parsing

### Overview

The HTML parsing phase of the compiler involves converting HTML tags into JavaScript code that can be executed to create DOM elements on the client side. This process also includes handling references (`ref`) and state objects to ensure that dynamic updates to the HTML structure are properly managed.

### HTML Traversal and Node Creation

1. **Traverse the HTML**:
    - The compiler recursively traverses the HTML structure, visiting each tag and its attributes.

2. **Generate JavaScript for Each Tag**:
    - For every HTML tag encountered, the compiler generates the corresponding JavaScript code to create the DOM node. This involves:
      - Using `document.createElement("tag-name")` to generate the element.
      - Applying attributes and properties to the element using standard JavaScript methods like `setAttribute`, `classList.add`, etc.

### Handling Attributes

1. **Copy Expressions**:
    - For attributes defined with expressions (e.g., `attr-name={expression}`), the expressions are copied directly into the generated JavaScript code.

2. **Handle `ref` Attributes**:
    - If an element has a `ref={refObjectName}` attribute:
      - The `ref` attribute is removed from the final generated code.
      - Instead, an `id` attribute is added to the element using a generated ID based on the `refObjectName`. This ID is produced using the function `GetIdFor(refObjectName)`.
      - This ID ensures that the reference can be easily accessed and manipulated in the JavaScript code.

### Handling State Objects

1. **Identify State Objects**:
    - If an attribute expression contains a state object (identified through a lookup in the state hash map), the compiler performs the following actions:
      - Generate a unique ID for the element using the `GetIdFor` function.
      - Store a tuple `(stateObjectName, id, update_expression)` in a hash table. This tuple includes:
        - `stateObjectName`: The name of the state object.
        - `id`: The generated ID for the HTML element.
        - `update_expression`: The JavaScript code required to update the attribute or property of the element when the state changes.

2. **Generate Update Expression**:
    - The `update_expression` is a piece of code that will be executed whenever the state object changes. It ensures that the corresponding attribute of the HTML element is updated to reflect the new state.

### Combining Update Expressions

1. **Group Update Expressions by `stateObjectName`**:
    - After all the HTML tags have been processed, the compiler groups all `update_expression`s by `stateObjectName`. 
    - A single update function is generated for each state object. This function will:
        - Iterate over all the elements associated with the state object.
        - Apply the corresponding `update_expression` to update the attributes based on the latest state.

2. **Incorporate Update Functions into JavaScript Code**:
    - The compiler then searches for usages of the `stateObjectName` in the `.js` code.
    - Whenever the state object is modified, the corresponding update function is called to refresh the affected parts of the HTML.

### Final Output

- The result of the HTML parsing step is a set of JavaScript code that:
  - Creates the necessary DOM nodes.
  - Handles dynamic updates through `ref` objects and state objects.
  - Ensures that the HTML structure reflects the current state of the application.

This process ensures that the generated JavaScript code is both efficient and dynamic, allowing for real-time updates to the UI based on state changes and references.

## Additional Notes

- All ref and state names are stored in hash maps to ensure that they can be efficiently accessed and managed during code generation.
- The compiler's parsing steps are designed to be extensible, allowing for future updates to handle more complex patterns and transformations.

This documentation provides a high-level overview of the current functionality of the compiler. Future updates will expand on HTML parsing and additional features.
