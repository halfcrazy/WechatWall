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
        print "new user %r" % id(self)

    def on_message(self, message):
        WSHandler.broadcast(message)
        print "got message %r" % message

    def on_close(self):
        WSHandler.clients.remove(self)
        WSHandler.broadcast(object_to_json(CloseData(id(self))))
        print "user leave %r" % id(self)


class ApiCategoryHandler(BaseHandler):
    default_show_nums = 18

    def get(self,category_id):
        category_ids = self.session.query(Category.id)
        if category_id not in category_ids:
            #主题分类不存在
            raise tornado.web.HTTPError(404)

        self.page = self.get_argument("p",1)
        if self.page < 1:
            #页数错误
            raise tornado.web.HTTPError(404)
        self.page = self.page - 1

        if category_id == 0:
            content_list = self.session.query(Content.id, Conetnt.category_id, Content.content, Content.created_at) \
                               .offset(default_show_nums * self.page) \
                               .limit(default_show_nums)
        else:
            content_list = self.session.query(Content.id, Conetnt.category_id, Content.content, Content.created_at) \
                               .filter(Content.category_id == category_id) \
                               .offset(default_show_nums * self.page) \
                               .limit(default_show_nums)
    
        content_rs = [dict({'id': i[0], 'category_id': i[1], 'content': i[2].encode('utf-8'), 'created_at': i[3]}) for i in content_list]
        
        top_list = self.session.query(Top.id) \
                               .filter(Top.category_id == category_id)
        
        top_rs = [dict({'id': i[0]}) for i in top_list]

        self.set_header("Content-Type","application/json")
        self.write(json.dumps({'contents': content_rs, 'top': top_rs}, ensure_ascii=False))


class ApiDetailHandler(BaseHandler):
    def get(self,contents_id):
        self.render("index.html")


class ApiReceiveHandler(BaseHandler):
    def post(self):
        self.render("index.html")
