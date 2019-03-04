# Dudo小游戏开发文档 
2018.7.29
- Designer 是我们自己的关卡设计工具
- Duet 是游戏主体工程文件夹
- Subdomain 是微信开放数据域(也就是我们的排行榜)的工程文件夹

## 一、游戏开发背景

1. 游戏选题

起初听到助教说这次大作业可以实现自己喜欢的一款手机游戏，恰好我们对** Duet**（中文名为**二重奏**）这款手机游戏非常感兴趣，于是决定开发一款类似 **Duet** 的微信小游戏。

1. 游戏介绍

**Duet**是一款休闲游戏，屏幕上玩家控制的两个可旋转的点，点击屏幕左侧两个点同时进行逆时针旋转，点击屏幕右侧则进行顺时针旋转，游戏过程中通过这两个操作躲避所有障碍即可通关。

1. 说明

我们的创意来自于原作品**Duet**，但是我们所有的工作，包括寻找素材，找寻游戏规律，实现障碍组合、切换关卡等等都是我们自主完成，未参考他人工作成果。

1. 开发环境
   - IDE：Cocos Creator 1.9
   - 编程语言：JavaScript (ES6)
   - 操作系统：macOS 10.13 和 Windows 10 Pro Education
   - 上传工具：微信web开发者工具 v1.02.1807200

## 二、游戏策划与功能

1. 游戏概要
   - **名称**：二重奏
   - **概述**：《二重奏》是一款跑酷向的休闲游戏，游戏中出现的物体很简单，一种是玩家操控的红蓝圆块，以对称的方式分布在一个圆周上，玩家通过点击屏幕左右两侧来控制这两个圆块。点击屏幕左侧可以让两个圆块在圆周上**逆时针**地旋转，点击屏幕右侧**顺时针**地旋转。而由于这两个圆块对称分布在圆周上，他们之间的距离永远都是一个直径。游戏目的非常简单，就是通过旋转躲避所有遇到的障碍物。
   - **特色：**此游戏特色主要在于简约的画风，在躲避障碍时由于是两个小球同时运动，玩家需要同时照顾这两个圆块不被撞到，其中包含了许多遇到不同障碍时的应对策略，由于障碍的种类其实非常有限，所以游戏中有数种特殊动作来给障碍增加难度，例如一个障碍可能会突然向下加速，可能会不断左右移动而难以判断会停在哪一边，甚至有可能会突然消失，只能通过感觉来通过这个障碍。此游戏的困难之处并不在于各个独立的障碍，而是在于当这些障碍组合到一起时玩家能否把握游戏节奏和能否快速反应出下一步的运动方式
2. 界面场景设定

此部分请直接查看文档第三部分——界面布局设计

1. 游戏元素

游戏进行中的元素只有两类，控制的红蓝圆块和障碍物，对于圆块，请见游戏概要，此处不再赘述。这里说一下障碍物。
游戏中的障碍物拥有不同的难度等级，障碍共有两个大类，每个大类中又分为几个小类（这些障碍全部定义在文件levels.js中）：

- 没有旋转效果的矩形障碍
  - 长条
  - 短条
  - 大的方块
  - 大小中等的方块
- 拥有旋转效果的旋转型障碍
  - 位置在中央的可旋转条
  - 位置在两边的可旋转条

这些不同的分类都有着独立的大小，而游戏中的障碍物除了所处的大类小类不同外，还有不同的对齐方式，其可以影响一个障碍物的位置。我们定义的对齐方式一共有七种：

```
left, right, middle, float_left, float_right, leftMost, rightMost
```

其中带有float表示方向偏向一边但不在一边，Most表示此障碍物的中心在最左或最左右，即只有一半被显示在屏幕中。
通过上面的几种不同类别和对齐方式，在加上对障碍之间距离的定义，可以获得许多关卡和组合方式，但是这些还是不够组成游戏内容。于是加入了几种动作，例如旋转种类的障碍带有旋转的效果，即障碍会不断旋转，而玩家需要把握好时机躲过障碍物；另外的几种动作如游戏特色中所述，突然下移，左右移动，以及逐渐消失。这些动作的组合形成了最终的关卡样式。

1. 游戏模式

游戏共有三种模式供选择，其中故事模式为我们提前设定的43关，逐步引入上述障碍组合方式，向玩家提供一个游戏的过渡过程，难度也是逐渐上升。如从**否定**关卡开始，提供可以旋转的障碍，**愤怒**关卡开始提供突然下移的动作等。另外的挑战模式，其关卡组成和故事模式一样，但是速度快了许多，故事模式中游戏速度随着关卡的深入逐渐加快，而挑战模式的速度则是固定在了1.7倍于常规速度，快了许多。最终是无尽模式，无尽模式随机生成一定模式的障碍，玩家共有三条生命，每经过一定距离就获得一些分数，速度固定在了常规速度的1.5倍，难度也较大。

## 三、界面布局和设计

由于我们的游戏整体风格为简约风，所以我们的界面布局也力求简洁凝练，通过少量的的按钮、页面等UI元素组成我们的界面。下面分别介绍主菜单和关卡(或教程）界面的布局设计：

1. 主菜单界面

主菜单由红、蓝两个小球围绕着位于屏幕中心偏上的圆心做匀速圆周运动，屏幕下方有三个按钮，从左到右依次是排行榜、教程和开始按钮。其中，

- 点击排行榜按钮则唤出排行榜小窗，排行榜小窗是从上至下用垂直布局(Vertical Layout)将各个元素进行排布的。从上至下分别是标题、排行榜表头、各个好友的记录和三个操作按钮（上一页、关闭和下一页）。每一条好友记录都由一个已经预制好的模板资源 (Prefab) 嵌入不同的信息生成，其内部横向布局严格规整；
- 点击教程按钮会直接跳转到教程场景；
- 点击开始按钮会唤出关卡选择页面，关卡选择页面整体框架使用的是Cocos Creator中一个叫做Pageview的UI组件，它能够支持横向翻页查看内容。通过自定义组件，我们将其改造成为适应于我们游戏特点的新布局。关卡选择页面顶部是页面标签，当前页面标签会有下划线并高亮。共分三页，从左到右分别为故事、无尽、挑战，每个页面中都有小标签，我们称之为章节。页面中的按钮分别代表相应模式下的对应关卡，按钮的排布是通过计算按键行距、章节间距和后期微调来完成的；
- 点击关卡选择页面中的任一按钮会直接跳转到关卡场景。

1. 关卡、教程界面

关卡和教程的界面是相同的。均为红、蓝两色小球在屏幕下方的白色圆环上运动，左上角会有返回按钮，点击则返回主菜单界面。在无尽模式下，还会在返回按钮下方放置生命值和分数的图样。（选择放在返回按钮下方而不是右方是因为考虑到在 iPhone X 上运行小游戏时它的“刘海”会遮住一部分小游戏界面。）

## 四、技术实现方案及重点与难点

1. 场景切换时信息的保留与传递

Cocos Creator中最基本的可视载体是场景文件，虽然所有的画面效果都可以在一个场景文件中，通过频繁地切换背景图和显示/隐藏页面元素的方式实现，但是这样很不优雅，也会导致这样的单个场景文件过于冗杂。所以我们选择使用多个场景文件，并在场景之间进行切换完实现相应的逻辑。但是切换场景面临的问题是：场景之下的信息都是作为组件属性挂载在场景文件下面的，切换场景之后这些信息如果不作处理无法被下一个场景利用。
为了解决这个问题，我们利用了Cocos Creator中的常驻节点机制，即在游戏初始化时就将这样一个节点设置为常驻节点Controller Node，它在场景切换时不会被销毁。于是我们通过将需要跨场景的信息保存在这个常驻节点中，这样就解决了上述问题。例如，在关卡选择页面中，点击每个按钮都会将包含对应关卡名字的事件派发出去，在常驻节点的controller组件中监听这个事件并保存关卡名字，用于加载关卡文件。

1. 关卡选择页面的自定义化

我们希望做出既可以左右滑动在页面之间切换，又可以上下滑动在页内浏览内容的翻页效果，但是Cocos Creator自带的Pageview组件只能支持横向翻页，无法适应我们一个页面有许多章节、许多按钮的需求。所以我们对其进行了改造——增添组件，删除部分节点。
我们在关卡选择页面内，我们捕获屏幕触摸开始和结束事件(Touchstart和Touchend)并停止其向父节点传播，因为选择页面是浮在父节点Canvas上的，向父节点传播触摸事件会导致触发主菜单按键或者让主菜单小球加速旋转(在主菜单按住空白处，小球会加速旋转)。捕获屏幕触摸移动事件(Touchmove)，读取移动的y值，用于上下移动页面视图。
指示器是另一个组件，通过获取原生Pageview组件当前页面索引，设置顶部三张图片的透明度和是否有下划线。

1. 排行榜——微信接口的调用

> 微信小游戏为了保护其社交关系链数据，增加了子域的概念，子域又叫**开放数据域**，是一个单独的游戏执行环境。子域中的资源、引擎、程序，都和主游戏完全隔离……由于子域只能在离屏画布 sharedCanvas 上渲染，因此需要我们把 sharedCanvas 绘制到主域上。
> ——Cocos Creator文档《接入微信小游戏的子域》

为了增强游戏的社交趣味性，我们选择加入无尽模式下分数的排行榜。正如文档里所说，子域中的资源、引擎、程序，都和主游戏完全隔离，在Cocos Creator中简单来说，排行榜和我们的游戏就是两个项目。经过尝试，我们发现直接在排行榜项目中添加按钮是没有作用的，因为子域只能在离屏画布上渲染，并把这个离屏画布上的内容“画到”到主域的某节点上，子域中的按钮在主域中只是一个图像而已，并无法相应点击事件。不仅如此，主域和子域之间的信息传递是单向的：只能主域向子域发送消息。所以在主域无法保存排行榜状态。
于是我们选择在唤出排行榜的时候，设置一个1000 ms的计时器，当时间到了之后将按钮显示出来，营造一种排行榜上的按键和排行榜一起经过加载出现在屏幕上。点击按键会由主域向子域发送消息，子域会监听这些消息并作出相应的响应操作。

1. 游戏场景的总控制

游戏场景下，给根节点绑定名为Game.js的组件，用以控制整个游戏的流程，其属性中包含了所有游戏过程中元素的引用，例如用户控制圆圈circle节点，障碍物obstacles节点，以及一些游戏的提示文字。游戏中有一些确定的数字量，如障碍物之间的单位距离，两个圆块之间的直径距离，统一放在了gamePreSet.js文件中，并且在controller节点加载时包含进来，这样对游戏中一些通用的量可以有比较好的管理。游戏中除了这一点就是游戏状态的更新，游戏中共定义了以下几种状态：

- on——游戏正常进行
- deadPause——玩家死亡之后的一瞬间需要暂停一会儿
- passPause——玩家成功过关之后同样有一段时间暂停
- rewind——玩家死亡之后需要退回到开始的状态，两个圆块也要回到角度为0的状态，此状态即完成这一动作
- revolve——玩家成功通过这一关，也要回到开始的状态，这一状态完成此动作

游戏中根据这些状态的分配以及绑定的一些事件即可以完成对游戏流程的总控制。在start函数中，绑定了一些事件的处理函数，包括加载下一关，撞击后死亡，撞击复活动作完成，开始下一关等。
除此之外，圆形块和障碍物也分别有自己的状态，通过状态决定他们的动作，但状态的更改都是由游戏总控制来更改。

1. 障碍物的动作实现

由于游戏中有几种比较复杂的障碍物动作，他们的实现方式都是通过组件的形式，首先所有的障碍物都是白色矩形，通过Rect这一个prefab来实现动态添加删除的功能。而不同的动作则是由组件来完成，需要一个动作时只需要挂载一个已经实现的组件并提供参数，即可实现动作。这样的好处在于可以将多个动作同时组合，使得一个障碍能做出多个动作。
在说明各个动作的实现之前，先解释一下障碍物整体是如何实现的，在obstacles.js文件中实现了这些，所有障碍物都挂在一个总障碍的节点下，这样在这个节点中绘制所有的障碍，直接移动这个节点，就能做到让所有障碍以某一速度一起移动。这样完全不会影响各个障碍之间的独立性，如果没有特殊动作，一个障碍被生成之后其实不需要多挂载任何组件。所以这个文件中需要实现的最核心功能即为**绘制**一个关卡，此函数根据一个输入的数组，将需要绘制的关卡绘制到obstacles节点中，作为其子节点，再根据提供的动画效果，加入动画组件。更新函数中，根据目前的游戏状态更新显示即可。（rewind状态下所有的动作都不是瞬间回去的，所以需要一个加速回到初始状态的过程，这一点在很多地方都有体现）
接下来介绍几个特殊动作：

- moveDown动作：障碍物在距离两个圆块一定距离时加速向下运动，只运动一个spacing的距离（一个spacing即为中心圆的直径，同时也是两个障碍物之前的单位距离）。接受两个参数，分别是开始运动的距离和运动速度的加成，moveDown这一动作的速度直接加给障碍，由于全部障碍还有一个向下运动的速度，故如果速度加成为0.5，障碍将以1.5倍于正常速度的速度移动。实现比较简单，在update中判断状态以及距离即可。
- moveLR动画：障碍物在运行到两个圆块之前先做一个左右的来回移动，包括运行之后也继续做这一动作。接受一个参数：左右运动速度和障碍物下移速度的比例。以障碍物初始时在左边为例，左右运动过程为：向右->向左->玩家做出动作通过这一障碍->向右->向左。实现同样不难，首先通过速度比例计算开始运动的距离（这一距离在moveDown动作中由参数给出，这里不能给出的原因在于一个来回运动是固定的），然后判断状态、距离，计算相应方向并运动即可。
- disappear动画：障碍物在距离两个圆块一定距离时开始消失，这一距离由参数给出，而消失的速度只和障碍物整体的速度有关。我们的默认设定是游戏速度100%时，每一帧其不透明度下降4，这一个值定义在gamePreSet.js文件中。实现同样，判断距离状态即可。
- 旋转动画：旋转动画的更新非常简单，更新节点的rotation值即可，但复杂的地方在于开始距离的计算和旋转角速度。经过测试，对于较短的中间旋转的块，其转速应该和用户控制两个圆块转动角速度一致（实际略小一些），在边上的较长的块，转速为用户控制物体转动角速度的1/3。然后再经过一些计算可得开始旋转的距离，在更新函数中判断距离旋转即可。

注：这些动作都包含了在rewind状态下，加速回到初始状态的动作，方式基本和正常进行一样，不过要多加一个加速倍数，此倍数由撞击时在obstacles.js文件中计算，由于rewind时间是确定的，故根据玩家已经走过路程不同，其速度会不同。

1. 游戏动画效果——两个圆球拖尾的实现

游戏中为了实现两个圆块的看起来向前运动的特效，以及旋转时的影子的效果，需要两个圆块后面的拖尾，我们首先看了cocos creator提供的拖尾效果，发现无法满足我们的要求，于是决定采用粒子效果，初始时定义其角度为-90，这样就可以发射到“后方”去，使用粒子特效可以得到我们需要的效果，同时在撞击死亡的瞬间，需要有一个撞击的效果，于是直接在代码中更改粒子效果，然后再结束后更改回来，即实现了撞击后爆炸的效果。

1. 关卡的生成和加载

### 关卡生成

关卡的定义全都在level.js这个文件中，每一个关卡都包含了一个障碍物数组，对于每一个对象，其定义了类别，对其，和上一个障碍之间的距离这几个变量，另外如果想要添加动作，直接添加动作的变量即可。对于关卡的生成，我们自己制作了43个不同的关卡，同时构建了一个关卡编辑器，可以较快的生成关卡并导出js代码。无尽模式的生成中，首先确定了几十种不同的障碍物组合方式，但这些方式中都不包含任何消失动画，除此之外其他动画和障碍都有，然后在随机地选取5～7种障碍物的模式，然后即可生成。对于消失动画，任何一个障碍都有50%的概率有消失动画，而消失动画也有不同的开始距离，这样可以保证生成的无尽模式关卡种类相当多，几乎不可能出现两个完全一致的。

### 关卡加载

关卡加载是obstacles.js文件的主体功能，通过输入的关卡障碍数组，开始在obstacles节点中添加子节点，需要通过种类决定其大小，通过对齐方式决定其x坐标，通过和上一个障碍的距离决定其y坐标，通过给定的动画添加动画组件。这样就能绘制一个关卡。

1. 碰撞的处理

cocos creator中已经给出了碰撞组件，直接挂载到两个圆块的节点上即可，而对于事件的处理，在Dot.js中，其作为圆块的组件，将撞击事件直接向上传播，直到Game.js中处理这个事件即可，当然撞击只有在游戏状态为进行时有反应。

1. 两个圆块的动作

圆块的动作相对比较简单，用户控制方面直接使用cocos creator的API即可。更新其位置同样比较简单，按下时更改角度即可。较难点在于用户死亡或者通关之后，两个圆块要逐渐运动到初始位置，即在rewind和revolve状态下，圆块的动作。为此，在Game.js中计算需要旋转的角度，然后在circle.js（两个圆块父节点所挂载的组件）中，根据目前状态更新，就可以实现这一动作。

## 五、游戏测试

我们两个人的手机型号分别是锤子坚果 Pro 2和荣耀 10，运行体验版的小游戏，除了排行榜唤出时获取微信云端数据时出现延迟外，其他交互无明显延迟。关卡之中的操作也十分顺滑流畅。我们在游戏开发时邀请一些同学、朋友做我们游戏的体验者，下面是一些测试感受：

| **名字** |  **手机型号**  |               **测试感受**               |
| :------: | :------------: | :--------------------------------------: |
|  Z同学   |  Vivo xplay5   |         “不卡顿，游戏体验可以的”         |
|  W同学   |    Vivo x7     |       “游戏体验流畅、关卡有些简单”       |
|  Z同学   |   iPhone 6s    |    “元素挺丰富，节奏很好，像原作一样”    |
|  M同学   |    iPhone 7    |        “关卡好难，其他都不错呀~”         |
|  H同学   |    iPhone 7    |       “很流畅，玩到停不下来(真的 ”       |
|  W同学   |   iPhone 6s    |              “游戏挺好的啊”              |
|  王述熠  |    荣耀 10     | “很好玩，加上动感的音乐和音效之后更是！” |
|   纳鑫   | 锤子坚果 Pro 2 |           “我也玩到停不下来！”           |

## 六、游戏亮点

本游戏的亮点主要在于比较困难的关卡，根据不少同学的反馈，游戏的难度较高，不过我们认为这是一件好事。
另外，游戏操作简单，容易上手，关卡的节奏性很强，考验玩家的反应和节奏把握能力，也会受玩家的喜爱。游戏中关卡多变，障碍的种类很多，有各种各样的动画和组合，可以很好的吸引玩家。三种不同的游戏模式和我们制作的43个不同的关卡都很有吸引力，能够很好地把握节奏通过难度较高的一小关可以给玩家带来成就感。

