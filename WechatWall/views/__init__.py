#!/usr/bin/env python
# -*- coding: utf-8 -*-

from handlers import IndexHandler
from handlers import WSHandler
from handlers import ApiCategoryHandler
from handlers import ApiDetailHandler
from handlers import ApiReceiveHandler

handlers=[
    (r"/",IndexHandler),
    (r"/ws",WSHandler),
    (r"/w/([0-9]+)",ApiCategoryHandler),
    (r"/t/([0-9]+)",ApiDetailHandler),
    (r"/post",ApiReceiveHandler),
    ]
