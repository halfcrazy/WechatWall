#!/usr/bin/env python
# -*- coding: utf-8 -*-


from sqlalchemy import create_engine
from sqlalchemy.orm import scoped_session, sessionmaker
from sqlalchemy.ext.declarative import declarative_base
from WechatWall.config import load_config

config = load_config()

engine = create_engine(config.SQLALCHEMY_DATABASE_URI)
db_session = scoped_session(sessionmaker(autocommit=False,
                                         autoflush=False,
                                         bind=engine))
#Base = declarative_base(metadata=MetaData(), metaclass=DeclarativeMeta)
Base = declarative_base()

def init_db():
    # import all modules here that might define models so that
    # they will be registered properly on the metadata.  Otherwise
    # you will have to import them first before calling init_db()
    import WechatWall.models
    from WechatWall.models._base import Base
    Base.metadata.create_all(bind=engine)
