# iOS 线程使用

[2015-09-28]

### 一、常用的方法dispatch_async

为了避免界面在处理耗时的操作时卡死，比如读取网络数据，IO,数据库读写等，我们会在另外一个线程中处理这些操作，然后通知主线程更新界面。

用GCD实现这个流程的操作比前面介绍的`NSThread` 、 `NSOperation`的方法都要简单。代码框架结构如下：

```objective-c
dispatch_async(dispatch_get_global_queue(DISPATCH_QUEUE_PRIORITY_DEFAULT, 0), ^{ 

    // 耗时的操作 

    dispatch_async(dispatch_get_main_queue(), ^{ 

        // 更新界面 

    }); 

}); 
```

如果这样还不清晰的话，那我们还是用以下的下载图片为例子，代码如下：

```objective-c
dispatch_async(dispatch_get_global_queue(DISPATCH_QUEUE_PRIORITY_DEFAULT, 0), ^{ 

    NSURL * url = [NSURL URLWithString:@"http://avatar.csdn.net/2/C/D/1_totogo2010.jpg"]; 

    NSData * data = [[NSData alloc]initWithContentsOfURL:url]; 

    UIImage *image = [[UIImage alloc]initWithData:data]; 

    if (data != nil) { 

        dispatch_async(dispatch_get_main_queue(), ^{ 

            self.imageView.image = image; 

         }); 

    } 

});
```

### 二、dispatch_group_async的使用

`dispatch_group_async`可以实现监听一组任务是否完成，完成后得到通知执行其他的操作。这个方法很有用，比如你执行三个下载任务，当三个任务都下载完成后你才通知界面说完成的了。下面是一段例子代码：

```objective-c
dispatch_queue_t queue = dispatch_get_global_queue(DISPATCH_QUEUE_PRIORITY_DEFAULT, 0); 

dispatch_group_t group = dispatch_group_create(); 

dispatch_group_async(group, queue, ^{ 

    [NSThread sleepForTimeInterval:1]; 

    NSLog(@"group1"); 

}); 

dispatch_group_async(group, queue, ^{ 

    [NSThread sleepForTimeInterval:2]; 

    NSLog(@"group2"); 

}); 

dispatch_group_async(group, queue, ^{ 

    [NSThread sleepForTimeInterval:3]; 

    NSLog(@"group3"); 

}); 

dispatch_group_notify(group, dispatch_get_main_queue(), ^{ 

    NSLog(@"updateUi"); 

}); 

dispatch_release(group); 
```

`dispatch_group_async`是异步的方法，运行后可以看到打印结果：

```objective-c
2015-09-28 16:04:16.737 gcdTest[43328:11303] group1

2015-09-28 16:04:17.738 gcdTest[43328:12a1b] group2

2015-09-28 16:04:18.738 gcdTest[43328:13003] group3

2015-09-28 16:04:18.739 gcdTest[43328:f803] updateUi
```

每个一秒打印一个，当第三个任务执行后，upadteUi被打印。

### 三、dispatch_barrier_async的使用

`dispatch_barrier_async`是在前面的任务执行结束后它才执行，而且它后面的任务等它执行完成之后才会执行

例子代码如下：

```objective-c
dispatch_queue_t queue = dispatch_queue_create("gcdtest.rongfzh.yc", DISPATCH_QUEUE_CONCURRENT); 

dispatch_async(queue, ^{ 

    [NSThread sleepForTimeInterval:2]; 

    NSLog(@"dispatch_async1"); 

}); 

dispatch_async(queue, ^{ 

    [NSThread sleepForTimeInterval:4]; 

    NSLog(@"dispatch_async2"); 

}); 

dispatch_barrier_async(queue, ^{ 

    NSLog(@"dispatch_barrier_async"); 

    [NSThread sleepForTimeInterval:4]; 

 

}); 

dispatch_async(queue, ^{ 

    [NSThread sleepForTimeInterval:1]; 

    NSLog(@"dispatch_async3"); 

});
```

打印结果：

```objective-c
2015-09-28 16:20:33.967 gcdTest[45547:11203] dispatch_async1

2015-09-28 16:20:35.967 gcdTest[45547:11303] dispatch_async2

2015-09-28 16:20:35.967 gcdTest[45547:11303] dispatch_barrier_async

2015-09-28 16:20:40.970 gcdTest[45547:11303] dispatch_async3
```

请注意执行的时间，可以看到执行的顺序如上所述。

### 四、dispatch_apply

执行某个代码片段N次。

```objective-c
dispatch_apply(5, dispatch_get_global_queue(DISPATCH_QUEUE_PRIORITY_DEFAULT, 0)

, ^(size_t index) {

    // 执行5次

});
```





[BackHome](http://robinshare.github.io/)


