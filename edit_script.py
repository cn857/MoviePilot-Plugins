
path = "D:/Data/Work/github/MoviePilot-Plugins/plugins.v2/emossignin/__init__.py"
with open(path, "r", encoding="utf-8") as f:
    text = f.read()

# 1. Class attribute
text = text.replace(
    "    _show_sidebar: bool = True\n\n    def init_plugin",
    "    _show_sidebar: bool = True\n    _random_saying: bool = False\n    _random_saying_url: str = \"https://v1.uapis.cn\"\n\n    def init_plugin"
)

# 2. Parse in init_plugin
text = text.replace(
    "        self._show_sidebar = bool(config.get(\"show_sidebar\", True))\n\n        # \u7acb\u5373\u6267\u884c\u4e00\u6b21",
    "        self._show_sidebar = bool(config.get(\"show_sidebar\", True))\n        self._random_saying = bool(config.get(\"random_saying\", False))\n        self._random_saying_url = str(config.get(\"random_saying_url\") or \"https://v1.uapis.cn\").rstrip(\"/\")\n\n        # \u7acb\u5373\u6267\u884c\u4e00\u6b21"
)

# 3. Add form fields - match the show_sidebar VRow and insert new rows before form end
old_form_end = """                            {
                                "component": "VSwitch",
                                        "props": {
                                            "model": "show_sidebar",
                                            "label": "\u542f\u7528\u5de6\u4fa7\u5bfc\u822a",
                                        },
                                    }
                                ],
                            },
                        ],
                    },
                ],
            }
        ], {"""

new_form = """                            {
                                "component": "VSwitch",
                                        "props": {
                                            "model": "show_sidebar",
                                            "label": "\u542f\u7528\u5de6\u4fa7\u5bfc\u822a",
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
                                "props": {"cols": 12, "md": 6},
                                "content": [
                                    {
                                        "component": "VTextField",
                                        "props": {
                                            "model": "random_saying_url",
                                            "label": "\u968f\u673a\u9644\u8a00\u63a5\u53e3\u5730\u5740",
                                            "placeholder": "https://v1.uapis.cn",
                                            "persistentPlaceholder": True,
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
                                            "model": "random_saying",
                                            "label": "\u4f7f\u7528\u968f\u673a\u9644\u8a00\uff08\u8986\u76d6\u56fa\u5b9a\u9644\u8a00\uff09",
                                        },
                                    }
                                ],
                            },
                        ],
                    },
                ],
            }
        ], {"""
text = text.replace(old_form_end, new_form)

# 4. Default values in form model
text = text.replace(
    '            "show_sidebar": True,\n        }',
    '            "show_sidebar": True,\n            "random_saying": False,\n            "random_saying_url": "https://v1.uapis.cn",\n        }'
)

# 5. Persist in _update_config
text = text.replace(
    '"show_sidebar": self._show_sidebar,\n            }\n        )',
    '"show_sidebar": self._show_sidebar,\n                "random_saying": self._random_saying,\n                "random_saying_url": self._random_saying_url,\n            }\n        )'
)

# 6. Modify sign_in to fetch random saying
old_sign = """                # Step 3: \u6267\u884c\u7b7e\u5230
                sign_url = f"{self._base_url}/api/user/sign"
                if self._sign_content:
                    sign_url += f"?content={self._sign_content}""""

new_sign = """                # Step 3: \u83b7\u53d6\u968f\u673a\u9644\u8a00\uff08\u5982\u5f00\u542f\uff09
                actual_content = self._sign_content
                if self._random_saying:
                    try:
                        saying_req = RequestUtils(proxies=settings.PROXY)
                        saying_res = saying_req.get_res(f"{self._random_saying_url}/api/v1/saying/random?mode=daily")
                        if saying_res and saying_res.status_code == 200:
                            saying_data = saying_res.json()
                            if saying_data.get("code") == 0:
                                content = saying_data.get("data", {}).get("content", "")
                                if content:
                                    actual_content = content
                    except Exception as e:
                        logger.warning(f"Emos\u7b7e\u5230\u52a9\u624b\uff1a\u83b7\u53d6\u968f\u673a\u9644\u8a00\u5931\u8d25 - {e}")

                # Step 4: \u6267\u884c\u7b7e\u5230
                sign_url = f"{self._base_url}/api/user/sign"
                if actual_content:
                    sign_url += f"?content={actual_content}""""
text = text.replace(old_sign, new_sign)

# 7. Update history record to use actual_content
old_record = """                # Step 4: \u8bb0\u5f55\u5386\u53f2\u4e0e\u7edf\u8ba1
                record = {
                    "date": today_str,
                    "carrot_earned": carrot_earned,
                    "content": self._sign_content,"""

new_record = """                # Step 5: \u8bb0\u5f55\u5386\u53f2\u4e0e\u7edf\u8ba1
                record_content = actual_content if self._random_saying else self._sign_content
                record = {
                    "date": today_str,
                    "carrot_earned": carrot_earned,
                    "content": record_content,"""
text = text.replace(old_record, new_record)

with open(path, "w", encoding="utf-8") as f:
    f.write(text)
print("ok")
