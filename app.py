#!/usr/bin/env python
# -*- coding: utf-8 -*-

import sys

import tornado.ioloop
import tornado.httpserver
from tornado.netutil import bind_sockets
from WechatWall import Application


if __name__ == '__main__':
    if len(sys.argv) < 2:
        print 'No action specified.'
        sys.exit()

    if sys.argv[1] == "run":
        from WechatWall.config import load_config
        config = load_config()
        if config.IPV4_ONLY:
            import socket
            sockets = bind_sockets(8001, family=socket.AF_INET)
        else:
            sockets = bind_sockets(8001)

        try:
            http_server = tornado.httpserver.HTTPServer(Application(), xheaders=True)
            http_server.add_sockets(sockets)
            '''
            http_server.start(0)  # forks one process per cpu
            RuntimeError: Cannot run in multiple processes: IOLoop instance has already been initialized. 
            You cannot call IOLoop.instance() before calling start_processes()
            '''
            http_server.start(1) # specified one process
            tornado.ioloop.IOLoop.instance().start()

        except KeyboardInterrupt:
            tornado.ioloop.IOLoop.instance().stop()

    elif sys.argv[1] == "init":
        from WechatWall.models import init_db
        init_db()
