import React from "react";
import PropTypes from "prop-types";
import invariant from "invariant";
import RouterContext from "./RouterContext";

/**
 * The public API for prompting the user before navigating away
 * from a screen with a component.
 */
class InnerPrompt extends React.Component {
  static propTypes = {
    when: PropTypes.bool,
    message: PropTypes.oneOfType([PropTypes.func, PropTypes.string]).isRequired,
    router: PropTypes.shape({
      history: PropTypes.shape({
        block: PropTypes.func.isRequired
      }).isRequired
    }).isRequired
  };

  static defaultProps = {
    when: true
  };

  enable(message) {
    if (this.unblock) this.unblock();

    this.unblock = this.props.router.history.block(message);
  }

  disable() {
    if (this.unblock) {
      this.unblock();
      this.unblock = null;
    }
  }

  componentDidMount() {
    invariant(
      this.props.router,
      "You should not use <Prompt> outside a <Router>"
    );

    if (this.props.when) this.enable(this.props.message);
  }

  componentDidUpdate(prevProps) {
    if (this.props.when) {
      if (!prevProps.when || prevProps.message !== this.props.message)
        this.enable(this.props.message);
    } else {
      this.disable();
    }
  }

  componentWillUnmount() {
    this.disable();
  }

  render() {
    return null;
  }
}

const Prompt = props => (
  <RouterContext.Consumer>
    {({ router }) => <InnerPrompt {...props} router={router} />}
  </RouterContext.Consumer>
);

export default Prompt;
