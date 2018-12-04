# Canvas 手写板的实现与优化（施工中）

最近在公司接了几个项目，都和 Canvas 手绘手写有关的，有历史遗留项目，还有要从头写的新需求。之前对 Canvas 的认知比较少，只写过一个带动画的圆环百分比小组件（[GitHub - ElizurHz/vue-percentage: 圆环百分比小组件](https://github.com/ElizurHz/vue-percentage)），是定好数据后再把它画到 Canvas 上，而手写板是第一次接触。

## 相关基础知识

### Canvas 基本用法

### Canvas 事件

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

## 额外功能

### 单次手写保存成图片

### 删除、空格、换行、清空

### 所有的手写内容拼接并保存为一张图片
