#!/usr/bin/env python
# -*- coding: utf-8 -*-

import datetime

from sqlalchemy import Column, Integer, String, Boolean, DateTime
from ._base import Base


class Category(Base):
    __tablename__ = 'category'
    id = Column(Integer, primary_key=True)
    category_name = Column(String(50))
    category_top = Column(String(100))

    def __repr__(self):
        return '<CategoryName %r>' % self.category_name
