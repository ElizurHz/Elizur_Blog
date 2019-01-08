# 在 React 中使用 RxJS（施工中）

## 为什么使用

管理异步操作！

## 使用高阶组件

## redux-observable

### redux-observable VS redux-saga

这两个库都是非常好的用于处理异步操作的 redux 中间件。redux-saga 基于 ES6 generator 来实现的。

简单来说：

Saga = Worker + Watcher

Rxjs = Epic(Type + Operators)

```JavaScript
import axios from 'axios' 

// redux-saga
function* watchSaga(){
  yield takeEvery('fetch_user', fetchUser) // waiting for action (fetch_user)
}

function* fetchUser(action){
  try {
    yield put({type:'fetch_user_ing'})
    const response = yield call(axios.get,'/api/users/1')
    yield put({type:'fetch_user_done',user:response.data})
  } catch (error) {
    yield put({type:'fetch_user_error',error})
  }
}

// redux-observable
const fetchUserEpic = action$ => 
  action$
    .ofType('fetch_user')
    .flatMap(()=>
      Observable.from(axios.get('/api/users/1')) // or use Observable.ajax
        .map(response=>({type:'fetch_user_done', user:response.data}))
        .catch(error => Observable.of({type:'fetch_user_error',error}))
        .startWith({type:'fetch_user_ing'})
    )
```

## rxjs-hooks
