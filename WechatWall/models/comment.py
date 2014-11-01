#!/usr/bin/env python
# -*- coding: utf-8 -*-

import datetime

from sqlalchemy import Column, Integer, String, DateTime
from ._base import Base


class Comment(Base):
    __tablename__ = 'comment'
    id = Column(Integer, primary_key=True)
    comment = Column(String(140))
    author = Column(String(20))
    # kind 为回复种类，回复帖子 1，回复评论 2
    kind = Column(Integer)
    # reply_to 回复的id号
    reply_to = Column(Integer)
    ip = Column(String(20))
    created_at = Column(DateTime, default=datetime.datetime.now)

    def __repr__(self):
        return '<Comment %r>' % self.comment
