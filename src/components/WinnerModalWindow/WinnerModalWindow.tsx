import React from 'react';

import './WinnerModalWindow.sass';

type TState = {
  isShown: boolean;
};

interface IProps {
  isShown: boolean;
  onClose: () => void;
  carWinner: {
    name: string;
    time: number;
  } | null;
}

export default class WinnerModalWindow extends React.Component<IProps, {}> {
  state: TState = {
    isShown: false,
  };

  componentDidUpdate(_prevProps: IProps) {
    if (_prevProps.isShown !== this.props.isShown) this.setState({ isShown: this.props.isShown });
  }

  render() {
    const message = this.props.carWinner
      ? winnerMessage(this.props.carWinner.name, this.props.carWinner.time)
      : 'All cars broke. Noone won :(';

    const { isShown } = this.state;
    return (
      <div
        className={`popup__wrapper ${isShown ? 'popup--shown' : 'popup--y'}`}
        onMouseDown={this.hidePopup}
      >
        <div className={`popup`}>
          <span className="popup__message">{message}</span>
        </div>
      </div>
    );
  }

  hidePopup = () => {
    this.setState({ isShown: false });
    this.props.onClose();
  };
}

const winnerMessage = (name: string, time: number) => {
  return `Race done. The winner is ${name}. Time - ${time}`;
};
