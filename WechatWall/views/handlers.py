#!/usr/bin/env python
# -*- coding: utf-8 -*-

import json
import tornado.web
import tornado.websocket
from ..utils import object_to_json, generate_name
from ..models import *
from structure import InitData, CloseData


class BaseHandler(tornado.web.RequestHandler):
    def initialize(self):
        self.session = db_session
 
    def on_finish(self):
        self.session.close()


class IndexHandler(tornado.web.RequestHandler):
    def get(self):
        self.render("index.html")


class WSHandler(tornado.websocket.WebSocketHandler):
    clients=set()

    @staticmethod
    def broadcast(message):
        for client in WSHandler.clients:
            client.write_message(message)

    def get_compression_options(self):
        # Non-None enables compression with default options.
        return {}

    def open(self):
        WSHandler.clients.add(self)
        self.write_message(object_to_json(InitData(id(self))))
        print "new user %s" % id(self)

    def on_message(self, message):
        WSHandler.broadcast(message)
        print "got message %s" % message

    def on_close(self):
        WSHandler.clients.remove(self)
        WSHandler.broadcast(object_to_json(CloseData(id(self))))
        print "user leave %s" % id(self)


class ApiCategoryHandler(BaseHandler):
    def get(self,category_id):
        self.render("index.html")


class ApiDetailHandler(BaseHandler):
    def get(self,contents_id):
        self.render("index.html")


class ApiReceiveHandler(BaseHandler):
    def post(self):
        self.render("index.html")
