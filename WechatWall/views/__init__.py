#!/usr/bin/env python
# -*- coding: utf-8 -*-

from handlers import IndexHandler
from handlers import PostHandler
from handlers import WSHandler
from handlers import ApiCategoryHandler
from handlers import ApiDetailHandler
from handlers import ApiReceiveHandler
from handlers import PageNotFoundHandler

handlers = [
    (r"/", IndexHandler),
    (r"/t/([0-9]+)", PostHandler),
    (r"/ws", WSHandler),
    (r"/api/w/([0-9]+)", ApiCategoryHandler),
    (r"/api/t/([0-9]+)", ApiDetailHandler),
    (r"/api/post", ApiReceiveHandler),
    (r".*", PageNotFoundHandler),
    ]
