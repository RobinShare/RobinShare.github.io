# iOS的一对多的回调GCDMulticastDelegate(多播委托)

[2016-02-09]

在iOS中为了实现回调一般有如下几个方法：

```markdown
delegate
通知中心
block
KVO(较特殊的回调，姑且也算一种)
```

以上四种中在我自己的项目中比较常用的就是delegate和block了。

在现实中回调的需求也分两种

```
一对一的回调
一对多的回调
```

对于一对一的回调，在IOS中使用delegate、block都能实现。而一对多的回调基本就是通知中心了。

假如现在有一个需求，我们以图片下载为例。这里先忽略那些SDWebimage等已经封装好的第三方类库。对于图片下载一般的过程如下：

先判断该图片url是否已经下载完毕。如果已经下载完毕那么直接回调显示图片。如果没有下载那么进入下载过程.

使用合适的图片下载器下载图片。

图片下载完毕后回调显示图片。并且把该图片存到缓存中。

这里的难点是回调。如果一个页面中有多个地方需要显示同一张图片，那么势必会发生这样一种情况，就是同时有多个请求下载同意url的图片，并且下载完成后需要同时在多个地方显示图片。要是实现这样的需求，用现有的方案貌似很难解决。有的同学会想到通知中心，但是通知中心其实是一个广播服务，只要注册了接受该通知那么所有的注册者都能收到通知，但事实上我只需要在我需要下载的那个url的图片下载完后给出通知，而不需要所有的下载完毕事件都通知。这时候我们就需要多播委托了。

什么是多播委托？我直接拿其他博客上的一个定义来解释。简单地说，多播委托是指允许创建方法的调用列表或者链表的能力。当多播委托被调用时，列表中的方法均自动执行

在IOS中我就以我们平常用的最多的delagate为例，普通的delegate只能是一对一的回调，无法做到一对多的回调。而多播委托正式对delegate的一种扩展和延伸，多了一个注册和取消注册的过程，任何需要回调的对象都必须先注册。

如何在IOS中实现多播委托?老外早就已经写好了，而且相当的好用。我最初接触IOS多播委托是我在研究XMPPframework的时候，而多播委托可以说是XMPPframework架构的核心之一。具体的类名就是[GCDMulticastDelegate](https://github.com/euanlau/GCDMulticastDelegate)，从名字就可以看出，这是一个支持多线程的多播委托。那为什么要支持多线程呢?我的理解是多个回调有可能不是在同一个线程的，比如我注册回调的时候是在后台线程，但是你回调的时候却在UI线程，那就有可能出问题了。因此必须保证你注册的时候在哪个线程上注册的，那么回调的时候必须还是在那个线程上回调的。

**Demo1：**

比如有一个UserInfo(有一个userName的属性)的类，页面上有三个lable和一个按钮，当点击按钮的时候给userInfo的userName属性赋值，这时候三个lable同时显示userInfo的userName属性的值。

针对以上过程，我们需要对每个lable向userInfo实例注册，也就是向多播委托注册。当对userInfo的userName赋值的时候调用多播委托的方法，这里也就是调用setText方法。这样就能实现上面的需求了。用代码表示就是：

```objective-c
//继承自多播委托基类的userInfo类

@interface UserInfo : MulticastDelegateBaseObject

@property (nonatomic,strong)NSString *userName;

@end

@implementation UserInfo
-(void)setUserName:(NSString *)userName{

    _userName=userName;

    [multicastDelegate setText:userName];//调用多播委托

}

@end

 

-(void)viewDidLoad {
    [super viewDidLoad];
    //初始化一个userinfo的实例
    userInfo=[[UserInfo alloc] init]; 
  
    //添加一个lable
    UILabel *lable =[[UILabel alloc] initWithFrame:CGRectMake(0, 20, 100, 30)];
    lable.backgroundColor=[UIColor blueColor];
    lable.textColor=[UIColor blackColor];
    [userInfo addDelegate:lable delegateQueue:dispatch_get_main_queue()];//向多播委托注册
    [self.view addSubview:lable];

    lable =[[UILabel alloc] initWithFrame:CGRectMake(0, 60, 100, 30)];
    lable.backgroundColor=[UIColor blueColor];
    lable.textColor=[UIColor blackColor];
    [userInfo addDelegate:lable delegateQueue:dispatch_get_main_queue()];
    [self.view addSubview:lable];

    lable =[[UILabel alloc] initWithFrame:CGRectMake(0, 100, 100, 30)];
    lable.backgroundColor=[UIColor blueColor];
    lable.textColor=[UIColor blackColor];
    [userInfo addDelegate:lable delegateQueue:dispatch_get_main_queue()];
    [self.view addSubview:lable];

    //添加一个按钮
    UIButton *btn=[[UIButton alloc] initWithFrame:CGRectMake(200, 20, 100, 50)];
    [btn setBackgroundColor:[UIColor blueColor]];
    [btn setTitle:@"button1" forState:UIControlStateNormal];
    [btn addTarget:selfaction:@selector(btnCLicked:)
     forControlEvents:UIControlEventTouchUpInside];
    [self.view addSubview:btn];
}
```

**Demo2：**

iOS中通常的delegate模式只能有一个被委托的对象，这样当需要有多个被委托的对象时，实现起来就略为麻烦，在开源库XMPPFramework中提供了一个[GCDMulticastDelegate](https://github.com/euanlau/GCDMulticastDelegate)类，这个类实现的技术基础是OC的消息动态解析与转发，通过这些机制进行封装，很巧妙实现了一对多的delegate机制，避免了有这种需求的时候，都需要自己去维护这种逻辑的问题。代码不长，阅读难度也不是很大。调用的时候，核心是methodSignatureForSelector: -> forwardInvocation: -> doesNotRecognizeSelector逻辑的重写，关于这部分，可以参考我之前关于OC消息动态解析与转发的一篇博客，[iOS中的Rumtime](http://ablexie.github.io/md/codeMark/iOS中的Runtime.html)。这里需要注意的一点是，[GCDMulticastDelegate](https://github.com/euanlau/GCDMulticastDelegate)不能使用respondToSelector进行检测，但是其内部已经对不能实现调用的方法进行了处理，不会引发Exception。使用[GCDMulticastDelegate](https://github.com/euanlau/GCDMulticastDelegate)类可以为一个对象添加多个被委托的对象，用起来也比较方便，用法简单小结如下：

    （1）定义一个协议：

```objective-c
@protocol MyDelegate

@optional
-(void)test;

@end
```

    （2）在需要使用delegate的类中定义一个[GCDMulticastDelegate](https://github.com/euanlau/GCDMulticastDelegate)变量

```objective-c
@interface ViewController : UIViewController{
	GCDMulticastDelegate<MyDelegate> *multiDelegate;
}
```

    （3)定义多个实现了协议MyDelegate的类，如Object1和Object2；

    （4）在需要使用delegate的地方使用如下代码，将多个被委托的对象，添加到multiDelegate的delegate链中。

```objective-c
- (void)viewDidLoad{
     multiDelegate = (GCDMulticastDelegate <MyDelegate> *)[[GCDMulticastDelegatealloc] init];

     Object1 *o1 = [[Object1 alloc]init];

     Object2 *o2 = [[Object2 alloc]init];

     [multiDelegate addDelegate:o1 delegateQueue:dispatch_get_main_queue()];

     [multiDelegate addDelegate:o2 delegateQueue:dispatch_get_main_queue()];

     [multiDelegate test1];
}
```

     多播的delegate与通常的delegate不同，multiDelegate并没有实现协议中的方法，而是将协议中的方法转发到自己delegate链中的对象。   对multiDelegate对象调用test1方法时，由于[GCDMulticastDelegate](https://github.com/euanlau/GCDMulticastDelegate)没有实现test1方法，因此该类的forwardInvocation函数会被触发，在该函数中会遍历delegate链，对每一个delegate对象调用test1方法，从而实现了多个delegate。同时，在对multiDelegate调用协议方法时，采用的是异步的方式，协议方法会立刻返回，不会阻碍当前函数。



[BackHome](http://robinshare.github.io/)