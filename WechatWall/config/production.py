#!/usr/bin/env python
# -*- coding: utf-8 -*-

from .default import Config


from sae.const import (MYSQL_HOST, MYSQL_PORT,
            MYSQL_USER, MYSQL_PASS, MYSQL_DB)


class ProductionConfig(Config):
    SQLALCHEMY_DATABASE_URI = "mysql://{user}:{password}@{host}:{port}/{db}".format(
        user=MYSQL_USER,
        password=MYSQL_PASS,
        host=MYSQL_HOST,
        port=MYSQL_PORT,
        db=MYSQL_DB)
        
    SQLALCHEMY_POOL_RECYCLE = 10  