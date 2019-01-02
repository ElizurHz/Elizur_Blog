# Web 前端录音（施工中）

音视频在前端算是一个比较偏的方向，之前对此了解也并不是很多，直到工作中的某个功能需要用到它。事实上这个领域在前端的应用也确实不广，这方面能力的需求也较少，包括招聘职位也少，绝大多数人和企业还是沉浸于 JavaScript 和 React、Vue 这样的框架，这是我自己的感受，也是前些天刚阅读了 [坚定你选择的前端技术方向](https://www.zhangxinxu.com/life/2018/12/firm-direction/) 这篇文章，有很多的共鸣。

废话不多说，下面就按照步骤来进行逐步拆解前端录音的步骤。

## 采集声音信息

首先，我们需要的是采集声音信息。

我们可以通过 `getUserMedia()` 来进行采集。但是要注意的是 getUserMedia() 有兼容性的问题，IE 不兼容，且有 `navigator.getUserMedia` 和 `Navigator.mediaDevices.getUserMedia()` 两个 API。MDN 推荐新代码尽量使用 `Navigator.mediaDevices.getUserMedia()`。详情：[MediaDevices.getUserMedia()
](https://developer.mozilla.org/zh-CN/docs/Web/API/MediaDevices/getUserMedia)，[navigator.getUserMedia](https://developer.mozilla.org/zh-CN/docs/Web/API/Navigator/getUserMedia)。

> 它返回一个 Promise 对象，成功后会resolve回调一个 MediaStream 对象。

所以 `getUserMedia()` 的使用方式就是：

```JavaScript
navigator.mediaDevices.getUserMedia(constraints).then(stream => {
  // HANDLE SUCCESS
}).catch(err => {
  // HANDLE ERROR
})
```

这里提到了 MediaStream 对象，那么 MediaStream 又是什么呢？

## MediaRecorder

## Decode

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
