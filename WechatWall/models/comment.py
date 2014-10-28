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
    reply_to = Column(Integer)
    topic_top_id = Column(Integer)
    created_at = Column(DateTime, default=datetime.datetime.now)
    
    def __repr__(self):
        return '<Comment %r>' % self.comment
