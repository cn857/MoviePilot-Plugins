# Emos API 文档

> 从 [Postman 公开集合](https://www.postman.com/somebyteorg/emos) (`api` collection) 提取。
> 集合最后更新: 2026-06-10T11:47:49.000Z

## 基础信息

- **正式服**       : `https://emos.best`
- **备用地址**     : `https://api.emos.best`（遇到 CF 403 时用）
- **测试服**       : `https://test.emos.best`
- **测试服 Token** : `11_test-token`
- **鉴权方式**     : Bearer Token
- **Token 获取**   : 访问主站获得「密钥」，格式 `xx_xxx`
- **快捷登录**     : `https://emos.best/#/sign?token=xxx_xxx`
- **请求头**       : `Authorization: Bearer <token>`

## 名词解释

| 缩写 | 全称             | 含义           |
|------|------------------|----------------|
| pn   | person           | 人物 ID        |
| vb   | video library    | 媒体库 ID      |
| vl   | video list       | 视频 ID        |
| vs   | video season     | 季 ID          |
| ve   | video episode    | 集 ID          |
| vp   | video part       | 片段 ID        |
| vm   | video media      | 具体资源 ID    |
| vt   | video subtitle   | 字幕 ID        |

---

## ⭐ 签到相关接口

### 签到

- **请求**: `PUT` `{{url}}/api/user/sign?content`
- **说明**: 执行签到。content 为可选 query 参数，"说点什么进行随机签到以获得更多萝卜"，留空也能签。
- **注意**:
  - **禁止接口轮询**，发现做封禁处理。
  - 如果是搞自动签到，**禁止选 0 点**。
  - 建议先调 `/api/user` 看 `sign` 字段，为 `null` 才签到（幂等判断）。

### 判断是否登录

- **请求**: `GET` `{{url}}/api/sign/check`
- **说明**: 校验当前 Bearer Token 是否有效。

### 基本信息

- **请求**: `GET` `{{url}}/api/user`
- **说明**: 获取用户完整信息。**`sign` 字段**：当天未签到时返回 `null`，可据此判断是否需要签到。
- **注意**:
  - `server_*` — 各服务端登录地址
  - `must_otp` — 是否需要一次性密码
  - `telegram_bind_url` — TG 绑定地址，`null` 表示已绑定
  - `pseudonym` — 笔名
  - `roles` — 角色列表
  - `is_viewing` — 是否有观影权限
  - `size_upload` — 上传总量（字节）
  - `invite_remaining` — 可邀请人数
  - `slot_remaining` — 剩余片单卡槽数
  - `sign` — 签到信息，当天未签到返回 `null`

### 签到排行榜

- **请求**: `GET` `{{url}}/api/rank/sign`
- **说明**: 获取签到排行榜。

### 自动签到推荐流程

```
1. GET /api/sign/check          → 验证 token 有效
2. GET /api/user               → 检查 response.sign 是否为 null
3. 若 sign == null:
   PUT /api/user/sign?content=xxx  → 执行签到
   否则：今天已签，跳过
```

> 触发时间避开 0 点，每天只跑一次，不要轮询。

---

## 全部接口（按分组）

### 上传相关

| 方法 | 路径 | 说明 |
|------|------|------|
| POST | `{{url}}/api/upload/getUploadToken` |  |

### 专辑

| 方法 | 路径 | 说明 |
|------|------|------|
| PUT | `{{url}}/api/music/album/{{music_alumb_id}}/updateVideoId?video_id={{video_id}}` |  |
| | _Query: `video_id`_ | None |
| GET | `{{url}}/api/music/album/list?album_id&name&has_media&is_favorite&is_rating&person_id_artist&person_name_artist` |  |
| | _Query: `album_id`_ | None |
| | _Query: `name`_ | None |
| | _Query: `has_media`_ | None |
| | _Query: `is_favorite`_ | None |
| | _Query: `is_rating`_ | None |
| | _Query: `person_id_artist`_ | None |
| | _Query: `person_name_artist`_ | None |

### 其他

| 方法 | 路径 | 说明 |
|------|------|------|
| PATCH | `{{url}}/api/music/syncSpotifyArtist` |  |
| PUT | `{{url}}/api/music/favorite?type=mp&value=1000` | 支持 `歌手` `音乐` `专辑` |
| | _Query: `type`_ | 类型 |
| | _Query: `value`_ | None |
| PUT | `{{url}}/api/music/rating?type=mp&value=1000&rating=1` |  |
| | _Query: `type`_ | 类型 |
| | _Query: `value`_ | 关联的id |
| | _Query: `rating`_ | 5分制 整数 传null则删除评分 |
| PATCH | `{{url}}/api/music/sync?type=mp&value=1001` | 同步专辑时会自动同步专辑下所属音乐 |
| | _Query: `type`_ | 类型 |
| | _Query: `value`_ | 对应的ID |

### 分类

| 方法 | 路径 | 说明 |
|------|------|------|
| DELETE | `{{url}}/api/shop/category/delete?category_id=1000` |  |
| | _Query: `category_id`_ | None |
| PUT | `{{url}}/api/shop/category/sort` |  |
| GET | `{{url}}/api/shop/category/list?seller_id=1000` |  |
| | _Query: `seller_id`_ | None |
| POST | `{{url}}/api/shop/category/create` |  |

### 列表相关

| 方法 | 路径 | 说明 |
|------|------|------|
| GET | `{{url}}/api/live/list?library_id=100&code&title` |  |
| | _Query: `library_id`_ | 直播的媒体库id |
| | _Query: `code`_ | 直播列表的唯一编码 官方源存在 |
| | _Query: `title`_ | 直播列表 按照标题搜索 |
| DELETE | `{{url}}/api/live/list/{{live_list_id}}` | 不可删除官方的直播 |
| POST | `{{url}}/api/live/list` | 如果存在 `code` 则为官方源 除图片外均可修改 |

### 商品

| 方法 | 路径 | 说明 |
|------|------|------|
| PUT | `{{url}}/api/shop/product/sort?product_id=1000&sort=80` |  |
| | _Query: `product_id`_ | None |
| | _Query: `sort`_ | None |
| POST | `{{url}}/api/shop/product/createOrUpdate` |  |
| PUT | `{{url}}/api/shop/product/up?product_id=1000` |  |
| | _Query: `product_id`_ | None |
| GET | `{{url}}/api/shop/product/list?seller_id=1000&category_id=1000&name&sort_by=sort&sort_order=asc&is_up=1` |  |
| | _Query: `seller_id`_ | None |
| | _Query: `category_id`_ | None |
| | _Query: `name`_ | 商品名 |
| | _Query: `sort_by`_ | 排序字段 |
| | _Query: `sort_order`_ | 排序方式 |
| | _Query: `is_up`_ | 是否上架 |
| PUT | `{{url}}/api/shop/product/category?product_id=1000&category_id=1000` |  |
| | _Query: `product_id`_ | None |
| | _Query: `category_id`_ | None |
| GET | `{{url}}/api/shop/product/info?product_id=1000` |  |
| | _Query: `product_id`_ | None |
| DELETE | `{{url}}/api/shop/product/delete?product_id=1000` |  |
| | _Query: `product_id`_ | None |

### 商户

| 方法 | 路径 | 说明 |
|------|------|------|
| GET | `{{url}}/api/shop/seller/base?seller_id` | 商户状态 |
| | _Query: `seller_id`_ | 如果查自己为空即可 |
| POST | `{{url}}/api/shop/seller/apply` |  |
| POST | `{{url}}/api/shop/seller/update` |  |

### 商户层面

| 方法 | 路径 | 说明 |
|------|------|------|
| PUT | `{{url}}/api/shop/order/shop/delivery` |  |
| POST | `{{url}}/api/shop/order/shop/remark` |  |
| DELETE | `{{url}}/api/shop/order/shop/order?order_no=20260331012556shopgtRev` |  |
| | _Query: `order_no`_ | None |
| GET | `{{url}}/api/shop/order/shop/order?user_id&order_no&order_title&is_pay&is_delivery&product_id` |  |
| | _Query: `user_id`_ | None |
| | _Query: `order_no`_ | None |
| | _Query: `order_title`_ | None |
| | _Query: `is_pay`_ | None |
| | _Query: `is_delivery`_ | None |
| | _Query: `product_id`_ | None |

### 图片

| 方法 | 路径 | 说明 |
|------|------|------|
| DELETE | `{{url}}/api/upload/image/delete?file_id=EzqvM34pPRge` |  |
| | _Query: `file_id`_ | None |
| GET | `{{url}}/api/upload/image/list?name=&date=` |  |
| | _Query: `name`_ | 通过文件名查询 |
| | _Query: `date`_ | 通过上传日期查询 Y-m-d |

### 字幕

| 方法 | 路径 | 说明 |
|------|------|------|
| POST | `{{url}}/api/upload/subtitle/save` |  |

### 字幕相关

| 方法 | 路径 | 说明 |
|------|------|------|
| PUT | `{{url}}/api/video/subtitle/rename?subtitle_id=Bpvx8YxPoVdQ&title=简中` |  |
| | _Query: `subtitle_id`_ | None |
| | _Query: `title`_ | None |
| GET | `{{url}}/api/video/subtitle/list?video_list_id=1&video_episode_id=1&video_part_id&media_id` | 参数中 查什么穿什么 |
| | _Query: `video_list_id`_ | 视频id |
| | _Query: `video_episode_id`_ | 集ID |
| | _Query: `video_part_id`_ | 分段ID |
| | _Query: `media_id`_ | 资源ID |
| DELETE | `{{url}}/api/video/subtitle/delete` |  |

### 封禁相关

| 方法 | 路径 | 说明 |
|------|------|------|
| GET | `{{url}}/api/ban/list` | 只显示最近一周的数据 |
| PUT | `{{url}}/api/ban/change?type=disable&user_id=e0E4MKO96s&reason=原因啊` |  |
| | _Query: `type`_ | 类型 disable 封禁 unblock 解禁 |
| | _Query: `user_id`_ | 用户ID |
| | _Query: `reason`_ | 封禁或解禁原因 |

### 我的服

| 方法 | 路径 | 说明 |
|------|------|------|
| GET | `{{url}}/api/user/server/videoHistory` |  |
| POST | `{{url}}/api/user/server/videoLogout` |  |

### 投票

| 方法 | 路径 | 说明 |
|------|------|------|
| GET | `{{url}}/api/telegram/vote/result?vote_id=4` | 只可以查看已结束的投票 |
| | _Query: `vote_id`_ | None |
| POST | `{{url}}/api/telegram/vote/create` |  |

### 抽奖相关

| 方法 | 路径 | 说明 |
|------|------|------|
| PUT | `{{url}}/api/lottery/stop?lottery_id=4zwLEpq8P2r1` |  |
| | _Query: `lottery_id`_ | None |
| POST | `{{url}}/api/lottery/create` |  |
| GET | `{{url}}/api/lottery/win?lottery_id=4zwLEpq8P2r1` |  |
| | _Query: `lottery_id`_ | None |
| PUT | `{{url}}/api/lottery/cancel?lottery_id=4zwLEpq8P2r1` |  |
| | _Query: `lottery_id`_ | None |

### 支付相关

| 方法 | 路径 | 说明 |
|------|------|------|
| POST | `{{url}}/api/pay/transfer` | 类似于提现 退款等 |
| GET | `{{url}}/api/pay/getUserCarrot?user_id=ewd3n7ex8s` |  |
| | _Query: `user_id`_ | None |
| PUT | `{{url}}/api/pay/close?no=20260215153614-pay-eA2rq` | 只有首次会关闭成功 |
| | _Query: `no`_ | None |
| GET | `{{url}}/api/pay/base` | - `total_revenue` 总收入 |
| POST | `{{url}}/api/pay/update` | 只有审核通过的可以更改 |
| GET | `{{url}}/api/pay/query?no=20260215153614-pay-eA2rq` |  |
| | _Query: `no`_ | None |
| POST | `{{url}}/api/pay/create` | 在网页支付时候可以手动将 `return_url` 拼接到地址后面 |
| POST | `{{url}}/api/pay/apply` |  |
| GET | `{{url}}/api/pay/getUserInfo?user_id=ewd3n7ex8s&username=soa` | 参数中 任意存在一个即可 |
| | _Query: `user_id`_ | None |
| | _Query: `username`_ | None |
| POST | `{{url}}/api/pay/testNotify` |  |

### 榜单相关

| 方法 | 路径 | 说明 |
|------|------|------|
| GET | `{{url}}/api/rank/userVideoRecordPlaying` | 数据为最近3分钟正在看的人 |
| GET | `{{url}}/api/rank/sign` |  |
| GET | `{{url}}/api/rank/carrot` | 前30条数据 10分钟缓存时间 |
| GET | `{{url}}/api/rank/upload` | 前30条数据 10分钟缓存时间 单位 字节 |
| GET | `{{url}}/api/rank/userLiveRecordPlaying` | 数据为最近3分钟正在看的人 |

### 歌手

| 方法 | 路径 | 说明 |
|------|------|------|
| GET | `{{url}}/api/music/person/list?person_id&name` |  |
| | _Query: `person_id`_ | None |
| | _Query: `name`_ | None |
| GET | `None` |  |

### 歌词

| 方法 | 路径 | 说明 |
|------|------|------|
| DELETE | `{{url}}/api/music/song/{{music_song_id}}/lyric/delete?lyric_id=1` |  |
| | _Query: `lyric_id`_ | None |
| GET | `{{url}}/api/music/song/{{music_song_id}}/lyric/list` |  |
| POST | `{{url}}/api/music/song/{{music_song_id}}/lyric/create` |  |

### 求片相关

| 方法 | 路径 | 说明 |
|------|------|------|
| GET | `{{url}}/api/seek/poll?last_id=&page_size=10` | 只会显示未认领的片 |
| | _Query: `last_id`_ | 上次id |
| | _Query: `page_size`_ | 返回条数 |
| GET | `{{url}}/api/seek/query?seek_id=1` |  |
| | _Query: `seek_id`_ | 求片ID |
| PUT | `{{url}}/api/seek/claim` |  |
| PUT | `{{url}}/api/seek/apply?item_type=vl&item_id=1003` |  |
| | _Query: `item_type`_ | None |
| | _Query: `item_id`_ | None |
| GET | `{{url}}/api/seek/history?seek_id=1&video_list_id=&video_season_id&video_episode_id` | 为合并查询关系 使用时必须传一个 |
| | _Query: `seek_id`_ | 求片id |
| | _Query: `video_list_id`_ | 视频ID |
| | _Query: `video_season_id`_ | 视频季ID |
| | _Query: `video_episode_id`_ | 视频集ID |
| PUT | `{{url}}/api/seek/urge` |  |
| POST | `{{url}}/api/seek` |  |

### 片单相关

| 方法 | 路径 | 说明 |
|------|------|------|
| GET | `{{url}}/api/watch/{{watch_id}}/user` |  |
| GET | `{{url}}/api/watch?watch_id&type&name=&author_id=&author_username=&is_public=&is_self=&is_subscribe=` | - `maintainers` 维护者 |
| | _Query: `watch_id`_ | 片单ID |
| | _Query: `type`_ | 片单类型 |
| | _Query: `name`_ | 片单名称 |
| | _Query: `author_id`_ | 作者ID |
| | _Query: `author_username`_ | 作者用户名 采用左匹配模式 |
| | _Query: `is_public`_ | 是否公开 |
| | _Query: `is_self`_ | 是否自己的 |
| | _Query: `is_subscribe`_ | 是否订阅 |
| PUT | `{{url}}/api/watch/{{watch_id}}/sort?sort=80` | 类似于 媒体库排序 |
| | _Query: `sort`_ | None |
| POST | `{{url}}/api/watch/slot` |  |
| PUT | `{{url}}/api/watch/{{watch_id}}/maintainer` | 所有维护者 只对片单中的视频有操作权限 |
| DELETE | `{{url}}/api/watch/{{watch_id}}` |  |
| PUT | `{{url}}/api/watch/{{watch_id}}/show` | 类似于 媒体库隐藏 |
| PUT | `{{url}}/api/watch/{{watch_id}}/subscribe?sort` |  |
| | _Query: `sort`_ | 排序 在订阅时生效 |
| PUT | `{{url}}/api/watch/{{watch_id}}/dynamic` | 接口为同步调用 将会去目标地址执行抓取 |
| POST | `{{url}}/api/watch` |  |

### 用户层面

| 方法 | 路径 | 说明 |
|------|------|------|
| PUT | `{{url}}/api/shop/order/user/urge` |  |
| GET | `{{url}}/api/shop/order/user/list?seller_id&product_id&order_title&order_no&is_pay&is_delivery` |  |
| | _Query: `seller_id`_ | None |
| | _Query: `product_id`_ | None |
| | _Query: `order_title`_ | None |
| | _Query: `order_no`_ | 订单号 |
| | _Query: `is_pay`_ | 是否支付 null为全部 |
| | _Query: `is_delivery`_ | 是否发货 null为全部 |
| POST | `{{url}}/api/shop/order/user/close` |  |
| DELETE | `{{url}}/api/shop/order/user/order?order_no=20260331012556shopgtRev` |  |
| | _Query: `order_no`_ | None |
| POST | `{{url}}/api/shop/order/user/create` |  |
| POST | `{{url}}/api/shop/order/user/pay` |  |

### 用户相关

| 方法 | 路径 | 说明 |
|------|------|------|
| PUT | `{{url}}/api/user/passwordReset?password=1212` | 相关服软件中的登录密码 |
| | _Query: `password`_ | 新密码 |
| PUT | `{{url}}/api/user/agreeUploadAgreement` | 建议让用户在官网手动同意 |
| PUT | `{{url}}/api/user/pseudonym?name=张三` | 就像是 `up主` `化名` 等一样的东西 |
| | _Query: `name`_ | 新笔名 |
| GET | `{{url}}/api/user` | - `server_` 开头的为对应服的登录地址 |
| GET | `{{url}}/api/user/passwordTemporary` | 只有当 `must_otp` 为 `true` 时才是临时密码 |
| PUT | `{{url}}/api/user/showEmpty` |  |
| PUT | `{{url}}/api/user/sign?content` | 禁止接口轮训 发现做封禁处理 |
| | _Query: `content`_ | 说点什么进行随机签到以获得更多萝卜 |

### 登录相关

| 方法 | 路径 | 说明 |
|------|------|------|
| GET | `{{url}}/api/sign/check` |  |
| GET | `{{url}}/link?uuid={{$randomUUID}}&name=测试登录&url=https://emos-link.local` |  |
| | _Query: `uuid`_ | None |
| | _Query: `name`_ | None |
| | _Query: `url`_ | None |

### 直播相关

| 方法 | 路径 | 说明 |
|------|------|------|
| GET | `{{url}}/api/live/library` |  |

### 红包相关

| 方法 | 路径 | 说明 |
|------|------|------|
| GET | `{{url}}/api/redPacket/receive?red_packet_id=K21DY2yxLj6e` |  |
| | _Query: `red_packet_id`_ | None |
| POST | `{{url}}/api/redPacket/create` | 封面图相同的话 建议把 `file_id` 保存起来 |

### 线路相关

| 方法 | 路径 | 说明 |
|------|------|------|
| GET | `{{url}}/api/proxy/line?only_self` |  |
| | _Query: `only_self`_ | 是否只查询自己添加的 |
| DELETE | `{{url}}/api/proxy/line?id=1` |  |
| | _Query: `id`_ | 线路ID |
| POST | `{{url}}/api/proxy/line` |  |

### 萝卜相关

| 方法 | 路径 | 说明 |
|------|------|------|
| PUT | `{{url}}/api/carrot/transfer` |  |
| GET | `{{url}}/api/carrot/history?type=&user_id=` | # `type` 类型 |
| | _Query: `type`_ | 类型 |
| | _Query: `user_id`_ | 对方用户id 传递的话则查对方 |

### 观影记录

| 方法 | 路径 | 说明 |
|------|------|------|
| GET | `{{url}}/api/video/record/list` | 只会显示回传超过10s的视频 |
| PUT | `{{url}}/api/video/record/change?mode=delete&type=vl&id=1000` |  |
| | _Query: `mode`_ | 更新类型 delete 删除 complete 标记为完成 |
| | _Query: `type`_ | 视频类型 对这个类下所有视频生效 |
| | _Query: `id`_ | 对应的类ID |
| GET | `{{url}}/api/video/record/request?user_id` | 只可查询近一周的 |
| | _Query: `user_id`_ | 对方用户id 传递的话则查对方 |

### 视频

| 方法 | 路径 | 说明 |
|------|------|------|
| POST | `{{url}}/api/upload/video/saveInternal` | 需申请使用 |
| GET | `{{url}}/api/upload/video/base?item_type=vl&item_id=3` |  |
| | _Query: `item_type`_ | None |
| | _Query: `item_id`_ | None |
| POST | `{{url}}/api/upload/video/save` |  |

### 视频相关

| 方法 | 路径 | 说明 |
|------|------|------|
| GET | `{{url}}/api/video/list?tmdb_id=&todb_id&video_id=&type&title&only_delete&with_media&page&page_size` |  |
| | _Query: `tmdb_id`_ | None |
| | _Query: `todb_id`_ | None |
| | _Query: `video_id`_ | None |
| | _Query: `type`_ | 视频类型 |
| | _Query: `title`_ | 视频标题 |
| | _Query: `only_delete`_ | 是否仅查询已删除 |
| | _Query: `with_media`_ | 仅查询有视频的资源 true 是 flase否 null全部 |
| | _Query: `page`_ | None |
| | _Query: `page_size`_ | None |
| GET | `{{url}}/api/video/search?last_id&tmdb_id=&todb_id&video_id=&type&title&with_genre=&sort_by&page&page_size` |  |
| | _Query: `last_id`_ | 上条视频ID |
| | _Query: `tmdb_id`_ | None |
| | _Query: `todb_id`_ | None |
| | _Query: `video_id`_ | None |
| | _Query: `type`_ | 视频类型  |
| | _Query: `title`_ | None |
| | _Query: `with_genre`_ | 是否包含类型 |
| | _Query: `sort_by`_ | 排序方式 |
| | _Query: `page`_ | None |
| | _Query: `page_size`_ | None |
| PUT | `{{url}}/api/video/{{video_id}}/delete` |  |
| GET | `{{url}}/api/video/persons?video_list_id={{video_id}}&video_season_id=&video_episode_id` | # gender 性别 |
| | _Query: `video_list_id`_ | 视频ID 必传 |
| | _Query: `video_season_id`_ | 传入则查询当前季 |
| | _Query: `video_episode_id`_ | 传入则查询当前集 |
| GET | `{{url}}/api/video/getVideoId?video_id_type=tmdb&video_id_value=1600&season_number=&episode_number=&tmdb_type=` |  |
| | _Query: `video_id_type`_ | 视频id类型 |
| | _Query: `video_id_value`_ | 视频id值 |
| | _Query: `season_number`_ | 具体的季数 |
| | _Query: `episode_number`_ | 集体的集数 |
| | _Query: `tmdb_type`_ | tmdb会有id重叠情况 如果视频id类型为tmdb 建议传此字段 |
| GET | `{{url}}/api/video/{{video_id}}/episode?season_number&with_seek=1&with_seek_is_request=1` |  |
| | _Query: `season_number`_ | 季id 空则查全部 |
| | _Query: `with_seek`_ | 是否包含认领信息 |
| | _Query: `with_seek_is_request`_ | 是否包含是否点播信息 |
| GET | `{{url}}/api/video/tree?type&title&tmdb_id=63247&todb_id&video_id` | # 视频类型 `type` |
| | _Query: `type`_ | 类别 |
| | _Query: `title`_ | 名称 |
| | _Query: `tmdb_id`_ | None |
| | _Query: `todb_id`_ | None |
| | _Query: `video_id`_ | 视频ID |
| GET | `{{url}}/api/video/{{video_id}}/season` |  |
| PATCH | `{{url}}/api/video/sync?tmdb_id=&todb_id=1000` | 从 `todb` 平台同步视频信息 |
| | _Query: `tmdb_id`_ | 与 todb 二选一 |
| | _Query: `todb_id`_ | 与 tmdb 二选一  都存在以这个为准 |

### 视频类

| 方法 | 路径 | 说明 |
|------|------|------|
| POST | `{{url}}/api/watch/{{watch_id}}/video/{{video_id}}` |  |
| GET | `{{url}}/api/watch/{{watch_id}}/video?video_title=` |  |
| | _Query: `video_title`_ | 视频标题搜索 |
| POST | `{{url}}/api/watch/{{watch_id}}/video/update` | 最大支持 `1000` 个视频 |
| DELETE | `{{url}}/api/watch/{{watch_id}}/video/{{video_id}}` |  |
| GET | `{{url}}/api/watch/{{watch_id}}/video/search?title=权力的游戏&type` |  |
| | _Query: `title`_ | 视频名称 |
| | _Query: `type`_ | 视频类型 |
| DELETE | `{{url}}/api/watch/{{watch_id}}/video/empty` | 返回内容为 已删除视频总数 |

### 资源

| 方法 | 路径 | 说明 |
|------|------|------|
| GET | `{{url}}/api/music/song/{{music_song_id}}/media/playUrl?media_id=ymqnzjo29z80` |  |
| | _Query: `media_id`_ | None |
| GET | `{{url}}/api/music/song/{{music_song_id}}/media/list` |  |
| DELETE | `{{url}}/api/music/song/{{music_song_id}}/media/delete?media_id=x7zw5keew8r6&reason` |  |
| | _Query: `media_id`_ | None |
| | _Query: `reason`_ | 删除原因 删除别人资源时必填 |
| PUT | `{{url}}/api/music/song/{{music_song_id}}/media/move?media_id=ymqnzjo29z80` | 将资源移动到当前歌曲下 |
| | _Query: `media_id`_ | None |

### 资源相关

| 方法 | 路径 | 说明 |
|------|------|------|
| DELETE | `{{url}}/api/video/media/delete` |  |
| PUT | `{{url}}/api/video/media/move?media_id=YLgw45W2Jk1V&item_type=ve&item_id=3` |  |
| | _Query: `media_id`_ | None |
| | _Query: `item_type`_ | None |
| | _Query: `item_id`_ | None |
| GET | `{{url}}/api/video/media/list?video_list_id=1&video_season_id=&video_episode_id=&video_part_id&include_metadata=` | 参数中 查什么穿什么 |
| | _Query: `video_list_id`_ | 视频ID |
| | _Query: `video_season_id`_ | 季ID |
| | _Query: `video_episode_id`_ | 集ID |
| | _Query: `video_part_id`_ | 分段ID |
| | _Query: `include_metadata`_ | 包含元数据 |
| PUT | `{{url}}/api/video/media/rename?media_id=YLgw45W2Jk1V&name=4k HDR` |  |
| | _Query: `media_id`_ | None |
| | _Query: `name`_ | None |
| GET | `{{url}}/api/video/media/playUrl?media_id=YLgw45W2Jk1V` | 第三方播放使用 每次`-1`萝卜 |
| | _Query: `media_id`_ | None |
| GET | `{{url}}/api/video/media/listAll?media_id=&user_id=&only_delete=&include_metadata=` |  |
| | _Query: `media_id`_ | 资源ID |
| | _Query: `user_id`_ | 上传用户 |
| | _Query: `only_delete`_ | 仅查询已删除 |
| | _Query: `include_metadata`_ | 包含元数据 |

### 资源相关

| 方法 | 路径 | 说明 |
|------|------|------|
| POST | `{{url}}/api/live/media/update` | 外部接口用 |
| DELETE | `{{url}}/api/live/media/{{live_media_id}}` |  |
| POST | `{{url}}/api/live/media` |  |
| GET | `{{url}}/api/live/media?live_list_id={{live_list_id}}` | # `status` 值 系统内部用到 用户无法更改 |
| | _Query: `live_list_id`_ | 直播的媒体库id |

### 邀请相关

| 方法 | 路径 | 说明 |
|------|------|------|
| GET | `{{url}}/api/invite/history?username&page_size&user_id&page&telegram_user_id` |  |
| | _Query: `username`_ | 根据用户名搜索 |
| | _Query: `page_size`_ | None |
| | _Query: `user_id`_ | 根据用户ID搜索 |
| | _Query: `page`_ | None |
| | _Query: `telegram_user_id`_ | 根据tgid搜索 |
| POST | `{{url}}/api/invite` |  |
| GET | `{{url}}/api/invite/info` |  |
| POST | `{{url}}/api/invite/emps` |  |
| POST | `{{url}}/api/invite/revoke` |  |

### 音乐

| 方法 | 路径 | 说明 |
|------|------|------|
| POST | `{{url}}/api/upload/music/save` |  |
| POST | `{{url}}/api/upload/music/saveHeadless` | 有时候 `todb` 添加过于麻烦 |

### 音乐

| 方法 | 路径 | 说明 |
|------|------|------|
| DELETE | `{{url}}/api/music/song/{{music_song_id}}/delete` | 只有管理可以删除群星的版本 如果是用户的话 删除自己的资源时会顺带删除歌曲 |
| PUT | `{{url}}/api/music/song/{{music_song_id}}/updateVideoId?video_id={{video_id}}` | 类似于 `MV` |
| | _Query: `video_id`_ | 视频ID |
| GET | `{{url}}/api/music/song/search?name&has_media&person_id_artist&person_name_artist&is_headless` |  |
| | _Query: `name`_ | None |
| | _Query: `has_media`_ | None |
| | _Query: `person_id_artist`_ | None |
| | _Query: `person_name_artist`_ | None |
| | _Query: `is_headless`_ | 是否为群星歌曲 |
| POST | `{{url}}/api/music/song/batchHashExist` | 采用 `sha256` 验证 需要转为小写 |
| GET | `{{url}}/api/music/song/list?song_id&name&has_media&is_favorite=&is_rating&album_id=&person_id_artist=&person_name_artist&is_headless` |  |
| | _Query: `song_id`_ | 音乐ID |
| | _Query: `name`_ | 音乐名称 |
| | _Query: `has_media`_ | 是否存在资源 |
| | _Query: `is_favorite`_ | 仅展示收藏的 |
| | _Query: `is_rating`_ | 仅展示自己评分的 |
| | _Query: `album_id`_ | 专辑ID |
| | _Query: `person_id_artist`_ | 歌手id |
| | _Query: `person_name_artist`_ | 歌手姓名 |
| | _Query: `is_headless`_ | None |

### 音乐类

| 方法 | 路径 | 说明 |
|------|------|------|
| DELETE | `{{url}}/api/watch/{{watch_id}}/music/empty` |  |
| POST | `{{url}}/api/watch/{{watch_id}}/music/{{music_song_id}}` |  |
| DELETE | `{{url}}/api/watch/{{watch_id}}/music/{{music_song_id}}` |  |
| GET | `{{url}}/api/watch/{{watch_id}}/music?song_title=` |  |
| | _Query: `song_title`_ | None |
| GET | `{{url}}/api/watch/{{watch_id}}/music/search?song_title=` |  |
| | _Query: `song_title`_ | None |
