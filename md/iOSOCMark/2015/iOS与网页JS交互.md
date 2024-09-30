# iOS与网页JS交互

[2015-12-08]

随着移动APP的快速迭代开发趋势，越来越多的APP中嵌入了html网页，但在一些大中型APP中，尤其是电商类APP，html页面已经不仅仅满足展示功能，这时html要求能与原生语言进行交互、相互传值。比如携程APP中一个热门景点的网页中，点击某个景点，可以跳转到原生中的该景点详情页控制器。

为此，我整理了三种最常用最便捷有效的OC与JS交互的方式，供大家学习交流。

### 第一种：JS给OC传值。

1. 技术方案：使用JavaScriptCore.framework框架 

2. 使用场景： 网页中代码中的某个方法，比如点击事件方法，将该方法的参数传值给OC，供OC使用。

比如：携程APP中一个热门景点的网页中，有很多个热门景点，点击某个景点的图片或名称，可以跳转到原生中的该景点详情页控制器。

3. 代码实现如下：

**OC里要实现的代码：**

拖入JavaScriptCore.framework静态库，遵守UIWebViewDelegate代理协议。

在-webViewDidFinishLoad:方法里编写如下代码：

```objective-c
- (void)webViewDidFinishLoad:(UIWebView *)webView{
JSContext *context = [webView valueForKeyPath:@"documentView.webView.mainFrame.javaScriptContext"];
  
    context[@"passValue"] = ^{
        NSArray *arg = [JSContext currentArguments];
        for (id obj in arg) {
            NSLog(@"%@", obj);
        }
   };
 
}

```

其中 **passValue** 是JS的函数名，得到的 **arg数组** 里面为JS的 **passValue** 函数的参数，即 **JS**要传给**OC的参数**。

**JS**里要实现的代码：

```javascript
function testClick(){
    var str1 = document.getElementById("text1").value;
    var str2 = document.getElementById("text2").value;
    passValue(str1,str2);
}
```

在需要给OC传值的函数里（例如：testClick（））直接调用 passValue（）函数，将值传进去即可。

### 第二种：JS给OC传值。

1. 技术方案：使用自定义url方法，每次点击网页
2. 使用场景： 网页中代码中的某个方法，比如点击事件方法，将该方法的参数传值给OC，供OC使用。

比如：携程APP中一个热门景点的网页中，有很多个热门景点，点击某个景点的图片或名称，可以跳转到原生中的该景点详情页控制器。

3. 代码实现如下：

**JS里要实现的代码：**

```javascript
function testClick(){
    var str1=document.getElementById("text1").value;
    var str2=document.getElementById("text2").value;
    //  "objc://"为自定义协议头;
    //  str1&str2为要传给OC的值,以":/"作为分隔
    window.location.href="objc://"+":/"+str1+":/"+str2;
}
```

在需要给OC传值的函数里（例如：testClick（））写如上格式的代码。

其中 objc:// 是自定义的协议头，str1与str2为**JS**要传给OC的值。

**OC里要实现的代码：**

```objective-c
-(BOOL)webView:(UIWebView *)webView shouldStartLoadWithRequest:(NSURLRequest *)request navigationType:(UIWebViewNavigationType)navigationType{
    //拿到网页的实时url
    NSString *requestStr = [[request.URL absoluteString] stringByRemovingPercentEncoding];
    //在url中寻找自定义协议头"objc://"
    if ([requestStr hasPrefix:@"objc://"]){
        // 以"://"为中心将url分割成两部分，放进数组arr
        NSArray *arr = [requestStr componentsSeparatedByString:@"://"];
        NSLog(@"%@",arr);
        //取其后半段
        NSString *paramStr = arr[1];
        NSLog(@"%@",paramStr);
        //以":/"为标识将后半段url分割成若干部分，放进数组arr2，此时arr2[0]为空，arr2[1]为第一个传参值，arr2[2]为第二个传参值，以此类推
        NSArray *arr2 = [paramStr componentsSeparatedByString:@":/"];
        NSLog(@"%@",arr2);
        //取出参数，进行使用
        if (arr2.count) {
            NSLog(@"有参数");
            [self doSomeThingWithParamA:arr2[1] andParamB:arr2[2]];
        }else{
            NSLog(@"无参数");
        }
        return NO;
    }
 
    return YES;
}
//对JS传来的值进行调用
- (void)doSomeThingWithParamA:(id)paramA andParamB:(id)paramB{
    NSLog(@"%@=====%@", paramA, paramB);
}
```

### 第三种：利用第三方库实现JS与OC的相互传值。

1. 技术方案：使用WebViewJavascriptBridge第三方库
2. 使用场景： 网页中代码中的某个方法，比如点击事件方法，将该方法的参数传值给OC，供OC使用。 比如：携程APP中一个热门景点的网页中，有很多个热门景点，点击某个景点的图片或名称，可以跳转到原生中的该景点详情页控制器。 或者将原生中的用户信息传递给网页，以便其个性化展示
3. 代码实现如下：

#### **I、OC传值给JS**

**JS里需要实现的代码：**

```javascript
function setupWebViewJavascriptBridge(callback) {
    if (window.WebViewJavascriptBridge) {
      return callback(WebViewJavascriptBridge); 
    }
    if (window.WVJBCallbacks) { 
      return window.WVJBCallbacks.push(callback);
    }
    window.WVJBCallbacks = [callback];
    var WVJBIframe = document.createElement('iframe');
    WVJBIframe.style.display = 'none';
    WVJBIframe.src = 'wvjbscheme://__BRIDGE_LOADED__';
    document.documentElement.appendChild(WVJBIframe);
    setTimeout(function() { document.documentElement.removeChild(WVJBIframe) }, 0)
}

//调用上面定义的函数
setupWebViewJavascriptBridge(function (bridge){
//OC传值给JS 'testJavascriptHandler'为双方自定义好的统一方法名；'data'是OC传过来的值；'responseCallback'是JS接收到之后给OC的回调
    bridge.registerHandler('testJavascriptHandler', function(data, responseCallback) {
      //打印OC传过来的值
      log('ObjC called testJavascriptHandler with', data)
      var responseData = { 'Javascript Says':'Right back atcha!' }
      log('JS responding with', responseData)
      //给OC的回调
      responseCallback(responseData)
})

```

**OC里需要实现的代码：**

导入第三方库WebViewJavascriptBridge；

遵守UIWebViewDelegate；

```objective-c

//设置第三方Bridge是否可用
[WebViewJavascriptBridge enableLogging];
//关联webView和bridge
_bridge = [WebViewJavascriptBridge bridgeForWebView:web];
[_bridge setWebViewDelegate:self];
//OC给JS传值，双方自定义一个统一的方法名'testJavascriptHandler'；data里即为要传过去的值
[_bridge callHandler:@"testJavascriptHandler" data:@{@"年龄":@"20"}];

```

#### **II、JS传值给OC**

**JS里需要实现的代码：**

```javascript
//点击网页上一个按钮时
 callbackBt.onclick = function(){  
 var str1 = document.getElementById("text1").value;
 var str2 = document.getElementById("text2").value;
 //JS给OC传值。'passValue'为双方自定义的统一方法名；'str1'&'str2'为要传的值； response为OC收到后给JS的回调
 bridge.callHandler('passValue', {str1,str2}, function(response) { })

}
```

**OC里需要实现的代码：**

导入第三方库WebViewJavascriptBridge；

遵守UIWebViewDelegate；

```objective-c
//设置第三方Bridge是否可用
[WebViewJavascriptBridge enableLogging];
//关联webView和bridge
_bridge = [WebViewJavascriptBridge bridgeForWebView:web];
[_bridge setWebViewDelegate:self];
//js给oc传值.'passValue'为双方自定义的统一方法名；'data'为JS传过来的值；'responseCallback'为OC收到值后给JS返回的回调
[_bridge registerHandler:@"passValue" handler:^(id data, WVJBResponseCallback responseCallback){
      //打印js传过来的值
      NSLog(@"%@", data);
      //返回给js的值
      responseCallback(@"收到了");
}];
```

需要注意的是：不论哪方给哪方传值，传值的方法名称与对应接收值的方法名称要保持一致。





[BackHome](http://robinshare.github.io/)