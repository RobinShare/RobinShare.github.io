# 面向对象

[2018-12-30]

### 1.1 面向对象的简介及实例属性

```markdown
用生物学的角度把变量和函数有机组织起来，叫面向对象编程
基因：属性和方法  (变量和函数)
繁殖：完全克隆 和 基因交换 (继承和变异)
术语：结构体(struct)和类(class)，swift 推荐自己定义的对象使用结构体
```

```markdown
属性：一个类/结构体/枚举关联的变量
实例属性：实例化后才能使用
存储属性：保存单个类型的变量
```

```swift
//定义类
class 角色 {
    var id = ""
    var money = 0
}

//实例化
let 扁鹊 = 角色()

扁鹊.id = "xiaoming"
扁鹊.money = 5000
```

```markdown
计算属性：由其他属性计算得出的，由getter和setter组成
getter获取器(必须)：描述属性如何计算及返回语句，形式：get{语句和返回}
setter设置器(可选)：有新值(newValue)后如何影响其他属性，形式set{语句}
eg.游戏的当前坐标，通常是移动方式代表位移量相关
```

```swift
//位置坐标，结构体
struct 坐标 {
    var x = 0, y = 0
}

//移动方式，枚举
enum 移动方式 {
    case 走
    case 跑
    case 骑
    case 传送
}

//游戏角色法师，类
class 法师 : 角色 {
    var 人物坐标 = 坐标()
    var 人物移动方式 = 移动方式.走
    
    var 当前坐标 : 坐标 {
        get {
            switch 人物移动方式 {
                case .走：
                	人物坐标.x += 1
                	人物坐标.y += 1
                case .跑:
                	人物坐标.x += 3
                	人物坐标.y += 3
                case .骑:
                	人物坐标.x += 10
                	人物坐标.y += 10
                case .传送:
                	人物坐标.x += 1000
                	人物坐标.y += 1000
            }
            return 人物坐标
        }
        set {
            人物坐标 = newValue
        }
    }
}

//实例对象
var 法师1 = 法师()
法师1.当前坐标

法师1.人物移动方式 = .走
法师1.当前坐标

法师1.人物移动方式 = .跑
法师1.当前坐标

法师1.人物移动方式 = .传送
法师1.当前坐标

//计算属性的setter方法，影响其他属性
法师1.人物坐标 = 坐标(x: 2, y: 800)
```

```markdown
属性监视器 ：对属性值的变化进行响应
willSet ：事前响应，新值newValue
didSet  ：事后响应，旧值oldValue
```

```swift
class 经验 {
    var 总经验 = 0 {
        willSet {
            print("当前总经验是：\(newValue)！")
        }
        didSet {
            print("增加了\(总经验 - oldValue)点经验")
        }
    }
}

var 经验1 = 经验()
经验1.总经验 = 1000
经验1.总经验 = 3000
经验1.总经验 = 5000
```

### 2.1 类型属性

```markdown
类型属性：属性类型固有的，实例不能调用
对于类，计算型的类型属性，前面加关键字class可被子类重写(override)
```

```swift
class 生命体 {
    class var 遗传方式: String {
        return "RNA"
    }
}

生命体.遗传方式

class Human: 生命体 {
    override class var 遗传方式 : String {
        return "DNA"
    }
}

Human.遗传方式

//结构体和枚举，关键字static
struct 逛街 {
    static let 试衣间 = "UNIClO"
    static let 网站 = "http://www.taobao.com?cate="
    var cate = ""
    var shareUrl : String {
        return 逛街.网站 + cate
    }
}

逛街.试衣间
let 逛淘宝 = 逛街(cate: "seafood")
逛淘宝.shareUrl

//方法是一个类/结构体/枚举关联的函数,分为实例方法和类型方法
//实例方法：
//定义和使用：与函数相似      self属性：引用实例自身，通常可以不写
enum Moster: Int {
    case sheep = 10,
    cat = 50,
    snake = 100
}

struct ExpTimes {
    var open = false
    var times = 1
}

class RmbPlayer {
    var exp = 0
    var expTimes = ExpTimes()
    
    func idle(){
        exp += 500
        print("挂机成功1次！总经验为\(exp)")
    }
    
    func kill(moster: Moster, expTimes: Int){
        exp += (monster.rawValue * expTimes)
        print("当前总经验为\(exp)")
    }
}

var xiaoming = RmbPlayer()
xiaoming.idle()
xiaoming.kill(moster: Moster.cat, expTimes:2)
xiaoming.expTimes.open = true
xiaoming.expTimes.times = 2
xiaoming.kill(monster: Moster.sheep, expTimes: 4)

//类型方法：属于类型本身，无需实例化就可以使用。方法前加关键字static
//对于类，加关键字class，可被子类重写(override)

class Player {
    static var nick = "xiaoming"
    
    class func server(){
        print("\(nick),您在北京联通1区")
    }
}

Player.server()

class ShanghaiPlayer: Player {
    override static func server(){
        print(nick,"您在上海电信2区")
    }
}

ShanghaiPlayer.server()

```

### 2.2 下标方法

```markdown
下标是方法的一种，是访问集合、列表或者序列中的元素的快捷方式。
用法：实例名[索引],可以访问或者设置其中元素。
下标可以是多维或嵌套的
```

`嵌套：area[country][province][city][district][weekly]`

`多维：矩阵[2,2],数组[1,2,3]`

```swift
定义形式：一个名为subscript的计算属性；可以忽略set(只读)
subscript(index:参数类型) -> 返回类型 {
    get{}
    set{}
}
```

`常用的用法：字典、数组、集合等`

```swift
var array = [1,2,4]
array[2]

var dict =["name": "xiaoming","behavior": "say", "what": "swift"]
dict["what"]
```

`通过下标简化调用方法的调用`

```swift
import Foundation

struct Cycle {
    func area(radius: Double) -> Double {
        return Double.pi * pow(radius, 2)
    }
    
    subscript(radius: Double) -> Double {
        return Double.pi * pow(radius, 2)
    }
}

let cycle = Cycle()

cycle.are(radius: 3)
cycle[3]

//多维下标，实现一个二维行列式矩阵(选修)
```

### 3.1 类的继承

```markdown
继承：class之间的“父子”关系体现
子类可以继承父类的属性和方法
```

```swift
class Viechle {
    var speed = 0
    var desc: String{
        return "时速是\(speed)km/h"
    }
    
    func makeNoise(){
        
    }
}

class Bike: Viechle {
    var hasBasket = true
}

let aBike = Bike()
aBike.speed = 30
aBike.desc
aBike.hasBasket 
aBike.makeNoise()

//子类可以根据需要，修改继承来的属性和方法(多态)
class CRH: Viechle {
    override func makeNoise() {
        print("嘟嘟嘟")
    }
}

let crh = CRH()
crh.makeNoise()
```

### 3.2 初始化

```markdown
初始化：描述类/结构体/枚举实例化时，属性如何给初始值的方法。形式：init(){}，此方法称之为构造器。
```

```swift
//类的定义没有给属性默认的值，则须在init中指定
class RoomTemp {
    var season: String
    var temp: Int
    
    init(season: String, temp: Int) {
        self.season = season
        self.temp = temp
    }
}

let temps = RoomTemp(season: "Spring", temp: 24)
temps.season
temps.temp

//结构体定义不需要指定属性默认的值，因为默认存在一个包含所有属性初始化的构造器
struct RoomTemp0{
    var season: String
    var temp: Int
}

let temp0 = RoomTemp0(season: "Summer", temp: 34)

//便利构造器：可以通过对主构造器init(){}的包装，实现便利的初始化
class Food {
    var name: String
    
    init(name: String){
        self.name = name
    }
    
    convenience init(){
        self.init(name:"米饭")
    }
}

let food = Food()

//可失败构造器：针对有可能的初始化失败，返回nil。例子，初始化一张图片，如果图片名不存在，则初始化失败，体现容错机制
struct Animal {
    let name: String
    
    init?(name: String) {
        if name.isEmpty {
            print("没有给动物名称！")
            return nil
        }
        self.name = name
    }
}

let cat = Animal(name:"")

import UIKit

let ball = UIImage(named: "ball")
```

### 4.1 错误处理

```markdown
错误处理：反映运行出错的“细节”，并恢复程序的过程
可选类型仅处理值缺失，错误处理可以针对不同的出错原因做不同的应对
```

```swift
//一个函数可以加上关键字throws，表示可以处理错误，这个函数的调用者可以捕获(catch)这个错误并进行应对
class aFoo() throws {
    print("xiaoming的斗鱼直播间123")
}
//当你调用可以抛出错误的函数时，须在前面加上关键字try
try aFoo()

//处理更细分的错误情况。错误类型须遵从ErrorType协议
enum LearningObs: Error {
    case noMethod,
    noReading,
    noTool(tool: String)
}

func iosDev(method: Bool, style: Bool, hasTool: Bool) throws {
    guard method else {
        throw Learning.noMethod
    }
    
    guard style else {
        throw Learning.noReading
    }
    
    guard hasTool else {
        throw Learning.noTool(tool:"缺Mac电脑")
    }
}

var budget = 7000 

func buy(tool: String){
    if budget >= 6000 {
        budget -= 6000
        print("您已经购买",tool,"花费6000元，余额：",budget)
    }else{
        print("资金不足")
    }
}

do{
    try iosDev(method:true, style: true, hasTool: false)
    print("恭喜，您已经开始学习iOS开发")
}catch LearningObs.noMethod {
    print("没有好的学习方法")
}catch LearningObs.noReading {
    print("不想看书，就看视频吧~")
}catch LearningObs.noTool(let tool){
    buy(tool: "mac")
}


//有时候仅关心结果有无，可使用try?或try!来忽略错误细节
if let result = try? iosDev(method: true, style: true, hasTool: true){
    print("恭喜进入学习")
}else{
    print("学习条件不满足")
}

//不满足程序崩溃
//try! iosDev(method: true, style: true, hasTool: false)
```





[BackHome](http://robinshare.github.io/)