#!/usr/bin/env python
# -*- coding: utf-8 -*-

from ConfigParser import SafeConfigParser


def load_config():
    """加载配置类"""
    parser = SafeConfigParser()
    parser.read("config.ini")
    mode = parser.get("configure","mode")
    try:
        if mode is None:
            from .development import DevelopmentConfig
            return DevelopmentConfig
        elif mode == "production":
            from .production import ProductionConfig
            return ProductionConfig
        elif mode == "development":
            from .development import DevelopmentConfig
            return DevelopmentConfig
    except ImportError, e:
        from .default import Config
        return Config
