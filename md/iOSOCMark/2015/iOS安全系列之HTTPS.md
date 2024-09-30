# 打造安全的App！iOS安全系列之 HTTPS

[2015-08-15]

![https](mdPhotoSource/https.jpg)

如何打造一个安全的App？这是每一个移动开发者必须面对的问题。在移动App开发领域，开发工程师对于安全方面的考虑普遍比较欠缺，而由于iOS平台的封闭性，遭遇到的安全问题相比于Android来说要少得多，这就导致了许多iOS开发人员对于安全性方面没有太多的深入，但对于一个合格的软件开发者来说，安全知识是必备知识之一。

对于未越狱的iOS设备来说，由于强大的沙箱和授权机制，以及Apple自己掌控的App Store， 基本上杜绝了恶意软件的入侵。但除系统安全之外，我们还是面临很多的安全问题：网络安全、数据安全等，每一项涉及也非常广，安全是非常大的课题，本人并非专业的安全专家，只是从开发者的角度，分析我们常遇到的各项安全问题，并提出通常的解决方法，与各位交流。

每一个软件工程师都有义务保护用户数据的隐私和安全。

首先是网络安全，OSI模型各层都会面临相应的网络安全问题，涉及宽广，而网络安全也是安全领域发展最为繁荣的领域。本文我们只是从移动应用开发角度，以尽量简单的方式，讲解HTTPS核心概念知识，以及在iOS平台上的实现。建议现在还在使用HTTP的应用都升级到HTTPS。

引读：[互联网全站HTTPS的时代已经到来](http://get.jobdeer.com/1607.get)

**1. HTTPS**

其实HTTPS从最终的数据解析的角度，与HTTP没有任何的区别，HTTPS就是将HTTP协议数据包放到SSL/TSL层加密后，在TCP/IP层组成IP数据报去传输，以此保证传输数据的安全；而对于接收端，在SSL/TSL将接收的数据包解密之后，将数据传给HTTP协议层，就是普通的HTTP数据。HTTP和SSL/TSL都处于OSI模型的应用层。从HTTP切换到HTTPS是一个非常简单的过程，在做具体的切换操作之前，我们需要了解几个概念：

**SSL/TSL**

关于SSL/TSL，阮一峰的两篇博客文章做了很好的介绍：

-  [SSL/TLS协议运行机制的概述](http://www.ruanyifeng.com/blog/2014/02/ssl_tls.html)
-  [图解SSL/TLS协议](http://www.ruanyifeng.com/blog/2014/09/illustration-ssl.html)

简单的来说，SSL/TSL通过四次握手，主要交换三个信息：

**1. 数字证书：**该证书包含了公钥等信息，一般是由服务器发给客户端，接收方通过验证这个证书是不是由信赖的CA签发，或者与本地的证书相对比，来判断证书是否可信；假如需要双向验证，则服务器和客户端都需要发送数字证书给对方验证；

**2. 三个随机数：**这三个随机数构成了后续通信过程中用来对数据进行对称加密解密的**“对话密钥”**。

首先客户端先发第一个随机数N1，然后服务器回了第二个随机数N2（这个过程同时把之前提到的证书发给客户端），这两个随机数都是明文的；而第三个随机数N3（这个随机数被称为Premaster secret），客户端用数字证书的公钥进行非对称加密，发给服务器；而服务器用只有自己知道的私钥来解密，获取第三个随机数。只有，服务端和客户端都有了三个随机数N1+N2+N3，然后两端就使用这三个随机数来生成“对话密钥”，在此之后的通信都是使用这个“对话密钥”来进行对称加密解密。因为这个过程中，服务端的私钥只用来解密第三个随机数，从来没有在网络中传输过，这样的话，只要私钥没有被泄露，那么数据就是安全的。

**3. 加密通信协议：**就是双方商量使用哪一种加密方式，假如两者支持的加密方式不匹配，则无法进行通信；

有个常见的问题，关于随机数为什么要三个？只最后一个随机数N3不可以么？

这是由于SSL/TLS设计，就假设服务器不相信所有的客户端都能够提供完全随机数，假如某个客户端提供的随机数不随机的话，就大大增加了“对话密钥”被破解的风险，所以由三组随机数组成最后的随机数，保证了随机数的随机性，以此来保证每次生成的“对话密钥”安全性。

**数字证书**

数字证书是一个电子文档，其中包含了持有者的信息、公钥以及证明该证书有效的数字签名。而数字证书以及相关的公钥管理和验证等技术组成了[PKI](http://en.wikipedia.org/wiki/Public-key_infrastructure)（公钥基础设施）规范体系。一般来说，数字证书是由数字证书认证机构(Certificate authority，即CA)来负责签发和管理，并承担PKI体系中公钥合法性的检验责任；数字证书的类型有很多，而HTTPS使用的是SSL证书。

怎么来验证数字证书是由CA签发的，而不是第三方伪造的呢？ 在回答这个问题前，我们需要先了解CA的组织结构。首先，CA组织结构中，最顶层的就是根CA，根CA下可以授权给多个二级CA，而二级CA又可以授权多个三级CA，所以CA的组织结构是一个树结构。对于SSL证书市场来说，主要被Symantec(旗下有VeriSign和GeoTrust)、Comodo SSL、Go Daddy 和 GlobalSign 瓜分。 了解了CA的组织结构后，来看看数字证书的签发流程：

![CA签发数字证书流程](mdPhotoSource/CA签发数字证书流程.png)

数字证书的签发机构CA，在接收到申请者的资料后进行核对并确定信息的真实有效，然后就会制作一份符合[X.509](http://tools.ietf.org/html/rfc5280)标准的文件。证书中的证书内容包括了持有者信息和公钥等都是由申请者提供的，而数字签名则是CA机构对证书内容进行hash加密后等到的，而这个数字签名就是我们验证证书是否是有可信CA签发的数据。

![CA证书内容](mdPhotoSource/CA证书内容.png)

接收端接到一份数字证书Cer1后，对证书的内容做Hash等到H1；然后在签发该证书的机构CA1的数字证书中找到公钥，对证书上数字签名进行解密，得到证书Cer1签名的Hash摘要H2；对比H1和H2，假如相等，则表示证书没有被篡改。但这个时候还是不知道CA是否是合法的，我们看到上图中有CA机构的数字证书，这个证书是公开的，所有人都可以获取到。而这个证书中的数字签名是上一级生成的，所以可以这样一直递归验证下去，直到根CA。根CA是自验证的，即他的数字签名是由自己的私钥来生成的。合法的根CA会被浏览器和操作系统加入到权威信任CA列表中，这样就完成了最终的验证。所以，一定要保护好自己环境（浏览器/操作系统）中根CA信任列表，信任了根CA就表示信任所有根CA下所有子级CA所签发的证书，不要随便添加根CA证书。

了解了上面两个概念之后，对HTTPS就有了个初步的了解，下面我们看如何在iOS上实现对HTTPS的支持。

**2. 实现支持HTTPS**

首先，需要明确你使用HTTP/HTTPS的用途，因为OSX和iOS平台提供了多种API，来支持不同的用途，官方文档[《Making HTTP and HTTPS Requests》](https://developer.apple.com/library/ios/documentation/NetworkingInternetWeb/Conceptual/NetworkingOverview/WorkingWithHTTPAndHTTPSRequests/WorkingWithHTTPAndHTTPSRequests.html)有详细的说明，而文档[《HTTPS Server Trust Evaluation》](https://developer.apple.com/library/ios/technotes/tn2232/_index.html)则详细讲解了HTTPS验证相关知识，这里就不多说了。本文主要讲解我们最常用的NSURLConnection支持HTTPS的实现（NSURLSession的实现方法类似，只是要求授权证明的回调不一样而已），以及怎么样使用AFNetworking这个非常流行的第三方库来支持HTTPS。本文假设你对HTTP以及NSURLConnection的接口有了足够的了解。

**验证证书的API**

相关的Api在[Security Framework](https://developer.apple.com/library/ios/documentation/Security/Reference/SecurityFrameworkReference/_index.html)中，验证流程如下：

1). 第一步，先获取需要验证的信任对象(Trust Object)。这个Trust Object在不同的应用场景下获取的方式都不一样，对于NSURLConnection来说，是从delegate方法-connection:willSendRequestForAuthenticationChallenge:回调回来的参数challenge中获取([challenge.protectionSpace serverTrust])。

2). 使用系统默认验证方式验证Trust Object。[SecTrustEvaluate](https://developer.apple.com/library/ios/documentation/Security/Reference/certifkeytrustservices/#//apple_ref/c/func/SecTrustEvaluate)会根据Trust Object的验证策略，一级一级往上，验证证书链上每一级数字签名的有效性（上一部分有讲解），从而评估证书的有效性。

3). 如第二步验证通过了，一般的安全要求下，就可以直接验证通过，进入到下一步：使用Trust Object生成一份凭证([NSURLCredential credentialForTrust:serverTrust])，传入challenge的sender中([challenge.sender useCredential:cred forAuthenticationChallenge:challenge])处理，建立连接。

4). 假如有更强的安全要求，可以继续对Trust Object进行更严格的验证。常用的方式是在本地导入证书，验证Trust Object与导入的证书是否匹配。更多的方法可以查看[Enforcing Stricter Server Trust Evaluation](https://developer.apple.com/library/ios/technotes/tn2232/_index.html#//apple_ref/doc/uid/DTS40012884-CH1-SECSTRICTER)，这一部分在讲解AFNetworking源码中会讲解到。

5). 假如验证失败，取消此次[Challenge-Response Authentication](http://en.wikipedia.org/wiki/Challenge%E2%80%93response_authentication)验证流程，拒绝连接请求。

ps: 假如是自建证书的，则会跳过第二步，使用第三部进行验证，因为自建证书的根CA的数字签名未在操作系统的信任列表中。

iOS授权验证的API和流程大概了解了，下面，我们看看在NSURLConnection中的代码实现：

**使用NSURLConnection支持HTTPS的实现**

```objective-c
Now start the connection
NSURL * httpsURL = [NSURL URLWithString:@"https://www.google.com"];
self.connection = [NSURLConnection connectionWithRequest:[NSURLRequest requestWithURL:httpsURL] delegate:self];
     
//回调
- (void)connection:(NSURLConnection *)connection willSendRequestForAuthenticationChallenge:(NSURLAuthenticationChallenge *)challenge {
    //1)获取trust object
    SecTrustRef trust = challenge.protectionSpace.serverTrust;
    SecTrustResultType result;
     
    //2)SecTrustEvaluate对trust进行验证
    OSStatus status = SecTrustEvaluate(trust, &result);
    if (status == errSecSuccess &&
        (result == kSecTrustResultProceed ||
        result == kSecTrustResultUnspecified)) {
         
        //3)验证成功，生成NSURLCredential凭证cred，告知challenge的sender使用这个凭证来继续连接
        NSURLCredential *cred = [NSURLCredential credentialForTrust:trust];
        [challenge.sender useCredential:cred forAuthenticationChallenge:challenge];
         
    } else {
     
        //5)验证失败，取消这次验证流程
        [challenge.sender cancelAuthenticationChallenge:challenge];
         
  }
}
```

上面是代码是通过系统默认验证流程来验证证书的。假如我们是自建证书的呢？这样Trust Object里面服务器的证书因为不是可信任的CA签发的，所以直接使用SecTrustEvaluate进行验证是不会成功。又或者，即使服务器返回的证书是信任CA签发的，又如何确定这证书就是我们想要的特定证书？这就需要先在本地导入证书，设置成需要验证的Anchor Certificate(就是根证书)，再调用SecTrustEvaluate来验证。代码如下

```objective-c
//先导入证书
NSString * cerPath = ...; //证书的路径
NSData * cerData = [NSData dataWithContentsOfFile:cerPath];
SecCertificateRef certificate = SecCertificateCreateWithData(NULL, (__bridge CFDataRef)(cerData));
self.trustedCertificates = @[CFBridgingRelease(certificate)];
//回调
- (void)connection:(NSURLConnection *)connection willSendRequestForAuthenticationChallenge:(NSURLAuthenticationChallenge *)challenge {
    //1)获取trust object
    SecTrustRef trust = challenge.protectionSpace.serverTrust;
    SecTrustResultType result;
    //注意：这里将之前导入的证书设置成下面验证的Trust Object的anchor certificate
    SecTrustSetAnchorCertificates(trust, (__bridge CFArrayRef)self.trustedCertificates);
    //2)SecTrustEvaluate会查找前面SecTrustSetAnchorCertificates设置的证书或者系统默认提供的证书，对trust进行验证
    OSStatus status = SecTrustEvaluate(trust, &result);
    if (status == errSecSuccess &&
        (result == kSecTrustResultProceed ||
        result == kSecTrustResultUnspecified)) {
         
        //3)验证成功，生成NSURLCredential凭证cred，告知challenge的sender使用这个凭证来继续连接
        NSURLCredential *cred = [NSURLCredential credentialForTrust:trust];
        [challenge.sender useCredential:cred forAuthenticationChallenge:challenge];
         
    } else {
     
        //5)验证失败，取消这次验证流程
        [challenge.sender cancelAuthenticationChallenge:challenge];
         
  }
}
```

建议采用本地导入证书的方式验证证书，来保证足够的安全性。更多的验证方法，请查看官方文档[《HTTPS Server Trust Evaluation》](https://developer.apple.com/library/ios/technotes/tn2232/_index.html)

**使用AFNetworking来支持HTTPS**

[AFNetworking](https://github.com/AFNetworking/AFNetworking)是iOS/OSX开发最流行的第三方开源库之一，其作者是非常著名的iOS/OSX开发者[Mattt Thompson](https://github.com/mattt)，其博客[NSHipster](http://nshipster.com/)也是iOS/OSX开发者学习和开阔技术视野的好地方。AFNetworking已经将上面的逻辑代码封装好，甚至更完善，在AFSecurityPolicy文件中，有兴趣可以阅读这个模块的代码；

AFNetworking上配置对HTTPS的支持非常简单：

```objective-c
NSURL * url = [NSURL URLWithString:@"https://www.google.com"];
AFHTTPRequestOperationManager * requestOperationManager = [[AFHTTPRequestOperationManager alloc] initWithBaseURL:url];
dispatch_queue_t requestQueue = dispatch_create_serial_queue_for_name("kRequestCompletionQueue");
requestOperationManager.completionQueue = requestQueue;
AFSecurityPolicy * securityPolicy = [AFSecurityPolicy policyWithPinningMode:AFSSLPinningModeCertificate];
//allowInvalidCertificates 是否允许无效证书（也就是自建的证书），默认为NO
//如果是需要验证自建证书，需要设置为YES
securityPolicy.allowInvalidCertificates = YES;
//validatesDomainName 是否需要验证域名，默认为YES；
//假如证书的域名与你请求的域名不一致，需把该项设置为NO
//主要用于这种情况：客户端请求的是子域名，而证书上的是另外一个域名。因为SSL证书上的域名是独立的，假如证书上注册的域名是www.google.com，那么mail.google.com是无法验证通过的；当然，有钱可以注册通配符的域名*.google.com，但这个还是比较贵的。
securityPolicy.validatesDomainName = NO;
//validatesCertificateChain 是否验证整个证书链，默认为YES
//设置为YES，会将服务器返回的Trust Object上的证书链与本地导入的证书进行对比，这就意味着，假如你的证书链是这样的：
//GeoTrust Global CA 
//    Google Internet Authority G2
//        *.google.com
//那么，除了导入*.google.com之外，还需要导入证书链上所有的CA证书（GeoTrust Global CA, Google Internet Authority G2）；
//如是自建证书的时候，可以设置为YES，增强安全性；假如是信任的CA所签发的证书，则建议关闭该验证；
securityPolicy.validatesCertificateChain = NO;
requestOperationManager.securityPolicy = securityPolicy;
```

这就是AFNetworking的支持HTTPS的主要配置说明，AFHTTPSessionManager与之基本一致，就不重复了。

**3. 总结**

虽然HTTPS相比于HTTP来说，会有一定的性能上的劣势，但对于网络飞速发展，移动设备的性能成倍增长的今天，安全才是我们更应该去考虑的。全网HTTPS并不是那么遥远。





[Fromwhere](http://www.cocoachina.com/ios/20150810/12947.html)

[BackHome](http://robinshare.github.io/)

