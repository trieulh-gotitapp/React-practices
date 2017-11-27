import React from 'react';

const content = document.createElement('div');
document.body.appendChild(content);

module.exports = class extends React.Component {
  static displayName = "03-basic-input";
  state = {
    fields: {
      name: '',
      email: ''
    },
    people: [],
  }

  onFormSubmit = (evt) => {
    evt.preventDefault();
    const people = [
      ...this.state.people,
      this.state.fields
    ]
    this.setState({
      people: people, 
      fields: {
        name: '',
        email: ''
      }
    });
  };

  onInputChange = (evt) => {
    const fields = this.state.fields
    fields[evt.target.name] = evt.target.value
    this.setState({fields: fields});
  }

  render() {
    return (
      <div>
        <h1>Sign Up Sheet</h1>

        <form onSubmit={this.onFormSubmit}>
          <input
            placeholder='Name'
            name='name'
            value={this.state.fields.name}
            onChange={this.onInputChange}
          />

          <input
            placeholder='Email'
            name='email'
            value={this.state.fields.email}
            onChange={this.onInputChange}
          />

          <input type='submit' />
        </form>

        <div>
          <h3>People</h3>
          <ul>
            {this.state.people.map((person,i)=> <li key={i}>{person.name} {person.email}</li>)}
          </ul>
        </div>
      </div>
    );
  }
};
