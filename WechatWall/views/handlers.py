#!/usr/bin/env python
# -*- coding: utf-8 -*-

import json
import tornado.web
import tornado.websocket
from ..utils import object_to_json, generate_name, datetime2timestamp
from ..models import *
from structure import InitData, CloseData, SyncData


class BaseHandler(tornado.web.RequestHandler):
    def initialize(self):
        self.session = db_session

    def on_finish(self):
        self.session.close()

    def write_error(self, status_code, **kwargs):
        if status_code == 404:
            self.render('404.html')
        elif status_code == 500:
            self.render('500.html')
        else:
            super(RequestHandler, self).write_error(status_code, **kwargs)

    def get_remote_ip(self):
        return self.request.remote_ip


class PageNotFoundHandler(BaseHandler):
    def get(self):
        raise tornado.web.HTTPError(404)


class IndexHandler(tornado.web.RequestHandler):
    def get(self):
        self.render("index.html")


class WSHandler(tornado.websocket.WebSocketHandler):
    clients = set()

    @staticmethod
    def broadcast(message):
        for client in WSHandler.clients:
            client.write_message(object_to_json(SyncData(message)))

    def get_compression_options(self):
        # Non-None enables compression with default options.
        return {}

    def open(self):
        WSHandler.clients.add(self)
        # self.write_message(object_to_json(InitData(id(self))))
        WSHandler.broadcast(object_to_json(InitData(id(self))))
        print "new user %r" % id(self)

    def on_message(self, message):
        WSHandler.broadcast(message)
        print "got message %r" % message

    def on_close(self):
        WSHandler.clients.remove(self)
        WSHandler.broadcast(object_to_json(CloseData(id(self))))
        print "user leave %r" % id(self)


class ApiCategoryHandler(BaseHandler):
    def get(self, category_id=0):
        self.default_show_nums = 10
        try:
            category_id = int(category_id)
        except:
            raise tornado.web.HTTPError(500)

        if category_id != 0:
            self.category_ids = self.session.query(Category.id).all()
            if (category_id,) not in self.category_ids:
                # 主题分类不存在
                print category_id, u"该主题id不存在"
                raise tornado.web.HTTPError(404)

        self.page_num = self.get_argument("p", 1)
        if self.page_num < 1:
            # 页数错误
            print self.page_num, u"页数错误"
            raise tornado.web.HTTPError(404)

        self.page_num = self.page_num - 1

        if category_id == 0:
            post_list = self.session.query(Post.id, Post.category_id, Post.content, Post.author, Post.created_at, Post.click_num, Post.comment_num) \
                                    .order_by(Post.id.desc()) \
                                    .offset(self.default_show_nums * self.page_num) \
                                    .limit(self.default_show_nums) \
                                    .all()
        else:
            post_list = self.session.query(Post.id, Post.category_id, Post.content, Post.author, Post.created_at, Post.click_num, Post.comment_num) \
                                    .filter(Post.category_id == category_id) \
                                    .order_by(Post.id.desc()) \
                                    .offset(self.default_show_nums * self.page_num) \
                                    .limit(self.default_show_nums) \
                                    .all()

        post_rs = [dict({'id': i[0], 'category_id': i[1], 'content': i[2].encode('utf-8'), 'author':i[3].encode('utf-8'),
                        'created_at': datetime2timestamp(i[4]), 'click_num': i[5], 'comment_num': i[6]})
                   for i in post_list]

        top_list = self.session.query(Top.id).filter(Top.category_id == category_id).all()

        top_rs = [dict({'id': i[0]}) for i in top_list]

        self.set_header("Content-Type", "application/json; charset=UTF-8")
        self.write(json.dumps({'posts': post_rs, 'top': top_rs, 'statusCode': 200}, ensure_ascii=False))
        return


class ApiDetailHandler(BaseHandler):
    def get(self, post_id):
        self.session.query(Post).filter(Post.id == post_id).update({'click_num': Post.click_num + 1})
        self.session.commit()
        post = self.session.query(Post.id, Post.category_id, Post.content, Post.author, Post.created_at, Post.click_num, Post.comment_num) \
                           .filter(Post.id == post_id) \
                           .one()
        comment_list = self.session.query(Comment.id, Comment.comment, Comment.author, Comment.kind, Comment.reply_to, Comment.created_at) \
                                   .filter(Comment.reply_to == post_id) \
                                   .order_by(Comment.created_at) \
                                   .all()

        post_rs = dict({'id': post[0], 'category_id': post[1], 'content': post[2].encode('utf-8'), 'author':post[3].encode('utf-8'),
                        'created_at': datetime2timestamp(post[4]), 'click_num': post[5], 'comment_num': post[6]})

        comment_rs = [dict({'id': i[0], 'comment': i[1].encode('utf-8'), 'author': i[2].encode('utf-8'), 'reply_to': i[3], 'created_at': i[4]})
                      for i in comment_list]

        self.set_header("Content-Type", "application/json; charset=UTF-8")
        self.write(json.dumps({'post': post_rs, 'comments': comment_rs, 'statusCode': 200}, ensure_ascii=False))
        return


class PostHandler(BaseHandler):
    def get(self,post_id):
        self.render("detail.html",post_id=post_id)


class ApiReceiveHandler(BaseHandler):
    def post(self):
        kind = self.get_argument("kind", "")
        if kind == "post":
            try:
                message = self.get_argument("message", "")
                if not message.strip():
                    self.set_header("Content-Type", "application/json; charset=UTF-8")
                    self.write(json.dumps({'error': u'内容不能为空', 'statusCode': 405}, ensure_ascii=False))
                    return

                author = self.get_argument("author", "")
                if not author.strip():
                    author = generate_name()

                category = self.get_argument("category", "")
                if not category.isdigit():
                    self.set_header("Content-Type", "application/json; charset=UTF-8")
                    self.write(json.dumps({'error': u'分类不能为空', 'statusCode': 405}, ensure_ascii=False))
                    return

                self.post = Post(category_id=category, content=message, author=author, ip=self.get_remote_ip())
                self.session.add(self.post)
                self.session.commit()

                self.set_header("Content-Type", "application/json; charset=UTF-8")
                self.write(json.dumps({'status': u'post创建成功', 'statusCode': 200}, ensure_ascii=False))
                return

            except Exception, e:
                raise e

        elif kind == "comment":
            try:
                comment = self.get_argument("comment", "")
                if not comment.strip():
                    self.set_header("Content-Type", "application/json; charset=UTF-8")
                    self.write(json.dumps({'error': u'内容不能为空', 'statusCode': 405}, ensure_ascii=False))
                    return

                author = self.get_argument("author", "")
                if not author.strip():
                    author = generate_name()
                reply_to = self.get_argument("reply_to", "")
                print reply_to
                self.comment = Comment(comment=comment, author=author, reply_to=reply_to, ip=self.get_remote_ip())
                self.session.add(self.comment)
                self.session.commit()

                self.set_header("Content-Type", "application/json; charset=UTF-8")
                self.write(json.dumps({'status': u'comment创建成功', 'statusCode': 200}, ensure_ascii=False))
                return

            except Exception, e:
                raise e
