# 在 React 中使用防抖动

## 什么是防抖动

防抖动其实就是保证在事件发生后的固定时间内，如果再触发该事件，则重新计算延时，直到这段延时内没有再次触发事件，则执行用户自定的函数。

更进一步说，防抖动分为立即执行和非立即执行，立即执行的运作方式有所不同，它是会先执行用户自定的函数，若在一段延时内未再触发该事件，则触发该事件才能再次执行函数；在该延时内触发的事件不执行函数，且重新计算延时。

### 基础版

关于防抖动的详情和具体实现，网上很多文章应该都介绍过了，这里不赘述，推荐一篇看过的应该是最好的文章：[函数防抖和节流 - 掘金](https://juejin.im/post/5b651dc15188251aa30c8669) 。不过这种代码实现比较“传统”，使用的是 ES5 和闭包。

```JavaScript
function debounce(func, wait) {
  var timeout;

  return function () {
    var context = this;
    var args = arguments;

    if (timeout) clearTimeout(timeout);
    
    timeout = setTimeout(function(){
      func.apply(context, args)
    }, wait);
  }
}
```

如果是按照上面的 ES5 + 闭包的形式编写 debounce 函数，那么使用方法如下：

```JavaScript
function print(value) {
  console.log(value)
}

debounce(print, 100)('123')
```

这也是 [lodash](https://github.com/lodash/lodash/blob/4ea8c2ec249be046a0f4ae32539d652194caf74f/debounce.js) 和 [underscore](https://github.com/jashkenas/underscore/blob/d5fe0fd4060f13b40608cb9d92eda6d857e8752c/underscore.js#L887) 中 debounce 的实现与使用方式。

### 进阶版

当然，我们也可以使用 Promise 来实现防抖动，参考：[理解函数防抖Debounce - 掘金](https://juejin.im/post/5bdb155b5188257f62136ce8) 。

```JavaScript
function debounce(method, wait, immediate) {
  let timeout
  let result
  let debounced = function(...args) {
    return new Promise(resolve => {
      let context = this
      if (timeout) {
        clearTimeout(timeout)
      }
      if (immediate) {
        let callNow = !timeout
        timeout = setTimeout(() => {
          timeout = null
        }, wait)
        if (callNow) {
          result = method.apply(context, args)
          resolve(result)
        }
      } else {
        timeout = setTimeout(() => {
          result = method.apply(context, args)
          resolve(result)
        }, wait)
      }
    })
  }

  debounced.cancel = function() {
    clearTimeout(timeout)
    timeout = null
  }

  return debounced
}
```

使用方法：

```JavaScript
function print(value) {
  return value
}

let debouncedFn = debounce(print, 1000, false)

debouncedFn('wtf').then(val => {
  console.log(val)
})
```

## React 中的防抖动

在 React 中，我们经常会需要在虚拟 DOM 上添加事件，比如最常用的 button 的 onClick 以及 input 的 onChange。

```JavaScript
class Test extends React.Component {
  onInputChange = (e) => {
    console.log(e.target.value)
  }

  render() {
    return (
      <div>
        <input onChange={this.onInputChange} />
      </div>
    )
  }
}
```

假如有如上所示的一个组件，如果我们想实现 debounce 触发 onChange 的话，我们需要这么写（假设以上面的 Promise 版本作为组件中的 debounce 函数）：

```JavaScript
class Test extends React.Component {
  constructor(props) {
    super(props)
    this.debounceInputChange = debounce(this.onInputChange, 666, false)
  }

  onInputChange = (e) => {
    console.log(e.target.value)
  }

  render() {
    return (
      <div>
        <input onChange={this.debounceInputChange} />
      </div>
    )
  }
}
```

或者：

```JavaScript
class Test extends React.Component {
  onInputChange = debounce((e) => {
    console.log(e.target.value)
  }, 666, false)

  render() {
    return (
      <div>
        <input onChange={this.onInputChange} />
      </div>
    )
  }
}
```

不可以写成这样：

```JavaScript
class Test extends React.Component {
  onInputChange = (e) => {
    debounce(this.requestAPI(), 666, false)
  }

  requestAPI = () => {
    // some API request
  }

  render() {
    return (
      <div>
        <input onChange={this.onInputChange} />
      </div>
    )
  }
}
```

如果需要在输入的时候防抖动请求服务端数据，这样写的结果就是仍然每次输入都会触发 input 的 onChange 事件，并且每次都会向服务端发出请求，只是每个请求会在 666 ms 的延时之后依次执行。

## PS

如果在服务端请求的函数中设置了 `setState`，那么有一定的可能性会遇到短时间内多次 `setState` 导致显示多次渲染，并且渲染的数据不是最新发出请求的数据。一般的 RESTful API 请求不太容易出现这种情况，但是最近我在做百度地图相关的开发时有遇到这样的情况。百度地图的 localSearch 使用的是 JSONP 的请求方式，不知道是不是和这个有关系。目前暂时没有找到解决方法。
