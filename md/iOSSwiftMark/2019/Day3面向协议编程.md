# 面向协议编程

[2019-01-01]

### 1.1 协议概念

```markdown
协议：方法、属性或一段功能的蓝本
协议可以被类、结构体和枚举“领养”从而“长大成人”
任何满足协议的“需求”的类型，被称为“遵从”该协议	
```

```swift
protocol AProtocol {
    
}

protocol BProtocol {
    
}

//“领养/遵从”若干个协议，用逗号分隔
struct AStruct: AProtocol, BProtocol {
    
}

//超类在协议之前
class Name {
    
}

class GivenName: Name, AProtocol, BProtocol {
    
}
```

### 2.1 属性协议

```markdown
属性协议：顾名思义，要求遵从者实现以指定的名称实现属性，但具体实现是实例属性或类型属性并不关心。
可以指定要求实现getter或getter+setter，属性必须定义为变量，var.
```

```swift
protocol FileAccessPriority  {
    var readOnly: Bool { get }
    var readWrite: Bool { get set }
}

protocol AccessUrl {
    static var link: String { get }
}
```

`遵从实例属性协议eg.1`

```swift
protocol FullName {
    var fName: String { get }
    var gName: String { get }
}

struct Student: FullName {
    var fName: String
    var gName: String
}

struct Teacher: FullName {
    var fName: String
    var gName: String
}

var student1 = Student(fName: "Wang", gName:"xiaoming")
student1.fName
student1.gName
```

`遵从实例属性协议eg.2`

```swift
class SomeBody: FullName {
    var title: String
    var name: String 
    init(title: String?, name: String) {
        self.title = title
        self.name = name
    }
    var fName: String {
        return title ?? "无名小辈"
    }
    var gName: String {
        return name
    }
    var desc: String {
        return self.fName + self.gName
    }
}

var somebody1 = SomeBody(title:"大帝", name:"亚历山大")
somebody1.fName
somebody1.gName
somdbody1.desc

var nobody = SomeBody(title:nil, name:"xiaoming")
nobody.fName
nobody.gName
nobody.desc
```

### 2.2 方法协议

```markdown
方法协议：定义时没有花括号执行体，实现仅要求名称相同
作用：可以让一个类/结构体/枚举的方法，分解为更小的组合，从而更具灵活性
```

`类型方法协议：前面总是static`

```swift
protocol AMethod {
    static func foo()
}

class A: AMethod {
    static func foo() {
        print("foo!!")
    }
}
```

`实例方法协议`

```swift
import Foundation

protocol RandomGenerable {
    func randomNumber() -> Int
}

struct RandomNumber: RandomGenerable {
    func randomNumber() -> Int {
        return Int(arc4random())
    }
}

struct RandomNumberSix: RandomGenerable {
    func randomNumber() -> Int {
        return Int(arc4random()%6)
    }
}

let random1 = RandomNumber()
random1.randomNumber()

let random2 = RandomNumberSix()
random2.randomNumber()
```

### 2.3 结构体/枚举的"变异方法协议"

```swift
protocol Switchable {
    mutating func onOff()
}

enum MySwitch: Switchable {
    mutating func onOff() {
        switch self {
            case .off:
            	self = .on
            default:
            	self = .off
        }
    }
    case on,
    off
}
```

### 3.1 构造方法协议

```markdown
构造方法协议：可以要求遵从者实现指定的构造方法
```

类实现时用`required init`,编译器会提示添加，无须手动添加`required`

```swift
protocol AA {
    var a: Int { get set }
    init(a: Int)
}

struct BB: AA {
    var a: Int
    init(a: Int) {
        self.a = a
    }
}

class CC: AA {
    var a: Int
    required init(a: Int) {
        self.a = a
    }
}
```

### 4.1 协议作为类型使用

```markdown
协议作为类型使用：可用于参数类型/返回类型；变量/常量/属性；集合类型中的元素类型
```

```swift
import Foundation

protocol RandomGenerable {
    func randomNumber() -> Int
}

struct RandomNumber: RandomGenerable {
    func randomNumber() -> Int {
        return Int(arc4random())
    }
}

class TenRandomNumber: RandomGenerable {
    func randomNumber() -> Int {
        return Int(arc4random()) % 10 + 1
    }
}

struct Dice {
    var sides: Int
    var randomNumber: RandomGenerable
    
    func play() -> Int {
        return self.randomNumber.randomNumber() % sides + 1
    }
}

let aDice = Dice(sides:99 , randomNumber:RandomNumber())
aDice.play()

let aDice10 = Dice(sides:10, randomNumber:TenRandomNumber())
aDice10.play()
```

### 5.1 协议作为代理

```markdown
协议作为代理：代理是一种常见的设计模式，可以让类或结构体把一部分职责，指派给非同类的实例去承担。
若要寻求代理，可以通过定义一个协议，打包要实现的职责于其中
该代理协议的遵从者就可以实现这些打包的职责
代理在iOS开发中，一般可以用于响应特定的操作，或从外部数据源取回数据但无需了解是何种数据源
```

```swift
struct Role {
    var name: String
}

protocol Player {
    var role: Role { get }
    mutating func play()
}

protocol GameDelegate {
    func start(with player: Player) -> Int
    func rolePk(with player: Player, armed: Bool) -> Int
    func end(with player: Player) -> Int
}

struct GameAgent: GameDelegte {
    func start(with player: Player) -> Int {
        print(player.role.name, "开始进入游戏，获取经验2000")
        return 2000
    }
    
    func rolePk(with player:Player, armed: Bool) -> Int {
        if armed {
            print(player.role.name,"开始PK，您有武器，获取经验5000")
            return 5000
        }else{
            print(player.role.name,"开始PK，您没武器，获取经验2500")
            return 2500
        }
    } 
    
    func end(with player: Player) -> Int {
        print(player.role.name, "正常退出游戏，获取经验1000")
        return 1000
    }
}

struct MirPlayer: Player {
    var exp: Int
    var gameAgent: GameAgent?
    
    var role: Role
    mutating func play() {
        if let gameAgent = gameAgent {
            print("您使用了代练！")
            
            exp += gameAgent.start(with: self)
            exp += gameAgent.rolePk(with: self, armed: true)
            exp += gameAgent.end(with: self)
        }else{
            print("您没有使用任何代练，不能自动升级")
        }
    }
}

let role1 = Role(name:"xiaoming")
var player1 = MirPlayer(exp:0, gameAgent:nil, role:role1)
player1.playe()

let role2 = Role(name:"土豪玩家")
let agent = GameAgent()
var player2 = MirPlayer(exp:0, gameAgent:agent, role:role2)
player2.play()
```

### 6.1 协议扩展和扩展约束

```markdown
协议扩展：即使无源码权限下，给已有的类添加协议
既存实例会自动遵从添加了的协议
```

```swift
protocol ShowHint {
    func hint() -> String
}

extension Int: ShowHint {
    func hint() -> String {
        return "整数：\(self)"
    }
}

let a = 1
a.hint()
(-432).hint
```

`如果一个类型预遵从了协议，可以直接扩展协议`

```swift
struct Lesson {
    var name: String
//    var description: String {
//        return "课程名称是：" + name
//    }
}

extension Lesson: CustomStringConvertible {
    var description: String {
        return "课程名称是：" + name
    }
}

var lesson = Lesson(name:"英文")
lesson.description
```

`扩展约束：可以在扩展协议的同时，加上限定条件，where语句`

```swift
extension ShowHint where Self: CustomStringConvertible {
    func hint2() -> String {
        return "我是一个能显示成字符串的类型" + self.description
    }
}

1.hint2()
```

`集合类型Collection也是一种协议。Iterator.Element指代其中的元素`

```swift
let array = [1,3,5,7]

extension Collection where Iterator.Element: CustomStringConvertible{
    func newDesc() -> String {
        let itemAsText = self.map{ $0.description }
        return "该集合类型元素数目是\(self.count)，元素的值依次是" + itemAsText.joined(separator:",")
    }
}

array.newDesc()
```

`协议的集合类型：因为协议可以作为类型使用，可以把遵从相同协议的实例放到一个协议类型的数组`

```swift
let arrayAll = [1,2,4,"aab"] as [Any]

let arrayCollection: [CustomStringConvertible] = [1,3,4,"bbc"]
for element in arrayCollection {
    print(element)
}
```

### 7.1 协议继承和默认实现

```markdown
协议继承：一个协议可以继承若干个协议，并可以在继承基础上增添新需求，与class继承相似，区别是class不能多重继承。对结构体进行协议扩展，相当于实现了多重继承(面向协议编程)
继承的多个协议间用逗号分隔
```

```swift
protocol MyPrintable: CustomStringConvertible, CustomPlaygroundQuickLookable {
    
}
```

`提供默认实现：可以给协议扩展提供一个默认的实现，任何遵从此协议的类型都会获得`

```swift
struct MyContent {
    var text: String
    var mycustomtext: String
}

extension MyPrintable {
    var customPlaygroundQuickLook: PlaygroundQuickLook{
        return PlaygroundQuickLook.text("Playground的默认预览文字")
    }
}

extension MyContent: MyPrintable {
    var description: String {
        return self.text
    }
    
//    var customPlaygroundQuickLook: PlaygroundQuickLook {
//        return PlaygroundQuickLook.text(self.mycustomtext)
//    }
}

let mycontent1 = MyContent(text:"内容", mycustomtext:"保留文字")
mycontent1.description
```

### 7.2 类专用协议

```markdown
类专用协议：可以把协议限制在class类型(让结构体和枚举无法使用)，加关键字class到协议继承列表的第一位。
```

```swift
protocol OnlyForClass: class, CustomStringConvertible, CustomPlaygroundQuickLookable{
    
}

class Mytext: OnlyForClass {
    var description: String {
        return "aaaa"
    }
    
    var customPlaygroundQuickLook: PlaygroundQuickLook {
        return PlaygroundQuickLook.text("bbbb")
    }
}

//以下结构体不能遵从OnlyForClass协议
//struct MyStruct: OnlyForClass {
//
//}
```

### 8.1 协议组合

`协议组合：多个协议临时组合在一起的类型，形式：协议1 & 协议2 & ...>`

```swift
protocol Ageable {
    var age: Int { get }
}

protocol Nameable {
    var name: String { get }
}

struct Student: Ageable, Nameable {
    var age: Int 
    var name: String
}

struct Teacher: Ageaable, Nameable {
    var age: Int
    var name: String
    var title: String
}

func wish(someone: Ageable & Nameable) {
    print("祝", someone.name, someone.age, "岁生日快乐！")
}

let student11 = Student(age:14, name:"xiaoming")
let teacher22 = Teacher(age:34, name:"Bob", title:"Professor")

wish(someone:student11)
wish(someone:teacher22)
```

### 8.2 协议检查和转换

```markdown
协议检查和转换：使用is和as类型转换操作符来检查协议遵从与否，或转换成特定的协议。
```

```swift
protocol Slogan {
    var desc: String { get }
}

protocol Coder: Slogan {
    var name: String { get set }
}

struct JavaCoder: Coder {
    var name: String
    var desc: String {
        return "我会Java我牛逼"
    }
}

struct JSCoder: Coder {
    var name: String
    var desc: String {
        return "我会JavaScript我很潮"
    }
}

struct NewBie {
    var name: String
}

let javaCoder = JavaCoder(name:"小米")
let jsCoder = JSCoder(name:"小明")
let newbieCoder = NewBie(name:"小刘")

let coders = [javaCoder, jsCoder, newbieCoder] as [Any]

for coder in coders {
    if let coder = coder as? Coder {
        print(coder.name, coder.desc)
    }else{
        print("您不是一个程序员！")
    }
    
    if let newbie = coder as? NewBie {
        print("您是一枚菜鸟\(newbie.name)")
    }
}
```

### 面向协议编程划重点：协议概念理解、协议作为类型使用、协议的扩展和约束、协议作为代理





[BackHome](http://robinshare.github.io/)