import { Component } from "../../../../src/Badger.js";

class Component1 extends Component {
  initComponent(props) {
    this.debug("initComponent() => ", props.message);
  }
  message() {
    this.debug("message()");
    return this.props.message;
  }
  async messages() {
    const c2 = await this.workspace.component('Component2');
    return this.props.message + ', ' + c2.message();
  }
}

export default Component1