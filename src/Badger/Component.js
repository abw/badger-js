import { addDebug } from "./Utils/Debug.js";

export class Component {
  constructor(workspace, props={}) {
    this.workspace = workspace;
    this.props = props;
    addDebug(this, props.debug, props.debugPrefix, props.debugColor);
    this.initComponent(props);
  }
  initComponent() {
    // stub for subclasses
  }
}

export default Component