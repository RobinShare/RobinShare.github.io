# Swift 语法概要

[2018-12-29]

## 1.0 数据类型

### 1.1 Hello world 打印

```swift
print("Hello world")
```

### 1.2 常量，一旦定义值不可修改

```swift
let Pi = 3.1415926
```

### 1.3 变量，定义后值可修改

```swift
var age : Int = 13
age = 14
```

### 1.4 整型

```swift
var carNum : Int = 128
```

### 1.5 Double类型与类型安全

```swift
var Pi : Double = 3.1415926
Pi = 3
print(Pi)    //实际打印出来还是Double类型3.0
```

### 1.6 Bool类型

```swift
var 资金充足 : Bool = true
资金充足  = false
```

### 1.7 元组（Tuple）类型，变量的组合

```swift
var x = 2
var y = 8
var z = 12

var vector = (4，6，8)
print(vector.0)
print(vector.1)
print(vector.2)

var (a, b, c) = (18, 29, 37)
print(a)
print(b)
print(c)

var message = (weather : "snowy", 23, "Friday")
print(message.weather)
```

### 1.8 可选类型Optional，代表变量可能有值的情况

```swift
var place : String? = "Beijing"
```

## 2. 基础操作符

### 2.1 赋值操作符

```swift
var a = 14
a = 18
```

### 2.2 数学操作符

```swift
1 + 3
8 - 6
3 * 5
8 / 2
//取余
9 % 4
```

### 2.3 组合赋值

```swift
var b = 5
b += 1
b -= 2
b *= 2
b /= 4
```

### 2.4 比较操作符

```swift
// > >= < <= ，结果true或false
2 > 4
5 >= 3
```

### 2.5 逻辑操作符

```swift
//与(&&)、或(||)、非(!),Bool值的组合
true && true && true

true || false || false

!true
```

## 3.0 字符串和字符

### 3.1 字符串类型

```swift
//字符串字面量，包含双引号""的字面量
var aa = ""
var bb = "   "

aa.isEmpty
bb.isEmpty
```

### 3.2 字符类型

```swift
var cc : Character = "n"
var dd : Character = "k"

let ee = "HowAreYou"

for hh in ee{
    print(hh)
}
```

### 3.3连接字符串

```swift
var aa = "How"
var bb = " Are"
var ee = " You"
var cc : Character = "!"
//连接符“+”仅能连接字符串,不能连接字符串与字符
var newNum = aa + bb + ee

//连接字符串与字符
newNum.append(cc)
print(newNum)
```

### 3.4 字符串插值：组合常量、变量、字面量、表达式成一个长字符串

```swift
let name = "Robin"
let type = "G"
let num = 13
let price = 158.9

let message = "\(name)先生，您订购了\(type)\(num)的往返票，需支付\(price * 2)元。"
```

## 4.0 集合类型[数组Array、字典Dictionary、集合Set：元素无序不重复]

### 4.1 数组Array：元素有序可重复

```swift
//定义：Array<类型>或[类型]
var array0 : [Int] = [Int](repeatElement(3,count:5))

let array1 = Array(1...10)

var places = ["shenzhen", "beijing","guangzhou","huizhou"]
places.count
places.isEmpty

//增加
places.append("dongguan")

let guoWaiPlaces = ["niuyue","xinjiapo"]
//拼接两个数组
places += guoWaiPlaces
//获取值
places[2]
//插入
places.insert("dongjing", at:2)

places[2]
//删除
places.remove(at:2)

places[2]
```

### 4.2 字典Dictionary：元素无序可重复，但每个值有唯一的key

```swift
//定义：Dictionary<键类型，值类型>或[键类型：值类型]
var airports = ["PVG" : "Shanghai Pudong", "CHU" : "Dalian", "DUB" : "Dublin Airport"]

airports.count
airports.isEmpty
//增加
airports["SHQ"] = "Hongqiao Airport"
//获取值
airports["CHU"]
//修改
airports["CHU"] = "Beijing"
//删除
airports["CHU"] = nil
airports

//遍历
for (key, value) in airports{
    print(key,value)
}

for key in airports.keys{
    print(key+"\n")
}
```

## 5.0 控制流

### 5.1 for-in循环，执行固定次数操作，或操作一个序列（如数组）中的每一项

```swift
let fruits = ["apple", "orange", "pear"]
for fruit in fruits{
    print(fruit)
}

var sum = 0
for i in 1...100{
    sum += i
}
print(sum)
```

### 5.2 while循环执行一系列操作，直到条件不成立，使用场合：执行次数未知

```swift
//格式：while 条件 {语句}
var i = 1
var sumAll = 0
while i <= 100{
    sumAll += i
    i += 1
}
print(sumAll)
```

### 5.3 if-else分支处理不同条件

```swift
var temp = 23
if temp > 35{
    print("开空调")
}else{
    print("不开空调")
}

var money = false
if money{
    print("买车买房")
}else{
    print("工作")
}
```

### 5.4 循环中的判断，continue结束本次循环，break结束整个循环

```swift
for i in 1...10{
    if i == 3{
        coutinue
    }
    print(i)
}
```

### 5.5  switch匹配处理

```swift
var temp = 30
switch temp{
    case 35...40:
    	print("空调强力制冷模式")
    case 25...34:
    	print("空调普通制冷模式")
    case 18...24:
    	print("空调除湿模式")
    default:
    	print("空调断电模式")
}

//元组(Tuple)选修
```

### 6.0 函数与闭包，枚举

### 6.1 函数

```swift
//函数定义形式：func 函数名(参数1：类型，参数2：类型，...) -> 返回结果的类型{执行语句}
//函数调用：var 变量名称 = 函数名(变量1，变量2，...)

func add(a : Int, b : Int) -> Int{
    return a + b
}

var sum = add(a : 5, b : 23)
print(sum)

//无参数无返回值函数
func welcome(){
    print("welcome back home")
}

welcome()

//多返回值
func maxMin -> (Int, Int){
    return (Int.max, Int.min)
}

maxMin().0
maxMin().1

//参数给默认值
func add1(x : Int, increment : Int = 2) -> Int{
    return x + increment
}

var aa = add1(x:3)
print(aa)
var bb = add1(x:3, increment:1)
print(bb)

//函数式编程，参数类型为函数类型(Int, Int) -> Int
func calculate(x : Int , y : Int , method : (Int, Int) -> Int) -> Int{
    return method(x, y)
}

func justAdd(a : Int, b : Int) -> Int{
    return a + b
}

func justMultiply(a : Int, b : Int) -> Int{
    return a * b
}

var cc = calculate(x:2, y:5, method:justAdd)
print(cc)
var dd = calculate(x:2, y:5, method:justMultiply)
print(dd)
```

### 6.2 闭包：一种函数的简写，省去函数名，把参数和返回值放入花括号内

```swift
//{ (a : Int, b : Int) -> Int in
//   	执行语句
//		return ...
//}

var citys = ["zhengzhou", "xiamen", "hangzhou", "nanchang"]

func daoxu(a : String, b : String) -> Bool{
    return a > b
}

var cityRank1 = citys.sorted(by:daoxu)

//闭包的自动推断类型
var cityRank2 = citys.sorted{(a, b) -> Bool in
    return a >b
}

var cityRank3 = citys.sorted{(a, b) in
    a > b
}

var cityRank4 = citys.sorted{
    $0 > $1
}
```

## 6.3 枚举

```swift
//枚举enumeration,列举有限种情况
//定义，给定一个名称，然后把每种情况都列举出来
//使用，点语法
enum Weather{
    case sunny
    case cloudy
    case snow
    case windy
    case froggy
}

Weather.cloudy

//与switch配合使用时，如果变量是枚举值，可省略枚举名
var todayWeather = Weather.snow

switch todayWeather{
    case .cloudy:
    	print("多云")
    case .snow:
    	print("下雪了")
    default:
    	print("天气状况未知")
}

//枚举的附加值()选修
```





[BackHome](http://robinshare.github.io/)