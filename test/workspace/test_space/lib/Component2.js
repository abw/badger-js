import { Component } from "../../../../src/Badger.js";

class Component2 extends Component {
  message() {
    this.debug("message()");
    return this.props.message;
  }
}

export default Component2