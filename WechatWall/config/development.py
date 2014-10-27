#!/usr/bin/env python
# -*- coding: utf-8 -*-

from .default import Config


class DevelopmentConfig(Config):
    SQLALCHEMY_POOL_RECYCLE = 10