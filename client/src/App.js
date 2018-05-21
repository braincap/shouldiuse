import React, { Component } from 'react';
import './App.css';
import axios from 'axios';
import 'react-s-alert/dist/s-alert-default.css';
import 'react-s-alert/dist/s-alert-css-effects/jelly.css';
import Alert from 'react-s-alert';

class App extends Component {
  state = {
    phraseOne: '',
    phraseTwo: '',
    phraseOneResults: {},
    phraseTwoResults: {},
    winner: '',
    phraseOnePlaceHolder: [
      'peak interest',
      'deep seeded',
      'should have',
      'defuse the situation'
    ],
    phraseTwoPlaceHolder: [
      'pique interest',
      'deep seated',
      'should have',
      'diffuse the situation'
    ]
  };

  componentDidMount = () => {
    this.placeHolderShifter();
  };

  placeHolderShifter = () => {
    setTimeout(() => {
      let tempArrayOne = this.state.phraseOnePlaceHolder;
      let tempArrayTwo = this.state.phraseTwoPlaceHolder;
      tempArrayOne.push(tempArrayOne.shift());
      tempArrayTwo.push(tempArrayTwo.shift());
      this.setState({
        phraseOnePlaceHolder: tempArrayOne,
        phraseTwoPlaceHolder: tempArrayTwo
      });
      this.placeHolderShifter();
    }, 3000);
  };

  handleOnSubmit = async e => {
    e.preventDefault();
    if (this.state.phraseOne.length < 3 && this.state.phraseTwo.length < 3) {
      Alert.error('Please enter longer phrases in both boxes for comparison', {
        position: 'bottom',
        effect: 'jelly',
        timeout: 3000
      });
      return;
    }

    let res;
    try {
      res = await axios.get(
        `/api/search_phrases/?phraseOne=${this.state.phraseOne}&phraseTwo=${
          this.state.phraseTwo
        }`
      );
      const { phraseOne, phraseTwo } = res.data;
      this.setState({
        phraseOneResults: phraseOne,
        phraseTwoResults: phraseTwo,
        winner:
          Object.values(phraseOne).reduce(
            (sum, currentValue) => sum + currentValue
          ) >
          Object.values(phraseTwo).reduce(
            (sum, currentValue) => sum + currentValue
          )
            ? 'phraseOne'
            : 'phraseTwo'
      });
    } catch (error) {
      console.log(error);
    }
  };

  render() {
    return (
      <div className="App">
        <h1 className="question-text">Should I use</h1>
        <form onSubmit={this.handleOnSubmit}>
          <input
            autoFocus
            type="text"
            id="phraseOne"
            placeholder={this.state.phraseOnePlaceHolder[0]}
            className="phraseBox"
            value={this.state.phraseOne}
            onChange={e =>
              this.setState({ phraseOne: e.target.value.toLocaleLowerCase() })
            }
          />
          <h1 className="or">or</h1>
          <input
            type="text"
            id="phraseTwo"
            placeholder={this.state.phraseTwoPlaceHolder[0]}
            className="phraseBox"
            value={this.state.phraseTwo}
            onChange={e =>
              this.setState({ phraseTwo: e.target.value.toLocaleLowerCase() })
            }
          />
          <button
            type="submit"
            onClick={this.handleOnSubmit}
            className="question-mark"
          >
            <h1>?</h1>
          </button>
        </form>
        <div className="results">
          <ul
            className={`result-number ${
              this.state.winner === 'phraseOne' ? 'winner' : 'loser'
            }`}
          >
            {Object.values(this.state.phraseOneResults).map((value, index) => (
              <li key={Object.keys(this.state.phraseOneResults)[index]}>
                <h4>{value.toLocaleString()}</h4>
              </li>
            ))}
          </ul>
          <ul className="result-title">
            {Object.keys(this.state.phraseOneResults).map(value => (
              <li key={value}>
                <h4>{value}</h4>
              </li>
            ))}
          </ul>
          <ul
            className={`result-number ${
              this.state.winner === 'phraseTwo' ? 'winner' : 'loser'
            }`}
          >
            {Object.values(this.state.phraseTwoResults).map((value, index) => (
              <li key={Object.keys(this.state.phraseTwoResults)[index]}>
                <h4>{value.toLocaleString()}</h4>
              </li>
            ))}
          </ul>
        </div>
        <div className="footer">
          <h3>Developed by Jai</h3>
        </div>
        <Alert stack={{ limit: 3 }} />
      </div>
    );
  }
}

export default App;
