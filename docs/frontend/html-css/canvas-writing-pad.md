# Canvas 手写板的实现与优化

最近在公司接了几个项目，都和 Canvas 手绘手写有关的，有历史遗留项目，还有要从头写的新需求。之前对 Canvas 的认知比较少，只写过一个带动画的圆环百分比小组件（[GitHub - ElizurHz/vue-percentage: 圆环百分比小组件](https://github.com/ElizurHz/vue-percentage)），是定好数据后再把它画到 Canvas 上，而手写板是第一次接触。

本文所涉及的代码是基于 [szimek/signature_pad](https://github.com/szimek/signature_pad) 这个开源组件进行改造的，所以下面会对源码进行一些解析，也会讲解一些我自己对其进行改造的经验。

## Canvas 相关基础知识

本文列举一些本文涉及到的必备知识和常用的 API，API 具体内容不过多赘述，详情可以在 [Canvas - Web API 接口参考 | MDN](https://developer.mozilla.org/zh-CN/docs/Web/API/Canvas_API) 查看。

### 基本用法

`<canvas>` 是 HTML5 中的一个标签，我们可以以如下方式书写：

```html
<canvas id="test" width="150" height="150"></canvas>
```

其中 width 和 height 是 canvas 的必需属性，否则无法看到绘制的内容。在初始化时我们也可以通过 `document.getElementById` 的方式获取 DOM 节点，并设置其 width 和 height 属性。**【注意：在已经绘制过的 canvas 上重设这两个属性会导致已绘制内容被清空】**

如需在 canvas 上绘制，我们需要获取它的“渲染上下文 (The rendering context)”

```JavaScript
const test = document.getElementById('test')
const ctx = test.getContext('2d')
```

### 绘制

在 Canvas 中我们定位使用的是坐标系，(0, 0) 代表的是最左上的点，可视区域最右下的点为 (width, height)。

- context.clearRect(x, y, width, height): 以 (x, y) 为基准（左上角的点），清空长为 width、宽为 height 的矩形中所绘制的所有内容
- context.eginPath(): 新建路径
- context.closePath(): 闭合路径
- context.stroke(): 绘制轮廓
- context.moveTo(x, y): 移动至点 (x, y)
- context.lineTo(x, y): 绘制一条从当前点到 (x, y) 的直线
- context.bezierCurveTo(cp1x, cp1y, cp2x, cp2y, x, y): 三次贝塞尔曲线

与图片相关的 API

- canvas.toBlob(): 当前 canvas 转化为 blob 对象，参数是一个回调函数，回调函数的参数就是 blob 对象。**回调函数是异步执行的！**
- canvas.toDataURL(): 转化为 base64 编码的 url。参数为图片格式，如 `'image/png'`。
- context.drawImage(): 把图片绘制到 canvas 上。它有三种使用方式，根据传参数量的不同会有不同的结果。详情见 [CanvasRenderingContext2D.drawImage() - Web API 接口参考 | MDN](https://developer.mozilla.org/zh-CN/docs/Web/API/CanvasRenderingContext2D/drawImage)。

### 贝塞尔曲线

[贝塞尔曲线 - 维基百科，自由的百科全书](https://zh.wikipedia.org/wiki/%E8%B2%9D%E8%8C%B2%E6%9B%B2%E7%B7%9A)

![Bézier_cube](./static/canvas-writing-pad/Bezier_3_big.gif)

这里主要讲一下本文涉及到的三次贝塞尔曲线。它有起点、控制点 1、控制点 2、终点四个关键的点。

三次贝塞尔曲线的公式如下：

![bezier_cube_formulation](./static/canvas-writing-pad/bezier_3_formulation.jpg)

其中 t 为参数。使 t 逐渐从 0 增大到 1，即可通过这个方程式画出贝塞尔曲线。

### 事件

实现手写板，我们需要监听 Canvas 上的事件。由于我们可能是用鼠标去绘画，也可能是在触屏上绘画，所以我们除了监听鼠标事件之外，还需要监听触摸事件。

* mousedown/touchstart: 鼠标点击/开始触摸
* mousemove/touchmove: 鼠标/触摸移动中
* mouseup/touchend: 鼠标按键抬起/触摸结束(离开屏幕)

用这些 API 能满足大多数情况下的需求，但是现在出现了如 Surface Pen, Apple Pen 这类的手写笔，W3C 也有相应的新标准：PointerEvent ([PointerEvent - Web API 接口 | MDN](https://developer.mozilla.org/zh-CN/docs/Web/API/PointerEvent))。

> PointerEvent 接口代表了由 指针 引发的DOM事件的状态，包括接触点的位置，引发事件的设备类型，接触表面受到的压力等。
> 指针 是输入设备的硬件层抽象（比如鼠标，触摸笔，或触摸屏上的一个触摸点）。指针 能指向一个具体表面（如屏幕）上的一个（或一组）坐标。
> 指针的 击中检测 指浏览器用来检测 指针事件的目标元素的过程。大多数情况下，这个目标元素是由 指针的位置和元素在文章中的位置和分层共同决定的。

PointerEvent 的使用方法和 MouseEvent、TouchEvent 很类似，但有新增一些有用的 Properties:

* PointerEvent.pointerType:  这个 property 表示的是接触类型，有 3 种 string 类型的值 - mouse, pen, touch，分别代表鼠标、触控笔、触摸。
* PointerEvent.pressure: 这个 property 表示的是压力等级，数值范围是从 0 到 1 ，如果我们没有压感触控笔，或者使用鼠标，那么这个值默认是 0.5。

## 实现方案

* 历史遗留的项目中使用的是监听 move 的事件，每次都用 `lineTo()`和`stroke()`绘制出线条。这样做存在的问题是延迟很严重，笔画不跟笔，同时锯齿感也很严重。
* 参考了 [GitHub - szimek/signature_pad: HTML5 canvas based smooth signature drawing](https://github.com/szimek/signature_pad) 的实现方案，使用的是三次贝塞尔曲线，由于三次贝塞尔曲线的绘制需要至少 4 个点，分别是起点、控制点 1、控制点 2、终点，所以不能每次 move 都 `stroke()`进行绘制，而是需要记录点坐标并通过计算来绘制。实际效果比上面一种方法的延迟和锯齿感都好很多，**但是唯独在 Surface Book + Surface Pen 上的延迟感还是很明显，而前一代的 iPad Pro + Apple Pen 非常流畅，不知道有没有做过 Surface Pen 适配的大神能解答这个问题**。于是我就想能不能用 PointerEvent 来解决，但测试用的 Surface Book 是公司的开发机，我们小组只有一台，常常被其他开发和 QA 抢去使用，所以没有机会去验证这个问题。

## 具体实现

接下来，我们对 [szimek/signature_pad](https://github.com/szimek/signature_pad) 的源码进行一番解析。需要注意的是，master 分支的源码是用 TypeScript 写的，而在 gh-pages 分支上有 ES5 的版本。为了让不懂 ts 的读者能看懂，下面会对 [ES5 版本](https://github.com/szimek/signature_pad/blob/gh-pages/js/signature_pad.js) 的代码进行解析。

### Classes

这里用了两个辅助类，Bezier 是贝塞尔曲线，而 Point 是 canvas 中需要用到的点。

```JavaScript
function Bezier(startPoint, control1, control2, endPoint) {
  this.startPoint = startPoint;
  this.control1 = control1;
  this.control2 = control2;
  this.endPoint = endPoint;
}

// Returns approximated length.
Bezier.prototype.length = function () {
  var steps = 10;
  var length = 0;
  var px = void 0;
  var py = void 0;

  for (var i = 0; i <= steps; i += 1) {
    var t = i / steps;
    var cx = this._point(t, this.startPoint.x, this.control1.x, this.control2.x, this.endPoint.x);
    var cy = this._point(t, this.startPoint.y, this.control1.y, this.control2.y, this.endPoint.y);
    if (i > 0) {
      var xdiff = cx - px;
      var ydiff = cy - py;
      length += Math.sqrt(xdiff * xdiff + ydiff * ydiff);
    }
    px = cx;
    py = cy;
  }

  return length;
};

/* eslint-disable no-multi-spaces, space-in-parens */
Bezier.prototype._point = function (t, start, c1, c2, end) {
  return start * (1.0 - t) * (1.0 - t) * (1.0 - t) + 3.0 * c1 * (1.0 - t) * (1.0 - t) * t + 3.0 * c2 * (1.0 - t) * t * t + end * t * t * t;
};
```

```JavaScript
function Point(x, y, time) {
  this.x = x;
  this.y = y;
  this.time = time || new Date().getTime();
}

Point.prototype.velocityFrom = function (start) {
  return this.time !== start.time ? this.distanceTo(start) / (this.time - start.time) : 1;
};

Point.prototype.distanceTo = function (start) {
  return Math.sqrt(Math.pow(this.x - start.x, 2) + Math.pow(this.y - start.y, 2));
};

Point.prototype.equals = function (other) {
  return this.x === other.x && this.y === other.y && this.time === other.time;
};
```

值得注意的是 Point 这个类中，原作者加入了点绘制的时间，在原作者的项目中是有根据绘制速度调整笔画粗细的，但这个在我的改造中因为需求的缘故被去掉了。

### mousedown/touchstart 

首先源码使用构造函数创建了一个 SignaturePad 的类。

```JavaScript
SignaturePad.prototype._strokeBegin = function (event) {
  this._data.push([]);
  this._reset();
  this._strokeUpdate(event);

  if (typeof this.onBegin === 'function') {
    this.onBegin(event);
  }
};
```

从这里开始的代码会出现很多 this 或者 self，它们如果没有特殊说明都是指代的构造函数中的 this 本身。

这部分没有什么关键的代码，直接调用 `this._strokeUpdate` 了。`onBegin` 是用户可以自定义的回调函数。

### mousemove/touchmove

```JavaScript
SignaturePad.prototype._strokeUpdate = function (event) {
  var x = event.clientX;
  var y = event.clientY;

  var point = this._createPoint(x, y); // 根据 event 对象中的 clientX 和 clientY 生成该点在 canvas 坐标系中的 Point 对象
  var lastPointGroup = this._data[this._data.length - 1];
  var lastPoint = lastPointGroup && lastPointGroup[lastPointGroup.length - 1];
  var isLastPointTooClose = lastPoint && point.distanceTo(lastPoint) < this.minDistance;

  // 如果绘制的点和之前的点距离太近，则跳过该点的绘制
  // Skip this point if it's too close to the previous one
  if (!(lastPoint && isLastPointTooClose)) {
    var _addPoint = this._addPoint(point),
        curve = _addPoint.curve,
        widths = _addPoint.widths;

    if (curve && widths) {
      this._drawCurve(curve, widths.start, widths.end);
    }

    this._data[this._data.length - 1].push({
      x: point.x,
      y: point.y,
      time: point.time,
      color: this.penColor
    });
  }
};

SignaturePad.prototype._createPoint = function (x, y, time) {
  var rect = this._canvas.getBoundingClientRect();

  return new Point(x - rect.left, y - rect.top, time || new Date().getTime());
};

/* 
 * 生成 Bezier 对象和曲线的宽度值
 * curve: Bezier 对象
 * widths: 包含 start 和 end 两个 properties
*/
SignaturePad.prototype._addPoint = function (point) {
  var points = this.points;
  var tmp = void 0;

  points.push(point);

  if (points.length > 2) {
    // Bezier 类需要 4 个点的参数，作者为了减少延迟，把第一个点复制了一次，构造成 4 个点的数组，以此计算前两个点之间的三次贝塞尔曲线的控制点
    // To reduce the initial lag make it work with 3 points
    // by copying the first point to the beginning.
    if (points.length === 3) points.unshift(points[0]);

    tmp = this._calculateCurveControlPoints(points[0], points[1], points[2]);
    var c2 = tmp.c2;
    tmp = this._calculateCurveControlPoints(points[1], points[2], points[3]);
    var c3 = tmp.c1;
    var curve = new Bezier(points[1], c2, c3, points[2]);
    var widths = this._calculateCurveWidths(curve);

    // Remove the first element from the list,
    // so that we always have no more than 4 points in points array.
    points.shift();

    return { curve: curve, widths: widths };
  }

  return {};
};

/* 
 * 绘制贝塞尔曲线
 * 绘制方法为从 0 至 1 逐步增大贝塞尔曲线的参数 t
 * 代码实际上就是公式的计算
*/
SignaturePad.prototype._drawCurve = function (curve, startWidth, endWidth) {
  var ctx = this._ctx;
  var widthDelta = endWidth - startWidth;
  var drawSteps = Math.floor(curve.length()); // 绘制步长是曲线的长度

  ctx.beginPath();

  for (var i = 0; i < drawSteps; i += 1) {
    // Calculate the Bezier (x, y) coordinate for this step.
    var t = i / drawSteps;
    var tt = t * t;
    var ttt = tt * t;
    var u = 1 - t;
    var uu = u * u;
    var uuu = uu * u;

    var x = uuu * curve.startPoint.x;
    x += 3 * uu * t * curve.control1.x;
    x += 3 * u * tt * curve.control2.x;
    x += ttt * curve.endPoint.x;

    var y = uuu * curve.startPoint.y;
    y += 3 * uu * t * curve.control1.y;
    y += 3 * u * tt * curve.control2.y;
    y += ttt * curve.endPoint.y;

    var width = startWidth + ttt * widthDelta;
    this._drawPoint(x, y, width);
  }

  ctx.closePath();
  ctx.fill();
};

// 绘制弧线
SignaturePad.prototype._drawPoint = function (x, y, size) {
  var ctx = this._ctx;

  ctx.moveTo(x, y);
  ctx.arc(x, y, size, 0, 2 * Math.PI, false);
  this._isEmpty = false;
};

// 计算贝塞尔曲线的控制点
SignaturePad.prototype._calculateCurveControlPoints = function (s1, s2, s3) {
  var dx1 = s1.x - s2.x;
  var dy1 = s1.y - s2.y;
  var dx2 = s2.x - s3.x;
  var dy2 = s2.y - s3.y;

  var m1 = { x: (s1.x + s2.x) / 2.0, y: (s1.y + s2.y) / 2.0 };
  var m2 = { x: (s2.x + s3.x) / 2.0, y: (s2.y + s3.y) / 2.0 };

  var l1 = Math.sqrt(dx1 * dx1 + dy1 * dy1);
  var l2 = Math.sqrt(dx2 * dx2 + dy2 * dy2);

  var dxm = m1.x - m2.x;
  var dym = m1.y - m2.y;

  var k = l2 / (l1 + l2);
  var cm = { x: m2.x + dxm * k, y: m2.y + dym * k };

  var tx = s2.x - cm.x;
  var ty = s2.y - cm.y;

  return {
    c1: new Point(m1.x + tx, m1.y + ty),
    c2: new Point(m2.x + tx, m2.y + ty)
  };
};
```

这一部分就是绘图的核心算法了，我在项目中也是直接使用了作者编写的代码。
在 `_addPoint()` 中有名为 `_calculateCurveWidths` 的函数，是原作者用于根据绘制速度计算笔画粗细的算法，原代码对应的相关参数是 `constructor` 中的 `this.maxWidth` 和 `this.minWidth`。
由于我做的项目不需要这个功能，所以我只需要把 `this.maxWidth` 和 `this.minWidth` 设置成相同的值即可。
这个功能详情可以参考前文提供的作者的 GitHub 上的源码。

主要内容已经用中文备注在代码中了，总结起来就是：选取3个点来计算控制点，根据控制点绘制出两点之间的曲线

### mouseup/touchend

```JavaScript
SignaturePad.prototype._strokeEnd = function (event) {
  var canDrawCurve = this.points.length > 2; // 如果点的数量太少，则无法绘制曲线
  var point = this.points[0]; // Point instance

  if (!canDrawCurve && point) {
    this._drawDot(point); // 点数量太少时改为绘制单个点
  }

  if (point) {
    var lastPointGroup = this._data[this._data.length - 1];
    var lastPoint = lastPointGroup[lastPointGroup.length - 1]; // plain object

    // 相同的点会被排除，不会被绘制
    // When drawing a dot, there's only one point in a group, so without this check
    // such group would end up with exactly the same 2 points.
    if (!point.equals(lastPoint)) {
      lastPointGroup.push({
        x: point.x,
        y: point.y,
        time: point.time,
        color: this.penColor
      });
    }
  }

  if (typeof this.onEnd === 'function') {
    this.onEnd(event);
  }
};

// 画点
SignaturePad.prototype._drawDot = function (point) {
  var ctx = this._ctx;
  var width = typeof this.dotSize === 'function' ? this.dotSize() : this.dotSize;

  ctx.beginPath();
  this._drawPoint(point.x, point.y, width);
  ctx.closePath();
  ctx.fill();
};
```

这里作者做了一个处理，就是在生成有效的点数量太少时则不会绘制曲线，改为绘制单点。如果忽略了此步，则会出现点触和小范围内移动无反应的情况，严重影响手写体验。

## 其他功能

这部分功能都是我根据需求加进去的。

### 单次手写保存成图片

首先我使用的 canvas 区域很大，但是实际上可能有手写内容的范围很小，所以这边要做一步剪裁的操作。
在上面的代码中有一个 `this._data` 的变量，这个变量记录了所有绘制过的点。
因此我们可以通过这个坐标数据来找出一个包含所有点的区域，再用 `drawImage()` 将其绘制到一个大小和这个区域相同的、隐藏的 canvas 中。
接着使用 `toBlob()` 或者 `toDataURL()` 就可以导出图片了。

### 所有的手写内容拼接并保存为一张图片

上面的【单次手写保存成图片】，在项目中我们是把它们排列起来，有空格、换行、退格等操作供排版，但是最后需要把这些所有的内容都导出成一张图片进行保存。
这里同样需要用到 `drawImage()`，不过区别在于不需要裁切。

我的解决方案是：首先每张图大小不同，所以我给每一行横向排列的图片定了一个固定的高度，超过这个高度的图片会被等比缩放到这个高度，未超过的则不作处理。
而绘制上去之后，每次都会移动绘制起始点，在同一行内的则直接向右侧平移（缩放后的）图片的宽度，空格就向右移动一段空白的位置，换行则向下移动一行的高度并移动到最左侧。

## 总结

仅仅是一个入门级的操作，但是用比较粗暴的方式实现的话，体验上和更优的方案的差距会比较明显。
