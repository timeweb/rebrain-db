import re
import json
import logging
import asyncio
import pymysql
from pymysql.cursors import DictCursor
from collections import namedtuple
from aiohttp import web
import config


logging.basicConfig(level=config.logging.get('level', 'INFO'))


class DB:


    def __init__(self, user, password, database, host='localhost'):
        self.conn = pymysql.connect(user=user, password=password,
                                    database=database, host=host)

    def query(self, sql, params=()):
        try:
            cursor = self.conn.cursor(DictCursor)
            logging.debug(cursor.mogrify(sql, params))
            cursor.execute(sql, params)
            self.conn.commit()
        except:
            self.conn.rollback()
            raise
        return cursor.fetchall()


class RPC:

    ALLOWED_TABLES = {
        'users',
        'classes',
        'subjects',
        'lessons',
        'classroom_teachers',
        'students_classes',
    }

    def __init__(self):
        self.db = None
        self.methods = {
            'get': self.get,
            'create': self.create,
            'delete': self.delete,
            'set_classroom_teacher': self.set_classroom_teacher,
            'set_students_classes': self.set_students_classes,
        }

    def run(self, rpc):
        method = rpc.get('method')
        args = rpc.get('args', [])
        logging.info('Got request: %s', rpc)
        if method not in self.methods:
            raise Exception(f'Unknown method: {method}')
        if isinstance(args, list):
            return self.methods[method](*args)
        elif isinstance(args, dict):
            return self.methods[method](**args)
        else:
            raise Exception(f'Unknown args: {args}')

    def get(self, table):
        if table not in self.ALLOWED_TABLES:
            raise Exception(f'Unknown table {table}')
        self.db = DB(**config.mysql)
        query = f'SELECT * FROM `{table}`'
        return self.db.query(query)

    def create(self, table, item):
        if table not in self.ALLOWED_TABLES:
            raise Exception(f'Unknown table {table}')

        if not item:
            raise Exception('Empty item')

        for field in item:
            if "'" in field or "`" in field:
                raise Exception(f'SQL injection detected: {field}')

        for value in item.values():
            if "'" in value or "`" in value:
                raise Exception(f'SQL injection detected: {value}')

        self.db = DB(**config.mysql)
        fields = ', '.join([str(key) for key in item.keys()])
        values = "', '".join([str(val) for val in item.values()])
        query = f"INSERT INTO `{table}` ({fields}) VALUES ('{values}')"
        
        return self.db.query(query)

    def delete(self, table, item_id):
        if not isinstance(item_id, int):
            raise Exception('Item id should be int')
        if table not in self.ALLOWED_TABLES:
            raise Exception(f'Unknown table {table}')
        self.db = DB(**config.mysql)
        query = f'DELETE FROM `{table}` WHERE id = {item_id}'
        return self.db.query(query)

    def set_classroom_teacher(self, class_id, teacher_id):
        if not isinstance(class_id, int):
            raise Exception('Class id should be int')
        if not isinstance(teacher_id, int):
            raise Exception('Teacher id should be int')
        self.db = DB(**config.mysql)
        role_check = self.db.query(
            'SELECT role FROM `users` WHERE id = %s',
            (teacher_id,)
        )
        if role_check != [{'role': 'teacher'}]:
            raise Exception(f'Teacher with user id = {teacher_id} not found')
        teacher_check = self.db.query(
            'SELECT * FROM `classroom_teachers` WHERE teacher_id = %s',
            (teacher_id,)
        )
        if teacher_check and teacher_check[0]['class_id'] != class_id:
            raise Exception('Cant set same teacher for multiple classes')
        class_check = self.db.query(
            'SELECT * FROM `classroom_teachers` WHERE class_id = %s',
            (class_id,)
        )
        if class_check:
            self.db.query(
                'UPDATE `classroom_teachers` SET teacher_id = %s WHERE class_id = %s',
                (teacher_id, class_id)
            )
        else:
            self.db.query(
                'INSERT INTO `classroom_teachers` (teacher_id, class_id) VALUES (%s, %s)',
                (teacher_id, class_id)
            )

    def set_students_classes(self, class_id, students_ids):
        if not isinstance(class_id, int):
            raise Exception('Class id should be int')
        if not students_ids or not isinstance(students_ids, list) or \
                not all([isinstance(student_id, int) for student_id in students_ids]):
            raise Exception('Wrong students ids')
        self.db = DB(**config.mysql)
        self.db.query(
            'DELETE FROM `students_classes` WHERE class_id = %s',
            (class_id,)
        )
        students_classes = '), ('.join([f'{student_id}, {class_id}' for student_id in students_ids])
        self.db.query(
            f'INSERT INTO `students_classes` (student_id, class_id) VALUES ({students_classes})'
        )


class API:

    def __init__(self):
        self.app = web.Application()
        self.rpc = RPC()

    async def handler(self, request):
        data = await request.text()
        try:
            rpc = json.loads(data)
            result = self.rpc.run(rpc)
            response = {'status': 'ok', 'data': result}
            logging.info('Response: %s', response)
        except Exception as err:
            response = {'status': 'error', 'error': str(err)}
            logging.error('Error response: %s', response)
        return web.json_response(response)


    def setup_routes(self):
        self.app.add_routes([
            web.post('/', self.handler),
        ])

    def run(self):
        api.setup_routes()
        web.run_app(self.app, port=config.http.get('port'))

if __name__ == '__main__':
    api = API()
    api.run()
