#!/usr/bin/env python
# -*- coding: utf-8 -*-

import sys

import tornado.ioloop
import tornado.httpserver
from WechatWall import Application


if __name__ == '__main__':
    if len(sys.argv) < 2:
        print 'No action specified.'
        sys.exit()

    if sys.argv[1] == "run":
        http_server = tornado.httpserver.HTTPServer(Application())
        http_server.listen(8001)

        tornado.ioloop.IOLoop.instance().start()
    elif sys.argv[1] == "init":
        from WechatWall.models import init_db
        init_db()
