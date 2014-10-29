#!/usr/bin/env python
# -*- coding: utf-8 -*-

from sqlalchemy import Column, Integer
from ._base import Base


class Top(Base):
    __tablename__ = 'top'
    id = Column(Integer, primary_key=True)
    category_id = Column(Integer)

    def __repr__(self):
        return '<topid %r top_category %r>' % (self.id, self.category_id)
