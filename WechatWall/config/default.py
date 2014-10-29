#!/usr/bin/env python
# -*- coding: utf-8 -*-

import os
from ConfigParser import SafeConfigParser


class Config(object):
    """配置基类"""
    DEBUG = False

    JSON_AS_ASCII = False

    # Root path of project
    PROJECT_PATH = os.path.abspath(os.path.join(os.path.dirname(__file__), '..'))

    # SQLAlchemy config
    # See:
    # http://docs.sqlalchemy.org/en/rel_0_9/core/engines.html#database-urls
    SQLALCHEMY_DATABASE_URI = "sqlite:///%s/db/development.db" % PROJECT_PATH

    parser = SafeConfigParser()
    parser.read("config.ini")
    IPV4_ONLY  = parser.get("configure","IPV4_ONLY")
