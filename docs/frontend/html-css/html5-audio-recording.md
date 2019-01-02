# Web 前端录音（施工中）

音视频在前端算是一个比较偏的方向，之前对此了解也并不是很多，直到工作中的某个功能需要用到它。事实上这个领域在前端的应用也确实不广，这方面能力的需求也较少，包括招聘职位也少，绝大多数人和企业还是沉浸于 JavaScript 和 React、Vue 这样的框架，这是我自己的感受，也是前些天刚阅读了 [坚定你选择的前端技术方向](https://www.zhangxinxu.com/life/2018/12/firm-direction/) 这篇文章，有很多的共鸣。而我本人对音视频也有一定的业余基础的，例如我是音乐发烧友，自己也会做做视频剪辑和转码之类的。

废话不多说，下面就按照步骤来进行逐步拆解前端录音的步骤。

_本文参考了 [react-audio-analyser](https://github.com/jiwenjiang/react-audio-analyser) 这个库的源码。_

## 采集声音信息

首先，我们需要的是采集声音信息。

我们可以通过 `getUserMedia()` 来进行采集。但是要注意的是 getUserMedia() 有兼容性的问题，IE 不兼容，且有 `navigator.getUserMedia` 和 `Navigator.mediaDevices.getUserMedia()` 两个 API。MDN 推荐新代码尽量使用 `Navigator.mediaDevices.getUserMedia()`。
详情见：[MediaDevices.getUserMedia()
](https://developer.mozilla.org/en-US/docs/Web/API/MediaDevices/getUserMedia) 和 [navigator.getUserMedia](https://developer.mozilla.org/en-US/docs/Web/API/Navigator/getUserMedia)。

> It returns a Promise that resolves to a MediaStream object.

所以 `getUserMedia()` 的使用方式就是：

```JavaScript
navigator.mediaDevices.getUserMedia(constraints).then(stream => {
  // HANDLE SUCCESS
}).catch(err => {
  // HANDLE ERROR
})
```

其中 `constraints` 是参数，用于指定录制方式，在 [MDN](https://developer.mozilla.org/en-US/docs/Web/API/Navigator/getUserMedia) 上有详细介绍。这里我们只需要传入 `{ audio: true }` 即可进行音频录制。

然后这里提到了 MediaStream 对象，那么 [MediaStream(媒体流)](https://developer.mozilla.org/en-US/docs/Web/API/MediaStream) 又是什么呢？

> The MediaStream interface represents a stream of media content. A stream consists of several tracks such as video or audio tracks. Each track is specified as an instance of MediaStreamTrack.You can obtain a MediaStream object either by using the constructor or by calling MediaDevices.getUserMedia().

简而言之，就是包含一些音轨/视频轨道的对象。这个是我们需要的进行下一步操作的资源。

## MediaRecorder

[MediaRecorder](https://developer.mozilla.org/en-US/docs/Web/API/MediaRecorder) 是实现 MediaRecord Stream API 的最基本的接口。

在使用时，我们首先要 `new MediaRecord()`，然后可以用 `addEventListener` 或者 `on` 来监听事件，常用的 [事件](https://developer.mozilla.org/en-US/docs/Web/API/MediaRecorder#Event_Handlers) 有：
- dataavailable
- start
- stop
- pause
- resume
- error

实际使用中，我们只要监听 `dataavailable`，就可以在回调函数中的参数里取得 `data`。这里的 `data` 是一个只读的 Blob 对象。当然其他的事件也有用途，例如在录音开始/暂停/结束时执行一些自定义的回调函数等。

## Decode

## Bonus: 实时模拟波形图

干巴巴的录音可有点乏味，不过我们可以通过一些 Web API 实现数据的可视化（当然可能没法做到专业软件做出来的波形图这么精准）。

### AudioContext

[利用HTML5 Web Audio API给网页JS交互增加声音 «  张鑫旭-鑫空间-鑫生活](https://www.zhangxinxu.com/wordpress/2017/06/html5-web-audio-api-js-ux-voice/)

[AudioContext](https://developer.mozilla.org/en-US/docs/Web/API/AudioContext) 这个接口在网上有许多参考资料，这边就不再赘述了，毕竟我只是拿东西来做业务而已，没有去深入研究。这里只简单描述一下实现这个功能

基本步骤如下：
1. 在开始录制前先用 [createAnalyser()](https://developer.mozilla.org/en-US/docs/Web/API/BaseAudioContext/createAnalyser) 创建一个 AnalyserNode。由于 `AudioContext` 继承了 `BaseAudioContext`，所以我们可以直接用 `AudioContext` 来创建它。AnalyserNode 是可以用于数据可视化的。
2. 在开始录制的时候，用 [createMediaElementSource()](https://developer.mozilla.org/en-US/docs/Web/API/AudioContext/createMediaElementSource) 创建一个 `MediaElementAudioSourceNode`，`createMediaElementSource()` 有一个必传的参数，我们只要把上面 `getUserMedia()` 中获得的媒体流传入即可。
3. 使用 [AudioNode.connect()
](https://developer.mozilla.org/en-US/docs/Web/API/AudioNode/connect) 将 analyser 和 source 连接。假设步骤 2 中创建的实例存储在变量 source 中，步骤 1 中创建的实例存储在变量 analyser 中，那么只需要 `source.connect(analyser)` 即可。
4. 可以根据 analyser，使用 Canvas 进行绘图

## 兼容性与使用

[getUserMedia() 兼容性](https://caniuse.com/#search=getUserMedia)

[MediaRecorder() 兼容性](https://caniuse.com/#search=MediaRecorder)

Chrome 上需要 https 安全性验证，否则在使用 `getUserMedia()` 时会报如下的错误：

![chrome-error](./static/html5-audio-recording/chrome-error.png)

在本机调试的时候，我们可以使用 Chrome 的实验性功能来关闭验证：

![insecure](./static/html5-audio-recording/insecure.png)

- 首先在地址栏中输入 `chrome://flags/`
- 搜索 'Insecure origins treated as secure'
- 在文本框中输入调试的地址（可以是线上环境的地址，也可以是本机环境的地址），并将右侧的下拉选项选为 Enable
- 这时在底部 Chrome 会提示重启浏览器，点击重启即可

**在使用的时候一定要有录音设备，特别是台式机，否则会报错：**

![no device](./static/html5-audio-recording/no-record-device.png)
