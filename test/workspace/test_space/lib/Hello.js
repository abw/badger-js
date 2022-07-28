import { Component } from "../../../../src/Badger.js";

class Hello extends Component {
  initComponent(props) {
    this.debug("initComponent() => ", props.message);
  }
  message() {
    this.debug("message()");
    return this.props.message;
  }
}

export default Hello