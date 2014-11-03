WechatWall
==========

What is WechatWall? WechatWall is a project to dispaly messages on a public board, anybody can post a message on different categorys.

It implements real-time message refresh with websocket to passing data from server to browser.

Standard Features
=================

 * Easy to deploy.
 * Real-time refresh.


Installation
============

require:
--------

* tornado
* sqlalchemy

python package
--------------

    sudo pip install -r requirements.txt

initial database
----------------

    python app.py init_db


Run
===

    python app.py run


TODO
====

 * ~~Recode click number.~~
 * 限制发送频率
 * 做心跳检测客户端状态，适当断开连接，节省资源
 * Support sql schema import.
 * Embed AC face to texting. 
 * Frontend interface.


Issue
====
