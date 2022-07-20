import { Component } from "../../../../../src/Badger.js";

export class MyComponent3 extends Component {
  initComponent(props) {
    this.debug("initComponent() => ", props.message);
  }
  message() {
    this.debug("message()");
    return this.props.message;
  }
}

// export default MyComponent3