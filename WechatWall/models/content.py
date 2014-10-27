#!/usr/bin/env python
# -*- coding: utf-8 -*-

import datetime

from sqlalchemy import Column, Integer, String, Boolean, DateTime
from ._base import Base

class Content(Base):
    __tablename__ = 'content'
    id = Column(Integer, primary_key=True)
    category_id = Column(Integer)
    content = Column(String(140))
    created_at = Column(DateTime, default=datetime.datetime.now)

    def __repr__(self):
        return '<Content %r>' % self.content
