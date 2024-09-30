# iOS之代码块Block攻关

[2016-06-06]

#### **概述**

代码块Block是苹果在iOS4开始引入的对C语言的扩展,用来实现匿名函数的特性,Block是一种特殊的数据类型,其可以正常定义变量、作为参数、作为返回值,特殊地,Block还可以保存一段代码,在需要的时候调用,目前Block已经广泛应用于iOS开发中,常用于GCD、动画、排序及各类回调。



>  注: Block的声明与赋值只是保存了一段代码段,必须调用才能执行内部代码



#### **Block变量的声明、赋值与调用**

**Block变量的声明**

```objective-c
Block变量的声明格式为: 返回值类型(^Block名字)(参数列表);

// 声明一个无返回值,参数为两个字符串对象,叫做aBlock的Block
void(^aBlock)(NSString *x, NSString *y);

// 形参变量名称可以省略,只留有变量类型即可
void(^aBlock)(NSString *, NSString *);
```

>  注: ^被称作"脱字符"

**Block变量的赋值**

```objective-c
Block变量的赋值格式为: Block变量 = ^(参数列表){函数体};

aBlock = ^(NSString *x, NSString *y){
    NSLog(@"%@ love %@", x, y);
};
```

>  注: Block变量的赋值格式可以是: `Block变量 = ^返回值类型(参数列表){函数体};`,不过通常情况下都将返回值类型省略,因为编译器可以从存储代码块的变量中确定返回值的类型

**声明Block变量的同时进行赋值**

```objective-c
int(^myBlock)(int) = ^(int num){
    return num * 7;
};

// 如果没有参数列表,在赋值时参数列表可以省略
void(^aVoidBlock)() = ^{
    NSLog(@"I am a aVoidBlock");
};
```

**Block变量的调用**

```objective-c
// 调用后控制台输出"Li Lei love Han Meimei"
aBlock(@"Li Lei",@"Han Meimei");

// 调用后控制台输出"result = 63"
NSLog(@"result = %d", myBlock(9));

// 调用后控制台输出"I am a aVoidBlock"
aVoidBlock();
```



#### **使用typedef定义Block类型**

在实际使用Block的过程中,我们可能需要重复地声明多个相同返回值相同参数列表的Block变量,如果总是重复地编写一长串代码来声明变量会非常繁琐,所以我们可以使用typedef来定义Block类型。

```objective-c
// 定义一种无返回值无参数列表的Block类型
typedef void(^SayHello)();
// 定义一种返回值类型为NSString，参数列表为两个NSString类型参数的Block类型
typedef NSString*(^FullName)(NSString*firstName,NSString*lastName);

// 我们可以像OC中声明变量一样使用Block类型SayHello来声明变量
SayHello hello = ^(){
    NSLog(@"hello");
};

FullName name = ^(NSString*firstName,NSString*lastName){
    return [NSString stringWithFormat:@"%@ %@",lastName,firstName];
};

// 调用后控制台输出"hello"
hello();

// 调用后控制台输出 "Li Fads"
NSLog(@"%@",name(@"Fads",@"Li"));
```



#### **Block作为函数参数**

**Block作为C函数参数**

```objective-c
// 1.定义一个形参为Block的C函数
void useBlockForC(int(^aBlock)(int, int))
{
    NSLog(@"result = %d", aBlock(300,200));
}

// 2.声明并赋值定义一个Block变量
int(^addBlock)(int, int) = ^(int x, int y){
    return x+y;
};

// 3.以Block作为函数参数,把Block像对象一样传递
useBlockForC(addBlock);

// 将第2点和第3点合并一起,以内联定义的Block作为函数参数
useBlockForC(^(int x, int y) {
    return x+y;
});
```

**Block作为OC函数参数**

```objective-c
// 1.定义一个形参为Block的OC函数
- (void)useBlockForOC:(int(^)(int, int))aBlock
{
    NSLog(@"result = %d", aBlock(300,200));
}

// 2.声明并赋值定义一个Block变量
int(^addBlock)(int, int) = ^(int x, int y){
    return x+y;
};

// 3.以Block作为函数参数,把Block像对象一样传递
[self useBlockForOC:addBlock];

// 将第2点和第3点合并一起,以内联定义的Block作为函数参数
[self useBlockForOC:^(int x, int y){
    return x+y;
}];
```

**使用typedef简化Block**

```objective-c
// 1.使用typedef定义Block类型
typedef int(^MyBlock)(int, int);

// 2.定义一个形参为Block的OC函数
- (void)useBlockForOC:(MyBlock)aBlock
{
    NSLog(@"result = %d", aBlock(300,200));
}

// 3.声明并赋值定义一个Block变量
MyBlock addBlock = ^(int x, int y){
    return x+y;
};

// 4.以Block作为函数参数,把Block像对象一样传递
[self useBlockForOC:addBlock];

// 将第3点和第4点合并一起,以内联定义的Block作为函数参数
[self useBlockForOC:^(int x, int y){
    return x+y;
}];
```



#### **Block内访问局部变量**

-  在Block中可以访问`局部变量`

```objective-c
// 声明局部变量global
int global = 100;

void(^myBlock)() = ^{
    NSLog(@"global = %d", global);
};
// 调用后控制台输出"global = 100"
myBlock();
```

-  在声明Block之后、调用Block之前对`局部变量`进行修改,在调用Block时`局部变量值`是修改之前的旧值

```objective-c
// 声明局部变量global
int global = 100;

void(^myBlock)() = ^{
    NSLog(@"global = %d", global);
};
global = 101;
// 调用后控制台输出"global = 100"
myBlock();
```

-  在Block中不可以直接修改`局部变量`

```objective-c
// 声明局部变量global
int global = 100;

void(^myBlock)() = ^{
    global ++; // 这句报错
    NSLog(@"global = %d", global);
};
// 调用后控制台输出"global = 100"
myBlock();
```

>  注: 原理解析,通过clang命令将OC转为C++代码来查看一下Block底层实现,clang命令使用方式为终端使用cd定位到main.m文件所在文件夹,然后利用clang -rewrite-objc main.m将OC转为C++,成功后在main.m同目录下会生成一个main.cpp文件

```c++
// OC代码如下
void(^myBlock)() = ^{
    NSLog(@"global = %d", global);
};

// 转为C++代码如下
void(*myBlock)() = ((void (*)())&__main_block_impl_0((void *)__main_block_func_0, &__main_block_desc_0_DATA, global));

// 将变量类型精简之后C++代码如下,我们发现Block变量实际上就是一个指向结构体__main_block_impl_0的指针,而结构体的第三个元素是局部变量global的值
void(*myBlock)() = &__main_block_impl_0(__main_block_func_0, &__main_block_desc_0_DATA, global);

// 我们看一下结构体__main_block_impl_0的代码
struct __main_block_impl_0 {
struct __block_impl impl;
struct __main_block_desc_0* Desc;
int global;
__main_block_impl_0(void *fp, struct __main_block_desc_0 *desc, int _global, int flags=0) : global(_global) {
    impl.isa = &_NSConcreteStackBlock;
    impl.Flags = flags;
    impl.FuncPtr = fp;
    Desc = desc;
  }
};

// 在OC中调用Block的方法转为C++代码如下,实际上是指向结构体的指针myBlock访问其FuncPtr元素,在定义Block时为FuncPtr元素传进去的__main_block_func_0方法
((void (*)(__block_impl *))((__block_impl *)myBlock)->FuncPtr)((__block_impl *)myBlock);

// __main_block_func_0方法代码如下,由此可见NSLog的global正是定义Block时为结构体传进去的局部变量global的值
static void __main_block_func_0(struct __main_block_impl_0 *__cself) {
    int global = __cself->global; // bound by copy
    NSLog((NSString *)&__NSConstantStringImpl__var_folders_6y_vkd9wnv13pz6lc_h8phss0jw0000gn_T_main_d5d9eb_mi_0, global);
}

// 由此可知,在Block定义时便是将局部变量的值传给Block变量所指向的结构体,因此在调用Block之前对局部变量进行修改并不会影响Block内部的值,同时内部的值也是不可修改的
```



#### **Block内访问__block修饰的局部变量**

-  在`局部变量`前使用`__block`修饰,在声明Block之后、调用Block之前对`局部变量`进行修改,在调用Block时`局部变量值`是修改之后的新值

```objective-c
// 声明局部变量global
__block int global = 100;

void(^myBlock)() = ^{
    NSLog(@"global = %d", global);
};
global = 101;
// 调用后控制台输出"global = 101"
myBlock();
```

-  在`局部变量`前使用`__block`修饰,在Block中可以直接修改`局部变量`

```objective-c
// 声明局部变量global
__block int global = 100;

void(^myBlock)() = ^{
    global ++; // 这句正确
    NSLog(@"global = %d", global);
};
// 调用后控制台输出"global = 101"
myBlock();
```

>  注: 原理解析,通过clang命令将OC转为C++代码来查看一下Block底层实现

```c++
// OC代码如下
void(^myBlock)() = ^{
    NSLog(@"global = %d", global);
};

// 转为C++代码如下
void(*myBlock)() = ((void (*)())&__main_block_impl_0((void *)__main_block_func_0, &__main_block_desc_0_DATA, (__Block_byref_global_0 *)&global, 570425344));

// 将变量类型精简之后C++代码如下,我们发现Block变量实际上就是一个指向结构体__main_block_impl_0的指针,而结构体的第三个元素是局部变量global的指针
void(*myBlock)() = &__main_block_impl_0(__main_block_func_0, &__main_block_desc_0_DATA, &global, 570425344);

// 由此可知,在局部变量前使用__block修饰,在Block定义时便是将局部变量的指针传给Block变量所指向的结构体,因此在调用Block之前对局部变量进行修改会影响Block内部的值,同时内部的值也是可以修改的
```



#### **Block内访问全局变量**

-  在Block中可以访问`全局变量`

```objective-c
// 声明全局变量global
int global = 100;

void(^myBlock)() = ^{
    NSLog(@"global = %d", global);
};
// 调用后控制台输出"global = 100"
myBlock();
```

-  在声明Block之后、调用Block之前对`全局变量`进行修改,在调用Block时`全局变量值`是修改之后的新值

```objective-c
// 声明全局变量global
int global = 100;

void(^myBlock)() = ^{
    NSLog(@"global = %d", global);
};
global = 101;
// 调用后控制台输出"global = 101"
myBlock();
```

-  在Block中可以直接修改`全局变量`

```objective-c
// 声明全局变量global
int global = 100;

void(^myBlock)() = ^{
    global ++;
    NSLog(@"global = %d", global);
};
// 调用后控制台输出"global = 101"
myBlock();
```

>  注: 原理解析,通过clang命令将OC转为C++代码来查看一下Block底层实现

```objective-c
// OC代码如下
void(^myBlock)() = ^{
    NSLog(@"global = %d", global);
};

// 转为C++代码如下
void(*myBlock)() = ((void (*)())&__main_block_impl_0((void *)__main_block_func_0, &__main_block_desc_0_DATA));

// 将变量类型精简之后C++代码如下,我们发现Block变量实际上就是一个指向结构体__main_block_impl_0的指针,而结构体中并未保存全局变量global的值或者指针
void(*myBlock)() = &__main_block_impl_0(__main_block_func_0, &__main_block_desc_0_DATA);

// 我们看一下结构体__main_block_impl_0的代码
struct __main_block_impl_0 {
struct __block_impl impl;
struct __main_block_desc_0* Desc;
__main_block_impl_0(void *fp, struct __main_block_desc_0 *desc, int flags=0) {
    impl.isa = &_NSConcreteStackBlock;
    impl.Flags = flags;
    impl.FuncPtr = fp;
    Desc = desc;
  }
};

// 在OC中调用Block的方法转为C++代码如下,实际上是指向结构体的指针myBlock访问其FuncPtr元素,在定义Block时为FuncPtr元素传进去的__main_block_func_0方法
((void (*)(__block_impl *))((__block_impl *)myBlock)->FuncPtr)((__block_impl *)myBlock);

// __main_block_func_0方法代码如下,由此可见NSLog的global还是全局变量global的值
static void __main_block_func_0(struct __main_block_impl_0 *__cself) {
    NSLog((NSString *)&__NSConstantStringImpl__var_folders_6y_vkd9wnv13pz6lc_h8phss0jw0000gn_T_main_f35954_mi_0, global);
}

// 由此可知,全局变量所占用的内存只有一份,供所有函数共同调用,在Block定义时并未将全局变量的值或者指针传给Block变量所指向的结构体,因此在调用Block之前对局部变量进行修改会影响Block内部的值,同时内部的值也是可以修改的
```



#### **Block内访问静态变量**

-  在Block中可以访问`静态变量`

```objective-c
// 声明静态变量global
static int global = 100;

void(^myBlock)() = ^{
    NSLog(@"global = %d", global);
};
// 调用后控制台输出"global = 100"
myBlock();
```

-  在声明Block之后、调用Block之前对`静态变量`进行修改,在调用Block时`静态变量值`是修改之后的新值

```objective-c
// 声明静态变量global
static int global = 100;

void(^myBlock)() = ^{
    NSLog(@"global = %d", global);
};
global = 101;
// 调用后控制台输出"global = 101"
myBlock();
```

-  在Block中可以直接修改`静态变量`

```objective-c
// 声明静态变量global
static int global = 100;

void(^myBlock)() = ^{
    global ++;
    NSLog(@"global = %d", global);
};
// 调用后控制台输出"global = 101"
myBlock();
```

>  注: 原理解析,通过clang命令将OC转为C++代码来查看一下Block底层实现

```c++
// OC代码如下
void(^myBlock)() = ^{
    NSLog(@"global = %d", global);
};

// 转为C++代码如下
void(*myBlock)() = ((void (*)())&__main_block_impl_0((void *)__main_block_func_0, &__main_block_desc_0_DATA, &global));

// 将变量类型精简之后C++代码如下,我们发现Block变量实际上就是一个指向结构体__main_block_impl_0的指针,而结构体的第三个元素是静态变量global的指针
void(*myBlock)() = &__main_block_impl_0(__main_block_func_0, &__main_block_desc_0_DATA, &global);

// 我们看一下结构体__main_block_impl_0的代码
struct __main_block_impl_0 {
struct __block_impl impl;
struct __main_block_desc_0* Desc;
int *global;
__main_block_impl_0(void *fp, struct __main_block_desc_0 *desc, int *_global, int flags=0) : global(_global) {
    impl.isa = &_NSConcreteStackBlock;
    impl.Flags = flags;
    impl.FuncPtr = fp;
    Desc = desc;
  }
};

// 在OC中调用Block的方法转为C++代码如下,实际上是指向结构体的指针myBlock访问其FuncPtr元素,在定义Block时为FuncPtr元素传进去的__main_block_func_0方法
((void (*)(__block_impl *))((__block_impl *)myBlock)->FuncPtr)((__block_impl *)myBlock);

// __main_block_func_0方法代码如下,由此可见NSLog的global正是定义Block时为结构体传进去的静态变量global的指针
static void __main_block_func_0(struct __main_block_impl_0 *__cself) {
    int *global = __cself->global; // bound by copy
    NSLog((NSString *)&__NSConstantStringImpl__var_folders_6y_vkd9wnv13pz6lc_h8phss0jw0000gn_T_main_4d124d_mi_0, (*global));
}

// 由此可知,在Block定义时便是将静态变量的指针传给Block变量所指向的结构体,因此在调用Block之前对静态变量进行修改会影响Block内部的值,同时内部的值也是可以修改的
```



#### **Block在MRC[**Manual Reference Counting:人工引用计数**]及ARC[**Automatic Reference Counting:自动引用计数**]下的内存管理**

**Block在MRC下的内存管理**

-  默认情况下,Block的内存存储在栈中,不需要开发人员对其进行内存管理

```objective-c
// 当Block变量出了作用域,Block的内存会被自动释放
void(^myBlock)() = ^{
    NSLog(@"------");
};
myBlock();
```

-  在Block的内存存储在栈中时,如果在Block中引用了外面的对象,不会对所引用的对象进行任何操作

```objective-c
Person *p = [[Person alloc] init];

void(^myBlock)() = ^{
    NSLog(@"------%@", p);
};
myBlock();

[p release]; // Person对象在这里可以正常被释放
```

-  如果对Block进行一次copy操作,那么Block的内存会被移动到堆中,这时需要开发人员对其进行release操作来管理内存

```objective-c
void(^myBlock)() = ^{
    NSLog(@"------");
};
myBlock();

Block_copy(myBlock);

// do something ...

Block_release(myBlock);
```

-  如果对Block进行一次copy操作,那么Block的内存会被移动到堆中,在Block的内存存储在堆中时,如果在Block中引用了外面的对象,会对所引用的对象进行一次retain操作,即使在Block自身调用了release操作之后,Block也不会对所引用的对象进行一次release操作,这时会造成内存泄漏

```objective-c
Person *p = [[Person alloc] init];

void(^myBlock)() = ^{
    NSLog(@"------%@", p);
};
myBlock();

Block_copy(myBlock);

// do something ...

Block_release(myBlock);

[p release]; // Person对象在这里无法正常被释放,因为其在Block中被进行了一次retain操作
```

-  如果对Block进行一次copy操作,那么Block的内存会被移动到堆中,在Block的内存存储在堆中时,如果在Block中引用了外面的对象,会对所引用的对象进行一次retain操作,为了不对所引用的对象进行一次retain操作,可以在对象的前面使用`__block`来修饰

```objective-c
__block Person *p = [[Person alloc] init];

void(^myBlock)() = ^{
    NSLog(@"------%@", p);
};
myBlock();

Block_copy(myBlock);

// do something ...

Block_release(myBlock);

[p release]; // Person对象在这里可以正常被释放
```

-  如果对象内部有一个Block属性,而在Block内部又访问了该对象,那么会造成循环引用

情况一

```objective-c
@interface Person : NSObject

@property (nonatomic, copy) void(^myBlock)();

@end


@implementation Person

- (void)dealloc
{
    NSLog(@"Person dealloc");

    Block_release(_myBlock);
    [super dealloc];
}

@end


Person *p = [[Person alloc] init];

p.myBlock = ^{
    NSLog(@"------%@", p);
};
p.myBlock();

[p release]; // 因为myBlock作为Person的属性,采用copy修饰符修饰(这样才能保证Block在堆里面,以免Block在栈中被系统释放),所以Block会对Person对象进行一次retain操作,导致循环引用无法释放
```

情况二

```objective-c
@interface Person : NSObject

@property (nonatomic, copy) void(^myBlock)();

- (void)resetBlock;

@end


@implementation Person

- (void)resetBlock
{
    self.myBlock = ^{
        NSLog(@"------%@", self);
    };
}

- (void)dealloc
{
    NSLog(@"Person dealloc");

    Block_release(_myBlock);

    [super dealloc];
}

@end


Person *p = [[Person alloc] init];
[p resetBlock];
[p release]; // Person对象在这里无法正常释放,虽然表面看起来一个alloc对应一个release符合内存管理规则,但是实际在resetBlock方法实现中,Block内部对self进行了一次retain操作,导致循环引用无法释放
```

-  如果对象内部有一个Block属性,而在Block内部又访问了该对象,那么会造成循环引用,解决循环引用的办法是在对象的前面使用`__block`来修饰,以避免Block对对象进行retain操作

情况一

```objective-c
@interface Person : NSObject

@property (nonatomic, copy) void(^myBlock)();

@end


@implementation Person

- (void)dealloc
{
    NSLog(@"Person dealloc");

    Block_release(_myBlock);
    [super dealloc];
}

@end


__block Person *p = [[Person alloc] init];

p.myBlock = ^{
    NSLog(@"------%@", p);
};
p.myBlock();

[p release]; // Person对象在这里可以正常被释放
```

情况二

```objective-c
@interface Person : NSObject

@property (nonatomic, copy) void(^myBlock)();

- (void)resetBlock;

@end


@implementation Person

- (void)resetBlock
{
    // 这里为了通用一点,可以使用__block typeof(self) p = self;
    __block Person *p = self;
    self.myBlock = ^{
        NSLog(@"------%@", p);
    };
}

- (void)dealloc
{
    NSLog(@"Person dealloc");

    Block_release(_myBlock);

    [super dealloc];
}

@end


Person *p = [[Person alloc] init];
[p resetBlock];
[p release]; // Person对象在这里可以正常被释放
```



#### **Block在ARC下的内存管理**

-  在ARC默认情况下,Block的内存存储在堆中,ARC会自动进行内存管理,程序员只需要避免循环引用即可

```objective-c
// 当Block变量出了作用域,Block的内存会被自动释放
void(^myBlock)() = ^{
    NSLog(@"------");
};
myBlock();
```

-  在Block的内存存储在堆中时,如果在Block中引用了外面的对象,会对所引用的对象进行强引用,但是在Block被释放时会自动去掉对该对象的强引用,所以不会造成内存泄漏

```objective-c
Person *p = [[Person alloc] init];

void(^myBlock)() = ^{
    NSLog(@"------%@", p);
};
myBlock();

// Person对象在这里可以正常被释放
```

-  如果对象内部有一个Block属性,而在Block内部又访问了该对象,那么会造成循环引用

情况一

```objective-c
@interface Person : NSObject

@property (nonatomic, copy) void(^myBlock)();

@end


@implementation Person

- (void)dealloc
{
    NSLog(@"Person dealloc");
}

@end


Person *p = [[Person alloc] init];

p.myBlock = ^{
    NSLog(@"------%@", p);
};
p.myBlock();

// 因为myBlock作为Person的属性,采用copy修饰符修饰(这样才能保证Block在堆里面,以免Block在栈中被系统释放),所以Block会对Person对象进行一次强引用,导致循环引用无法释放
```

情况二

```objective-c
@interface Person : NSObject

@property (nonatomic, copy) void(^myBlock)();

- (void)resetBlock;

@end


@implementation Person

- (void)resetBlock
{
    self.myBlock = ^{
        NSLog(@"------%@", self);
    };
}

- (void)dealloc
{
    NSLog(@"Person dealloc");
}

@end


Person *p = [[Person alloc] init];
[p resetBlock];

// Person对象在这里无法正常释放,在resetBlock方法实现中,Block内部对self进行了一次强引用,导致循环引用无法释放
```

-  如果对象内部有一个Block属性,而在Block内部又访问了该对象,那么会造成循环引用,解决循环引用的办法是使用一个弱引用的指针指向该对象,然后在Block内部使用该弱引用指针来进行操作,这样避免了Block对对象进行强引用

情况一

```objective-c
@interface Person : NSObject

@property (nonatomic, copy) void(^myBlock)();

@end


@implementation Person

- (void)dealloc
{
    NSLog(@"Person dealloc");
}

@end


Person *p = [[Person alloc] init];
__weak typeof(p) weakP = p;

p.myBlock = ^{
    NSLog(@"------%@", weakP);
};
p.myBlock();

// Person对象在这里可以正常被释放
```

情况二

```objective-c
@interface Person : NSObject

@property (nonatomic, copy) void(^myBlock)();

- (void)resetBlock;

@end


@implementation Person

- (void)resetBlock
{
    // 这里为了通用一点,可以使用__weak typeof(self) weakP = self;
    __weak Person *weakP = self;
    self.myBlock = ^{
        NSLog(@"------%@", weakP);
    };
}

- (void)dealloc
{
    NSLog(@"Person dealloc");
}

@end


Person *p = [[Person alloc] init];
[p resetBlock];

// Person对象在这里可以正常被释放
```



#### **Block在ARC下的内存管理的官方案例**

在MRC中,我们从当前控制器采用模态视图方式present进入MyViewController控制器,在Block中会对myViewController进行一次retain操作,造成循环引用

```objective-c
MyViewController *myController = [[MyViewController alloc] init];
// ...
myController.completionHandler =  ^(NSInteger result) {
   [myController dismissViewControllerAnimated:YES completion:nil];
};
[self presentViewController:myController animated:YES completion:^{
   [myController release];
}];
```

在MRC中解决循环引用的办法即在变量前使用`__block`修饰,禁止Block对所引用的对象进行retain操作

```objective-c
__block MyViewController *myController = [[MyViewController alloc] init];
// ...
myController.completionHandler =  ^(NSInteger result) {
    [myController dismissViewControllerAnimated:YES completion:nil];
};
[self presentViewController:myController animated:YES completion:^{
   [myController release];
}];
```

但是上述方法在ARC下行不通,因为`__block`在ARC中并不能禁止Block对所引用的对象进行强引用,解决办法可以是在Block中将myController置空(为了可以修改myController,还是需要使用`__block`对变量进行修饰)

```objective-c
__block MyViewController *myController = [[MyViewController alloc] init];
// ...
myController.completionHandler =  ^(NSInteger result) {
    [myController dismissViewControllerAnimated:YES completion:nil];
    myController = nil;
};
[self presentViewController:myController animated:YES completion:^{}];
```

上述方法确实可以解决循环引用,但是在ARC中还有更优雅的解决办法,新创建一个弱指针来指向该对象,并将该弱指针放在Block中使用,这样Block便不会造成循环引用

```objective-c
MyViewController *myController = [[MyViewController alloc] init];
// ...
__weak MyViewController *weakMyController = myController;
myController.completionHandler =  ^(NSInteger result) {
    [weakMyController dismissViewControllerAnimated:YES completion:nil];
};
[self presentViewController:myController animated:YES completion:^{}];
```

虽然解决了循环引用,但是也容易涉及到另一个问题,因为Block是通过弱引用指向了myController对象,那么有可能在调用Block之前myController对象便已经被释放了,所以我们需要在Block内部再定义一个强指针来指向myController对象

```objective-c
MyViewController *myController = [[MyViewController alloc] init];
// ...
__weak MyViewController *weakMyController = myController;
myController.completionHandler =  ^(NSInteger result) {
    MyViewController *strongMyController = weakMyController;
    if (strongMyController)
    {
        [strongMyController dismissViewControllerAnimated:YES completion:nil];
    }
    else
    {
        // Probably nothing...
    }
};
[self presentViewController:myController animated:YES completion:^{}];
```

这里需要补充一下,在Block内部定义的变量,会在作用域结束时自动释放,Block对其并没有强引用关系,且在ARC中只需要避免循环引用即可,如果只是Block单方面地对外部变量进行强引用,并不会造成内存泄漏

>  注: 关于`__block`关键字在MRC和ARC下的不同

```markdown
__block在MRC下有两个作用
1. 允许在Block中访问和修改局部变量 
2. 禁止Block对所引用的对象进行隐式retain操作

__block在ARC下只有一个作用
1. 允许在Block中访问和修改局部变量
```



#### **使用Block进行排序**

在开发中,我们一般使用数组的如下两个方法来进行排序

-  不可变数组的方法:` - (NSArray *)sortedArrayUsingComparator:(NSComparator)cmptr`
-  可变数组的方法 :` - (void)sortUsingComparator:(NSComparator)cmptr`

其中,`NSComparator`是利用typedef定义的`Block类型`

```objective-c
typedef NSComparisonResult (^NSComparator)(id obj1, id obj2);
```

其中,这个返回值为NSComparisonResult枚举,这个返回值用来决定Block的两个参数顺序,我们只需在Block中指明不同条件下Block的两个参数的顺序即可,方法内部会将数组中的元素分别利用Block来进行比较并排序

```objective-c
typedef NS_ENUM(NSInteger, NSComparisonResult)
{
    NSOrderedAscending = -1L, // 升序,表示左侧的字符在右侧的字符前边
    NSOrderedSame, // 相等
    NSOrderedDescending // 降序,表示左侧的字符在右侧的字符后边
};
```

我们以Person类为例,对Person对象以年龄升序进行排序,具体方法如下

```objective-c
@interface Student : NSObject

@property (nonatomic, assign) int age;

@end


@implementation Student

@end


Student *stu1 = [[Student alloc] init];
stu1.age = 18;
Student *stu2 = [[Student alloc] init];
stu2.age = 28;
Student *stu3 = [[Student alloc] init];
stu3.age = 11;

NSArray *array = @[stu1,stu2,stu3];

array = [array sortedArrayUsingComparator:^NSComparisonResult(id obj1, id obj2) {
    Student *stu1 = obj1;
    Student *stu2 = obj2;

    if (stu1.age > stu2.age)
    {
        return NSOrderedDescending; // 在这里返回降序,说明在该种条件下,obj1排在obj2的后边
    }
    else if (stu1.age < stu2.age)
    {
        return NSOrderedAscending;
    }
    else
    {
        return NSOrderedSame;
    }
}];
```



#### **参考文献**

1. [Blocks Programming Topics](https://developer.apple.com/library/ios/documentation/Cocoa/Conceptual/Blocks/Articles/00_Introduction.html#//apple_ref/doc/uid/TP40007502)
2. [A Short Practical Guide to Blocks](https://developer.apple.com/library/ios/featuredarticles/Short_Practical_Guide_Blocks/index.html#//apple_ref/doc/uid/TP40009758)
3. [Transitioning to ARC Release Notes](https://developer.apple.com/library/ios/releasenotes/ObjectiveC/RN-TransitioningToARC/Introduction/Introduction.html#//apple_ref/doc/uid/TP40011226)
4. [iOS开发ARC内存管理技术要点](http://www.cnblogs.com/flyFreeZn/p/4264220.html)
5. [唐巧的技术博客](http://blog.devtang.com/2013/07/28/a-look-inside-blocks/)
6. 李明杰(M了个J)相关技术讲解





[Fromwhere](http://www.jianshu.com/p/14efa33b3562)


[BackHome](http://robinshare.github.io/)

