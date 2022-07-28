import { Component } from "../../../../../src/Badger.js";

export class MyComponent3 extends Component {
  initComponent(props) {
    this.debug("initComponent() => ", props.message);
  }
  message() {
    this.debug("message()");
    return 'Component 3 message: ' + this.props.message;
  }
}

export class MyComponent4 extends Component {
  initComponent(props) {
    this.debug("initComponent() => ", props.message);
  }
  message() {
    this.debug("message()");
    return 'Component 4 message: ' + this.props.message;
  }
}

export default {
  MyComponent3,
  MyComponent4
}