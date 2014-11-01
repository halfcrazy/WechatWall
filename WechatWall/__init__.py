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
            debug=config.DEBUG,
            # cookie_secret=base64.b64encode(uuid.uuid4().bytes + uuid.uuid4().bytes)
            cookie_secret='esHxCHc8TGuPTz3ZI0NMVVGyEUk8zUhpr9FX8oqV8CM=',
            template_path=os.path.join(os.path.dirname(__file__), 'templates'),
            static_path=os.path.join(os.path.dirname(__file__), 'static'),
            xsrf_cookies=True,
        )

        tornado.web.Application.__init__(self, handlers=handlers, **settings)
