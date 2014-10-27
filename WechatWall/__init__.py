#!/usr/bin/env python
# -*- coding: utf-8 -*-

import os.path
import tornado.web
from WechatWall import views
from config import load_config


class Application(tornado.web.Application):
    def __init__(self):
        handlers = views.handlers

        config = load_config()
        
        settings = dict(
            debug = config.DEBUG,
            cookie_secret=r"\xcf\x15\x18\xccY\xed\xc8\xd6\xfb\x05\xc7\xa5W\x19Kk,\xd1.\xf4\xfd\x11\\\xf3",
            template_path=os.path.join(os.path.dirname(__file__), "templates/"),
            static_path=os.path.join(os.path.dirname(__file__), "static/"),
            xsrf_cookies=True,
        )

        tornado.web.Application.__init__(self, handlers=handlers, **settings)
    