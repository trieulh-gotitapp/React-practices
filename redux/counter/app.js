function reducer(state, action) {
    if (action.type === 'INCREMENT') {
        return state + action.amount
    } else if (action.type === 'DECREMENT') {
        return state - action.amount
    } else {
        return state
    }
}

function createStore(reducer) {
    let state = 0

    const getState = () => (state)

    const dispatch = (action) => {
        state = reducer(state, action)
    }

    return {
        getState,
        dispatch
    }
}

const incrementAction = {
    type: 'INCREMENT',
    amount: 3,
}
const unknownAction = {
    type: 'UNKNOWN',
}
const decrementAction = {
    type: 'DECREMENT',
    amount: 4,
}

const store = createStore(reducer)

store.dispatch(incrementAction)
console.log(store.getState())
store.dispatch(incrementAction)
console.log(store.getState())
store.dispatch(decrementAction)
console.log(store.getState())