import threading
from datetime import date, datetime, timedelta
from typing import Any, Dict, List, Optional, Tuple

import pytz
from apscheduler.schedulers.background import BackgroundScheduler
from apscheduler.triggers.cron import CronTrigger

from app import schemas
from app.core.config import settings
from app.log import logger
from app.plugins import _PluginBase
from app.schemas.types import NotificationType
from app.utils.http import RequestUtils


class EmosSignIn(_PluginBase):
    """
    Emos 签到助手插件。

    对接 Emos API，支持：
    - 定时自动签到（通过 get_service cron 调度）
    - 手动签到（通过 Vue 前端或 API）
    - 萝卜收益追踪与统计
    - 签到历史记录
    - 系统通知推送
    """

    plugin_name = "Emos签到助手"
    plugin_desc = "自动签到Emos站点，追踪萝卜收益，查看签到历史。"
    plugin_icon = "emos.png"
    plugin_version = "1.5"
    plugin_author = "feng"
    author_url = "https://github.com/cn857"
    plugin_config_prefix = "emossignin_"
    plugin_order = 50
    auth_level = 1

    # 数据存储键
    DATA_KEY_HISTORY = "sign_history"
    DATA_KEY_STATS = "sign_stats"

    # 默认接口地址
    DEFAULT_BASE_URL = "https://emos.best"

    # 运行时状态
    _scheduler: Optional[BackgroundScheduler] = None
    _lock = threading.Lock()

    # 配置属性
    _enabled: bool = False
    _base_url: str = DEFAULT_BASE_URL
    _token: str = ""
    _cron: str = "0 8 * * *"
    _sign_content: str = ""
    _notify: bool = True
    _onlyonce: bool = False
    _show_sidebar: bool = True
    _random_saying: bool = False
    _random_saying_url: str = "https://uapis.cn"

    def init_plugin(self, config: dict = None):
        """根据当前配置初始化插件。"""
        self.stop_service()

        config = config or {}
        self._enabled = bool(config.get("enabled"))
        self._base_url = str(config.get("base_url") or self.DEFAULT_BASE_URL).rstrip("/")
        self._token = str(config.get("token") or "").strip()
        self._cron = str(config.get("cron") or "0 8 * * *").strip()
        self._sign_content = str(config.get("sign_content") or "").strip()
        self._notify = bool(config.get("notify"))
        self._onlyonce = bool(config.get("onlyonce"))
        self._show_sidebar = bool(config.get("show_sidebar", True))
        self._random_saying = bool(config.get("random_saying", False))
        self._random_saying_url = str(config.get("random_saying_url") or "https://uapis.cn").rstrip("/")

        # 立即运行一次
        if self._onlyonce:
            self._scheduler = BackgroundScheduler(timezone=settings.TZ)
            logger.info("Emos签到助手：立即运行一次")
            self._scheduler.add_job(
                func=self.sign_in,
                trigger="date",
                run_date=datetime.now(tz=pytz.timezone(settings.TZ)).replace(second=0) + timedelta(seconds=3),
                name="Emos签到-一次性",
            )
            self._onlyonce = False
            self._update_config()
            if self._scheduler.get_jobs():
                self._scheduler.start()

        # 后台验证 Token
        if self._enabled and self._token and not self._onlyonce:
            self._validate_token()

    # ── 基类必需方法 ──────────────────────────────────────

    def get_state(self) -> bool:
        return self._enabled

    @staticmethod
    def get_render_mode() -> Tuple[str, str]:
        return "vue", "dist/assets"

    def get_form(self) -> Tuple[List[dict], Dict[str, Any]]:
        return [
            {
                "component": "VForm",
                "content": [
                    {
                        "component": "VRow",
                        "content": [
                            {
                                "component": "VCol",
                                "props": {"cols": 12, "md": 4},
                                "content": [
                                    {
                                        "component": "VSwitch",
                                        "props": {
                                            "model": "enabled",
                                            "label": "启用插件",
                                        },
                                    }
                                ],
                            }
                        ],
                    },
                    {
                        "component": "VRow",
                        "content": [
                            {
                                "component": "VCol",
                                "props": {"cols": 12, "md": 6},
                                "content": [
                                    {
                                        "component": "VTextField",
                                        "props": {
                                            "model": "base_url",
                                            "label": "接口地址",
                                            "placeholder": "https://emos.best",
                                            "persistentPlaceholder": True,
                                        },
                                    }
                                ],
                            }
                        ],
                    },
                    {
                        "component": "VRow",
                        "content": [
                            {
                                "component": "VCol",
                                "props": {"cols": 12, "md": 6},
                                "content": [
                                    {
                                        "component": "VTextField",
                                        "props": {
                                            "model": "token",
                                            "label": "密钥 (Bearer Token)",
                                            "placeholder": "格式: xx_xxx",
                                            "type": "password",
                                            "persistentPlaceholder": True,
                                        },
                                    }
                                ],
                            }
                        ],
                    },
                    {
                        "component": "VRow",
                        "content": [
                            {
                                "component": "VCol",
                                "props": {"cols": 12, "md": 6},
                                "content": [
                                    {
                                        "component": "VCronField",
                                        "props": {
                                            "model": "cron",
                                            "label": "签到时间",
                                            "placeholder": "0 8 * * *",
                                        },
                                    }
                                ],
                            }
                        ],
                    },
                    {
                        "component": "VRow",
                        "content": [
                            {
                                "component": "VCol",
                                "props": {"cols": 12, "class": "mb-3"},
                                "content": [
                                    {
                                        "component": "VBtn",
                                        "props": {
                                            "variant": "outlined",
                                            "size": "small",
                                            "class": "mr-2 mb-1",
                                            "prependIcon": "mdi-clock-outline",
                                            "text": "每天 8:00",
                                        },
                                        "events": {
                                            "click": {
                                                "api": "plugin/EmosSignIn/set_cron",
                                                "method": "post",
                                                "params": {"cron": "0 8 * * *"},
                                            }
                                        },
                                    },
                                    {
                                        "component": "VBtn",
                                        "props": {
                                            "variant": "outlined",
                                            "size": "small",
                                            "class": "mr-2 mb-1",
                                            "prependIcon": "mdi-clock-outline",
                                            "text": "每天 12:00",
                                        },
                                        "events": {
                                            "click": {
                                                "api": "plugin/EmosSignIn/set_cron",
                                                "method": "post",
                                                "params": {"cron": "0 12 * * *"},
                                            }
                                        },
                                    },
                                    {
                                        "component": "VBtn",
                                        "props": {
                                            "variant": "outlined",
                                            "size": "small",
                                            "class": "mr-2 mb-1",
                                            "prependIcon": "mdi-clock-outline",
                                            "text": "每天 20:00",
                                        },
                                        "events": {
                                            "click": {
                                                "api": "plugin/EmosSignIn/set_cron",
                                                "method": "post",
                                                "params": {"cron": "0 20 * * *"},
                                            }
                                        },
                                    },
                                ],
                            }
                        ],
                    },
                    {
                        "component": "VRow",
                        "content": [
                            {
                                "component": "VCol",
                                "props": {"cols": 12},
                                "content": [
                                    {
                                        "component": "VAlert",
                                        "props": {
                                            "type": "warning",
                                            "variant": "tonal",
                                            "density": "compact",
                                            "text": "⚠️ 请勿将签到时间设置为 0:00（凌晨），否则可能导致账号被限制。",
                                        },
                                    }
                                ],
                            }
                        ],
                    },
                    {
                        "component": "VRow",
                        "content": [
                            {
                                "component": "VCol",
                                "props": {"cols": 12, "md": 6},
                                "content": [
                                    {
                                        "component": "VTextField",
                                        "props": {
                                            "model": "sign_content",
                                            "label": "签到附言（可选）",
                                            "placeholder": "留空则默认签到",
                                            "persistentPlaceholder": True,
                                        },
                                    }
                                ],
                            }
                        ],
                    },
                    {
                        "component": "VRow",
                        "content": [
                            {
                                "component": "VCol",
                                "props": {"cols": 12, "md": 4},
                                "content": [
                                    {
                                        "component": "VSwitch",
                                        "props": {
                                            "model": "notify",
                                            "label": "签到通知",
                                        },
                                    }
                                ],
                            },
                            {
                                "component": "VCol",
                                "props": {"cols": 12, "md": 4},
                                "content": [
                                    {
                                        "component": "VSwitch",
                                        "props": {
                                            "model": "onlyonce",
                                            "label": "立即执行一次",
                                            "color": "warning",
                                        },
                                    }
                                ],
                            },
                        ],
                    },
                    {
                        "component": "VRow",
                        "content": [
                            {
                                "component": "VCol",
                                "props": {"cols": 12, "md": 4},
                                "content": [
                                    {
                                        "component": "VSwitch",
                                        "props": {
                                            "model": "show_sidebar",
                                            "label": "启用左侧导航",
                                        },
                                    }
                                ],
                            },
                        ],
                    },
                    {
                        "component": "VRow",
                        "content": [
                            {
                                "component": "VCol",
                                "props": {"cols": 12, "md": 8},
                                "content": [
                                    {
                                        "component": "VTextField",
                                        "props": {
                                            "model": "random_saying_url",
                                            "label": "一言 API 地址",
                                            "placeholder": "https://uapis.cn",
                                        },
                                    }
                                ],
                            },
                            {
                                "component": "VCol",
                                "props": {"cols": 12, "md": 4},
                                "content": [
                                    {
                                        "component": "VSwitch",
                                        "props": {
                                            "model": "random_saying",
                                            "label": "启用一言附言",
                                        },
                                    }
                                ],
                            },
                        ],
                    },
                ],
            }
        ], {
            "enabled": False,
            "base_url": self.DEFAULT_BASE_URL,
            "token": "",
            "cron": "0 8 * * *",
            "sign_content": "",
            "notify": True,
            "onlyonce": False,
            "show_sidebar": True,
            "random_saying": False,
            "random_saying_url": "https://uapis.cn",
        }
    def get_page(self) -> List[dict]:
        """返回插件详情页 JSON，展示签到状态概览。"""
        stats = self.get_data(self.DATA_KEY_STATS) or {}
        today_str = date.today().isoformat()
        signed_today = stats.get("last_signin_date") == today_str
        total_signins = stats.get("total_signins", 0)
        total_carrots = stats.get("total_carrots", 0)

        return [
            {
                "component": "VAlert",
                "props": {
                    "type": "success" if self._enabled else "warning",
                    "variant": "tonal",
                    "density": "compact",
                    "text": f"插件状态: {'已启用' if self._enabled else '已停用'}",
                },
            },
            {
                "component": "VAlert",
                "props": {
                    "type": "success" if self._token else "warning",
                    "variant": "tonal",
                    "density": "compact",
                    "text": f"密钥配置: {'已配置' if self._token else '未配置'}",
                    "class": "mt-3",
                },
            },
            {
                "component": "VAlert",
                "props": {
                    "type": "success" if signed_today else "info",
                    "variant": "tonal",
                    "density": "compact",
                    "text": f"今日签到: {'已完成' if signed_today else '待签到'}",
                    "class": "mt-3",
                },
            },
            {
                "component": "VRow",
                "props": {"class": "mt-4"},
                "content": [
                    {
                        "component": "VCol",
                        "props": {"cols": 6},
                        "content": [
                            {
                                "component": "VCard",
                                "props": {"variant": "outlined"},
                                "content": [
                                    {
                                        "component": "VCardText",
                                        "props": {},
                                        "content": [
                                            {
                                                "component": "div",
                                                "props": {"class": "text-caption text-medium-emphasis"},
                                                "text": "累计签到",
                                            },
                                            {
                                                "component": "div",
                                                "props": {"class": "text-h5 font-weight-bold"},
                                                "text": f"{total_signins} 次",
                                            },
                                        ],
                                    }
                                ],
                            },
                        ],
                    },
                    {
                        "component": "VCol",
                        "props": {"cols": 6},
                        "content": [
                            {
                                "component": "VCard",
                                "props": {"variant": "outlined"},
                                "content": [
                                    {
                                        "component": "VCardText",
                                        "props": {},
                                        "content": [
                                            {
                                                "component": "div",
                                                "props": {"class": "text-caption text-medium-emphasis"},
                                                "text": "累计萝卜",
                                            },
                                            {
                                                "component": "div",
                                                "props": {"class": "text-h5 font-weight-bold"},
                                                "text": f"{total_carrots} 🥕",
                                            },
                                        ],
                                    }
                                ],
                            },
                        ],
                    },
                ],
            },
            {
                "component": "VAlert",
                "props": {
                    "type": "info",
                    "variant": "tonal",
                    "density": "compact",
                    "text": f"签到时间: {self._cron} | 通知: {'开' if self._notify else '关'} | 接口: {self._base_url}",
                    "class": "mt-3",
                },
            },
        ]

    def get_sidebar_nav(self) -> List[Dict[str, Any]]:
        if not self.get_state() or not self._show_sidebar:
            return []
        return [
            {
                "nav_key": "main",
                "title": "Emos签到助手",
                "icon": "mdi-calendar-check",
                "section": "system",
                "permission": "manage",
                "order": 51,
            },
            {
                "nav_key": "history",
                "title": "签到历史",
                "icon": "mdi-history",
                "section": "system",
                "permission": "manage",
                "order": 52,
            },
        ]

    def get_api(self) -> List[Dict[str, Any]]:
        return [
            {
                "path": "/status",
                "endpoint": self.get_status_api,
                "methods": ["GET"],
                "auth": "bear",
                "summary": "获取签到状态",
            },
            {
                "path": "/sign",
                "endpoint": self.trigger_sign_api,
                "methods": ["POST"],
                "auth": "bear",
                "summary": "手动执行签到",
            },
            {
                "path": "/history",
                "endpoint": self.get_history_api,
                "methods": ["GET"],
                "auth": "bear",
                "summary": "获取签到历史",
            },
            {
                "path": "/set_cron",
                "endpoint": self.set_cron_api,
                "methods": ["POST"],
                "auth": "bear",
                "summary": "设置签到时间",
            },
        ]

    def get_service(self) -> List[Dict[str, Any]]:
        if not self._enabled or not self._cron:
            return []
        return [
            {
                "id": "EmosSignIn",
                "name": "Emos签到助手定时服务",
                "trigger": CronTrigger.from_crontab(self._cron),
                "func": self.sign_in,
                "kwargs": {},
            }
        ]

    def stop_service(self):
        try:
            if self._scheduler:
                self._scheduler.remove_all_jobs()
                if self._scheduler.running:
                    self._scheduler.shutdown()
                self._scheduler = None
        except Exception:
            pass

    # ── 配置方法 ──────────────────────────────────────────

    def _update_config(self):
        self.update_config(
            {
                "enabled": self._enabled,
                "base_url": self._base_url,
                "token": self._token,
                "cron": self._cron,
                "sign_content": self._sign_content,
                "notify": self._notify,
                "onlyonce": self._onlyonce,
                "show_sidebar": self._show_sidebar,
                "random_saying": self._random_saying,
                "random_saying_url": self._random_saying_url,
            }
        )

    def _build_headers(self) -> Dict[str, str]:
        return {"Authorization": f"Bearer {self._token}"}

    def _request(self) -> RequestUtils:
        return RequestUtils(headers=self._build_headers(), proxies=settings.PROXY)

    # ── Token 验证 ────────────────────────────────────────

    def _validate_token(self):
        """在后台线程中校验 Token 是否有效。"""

        def _check():
            try:
                req = self._request()
                res = req.get_res(f"{self._base_url}/api/sign/check")
                if res and res.status_code == 200:
                    logger.info("Emos签到助手：Token 验证成功")
                else:
                    logger.warning(
                        f"Emos签到助手：Token 验证失败，状态码: {res.status_code if res else 'None'}"
                    )
                    if self._notify:
                        self.post_message(
                            title="Emos签到助手",
                            mtype=NotificationType.SiteMessage,
                            text="Token 验证失败，请检查密钥配置。",
                        )
            except Exception:
                logger.warning("Emos签到助手：Token 验证异常，请检查网络和接口地址")

        threading.Thread(target=_check, daemon=True).start()

    # ── 核心签到逻辑 ──────────────────────────────────────

    def sign_in(self):
        """执行签到流程（线程安全）。"""
        if not self._token:
            logger.warning("Emos签到助手：未配置 Token，无法签到")
            return

        with self._lock:
            # 第一重检查：本地是否已签到
            stats = self.get_data(self.DATA_KEY_STATS) or {}
            today_str = date.today().isoformat()
            if stats.get("last_signin_date") == today_str:
                logger.info("Emos签到助手：今日已签到（本地记录），跳过")
                return

            try:
                req = self._request()

                # Step 1: 验证 Token
                check_res = req.get_res(f"{self._base_url}/api/sign/check")
                if not check_res or check_res.status_code != 200:
                    logger.error(
                        f"Emos签到助手：Token 验证失败，状态码: {check_res.status_code if check_res else 'None'}"
                    )
                    if self._notify:
                        self.post_message(
                            title="Emos签到助手",
                            mtype=NotificationType.SiteMessage,
                            text="Token 验证失败，签到未执行。请检查密钥配置。",
                        )
                    return

                # Step 2: 获取用户信息，检查 sign 字段
                user_res = req.get_res(f"{self._base_url}/api/user")
                if not user_res or user_res.status_code != 200:
                    logger.error(
                        f"Emos签到助手：获取用户信息失败，状态码: {user_res.status_code if user_res else 'None'}"
                    )
                    return

                user_data = user_res.json()
                sign_info = user_data.get("sign")

                # 第二重检查：API 返回 sign 不为 null
                if sign_info is not None:
                    logger.info("Emos签到助手：今日已签到（API 返回 sign 非 null）")
                    stats["last_signin_date"] = today_str
                    self.save_data(self.DATA_KEY_STATS, stats)
                    return

                # Step 3: 执行签到
                # Build sign URL with content
                actual_content = self._sign_content
                if self._random_saying:
                    try:
                        saying_res = RequestUtils(proxies=settings.PROXY).get_res(
                            url=f"{self._random_saying_url}/api/v1/saying/random?mode=daily",
                        )
                        if saying_res and saying_res.status_code == 200:
                            saying_data = saying_res.json()
                            # uapis.cn: item.content (daily) or content (random)
                            item = saying_data.get("item", {})
                            fetched = item.get("content", "") or saying_data.get("content", "")
                            if fetched:
                                actual_content = fetched[:200]
                    except Exception as e:
                        logger.warning(f"Emos签到助手：获取一言失败，{e}，使用静态附言")

                sign_url = f"{self._base_url}/api/user/sign"
                if actual_content:
                    import urllib.parse
                    sign_url += f"?content={urllib.parse.quote(actual_content)}"

                sign_res = req.put_res(sign_url)
                if not sign_res or sign_res.status_code != 200:
                    status_code = sign_res.status_code if sign_res else "None"
                    logger.error(f"Emos签到助手：签到请求失败，HTTP {status_code}")
                    if self._notify:
                        self.post_message(
                            title="Emos签到助手",
                            mtype=NotificationType.SiteMessage,
                            text=f"签到失败，HTTP 状态码: {status_code}",
                        )
                    return

                sign_data = sign_res.json()
                carrot_earned = self._extract_carrot(sign_data)
                if carrot_earned == 0:
                    logger.warning(
                        f"Emos签到助手：未能从签到响应中提取萝卜数量，"
                        f"原始响应: {str(sign_data)[:500]}"
                    )

                # Step 4: 记录历史与统计
                record = {
                    "date": today_str,
                    "carrot_earned": carrot_earned,
                    "content": actual_content,
                    "timestamp": datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
                }
                history = self.get_data(self.DATA_KEY_HISTORY) or []
                history.insert(0, record)
                if len(history) > 365:
                    history = history[:365]
                self.save_data(self.DATA_KEY_HISTORY, history)

                stats["last_signin_date"] = today_str
                stats["total_signins"] = stats.get("total_signins", 0) + 1
                stats["total_carrots"] = stats.get("total_carrots", 0) + carrot_earned
                self.save_data(self.DATA_KEY_STATS, stats)

                logger.info(f"Emos签到助手：签到成功，获得 {carrot_earned} 萝卜")

                if self._notify:
                    self.post_message(
                        title="Emos签到助手",
                        mtype=NotificationType.SiteMessage,
                        text=(
                            f"签到成功！\n"
                            f"今日获得: {carrot_earned} 萝卜\n"
                            f"累计签到: {stats['total_signins']} 次\n"
                            f"累计萝卜: {stats['total_carrots']}"
                        ),
                    )

            except Exception as e:
                logger.error(f"Emos签到助手：签到异常 - {e}")
                if self._notify:
                    self.post_message(
                        title="Emos签到助手",
                        mtype=NotificationType.SiteMessage,
                        text=f"签到异常: {str(e)}",
                    )

    @staticmethod
    def _extract_carrot(response_data: dict) -> int:
        """从签到响应中解析萝卜数量，覆盖多种可能的 JSON 结构。"""
        if not isinstance(response_data, dict):
            return 0

        # 所有尝试匹配的字段名
        carrot_keys = (
            "carrot", "carrots", "carrot_earned", "earned",
            "point", "points", "earn_point", "reward", "amount", "value",
            "gain", "bonus", "credit", "credits", "obtain",
        )

        # 直接在顶层查找
        for key in carrot_keys:
            val = response_data.get(key)
            if val is not None:
                try:
                    return int(val)
                except (ValueError, TypeError):
                    pass

        # 在 data / response / sign / reward / result 中查找
        for outer in ("data", "response", "sign", "reward", "result"):
            inner = response_data.get(outer)
            if isinstance(inner, dict):
                for key in carrot_keys:
                    val = inner.get(key)
                    if val is not None:
                        try:
                            return int(val)
                        except (ValueError, TypeError):
                            pass

        # 尝试 data.sign.carrot 等深层嵌套
        data = response_data.get("data")
        if isinstance(data, dict):
            for sub in ("sign", "reward", "result"):
                sub_obj = data.get(sub)
                if isinstance(sub_obj, dict):
                    for key in carrot_keys:
                        val = sub_obj.get(key)
                        if val is not None:
                            try:
                                return int(val)
                            except (ValueError, TypeError):
                                pass

        return 0

    # ── API 端点处理器 ────────────────────────────────────

    def get_status_api(self) -> schemas.Response:
        """返回当前签到状态、统计和用户信息。"""
        try:
            stats = self.get_data(self.DATA_KEY_STATS) or {}
            today_str = date.today().isoformat()
            signed_today = stats.get("last_signin_date") == today_str

            # 尝试获取实时用户信息
            user_info = None
            if self._token:
                try:
                    req = self._request()
                    res = req.get_res(f"{self._base_url}/api/user")
                    if res and res.status_code == 200:
                        user_info = res.json()
                except Exception:
                    pass

            sign_status = None
            if user_info:
                sign_status = user_info.get("sign")

            return schemas.Response(
                success=True,
                data={
                    "enabled": self._enabled,
                    "token_configured": bool(self._token),
                    "signed_today": signed_today,
                    "sign_status": sign_status,
                    "stats": {
                        "total_signins": stats.get("total_signins", 0),
                        "total_carrots": stats.get("total_carrots", 0),
                        "last_signin_date": stats.get("last_signin_date"),
                    },
                    "config": {
                        "base_url": self._base_url,
                        "cron": self._cron,
                        "sign_content": self._sign_content,
                        "notify": self._notify,
                    },
                    "user_info": (
                        {
                            "pseudonym": user_info.get("pseudonym"),
                            "size_upload": user_info.get("size_upload"),
                            "invite_remaining": user_info.get("invite_remaining"),
                        }
                        if user_info
                        else None
                    ),
                },
            )
        except Exception as e:
            logger.error(f"Emos签到助手：获取状态失败 - {e}")
            return schemas.Response(success=False, message=str(e))

    def trigger_sign_api(self) -> schemas.Response:
        """手动触发签到。"""
        try:
            self.sign_in()
            return self.get_status_api()
        except Exception as e:
            logger.error(f"Emos签到助手：手动签到失败 - {e}")
            return schemas.Response(success=False, message=str(e))

    def get_history_api(self) -> schemas.Response:
        """返回签到历史列表。"""
        try:
            history = self.get_data(self.DATA_KEY_HISTORY) or []
            return schemas.Response(
                success=True,
                data={"history": history, "total": len(history)},
            )
        except Exception as e:
            logger.error(f"Emos签到助手：获取历史失败 - {e}")
            return schemas.Response(success=False, message=str(e))

    def set_cron_api(self, cron: str = "") -> schemas.Response:
        """设置签到时间 Cron 表达式。"""
        if not cron or not cron.strip():
            return schemas.Response(success=False, message="cron 参数不能为空")
        cron = cron.strip()
        self._cron = cron
        self._update_config()
        self.stop_service()
        logger.info(f"Emos签到助手：签到时间已更新为 {cron}")
        return schemas.Response(
            success=True,
            message=f"签到时间已更新为 {cron}，下次重新加载配置后生效。",
        )
