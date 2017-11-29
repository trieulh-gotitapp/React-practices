import React from 'react';
import {createStore,combineReducers} from 'redux';
import {Provider, connect} from 'react-redux';
import uuid from 'uuid';
// function createStore(reducer, initialState) {
//   let state = initialState;
//   const listeners = [];

//   const subscribe = (listener) => (
//     listeners.push(listener)
//   );

//   const getState = () => (state);

//   const dispatch = (action) => {
//     state = reducer(state, action);
//     listeners.forEach(l => l());
//   };

//   return {
//     subscribe,
//     getState,
//     dispatch,
//   };
// }

// function reducer(state = {}, action) {
//   return {
//     activeThreadId: activeThreadIdRecucer(state.activeThreadId, action),
//     threads: threadsReducer(state.threads, action),
//   }
// }

const reducer = combineReducers({
  activeThreadId: activeThreadIdRecucer,
  threads: threadsReducer,
})

function activeThreadIdRecucer(state = '1-fca2', action) {
  if (action.type === 'OPEN_THREAD') {
    return action.id
  } else {
    return state;
  }
}

function messagesReducer(state = [], action) {
  switch (action.type) {
    case 'ADD_MESSAGE':
      {
        const newMessage = {
          text: action.text,
          timestamp: Date.now(),
          id: uuid.v4()
        }

        return state.concat(newMessage)
      }
    case 'DELETE_MESSAGE':
      {
        return state.filter((m) => (m.id !== action.id))
      }
    default:
      {
        return state
      }
  }
}

function threadsReducer(state = [{
  id: '1-fca2',
  title: 'Buzz Aldrin',
  messages: messagesReducer(undefined, {})
}, {
  id: '2-be91',
  title: 'Michael Collins',
  messages: messagesReducer(undefined, {})
}], action) {
  switch (action.type) {
    case 'ADD_MESSAGE':
    case 'DELETE_MESSAGE':
      {
        const threadIndex = findThreadIndex(state, action)

        const oldThread = state[threadIndex]

        const newThread = {
          ...oldThread,
          messages: messagesReducer(oldThread.messages, action),
          
        }

        return [
          ...state.slice(0, threadIndex),
          newThread,
          ...state.slice(threadIndex + 1, state.length)
        ]
      }
    default:
      {
        return state
      }
  }
}

function findThreadIndex(state, action) {
  switch (action.type) {
    case 'ADD_MESSAGE':
      return state.findIndex((t) => t.id === action.threadId)
    case 'DELETE_MESSAGE':
      return state.findIndex((t) => t.messages.find((m) => (m.id === action.id)))
    default:
      return state
  }
}

const initialState = {
  activeThreadId: '1-fca2',
  threads: [{ // Two threads in state
      id: '1-fca2', // hardcoded pseudo-UUID 
      title: 'Buzz Aldrin',
      messages: [{ // This thread starts with a single message already 
        text: 'Twelve minutes to ignition.',
        timestamp: Date.now(),
        id: uuid.v4()
      }]
    },
    {
      id: '2-be91',
      title: 'Michael Collins',
      messages: []
    }
  ]
}

const Tabs = (props) => (
  <div className = 'ui top attached tabular menu' >
    {
      props.tabs.map((tab, index) => (
        <div
          key={index}
          className={tab.active? 'active item': 'item'}
          onClick={() => props.onClick(tab.id)}>
          {tab.title}
        </div>
      ))
    }
  </div>
)

const mapStateToTabProps = (state) => {
  const tabs = state
    .threads
    .map((t) => ({
      title: t.title,
      active: t.id === state.activeThreadId,
      id: t.id
    }))
  
    return {
      tabs,
    }
}

const mapDispatchtoTabProps = (dispatch) => ({
  onClick: (id) => (store.dispatch({
    type: 'OPEN_THREAD',
    id: id
  })),
})


const ThreadTabs = connect(
  mapStateToTabProps,
  mapDispatchtoTabProps
)(Tabs)

const Thread = (props) => (
  <div className='ui center aligned basic segment'>
    <MessageList messages={props.thread.messages} onClick={props.onMessageClick}/>
    <TextFieldSubmit onSubmit={props.onMessageSubmit}/>
  </div>
)

const mapStateToThreadProps = (state) => ({
  thread: state.threads.find((t) => t.id === state.activeThreadId)
})

const mapDispatchtoThreadProps = (dispatch) => ({
  onMessageClick: (id) => (
    dispatch({
      type: 'DELETE_MESSAGE',
      id: id
    })
  ),
  dispatch: dispatch,
})

const mergeThreadProps = (stateProps, dispatchProps) => ({
  ...stateProps,
  ...dispatchProps,
  onMessageSubmit: (text) => (
    dispatchProps.dispatch({
      type: 'ADD_MESSAGE',
      text: text,
      threadId: stateProps.thread.id,
    })
  )
})

const ThreadDisplay = connect(
  mapStateToThreadProps,
  mapDispatchtoThreadProps,
  mergeThreadProps
)(Thread)

const MessageList = (props) => (
  <div className = 'ui comments' >
    {
      props.messages.map((message, index) => (
        <div className='comment' key={index} onClick={() => props.onClick(message.id)}>
          {message.text}
          <span className='metadata'>@{message.timestamp}
          </span>
        </div>
      ))
    }
  </div>
)

class TextFieldSubmit extends React.Component {
  state = {
    value: ''
  };

  onChange = (e) => {
    this.setState({value: e.target.value})
  };

  handleSubmit = () => {
    this.props.onSubmit(this.state.value)
    this.setState({value: ''});
  };

  render() {
    return (
      <div className='ui input'>
        <input onChange={this.onChange} value={this.state.value} type='text'/>
        <button onClick={this.handleSubmit} className='ui primary button' type='submit'>
          Submit
        </button>
      </div>
    );
  }
}

const store = createStore(reducer, initialState);

const App = () => (
  <div className='ui segment'>
    <ThreadTabs/>
    <ThreadDisplay/>
  </div>
)

const WrappedApp = () => (
  <Provider store={store}>
    <App/>
  </Provider>
)

export default WrappedApp
