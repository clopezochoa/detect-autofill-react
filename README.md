# detect-autofill-react

A lightweight React hook for detecting autofill events on form inputs in modern browsers. This package provides an easy-to-use API to track autofill status on HTML elements, handle autofill events, and create responsive UI feedback.

## Features

- Detects browser autofill using animations, transitions, and input events.
- Provides autofill and autofill cancel events.
- Lightweight and dependency-free.
- Compatible with modern browsers.

## Installation

Install the package using npm, yarn, pnpm, or bun:

```bash
npm install detect-autofill-react
# or
yarn add detect-autofill-react
# or
pnpm add detect-autofill-react
# or
bun add detect-autofill-react
```

## Usage

Import the hook and use it in your React component:

```tsx
import React, { useRef } from "react";
import { useAutofillDetection } from "detect-autofill-react";

const AutofillExample = () => {
  const { isAutofilled } = useAutofillDetection(document);

  return (
    <form>
      <div>
        <label htmlFor="username">Username</label>
        <input
          id="username"
          name="username"
          type="text"
          className="autofill-detect"
        />
      </div>
      <div>
        <label htmlFor="password">Password</label>
        <input
          id="password"
          name="password"
          type="password"
          className="autofill-detect"
        />
      </div>
      <p>Autofill Status: {isAutofilled ? "Autofilled" : "Not Autofilled"}</p>
    </form>
  );
};

export default AutofillExample;
```

### API

#### Hook: `useAutofillDetection`

##### Parameters:

- `scope: AutofillScope | null` - The scope of the detection (can be a specific `HTMLElement` or `document`).

##### Returns:

- `isAutofilled: boolean` - Indicates whether the form field is autofilled.
- `autofillRef: React.RefObject<HTMLElement>` - Ref object for tracking autofill status.

### License

This package is licensed under the MIT License. See the LICENSE file for details.

### Contribution

Contributions are welcome! Please submit issues and pull requests via GitHub.
