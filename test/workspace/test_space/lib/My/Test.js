import { Component } from "../../../../../src/Badger.js";

class Test extends Component {
  initComponent(props) {
    this.debug("initComponent() => ", props.message);
  }
  message() {
    this.debug("message()");
    return this.props.message;
  }
}

export default Test