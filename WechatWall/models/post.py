#!/usr/bin/env python
# -*- coding: utf-8 -*-

import datetime

from sqlalchemy import Column, Integer, String, Boolean, DateTime
from ._base import Base


class Post(Base):
    __tablename__ = 'post'
    id = Column(Integer, primary_key=True)
    category_id = Column(Integer)
    content = Column(String(140))
    author = Column(String(20))
    click = Column(Integer, default=0)
    ip = Column(String(20))
    created_at = Column(DateTime, default=datetime.datetime.now)

    def __repr__(self):
        return '<Post %r>' % self.content
