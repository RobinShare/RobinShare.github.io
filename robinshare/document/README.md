# musicPlayer
网页音乐播放器
### Audio对象
* 主要属性：
  * autoplay -> 在就绪（加载完成）后随即播放音频
  * currentTime -> 音频中的当前播放位置（以秒计）
  * duration -> 音频的长度（以秒计）
  * ended -> 音频的播放是否已结束
  * loop -> 音频是否应在结束时再次播放
  * src -> 音频文件路径
  * volume -> 音频的音量
*  主要方法：
  * play() -> 开始播放音频
  * pause() -> 暂停当前播放的音频

### 实现细节
* 歌曲名、歌手名、歌词都在数组中保存，通过遍历数组创建表格生成播放列表
* 歌词以[00:00.00]歌词形式存储，首先把每一句歌词分开，然后把每句歌词中的时间和内容分开，再把时间分和秒分开，换算成秒，通过计算歌词秒数与currentTime的差更新歌词。