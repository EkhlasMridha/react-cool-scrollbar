![npm](https://img.shields.io/npm/v/react-cool-scrollbar) ![NPM License](https://img.shields.io/npm/l/react-cool-scrollbar) ![ReactJS](https://img.shields.io/badge/-ReactJs-61DAFB?logo=react&logoColor=white&style=flat)

# react-cool-scrollbar

It's a simple react library for a customized browser independent scrollbar for your web page

## Installation

### npm

`npm install react-cool-scrollbar`

### or yarn

`yarn add react-cool-scrollbar`

## How to use

### import component and styles

Import `ReactCoolScrollbar` component and styles

```typescript
import { ReactCoolScrollbar } from "react-cool-scrollbar"; //scroller component
import "react-cool-scrollbar/dist/style.css"; //style files
```

### Using the component

You can use the component like below example-

```typescript
function App() {
  return (
    <div className="app">
      {/** .app {display: flex;} */}

      <ReactCoolScrollbar>
        {/** your scrollable content here */}
      </ReactCoolScrollbar>
    </div>
  );
}

export default App;
```

You must import the style file to make the scrollbar work.\
Make sure the parent of `ReactCoolScrollbar` component must be the scroll host of the scrollable content.\
Make the style property of the parent as `display:flex`. This will work in most cases.

## Props

- `scrollerWidth` : Receives a `number` as input to set the width of the scrollbar.
- `className` : Can be used to style the custom scrollbar. The className will be applied on the container of `scrollTrack` and `scrollThumb`

- `customScrollTrack` : You can customize the scroll track by passing a component or a function that will return a component.

  - Example:
    ```typescript
    <ReactCoolScrollbar
      customScrollTrack={<div className="custom-scroll"></div>}
    >
      {/** your scrollable content here */}
    </ReactCoolScrollbar>
    ```
    or
    ```typescript
    <ReactCoolScrollbar
      customScrollTrack={(props) => (
        <div className="custom-scroll" {...props}></div>
      )}
    >
      {/** your scrollable content here */}
    </ReactCoolScrollbar>
    ```
    The passed component or function will receive the following props

  ```
   handleMouseDown: (e: MouseEvent<HTMLDivElement>) => void;
   handleMouseUp: (e: MouseEvent<HTMLDivElement>) => void;
  ```

  If you use a separate component or function then you have to pass every received prop to your component.

- `customScrollThumb` : Same as `customScrollTrack` prop but it will customize the scroll thumb component. This component will receive prop
  - ```typescript
        handleMouseDown: (e: MouseEvent<HTMLDivElement>) => void;
    ```
    you have to be careful here that these props are passing down to your custom component properly

## License

[MIT](https://choosealicense.com/licenses/mit/)
